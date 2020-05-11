import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  Button,
  Card,
  Container,
  Dropdown,
  Grid,
  Icon,
  Menu,
  Message,
  Popup,
  Ref,
  Segment
} from 'semantic-ui-react';
// TODO: can we use this for shouldComponentUpdate?
// import hash from 'object-hash';
// import { diff } from 'deep-object-diff';
import storage from 'local-storage-fallback';
import Loading from '@components/Loading';
import notify from '@components/Notification';
import Sortable from '@components/Sortable';
import SlideEditor from '@components/Slide/SlideEditor';
import SlideComponentList from '@components/SlideComponentList';
import generateResponseId from '@components/util/generateResponseId';
import scrollIntoView from '@components/util/scrollIntoView';
import { getSlides } from '@client/actions/scenario';
import './Slides.css';

class Slides extends React.Component {
  constructor(props) {
    super(props);

    const activeNonZeroSlideIndex =
      Number(this.props.match.params.activeNonZeroSlideIndex) || 1;

    this.persistenceKey = `slides/${this.props.scenarioId}`;
    let persisted = JSON.parse(storage.getItem(this.persistenceKey));
    let activeSlideIndex = activeNonZeroSlideIndex - 1;

    if (!persisted) {
      persisted = {
        activeSlideIndex,
        minimized: false
      };
    }

    if (persisted.activeSlideIndex !== activeSlideIndex) {
      persisted.activeSlideIndex = activeSlideIndex;
    }

    storage.setItem(this.persistenceKey, JSON.stringify(persisted));

    this.state = {
      activeSlideIndex,
      loading: true,
      minimized: persisted.minimized,
      slides: []
    };

    this.slideRefs = [];
    this.debouncers = {};
    this.activateSlide = this.activateSlide.bind(this);
    this.onSlideAdd = this.onSlideAdd.bind(this);
    this.onSlideChange = this.onSlideChange.bind(this);
    this.onSlideDelete = this.onSlideDelete.bind(this);
    this.onSlideDuplicate = this.onSlideDuplicate.bind(this);
    this.onSlideOrderChange = this.onSlideOrderChange.bind(this);
    this.onSlideMinMaxChange = this.onSlideMinMaxChange.bind(this);
  }

  async componentDidMount() {
    await this.fetchSlides();
  }

