import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import { getCohort } from '@actions/cohort';
import {
  createChat,
  getChatById,
  getChatsByCohortId,
  joinChat
} from '@actions/chat';
import { getScenariosByStatus } from '@actions/scenario';
import Lobby from '@components/Lobby';
import {
  Button,
  Card,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Label,
  Modal,
  Ref,
  Text
} from '@components/UI';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import Username from '@components/User/Username';
import withSocket, {
  CHAT_CREATED,
  CREATE_COHORT_CHANNEL,
  JOIN_OR_PART,
  RUN_CHAT_LINK
} from '@hoc/withSocket';
import Events from '@utils/Events';
import Identity from '@utils/Identity';
import Moment from '@utils/Moment';
import Storage from '@utils/Storage';
import './Cohort.css';

export const makeCohortScenarioChatJoinPath = (cohort, scenario, chat) => {
  const persisted = Storage.get(`cohort/${cohort.id}/run/${scenario.id}`);
  const slideIndex = persisted ? persisted.activeRunSlideIndex : 0;
  const redirectCohortPart = `/cohort/${Identity.toHash(cohort.id)}`;
  const redirectRunPart = `/run/${Identity.toHash(scenario.id)}`;
  const redirectChatPart = `/chat/${Identity.toHash(chat.id)}`;
  const redirectSlidePart = `/slide/${slideIndex}`;

  return [
    redirectCohortPart,
    redirectRunPart,
    redirectChatPart,
    redirectSlidePart
  ].join('');
};

