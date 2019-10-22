import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Card, Dropdown, Button } from 'semantic-ui-react';
import * as Components from '@components/Slide/Components';
import SlideEditor from '@components/Slide/Editor';
import './Slides.css';

const dropDownValues = [
    {
        key: 'context',
        value: 'context',
        text: 'Context'
    },
    {
        key: 'anticipate',
        value: 'anticipate',
        text: 'Anticipate'
    },
    {
        key: 'enact',
        value: 'enact',
        text: 'Enact'
    },
    {
        key: 'reflect',
        value: 'reflect',
        text: 'Reflect'
    }
];

class Slides extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            slides: [],
            currentSlideIndex: 0
        };

        this.debounceSlideUpdate = {};

        this.onChangeSlide = this.onChangeSlide.bind(this);
        this.onChangeAddSlide = this.onChangeAddSlide.bind(this);
    }

    componentDidMount() {
        this.fetchSlides();
    }

    async fetchSlides() {
        const { scenarioId } = this.props;
        const res = await fetch(`/api/scenarios/${scenarioId}/slides`);
        const { slides } = await res.json();
        return new Promise(resolve =>
            this.setState({ loading: false, slides }, resolve)
        );
    }

    onChangeSlide(val) {
        const { scenarioId } = this.props;
        const { slides, currentSlideIndex } = this.state;
        const slide = slides[currentSlideIndex];
        this.props.updateEditorMessage('');
        clearTimeout(this.debounceSlideUpdate[slide.id]);
        this.debounceSlideUpdate[slide.id] = setTimeout(async () => {
            const newSlide = {
                ...slide,
                ...val
            };
            const result = await fetch(
                `/api/scenarios/${scenarioId}/slides/${slide.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newSlide)
                }
            );
            const { slide: savedSlide } = await result.json();
            const slides = this.state.slides.map(currSlide =>
                currSlide.id === savedSlide.id ? savedSlide : currSlide
            );
            this.setState({ slides });
            this.props.updateEditorMessage('Slide saved');
        }, 250);
    }

    async moveSlide(fromIndex, toIndex) {
        this.props.updateEditorMessage('Moving slides...');

        const { scenarioId } = this.props;
        const slides = this.state.slides.slice();
        const from = slides[fromIndex];
        const to = slides[toIndex];
        if (from && to) {
            slides[toIndex] = from;
            slides[fromIndex] = to;
        }
        const result = await fetch(
            `/api/scenarios/${scenarioId}/slides/order`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ slides })
            }
        );
        await result.json();
        this.setState({ slides, currentSlideIndex: toIndex });
        this.props.updateEditorMessage('Slide moved');
    }
    async deleteSlide(index) {
        const { scenarioId } = this.props;
        const slide = this.state.slides[index];
        const result = await fetch(
            `/api/scenarios/${scenarioId}/slides/${slide.id}`,
            {
                method: 'DELETE'
            }
        );
        await result.json();
        const slides = this.state.slides.filter(({ id }) => id !== slide.id);
        this.setState({ slides, currentSlideIndex: -1 });
        this.props.updateEditorMessage('Slide deleted');
    }

    async onChangeAddSlide(event, data) {
        this.props.updateEditorMessage('');
        const { scenarioId } = this.props;
        const newSlide = { title: data.value, components: [] };
        const res = await fetch(`/api/scenarios/${scenarioId}/slides`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSlide)
        });
        const {
            slide: { id }
        } = await res.json();
        await this.fetchSlides();
        const currentSlideIndex = this.state.slides.findIndex(
            slide => slide.id === id
        );
        this.setState({ currentSlideIndex });
    }

    renderLoading() {
        return <div>Loading...</div>;
    }

    render() {
        const { onChangeSlide, onChangeAddSlide } = this;
        const { loading, slides, currentSlideIndex } = this.state;
        if (loading) return this.renderLoading();
        return (
            <Container fluid className="tm__editor-tab">
                <h2>Teacher Moment Slides</h2>
                <Grid>
                    <Grid.Column width={3}>
                        <Grid.Row>
                            <Dropdown
                                selection
                                placeholder="Add +"
                                options={dropDownValues}
                                onChange={onChangeAddSlide}
                            />
                        </Grid.Row>
                        {slides.map((slide, index) => (
                            <Grid.Row
                                key={slide.id}
                                className="Slides-slide-sidebar-container"
                            >
                                <Card
                                    className="Slides-slide-sidebar-card"
                                    onClick={() =>
                                        this.setState({
                                            currentSlideIndex: index
                                        })
                                    }
                                >
                                    <Card.Header>{slide.title}</Card.Header>
                                    <Card.Content>
                                        {slide.components.map(
                                            ({ type }, index) => {
                                                const {
                                                    Card: ComponentCard = () => (
                                                        <b>{type}</b>
                                                    )
                                                } = Components[type];
                                                return (
                                                    <ComponentCard
                                                        key={index}
                                                    />
                                                );
                                            }
                                        )}
                                        <div className="Slides-button-bar">
                                            <Button
                                                icon="arrow alternate circle up outline"
                                                aria-label="Move up"
                                                disabled={index === 0}
                                                onClick={() =>
                                                    this.moveSlide(
                                                        index,
                                                        index - 1
                                                    )
                                                }
                                            />
                                            <Button
                                                icon="arrow alternate circle down outline"
                                                aria-label="Move down"
                                                disabled={
                                                    index === slides.length - 1
                                                }
                                                onClick={() =>
                                                    this.moveSlide(
                                                        index,
                                                        index + 1
                                                    )
                                                }
                                            />
                                            <Button
                                                icon="trash alternate outline"
                                                aria-label="Delete Slide"
                                                onClick={() =>
                                                    this.deleteSlide(index)
                                                }
                                            />
                                        </div>
                                    </Card.Content>
                                </Card>
                            </Grid.Row>
                        ))}
                    </Grid.Column>
                    <Grid.Column width={8}>
                        {slides[currentSlideIndex] && (
                            <SlideEditor
                                key={currentSlideIndex}
                                {...slides[currentSlideIndex]}
                                onChange={onChangeSlide}
                            />
                        )}
                    </Grid.Column>
                </Grid>
            </Container>
        );
    }
}

Slides.propTypes = {
    scenarioId: PropTypes.string,
    updateEditorMessage: PropTypes.func.isRequired
};
export default Slides;