  async fetchSlides() {
    const { getSlides, scenarioId } = this.props;
    const { activeSlideIndex } = this.state;
    const slides = (await getSlides(scenarioId)).filter(
      slide => !slide.is_finish
    );
    this.activateSlide({ activeSlideIndex, slides, loading: false });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     console.log("shouldComponentUpdate");
  //     // console.log(
  //     //     hash(this.props), hash(nextProps),
  //     //     hash(this.props) === hash(nextProps) ? 'PROPS UNCHANGED' : 'PROPS CHANGED',
  //     //     diff(this.props, nextProps)

  //     // );
  //     // console.log(
  //     //     hash(this.state), hash(nextState),
  //     //     hash(this.state) === hash(nextState) ? 'STATE UNCHANGED' : 'STATE CHANGED',
  //     //     diff(this.state, nextState)
  //     // );
  //     return hash(this.props) !== hash(nextProps) ||
  //             hash(this.state) !== hash(nextState);
  // }

  componentDidUpdate() {
    const { activeSlideIndex, minimized } = this.state;
    storage.setItem(
      this.persistenceKey,
      JSON.stringify({ activeSlideIndex, minimized })
    );
  }

  onSlideChange(activeSlideIndex, value) {
    const { scenarioId } = this.props;
    const { slides } = this.state;
    const slide = slides[activeSlideIndex];
    const slideId = slide.id;

    const newSlide = {
      ...slide,
      ...value
    };

    slides[activeSlideIndex] = newSlide;

    this.setState({ slides, activeSlideIndex });

    clearTimeout(this.debouncers[slideId]);
    this.debouncers[slideId] = setTimeout(async () => {
      const result = await fetch(
        `/api/scenarios/${scenarioId}/slides/${slideId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newSlide)
        }
      );
      await result.json();
      notify({ type: 'success', message: 'Slide saved' });
    }, 200);
  }

  moveSlide(fromIndex, activeSlideIndex) {
    const { scenarioId } = this.props;
    const { slides } = this.state;
    const moving = slides[fromIndex];
    slides.splice(fromIndex, 1);
    slides.splice(activeSlideIndex, 0, moving);
    this.activateSlide({ slides, activeSlideIndex }, async () => {
      const result = await fetch(`/api/scenarios/${scenarioId}/slides/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slides })
      });
      await result.json();
      notify({ type: 'success', message: 'Slide moved' });
    });
  }

  onSlideDelete(index) {
    const { scenarioId } = this.props;
    const slide = this.state.slides[index];
    const slides = this.state.slides.filter(({ id }) => id !== slide.id);

    let activeSlideIndex;

    // The slide was at the end...
    if (index > slides.length) {
      activeSlideIndex = slides.length - 1;
    }

    // The slide was at the beginning...
    if (index === 0) {
      activeSlideIndex = 0;
    } else {
      // The slide was somewhere in between...
      activeSlideIndex = index - 1;
    }

    this.activateSlide({ slides, activeSlideIndex }, async () => {
      const result = await fetch(
        `/api/scenarios/${scenarioId}/slides/${slide.id}`,
        {
          method: 'DELETE'
        }
      );
      await result.json();
      notify({ type: 'success', message: 'Slide deleted' });
    });
  }

  async onSlideDuplicate(index) {
    const { title, components } = this.state.slides[index];

    // Check through all components of this slide
    // for any that are response components...
    for (const component of components) {
      // ...When a response component has been
      // found, assign it a newly generated responseId,
      // to prevent duplicate responseId values from
      // being created.
      if (Object.prototype.hasOwnProperty.call(component, 'responseId')) {
        component.responseId = generateResponseId(component.type);
      }
    }

    const activeSlideIndex = await this.storeSlide({
      title,
      components
    });

    this.activateSlide(activeSlideIndex);
  }

  async onSlideAdd() {
    const activeSlideIndex = await this.storeSlide({
      title: '',
      components: []
    });

    this.activateSlide(activeSlideIndex);
  }

  activateSlide(state, callback = async () => {}) {
    let updatedState = state;

    if (Array.isArray(state)) {
      updatedState = {
        slides: state
      };
    }
    if (typeof state === 'number') {
      updatedState = {
        activeSlideIndex: state
      };
    }
    if (updatedState.activeSlideIndex !== -1) {
      this.setState(updatedState, () => {
        const { activeSlideIndex, minimized } = this.state;

        if (this.slideRefs[activeSlideIndex]) {
          scrollIntoView(this.slideRefs[activeSlideIndex]);
        }

        this.props.setActiveSlide(activeSlideIndex);
        storage.setItem(
          this.persistenceKey,
          JSON.stringify({ activeSlideIndex, minimized })
        );
        callback();
      });
    }
  }

  async storeSlide(slide) {
    const res = await fetch(`/api/scenarios/${this.props.scenarioId}/slides`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(slide)
    });
    const {
      slide: { id }
    } = await res.json();
    notify({ type: 'info', message: 'Slide added' });
    await this.fetchSlides();
    const orderIndex = this.state.slides.findIndex(slide => slide.id === id);
    let activeSlideIndex = this.state.activeSlideIndex + 1;

    if (this.state.slides.length > 1 && orderIndex !== activeSlideIndex) {
      this.moveSlide(orderIndex, activeSlideIndex);
    } else {
      // If this is the very first slide, the activeSlideIndex
      // needs to be corrected to 0
      if (this.state.slides.length === 1) {
        activeSlideIndex = 0;
      }

      // This is necessary when adding a slide that doesn't need
      // any special ordering changes, but still must be highlighted.
      this.setState({ activeSlideIndex });
    }

    return activeSlideIndex;
  }

  onSlideOrderChange(fromIndex, toIndex) {
    this.moveSlide(fromIndex, toIndex);
  }

  onSlideMinMaxChange() {
    const { activeSlideIndex, minimized } = this.state;

    this.setState({ minimized: !minimized }, () => {
      storage.setItem(
        this.persistenceKey,
        JSON.stringify({ activeSlideIndex, minimized })
      );
    });
  }

  render() {
    const {
      onSlideAdd,
      onSlideChange,
      onSlideDelete,
      onSlideDuplicate,
      onSlideMinMaxChange,
      onSlideOrderChange
    } = this;
    const { scenarioId } = this.props;
    const { activeSlideIndex, loading, minimized } = this.state;

    if (loading) {
      return (
        <Container fluid>
          <Grid>
            <Grid.Column width={3}>
              <Loading />
            </Grid.Column>
            <Grid.Column className="slides__editor-outer-container" width={13}>
              <Loading />
            </Grid.Column>
          </Grid>
        </Container>
      );
    }

    const slides = this.state.slides.filter(slide => !slide.is_finish);
    const minMaxIcon = `window ${minimized ? 'maximize' : 'minimize'} outline`;
    const minMaxText = `${minimized ? 'Preview' : 'Outline'} slides`;
    const minMaxHide = minimized ? { hidden: true } : {};

    return (
      <Container fluid>
        <Grid className="slides__editor-all-outer-container">
          <Grid.Column width={3} className="slides__list-outer-container">
            <Grid.Row>
              <Menu icon borderless>
                <Popup
                  content="Add a slide"
                  trigger={
                    <Menu.Item
                      name="Add a slide"
                      onClick={() => {
                        onSlideAdd(activeSlideIndex);
                      }}
                    >
                      <Icon
                        name="plus square outline"
                        size="large"
                        className="editormenu__icon-group"
                      />
                      Add a slide
                    </Menu.Item>
                  }
                />
                {slides.length > 0 && (
                  <Menu.Menu key="menu-item-slide-options" position="right">
                    <Popup
                      content="Slide options"
                      trigger={
                        <Dropdown item icon="options">
                          <Dropdown.Menu>
                            <Dropdown.Item
                              key={`slide-options-1`}
                              onClick={() => {
                                onSlideDuplicate(activeSlideIndex);
                              }}
                            >
                              <Icon name="copy outline" />
                              Duplicate selected slide
                            </Dropdown.Item>
                            <Dropdown.Item
                              key={`slide-options-0`}
                              onClick={onSlideMinMaxChange}
                            >
                              <Icon name={minMaxIcon} />
                              {minMaxText}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      }
                    />
                  </Menu.Menu>
                )}
              </Menu>
            </Grid.Row>
            <Segment className="slides__list-inner-container">
              {slides.length === 0 && (
                <Message
                  floating
                  icon={
                    <Icon.Group size="huge" className="editormenu__icon-group">
                      <Icon name="plus square outline" />
                      <Icon corner="top right" name="add" color="green" />
                    </Icon.Group>
                  }
                  header="Add a slide!"
                  content="Click the 'Add a slide' button to add your first slide!"
                  onClick={() => {
                    onSlideAdd(activeSlideIndex);
                  }}
                />
              )}
              <Sortable onChange={onSlideOrderChange}>
                {slides.map((slide, index) => {
                  const isActiveSlide = index === activeSlideIndex;
                  const className = isActiveSlide
                    ? 'slides__list-card sortable__selected'
                    : 'slides__list-card';
                  const onActivateSlideClick = () => {
                    // Update the UI as soon as possible
                    this.setState({
                      activeSlideIndex: index
                    });
                    this.activateSlide(index);
                  };
                  const description = index + 1;
                  return (
                    <Grid.Row key={slide.id} className="slides__list-row">
                      <Ref innerRef={node => (this.slideRefs[index] = node)}>
                        <Card
                          className={className}
                          onClick={onActivateSlideClick}
                        >
                          <Card.Content className="slides__list-card-content">
                            <Card.Header>
                              <Menu
                                size="mini"
                                className="slides__list-card-header-menu-items"
                                secondary
                              >
                                <Menu.Item name={`${index + 1}`} />

                                {slide.title && (
                                  <Menu.Item
                                    className="slides__list-card-header-title"
                                    name={slide.title}
                                  />
                                )}

                                {isActiveSlide ? (
                                  <Menu.Menu
                                    key="menu-slides-order-change"
                                    position="right"
                                  >
                                    <Button
                                      key="menu-slides-order-change-up"
                                      icon="caret up"
                                      aria-label={`Move slide ${description} up`}
                                      disabled={index === 0}
                                      onClick={event => {
                                        event.stopPropagation();
                                        onSlideOrderChange(index, index - 1);
                                      }}
                                    />
                                    <Button
                                      key="menu-slides-order-change-down"
                                      icon="caret down"
                                      aria-label={`Move slide ${description} down`}
                                      disabled={index === slides.length - 1}
                                      onClick={event => {
                                        event.stopPropagation();
                                        onSlideOrderChange(index, index + 1);
                                      }}
                                    />
                                  </Menu.Menu>
                                ) : null}
                              </Menu>
                            </Card.Header>
                          </Card.Content>
                          {!minimized ? (
                            <Card.Content
                              {...minMaxHide}
                              className="slides__list-card-content"
                            >
                              <SlideComponentList
                                asSVG={true}
                                components={slide.components}
                              />
                            </Card.Content>
                          ) : null}
                        </Card>
                      </Ref>
                    </Grid.Row>
                  );
                })}
              </Sortable>
            </Segment>
          </Grid.Column>
          <Grid.Column width={13} className="slides__editor-outer-container">
            {slides[activeSlideIndex] && (
              <SlideEditor
                key={`slide-editor-${activeSlideIndex}`}
                scenarioId={scenarioId}
                index={activeSlideIndex}
                {...slides[activeSlideIndex]}
                onChange={onSlideChange}
                onDelete={onSlideDelete}
              />
            )}
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

Slides.propTypes = {
  activeNonZeroSlideIndex: PropTypes.number,
  activeSlideIndex: PropTypes.number,
  getSlides: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      activeNonZeroSlideIndex: PropTypes.node,
      activeSlideIndex: PropTypes.node,
      id: PropTypes.node
    }).isRequired
  }),
  slides: PropTypes.array,
  scenarioId: PropTypes.node,
  setActiveSlide: PropTypes.func
};

const mapStateToProps = state => {
  const { slides } = state.scenario;
  return {
    slides
  };
};

const mapDispatchToProps = dispatch => ({
  getSlides: params => dispatch(getSlides(params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Slides)
);