export class CohortRoomSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      isOpenToCohort: false,
      create: {
        isOpen: false
      },
      lobby: {
        isOpen: false
      }
    };
    this.createChat = this.createChat.bind(this);
    this.fetchChats = this.fetchChats.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onSelectChatClick = this.onSelectChatClick.bind(this);
  }

  async fetchChats(data) {
    // TODO: get linked users here!!
    // if (data && data.)
    // console.log(data);

    await this.props.getChatsByCohortId(this.props.cohort.id);

    if (!this.state.isReady) {
      this.setState({
        isReady: true
      });
    }
  }

  async componentDidMount() {
    await this.fetchChats();

    const { cohort } = this.props;

    this.props.socket.emit(CREATE_COHORT_CHANNEL, { cohort });
    this.props.socket.on(CHAT_CREATED, this.fetchChats);
    this.props.socket.on(JOIN_OR_PART, this.fetchChats);
    this.props.socket.on(RUN_CHAT_LINK, this.fetchChats);
  }

  componentWillUnmount() {
    this.props.socket.off(CHAT_CREATED, this.fetchChats);
    this.props.socket.off(JOIN_OR_PART, this.fetchChats);
    this.props.socket.off(RUN_CHAT_LINK, this.fetchChats);
  }

  async createChat(event) {
    await this.props.createChat(
      this.props.scenario,
      this.props.cohort,
      this.state.isOpenToCohort
    );
  }

  onSelectChatClick(event, { chat }) {
    console.log('Select a chat room');
  }

  onCloseClick() {
    /* istanbul ignore else */
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    const { createChat, onCloseClick, onSelectChatClick } = this;

    const { chat, chats, cohort, scenario, user } = this.props;
    const { isReady } = this.state;

    if (!isReady) {
      return null;
    }

    const defaultOptions = scenario.personas.reduce((accum, persona) => {
      accum.push({
        persona,
        key: Identity.key(persona),
        value: persona.id,
        text: persona.name,
        content: (
          <Fragment>
            <Text>{persona.name}</Text>
            <br />
            <Text size="small">{persona.description}</Text>
          </Fragment>
        )
      });
      return accum;
    }, []);

    let isUserCurrentlyHosting = false;

    const cards = chats.reduce((accum, chat) => {
      const key = Identity.key(chat);
      const updatedAgo = Moment(chat.updated_at).fromNow();
      const userInChat = chat.usersById[user.id];
      const host = chat.usersById[chat.host_id];
      const isUserNotHost = host.id !== user.id;
      const isUserHost = !isUserNotHost;
      const filledRoles = chat.users.reduce((accum, { persona_id }) => {
        if (persona_id) {
          accum.push(persona_id);
        }
        return accum;
      }, []);
      const unfilledRoles = scenario.personas.reduce((accum, persona) => {
        if (!filledRoles.includes(persona.id)) {
          accum.push(persona);
        }
        return accum;
      }, []);

      // Skip the first option, since it's a placeholder.
      // Remove any options that are already
      // assigned/claimed by other users
      const options = defaultOptions.filter(
        option => !filledRoles.includes(option.value)
      );

      const articleOrPossessivePronoun = isUserNotHost ? 'a' : 'your';
      const placeholder = `Select ${articleOrPossessivePronoun} role`;

      const memoChatId = chat.id;

      const miniSendInvitesButton = (
        <Button
          compact
          className="primary"
          onClick={async () => {
            await this.fetchChats();

            const chat = this.props.chatsById[memoChatId];
            this.setState({
              lobby: {
                chat,
                isOpen: true
              }
            });
          }}
        >
          Send invites
        </Button>
      );

      const miniJoinScenarioButton = (
        <Button
          compact
          className="primary"
          onClick={() => {
            location.href = makeCohortScenarioChatJoinPath(
              cohort,
              scenario,
              chat
            );
          }}
        >
          Join room
        </Button>
      );

      const isUserRoleAssigned = userInChat && userInChat.persona_id !== null;

      const userPersona = isUserRoleAssigned
        ? scenario.personas.find(({ id }) => id === userInChat.persona_id)
        : null;

      const userRoleDisplay = isUserRoleAssigned ? (
        <Fragment>
          You are participating as <strong>{userPersona.name}</strong>
        </Fragment>
      ) : (
        'You must select a role'
      );

      const { displayableName } = Username.getDisplayables(host);

      const whoseRoom = isUserNotHost ? (
        <Fragment>{displayableName}&apos;s room</Fragment>
      ) : null;

      const showOrButton = isUserHost && isUserRoleAssigned;

      accum.push(
        <Card key={key}>
          <Card.Content className="c__chat-card">
            {whoseRoom ? <Card.Header>{whoseRoom}</Card.Header> : null}
            <Card.Meta>
              <Button.Group
                fluid
                widths={showOrButton ? 2 : 1}
                style={{ width: '97%' }}
              >
                {isUserHost ? miniSendInvitesButton : null}
                {showOrButton ? <Button.Or /> : null}
                {isUserRoleAssigned ? miniJoinScenarioButton : null}
              </Button.Group>
            </Card.Meta>
            <Card.Description className="c__chat-card__meta">
              <p>{userRoleDisplay}. The following roles are available:</p>
              <Label.Group>
                {options.reduce((accum, option, index) => {
                  const { content, persona } = option;

                  const key = Identity.key({ scenario, chat, index });

                  accum.push(
                    <Label
                      className="fluid"
                      as={Button}
                      key={key}
                      onClick={async () => {
                        await this.props.joinChat(chat.id, persona);
                      }}
                    >
                      {content}
                    </Label>
                  );

                  return accum;
                }, [])}
              </Label.Group>
            </Card.Description>
          </Card.Content>
        </Card>
      );

      if (!isUserCurrentlyHosting && isUserHost) {
        isUserCurrentlyHosting = isUserHost;
      }

      return accum;
    }, []);

    const primaryCreateButtonContent = this.state.create.isOpen
      ? 'Create and go to lobby'
      : '';

    const primaryLobbyButtonContent = this.state.lobby.isOpen
      ? 'Join room'
      : '';

    const primaryButtonContent = this.state.create.isOpen
      ? primaryCreateButtonContent
      : primaryLobbyButtonContent;

    let primaryButtonDisabled = false;
    let host = null;

    console.log(this.state.lobby.chat);

    if (this.state.lobby.isOpen && this.state.lobby.chat) {
      console.log('in the lobby');
      const chat = this.props.chatsById[this.state.lobby.chat.id];
      host = chat.usersById[this.props.user.id];
      primaryButtonDisabled = host.persona_id === null;
    }

    const primaryButtonProps = {
      content: primaryButtonContent,
      disabled: primaryButtonDisabled,
      primary: true,
      onClick: async () => {
        if (this.state.lobby.isOpen) {
          // await this.props.joinChat(chat.id, persona);
          location.href = makeCohortScenarioChatJoinPath(
            cohort,
            scenario,
            chat
          );
          return;
        }

        if (this.state.create.isOpen) {
          await this.createChat();
          this.setState({
            create: {
              isOpen: false
            },
            lobby: {
              isOpen: true
            }
          });
        }
      }
    };

    const secondary = {
      ...this.props?.buttons?.secondary
    };

    const closeOrCancel = this.state.create.isOpen ? 'Cancel' : 'Close';

    const onCloseOrCancel = () => {
      if (this.state.create.isOpen) {
        this.setState({
          isOpenToCohort: false,
          create: {
            isOpen: false
          },
          lobby: {
            isOpen: false
          }
        });
      } else {
        onCloseClick();
        if (secondary?.onClick) {
          secondary?.onClick();
        }
      }
    };

    const secondaryButtonProps = {
      content: closeOrCancel,
      onClick: onCloseOrCancel
    };

    const onCreateToggleClick = () => {
      const { create } = this.state;
      create.isOpen = !create.isOpen;
      this.setState({
        create
      });
    };

    const onRoomAccessChange = event => {
      const { value } = event.target;
      const isOpenToCohort = value === 'yes';
      this.setState({
        isOpenToCohort
      });
    };

    const pluralRoom = pluralize('room', chats.length);
    const isAre = pluralize('is', chats.length);
    const availableDisplay = (
      <p tabIndex="0">
        There {isAre} <strong>{chats.length}</strong> open {pluralRoom}{' '}
        available.
      </p>
    );

    const createOrLobbyIsOpen =
      this.state.create.isOpen || this.state.lobby.isOpen;
    const createOrLobbyHeader = this.state.create.isOpen
      ? `Creating a room for ${scenario.title}`
      : `Invite participants to your room for ${scenario.title}`;

    const headerContent = createOrLobbyIsOpen
      ? createOrLobbyHeader
      : `Create or join a room for ${scenario.title}`;

    return (
      <Modal.Accessible open>
        <Modal
          closeIcon
          open
          aria-modal="true"
          role="dialog"
          centered={false}
          onClose={secondaryButtonProps.onClick}
        >
          <Header icon="group" tabIndex="0" content={headerContent} />
          <Modal.Content style={{ height: '80vh' }}>
            {createOrLobbyIsOpen ? (
              <Fragment>
                {this.state.create.isOpen ? (
                  <Grid padded>
                    <Grid.Row>
                      <Grid.Column className="c__grid-single-col-padding">
                        <p tabIndex="0">
                          Is your room open to anyone in your cohort?
                        </p>
                        <Form>
                          <Form.Field>
                            <div className="ui checked radio checkbox">
                              <input
                                tabIndex="0"
                                type="radio"
                                name="isOpenToCohort"
                                id="no"
                                value="no"
                                checked={this.state.isOpenToCohort === false}
                                onChange={onRoomAccessChange}
                              />
                              <label htmlFor="no">
                                No, I will invite participants.
                              </label>
                            </div>
                          </Form.Field>

                          <Form.Field>
                            <div className="ui checked radio checkbox">
                              <input
                                tabIndex="0"
                                type="radio"
                                name="isOpenToCohort"
                                id="yes"
                                value="yes"
                                checked={this.state.isOpenToCohort === true}
                                onChange={onRoomAccessChange}
                              />
                              <label htmlFor="yes">
                                Yes, let anyone in my cohort join.
                              </label>
                            </div>
                          </Form.Field>
                        </Form>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                ) : null}
                {this.state.lobby.isOpen ? (
                  <Lobby
                    chat={this.state.lobby.chat}
                    cohort={cohort}
                    scenario={scenario}
                  />
                ) : null}
              </Fragment>
            ) : (
              <Fragment>
                {!isUserCurrentlyHosting ? (
                  <Button
                    size="large"
                    tabIndex="0"
                    onClick={onCreateToggleClick}
                  >
                    <Icon.Group>
                      <Icon className="primary" name="group" />
                      <Icon corner="top right" name="plus" />
                    </Icon.Group>
                    Create a room for this scenario
                  </Button>
                ) : null}
                <Grid padded>
                  <Grid.Row>
                    <Grid.Column className="c__grid-single-col-padding">
                      {availableDisplay}
                      <Card.Group className="c__chat-cards" itemsPerRow={3}>
                        {cards}
                      </Card.Group>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Fragment>
            )}
          </Modal.Content>
          <Modal.Actions className="c__action-btns__scenario-selector">
            <Button.Group fluid>
              {this.state.create.isOpen ? (
                <Fragment>
                  <Button {...primaryButtonProps} />
                  <Button.Or />
                </Fragment>
              ) : null}
              {this.state.lobby.isOpen ? (
                <Fragment>
                  <Button {...primaryButtonProps} />
                  <Button.Or />
                </Fragment>
              ) : null}
              <Button {...secondaryButtonProps} />
            </Button.Group>
          </Modal.Actions>
          <div data-testid="cohort-chat-selector" />
        </Modal>
      </Modal.Accessible>
    );
  }
}

CohortRoomSelector.propTypes = {
  buttons: PropTypes.object,
  chats: PropTypes.array,
  chatsById: PropTypes.object,
  cohort: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    roles: PropTypes.array,
    runs: PropTypes.array,
    scenarios: PropTypes.array,
    users: PropTypes.array
  }),
  createChat: PropTypes.func,
  getChatsByCohortId: PropTypes.func,
  header: PropTypes.any,
  joinChat: PropTypes.func,
  onClose: PropTypes.func,
  scenario: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { chat, cohort, chatsById, user } = state;
  let chats = [];

  if (state.chats) {
    chats.push(
      ...state.chats.filter(
        ({ ended_at, host_id, is_open }) =>
          (is_open || host_id === user.id) && !ended_at
      )
    );
  }

  return { chat, cohort, chats, chatsById, user };
};

const mapDispatchToProps = dispatch => ({
  joinChat: (...params) => dispatch(joinChat(...params)),
  createChat: (...params) => dispatch(createChat(...params)),
  getChatById: id => dispatch(getChatById(id)),
  getChatsByCohortId: id => dispatch(getChatsByCohortId(id))
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CohortRoomSelector)
);
