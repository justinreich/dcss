import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Container, Form, Grid, Popup } from 'semantic-ui-react';
import { getScenario, setScenario } from '@client/actions/scenario';

import ConfirmAuth from '@components/ConfirmAuth';
import notify from '@components/Notification';
import { AuthorDropdown, CategoriesDropdown } from './DropdownOptions';
import { Text } from '@components/Slide/Components';
import './scenarioEditor.css';

const { Editor: TextEditor } = Text;

const configTextEditor = {
  plugins: {
    options: 'inline link list image video help'
  },
  toolbar: {
    options: 'top',
    top: {
      options: 'inline link list image video history help',
      inline: {
        options: 'strong em underline strike'
      }
    }
  }
};

class ScenarioEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      categories: [],
      saving: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onConsentChange = this.onConsentChange.bind(this);
    this.onFinishSlideChange = this.onFinishSlideChange.bind(this);

    if (this.props.scenarioId === 'new') {
      this.props.setScenario({
        author: {},
        title: '',
        description: '',
        finish: {
          components: [
            {
              html: '<h2>Thanks for participating!</h2>'
            }
          ],
          is_finish: true,
          title: ''
        },
        categories: [],
        status: 1
      });
    } else {
      this.props.getScenario(this.props.scenarioId);
    }
  }

  async componentDidMount() {
    const categories = await (await fetch('/api/tags/categories')).json();
    const authors = await (await fetch('/api/roles/user/permission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ permission: 'create_scenario' })
    })).json();
    this.setState({ categories, authors });
  }

  onChange(event, { name, value }) {
    this.props.setScenario({ [name]: value });

    // Only auto-save after initial
    // save of new scenario
    // NOTE: temporarily disabling this until we
    // have a better strategy for auto saving details
    // on this page.
    // if (this.props.scenarioId !== 'new') {
    //     this.onSubmit();
    // }
  }

  onConsentChange({ html: value }) {
    let { id, prose } = this.props.consent;

    if (prose !== value) {
      id = null;
      prose = value;
      this.onChange(event, {
        name: 'consent',
        value: {
          id,
          prose
        }
      });
    }
  }

  onFinishSlideChange({ html }) {
    const {
      components: [existing],
      id,
      is_finish,
      title
    } = this.props.finish;

    if (!existing || (existing && existing.html !== html)) {
      this.onChange(event, {
        name: 'finish',
        value: {
          components: [{ html, type: 'Text' }],
          id,
          is_finish,
          title
        }
      });
    }
  }

  async onSubmit() {
    const {
      author,
      categories = [],
      consent,
      description,
      finish,
      postSubmitCB,
      status,
      submitCB,
      title
    } = this.props;

    if (!title || !description) {
      notify({
        type: 'info',
        message: 'A title and description are required for saving scenarios'
      });
      return;
    }

    this.setState({ saving: true });

    const data = {
      author,
      categories,
      consent,
      description,
      finish,
      status,
      title
    };

    const response = await (await submitCB(data)).json();

    let message = '';
    switch (response.status) {
      case 200: {
        message = 'Scenario saved';
        break;
      }
      case 201: {
        message = 'Scenario created';
        break;
      }
      default:
        if (response.message) {
          message = response.message;
        }
        break;
    }
    notify({ message });

    this.setState({ saving: false });
    if (postSubmitCB) {
      postSubmitCB(response.scenario);
    }
  }

  render() {
    const { onChange, onConsentChange, onFinishSlideChange, onSubmit } = this;
    const {
      author,
      categories,
      consent,
      description,
      finish,
      scenarioId,
      title
    } = this.props;

    // Stop letting the editor load before the
    // finish slide is available.
    if (!finish.components[0]) {
      return null;
    }

    const consentAgreementValue = {
      type: 'Text',
      html: consent.prose || ''
    };

    return (
      <Form size={'big'}>
        <Container fluid>
          <Grid columns={2} divided>
            <Grid.Row className="scenarioeditor__grid-nowrap">
              <Grid.Column
                width={6}
                className="scenarioeditor__grid-column-min-width"
              >
                <Popup
                  content="Enter a title for your scenario. This will appear on the scenario 'entry' slide."
                  trigger={
                    <Form.Input
                      focus
                      required
                      label="Title"
                      name="title"
                      value={title}
                      onChange={onChange}
                    />
                  }
                />
                <Popup
                  content="Enter a description for your scenario. This will appear on the scenario 'entry' slide."
                  trigger={
                    <Form.TextArea
                      focus="true"
                      required
                      label="Description"
                      name="description"
                      value={description}
                      onChange={onChange}
                    />
                  }
                />

                {scenarioId !== 'new' && (
                  <Popup
                    content="Enter Consent Agreement prose here, or use the default provided Consent Agreement. This will appear on the scenario 'entry' slide."
                    trigger={
                      <Form.Field required>
                        <label>Consent Agreement</label>
                        {consentAgreementValue.html && (
                          <TextEditor
                            onChange={onConsentChange}
                            scenarioId={scenarioId}
                            name="consentprose"
                            value={consentAgreementValue}
                            spellCheck={true}
                            styleConfig={{
                              editor: () => ({
                                height: '100px'
                              })
                            }}
                            config={configTextEditor}
                          />
                        )}
                      </Form.Field>
                    }
                  />
                )}

                {this.state.saving ? (
                  <Button type="submit" primary loading />
                ) : (
                  <Button type="submit" primary onClick={onSubmit}>
                    Save
                  </Button>
                )}
              </Grid.Column>
              <Grid.Column
                width={6}
                className="scenarioeditor__grid-column-min-width"
              >
                <ConfirmAuth requiredPermission="edit_scenario">
                  {this.state.authors.length ? (
                    <AuthorDropdown
                      author={author}
                      options={this.state.authors}
                      onChange={onChange}
                    />
                  ) : null}
                  {this.state.categories.length ? (
                    <CategoriesDropdown
                      options={this.state.categories}
                      categories={categories}
                      onChange={onChange}
                    />
                  ) : null}
                </ConfirmAuth>

                {/*
                                    TODO: create the same Dropdown style thing
                                            for displaying and selecting
                                            available topics (if any exist)

                                */}

                {scenarioId !== 'new' && finish && (
                  <Popup
                    content="This will appear on the slide that's shown after the scenario has been completed."
                    trigger={
                      <Form.Field>
                        <label>
                          After a scenario has been completed, the participant
                          will be shown this:
                        </label>
                        <TextEditor
                          onChange={onFinishSlideChange}
                          scenarioId={scenarioId}
                          value={finish.components[0]}
                          spellCheck={true}
                          styleConfig={{
                            editor: () => ({
                              height: '200px'
                            })
                          }}
                          config={configTextEditor}
                        />
                      </Form.Field>
                    }
                  />
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Form>
    );
  }
}

function mapStateToProps(state) {
  const {
    author,
    categories,
    consent,
    description,
    finish,
    status,
    title
  } = state.scenario;
  return { author, categories, consent, description, finish, status, title };
}

const mapDispatchToProps = {
  getScenario,
  setScenario
};

ScenarioEditor.propTypes = {
  getScenario: PropTypes.func.isRequired,
  scenarioId: PropTypes.node.isRequired,
  setScenario: PropTypes.func.isRequired,
  submitCB: PropTypes.func.isRequired,
  postSubmitCB: PropTypes.func,
  author: PropTypes.object,
  title: PropTypes.string,
  categories: PropTypes.array,
  consent: PropTypes.shape({
    id: PropTypes.number,
    prose: PropTypes.string
  }),
  description: PropTypes.string,
  finish: PropTypes.object,
  status: PropTypes.number
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenarioEditor);
