/** @TEMPLATE: BEGIN **/
import React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect
}));

import {
  fetchImplementation,
  mounter,
  reduxer,
  serialize,
  snapshotter,
  state
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';

import {
  act,
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
/** @TEMPLATE: END **/

/** @GENERATED: BEGIN **/

import Emitter from 'events';

import withSocket, * as SOCKET_EVENT_TYPES from '@hoc/withSocket';
jest.mock('@hoc/withSocket', () => {
  const socket = {
    disconnect: jest.fn(),
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
  };

  globalThis.mockSocket = socket;

  return {
    __esModule: true,
    ...jest.requireActual('@hoc/withSocket'),
    default: function(Component) {
      Component.defaultProps = {
        ...Component.defaultProps,
        socket
      };
      return Component;
    }
  };
});

jest.mock('@utils/Moment', () => {
  return {
    __esModule: true,
    default: function(time) {
      return {
        format() {
          return 'HH:mm A';
        }
      };
    }
  };
});

import Storage from '@utils/Storage';
jest.mock('@utils/Storage', () => {
  return {
    ...jest.requireActual('@utils/Storage'),
    get: jest.fn(),
    set: jest.fn(),
    merge: jest.fn()
  };
});

import {
  CREATE_CHAT_INVITE_SUCCESS,
  GET_CHAT_SUCCESS,
  GET_CHAT_USERS_SUCCESS,
  GET_CHATS_SUCCESS,
  GET_COHORT_SUCCESS,
  GET_INVITES_SUCCESS,
  GET_SCENARIO_SUCCESS,
  GET_USERS_COUNT_SUCCESS,
  GET_USERS_SUCCESS
} from '../../actions/types';
import * as chatActions from '../../actions/chat';
import * as cohortActions from '../../actions/cohort';
import * as inviteActions from '../../actions/invite';
import * as scenarioActions from '../../actions/scenario';
import * as usersActions from '../../actions/users';
jest.mock('../../actions/chat');
jest.mock('../../actions/cohort');
jest.mock('../../actions/invite');
jest.mock('../../actions/scenario');
jest.mock('../../actions/users');

let user;
let superUser;
let facilitatorUser;
let researcherUser;
let participantUser;
let anonymousUser;
let chat;
let chats;
let chatsById;
let cohort;
let invites;
let invitesById;
let scenario;
let users;
let usersById;

const expectDateString = expect.stringMatching(/[0-9]{4}-[0-9]{2}-[0-9]{2}.*/i);

import CohortRoomSelector from '../../components/Cohorts/CohortRoomSelector.jsx';
/** @GENERATED: END **/

/** @TEMPLATE: BEGIN **/
const original = JSON.parse(JSON.stringify(state));
let container = null;
let commonProps = null;
let commonState = null;
/** @TEMPLATE: END **/

beforeAll(() => {
  /** @TEMPLATE: BEGIN **/
  (window || global).fetch = jest.fn();
  /** @TEMPLATE: END **/
});

afterAll(() => {
  /** @TEMPLATE: BEGIN **/
  jest.restoreAllMocks();
  /** @TEMPLATE: END **/
});

beforeEach(() => {
  /** @TEMPLATE: BEGIN **/
  jest.useFakeTimers();
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);
  /** @TEMPLATE: END **/

  /** @GENERATED: BEGIN **/

  user = superUser = {
    username: 'super',
    personalname: 'Super User',
    email: 'super@email.com',
    id: 999,
    roles: ['participant', 'super_admin'],
    is_anonymous: false,
    is_super: true
  };

  facilitatorUser = {
    username: 'facilitator',
    personalname: 'Facilitator User',
    email: 'facilitator@email.com',
    id: 555,
    roles: ['participant', 'facilitator', 'researcher', 'owner'],
    is_anonymous: false,
    is_super: false,
    is_owner: true,
    progress: {
      completed: [],
      latestByScenarioId: {
        1: {
          is_complete: false,
          scenario_id: 99,
          event_id: 1905,
          created_at: 1602454306144,
          generic: 'arrived at a slide.',
          name: 'slide-arrival',
          url: 'http://localhost:3000/cohort/1/run/99/slide/1'
        }
      }
    }
  };
  researcherUser = {
    username: 'researcher',
    personalname: 'Researcher User',
    email: 'researcher@email.com',
    id: 444,
    roles: ['participant', 'researcher'],
    is_anonymous: false,
    is_super: false,
    progress: {
      completed: [],
      latestByScenarioId: {
        1: {
          is_complete: false,
          scenario_id: 99,
          event_id: 1904,
          created_at: 1602454306144,
          generic: 'arrived at a slide.',
          name: 'slide-arrival',
          url: 'http://localhost:3000/cohort/1/run/99/slide/1'
        }
      }
    }
  };
  participantUser = {
    username: 'participant',
    personalname: 'Participant User',
    email: 'participant@email.com',
    id: 333,
    roles: ['participant'],
    is_anonymous: false,
    is_super: false,
    progress: {
      completed: [],
      latestByScenarioId: {
        1: {
          is_complete: false,
          scenario_id: 99,
          event_id: 1903,
          created_at: 1602454306144,
          generic: 'arrived at a slide.',
          name: 'slide-arrival',
          url: 'http://localhost:3000/cohort/1/run/99/slide/1'
        }
      }
    }
  };
  anonymousUser = {
    username: 'anonymous',
    personalname: '',
    email: '',
    id: 222,
    roles: ['participant'],
    is_anonymous: true,
    is_super: false,
    progress: {
      completed: [],
      latestByScenarioId: {
        1: {
          is_complete: false,
          scenario_id: 99,
          event_id: 1902,
          created_at: 1602454306144,
          generic: 'arrived at a slide.',
          name: 'slide-arrival',
          url: 'http://localhost:3000/cohort/1/run/99/slide/1'
        }
      }
    }
  };

  users = [
    superUser,
    facilitatorUser,
    researcherUser,
    participantUser,
    anonymousUser
  ];

  usersById = users.reduce(
    (accum, user) => ({
      ...accum,
      [user.id]: user
    }),
    {}
  );

  chat = {
    id: 1,
    scenario_id: 42,
    cohort_id: null,
    host_id: 999,
    created_at: '2020-12-08T21:51:33.659Z',
    updated_at: null,
    deleted_at: null,
    ended_at: null,
    users: [superUser],
    usersById: {
      [superUser.id]: superUser
    }
  };

  chats = [chats];

  chatsById = chats.reduce((accum, chat) => {
    accum[chat.id] = chat;
    return accum;
  });

  cohort = {
    id: 1,
    created_at: '2020-08-31T14:01:08.656Z',
    name: 'A New Cohort That Exists Within Inline Props',
    is_archived: false,
    runs: [
      {
        id: 11,
        user_id: 333,
        scenario_id: 99,
        created_at: '2020-03-28T19:44:03.069Z',
        updated_at: '2020-03-31T17:01:43.139Z',
        ended_at: '2020-03-31T17:01:43.128Z',
        consent_id: 8,
        consent_acknowledged_by_user: true,
        consent_granted_by_user: true,
        referrer_params: null,
        cohort_id: 1,
        run_id: 11
      }
    ],
    scenarios: [99],
    users: [
      {
        username: 'super',
        personalname: 'Super User',
        email: 'super@email.com',
        id: 999,
        roles: ['participant', 'super_admin'],
        is_anonymous: false,
        is_super: true,
        progress: {
          completed: [1],
          latestByScenarioId: {
            1: {
              is_complete: true,
              event_id: 1909,
              created_at: 1602454306144,
              generic: 'arrived at a slide.',
              name: 'slide-arrival',
              url: 'http://localhost:3000/cohort/1/run/99/slide/1'
            }
          }
        }
      },
      {
        username: 'facilitator',
        personalname: 'Facilitator User',
        email: 'facilitator@email.com',
        id: 555,
        roles: ['participant', 'facilitator', 'researcher', 'owner'],
        is_anonymous: false,
        is_super: false,
        is_owner: true,
        progress: {
          completed: [],
          latestByScenarioId: {
            1: {
              is_complete: false,
              scenario_id: 99,
              event_id: 1905,
              created_at: 1602454306144,
              generic: 'arrived at a slide.',
              name: 'slide-arrival',
              url: 'http://localhost:3000/cohort/1/run/99/slide/1'
            }
          }
        }
      },
      {
        username: 'researcher',
        personalname: 'Researcher User',
        email: 'researcher@email.com',
        id: 444,
        roles: ['participant', 'researcher'],
        is_anonymous: false,
        is_super: false,
        progress: {
          completed: [],
          latestByScenarioId: {
            1: {
              is_complete: false,
              scenario_id: 99,
              event_id: 1904,
              created_at: 1602454306144,
              generic: 'arrived at a slide.',
              name: 'slide-arrival',
              url: 'http://localhost:3000/cohort/1/run/99/slide/1'
            }
          }
        }
      },
      {
        username: 'participant',
        personalname: 'Participant User',
        email: 'participant@email.com',
        id: 333,
        roles: ['participant'],
        is_anonymous: false,
        is_super: false,
        progress: {
          completed: [],
          latestByScenarioId: {
            1: {
              is_complete: false,
              scenario_id: 99,
              event_id: 1903,
              created_at: 1602454306144,
              generic: 'arrived at a slide.',
              name: 'slide-arrival',
              url: 'http://localhost:3000/cohort/1/run/99/slide/1'
            }
          }
        }
      },
      {
        username: 'anonymous',
        personalname: '',
        email: '',
        id: 222,
        roles: ['participant'],
        is_anonymous: true,
        is_super: false,
        progress: {
          completed: [],
          latestByScenarioId: {
            1: {
              is_complete: false,
              scenario_id: 99,
              event_id: 1902,
              created_at: 1602454306144,
              generic: 'arrived at a slide.',
              name: 'slide-arrival',
              url: 'http://localhost:3000/cohort/1/run/99/slide/1'
            }
          }
        }
      }
    ],
    roles: ['super', 'facilitator'],
    usersById: {
      999: {
        username: 'super',
        personalname: 'Super User',
        email: 'super@email.com',
        id: 999,
        roles: ['participant', 'super_admin'],
        is_anonymous: false,
        is_super: true,
        progress: {
          completed: [1],
          latestByScenarioId: {
            1: {
              is_complete: true,
              event_id: 1909,
              created_at: 1602454306144,
              generic: 'arrived at a slide.',
              name: 'slide-arrival',
              url: 'http://localhost:3000/cohort/1/run/99/slide/1'
            }
          }
        }
      },
      555: {
        username: 'facilitator',
        personalname: 'Facilitator User',
        email: 'facilitator@email.com',
        id: 555,
        roles: ['participant', 'facilitator', 'researcher', 'owner'],
        is_anonymous: false,
        is_super: false,
        is_owner: true,
        progress: {
          completed: [],
          latestByScenarioId: {
            1: {
              is_complete: false,
              scenario_id: 99,
              event_id: 1905,
              created_at: 1602454306144,
              generic: 'arrived at a slide.',
              name: 'slide-arrival',
              url: 'http://localhost:3000/cohort/1/run/99/slide/1'
            }
          }
        }
      },
      444: {
        username: 'researcher',
        personalname: 'Researcher User',
        email: 'researcher@email.com',
        id: 444,
        roles: ['participant', 'researcher'],
        is_anonymous: false,
        is_super: false,
        progress: {
          completed: [],
          latestByScenarioId: {
            1: {
              is_complete: false,
              scenario_id: 99,
              event_id: 1904,
              created_at: 1602454306144,
              generic: 'arrived at a slide.',
              name: 'slide-arrival',
              url: 'http://localhost:3000/cohort/1/run/99/slide/1'
            }
          }
        }
      },
      333: {
        username: 'participant',
        personalname: 'Participant User',
        email: 'participant@email.com',
        id: 333,
        roles: ['participant'],
        is_anonymous: false,
        is_super: false,
        progress: {
          completed: [],
          latestByScenarioId: {
            1: {
              is_complete: false,
              scenario_id: 99,
              event_id: 1903,
              created_at: 1602454306144,
              generic: 'arrived at a slide.',
              name: 'slide-arrival',
              url: 'http://localhost:3000/cohort/1/run/99/slide/1'
            }
          }
        }
      },
      222: {
        username: 'anonymous',
        personalname: '',
        email: '',
        id: 222,
        roles: ['participant'],
        is_anonymous: true,
        is_super: false,
        progress: {
          completed: [],
          latestByScenarioId: {
            1: {
              is_complete: false,
              scenario_id: 99,
              event_id: 1902,
              created_at: 1602454306144,
              generic: 'arrived at a slide.',
              name: 'slide-arrival',
              url: 'http://localhost:3000/cohort/1/run/99/slide/1'
            }
          }
        }
      }
    }
  };

  invites = [
    {
      id: 1,
      sender_id: 999,
      receiver_id: 555,
      status_id: 1,
      props: {
        chat_id: 8,
        persona_id: null
      },
      code: 'b7f21ab4-aa95-4f48-aee8-19f7176bc595',
      created_at: '2021-02-04T19:24:39.039Z',
      updated_at: null,
      expire_at: null
    }
  ];

  scenario = {
    author: {
      id: 999,
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      is_anonymous: false,
      roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
      is_super: true
    },
    categories: [],
    consent: { id: 69, prose: '' },
    description: "This is the description of 'Some Other Scenario'",
    finish: {
      id: 11,
      title: '',
      components: [{ html: '<h2>Bye!</h2>', type: 'Text' }],
      is_finish: true
    },
    lock: {
      scenario_id: 99,
      user_id: 999,
      created_at: '2020-02-31T23:54:19.934Z',
      ended_at: null
    },
    slides: [
      {
        id: 11,
        title: '',
        components: [{ html: '<h2>Bye!</h2>', type: 'Text' }],
        is_finish: true
      },
      {
        id: 22,
        title: '',
        components: [
          {
            id: 'b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
            html: '<p>HTML!</p>',
            type: 'Text'
          },
          {
            id: 'aede9380-c7a3-4ef7-add7-eb6677358c9e',
            type: 'TextResponse',
            header: 'TextResponse-1',
            prompt: '',
            timeout: 0,
            recallId: '',
            required: true,
            responseId: 'be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
            placeholder: 'Your response'
          },
          {
            id: 'f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
            html: '<p>?</p>',
            type: 'Text'
          }
        ],
        is_finish: false
      }
    ],
    status: 1,
    title: 'Some Other Scenario',
    users: [
      {
        id: 999,
        email: 'super@email.com',
        username: 'super',
        personalname: 'Super User',
        roles: ['super'],
        is_super: true,
        is_author: true,
        is_reviewer: false
      }
    ],
    id: 99,
    created_at: '2020-07-31T17:50:28.089Z',
    updated_at: null,
    deleted_at: null,
    labels: ['a'],
    personas: [
      {
        id: 1,
        name: 'Participant',
        description:
          'The default user participating in a single person scenario.',
        color: '#FFFFFF',
        created_at: '2020-12-01T15:49:04.962Z',
        updated_at: null,
        deleted_at: null,
        author_id: 3,
        is_read_only: true,
        is_shared: true
      }
    ]
  };

  scenario.personas = [
    {
      id: 2,
      name: 'Teacher',
      description:
        'A non-specific teacher, participating in a multi person scenario.',
      color: '#3f59a9',
      created_at: '2020-12-01T15:49:04.962Z',
      updated_at: null,
      deleted_at: null,
      author_id: 3,
      is_read_only: true,
      is_shared: true
    },
    {
      id: 3,
      name: 'Student',
      description:
        'A non-specific student, participating in a multi person scenario.',
      color: '#e59235',
      created_at: '2020-12-01T15:49:04.962Z',
      updated_at: null,
      deleted_at: null,
      author_id: 3,
      is_read_only: true,
      is_shared: true
    }
  ];

  invitesById = invites.reduce((accum, invite) => {
    accum[invite.id] = invite;
    return accum;
  });

  chatActions.createChat.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  chatActions.getChat.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  chatActions.getChatById.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  chatActions.joinChat.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHAT_SUCCESS, chat });
    return chat;
  });

  chatActions.getChatsByCohortId.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_CHATS_SUCCESS, chats });
    return chats;
  });

  cohortActions.getCohort.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_COHORT_SUCCESS, cohort });
    return cohort;
  });

  scenarioActions.getScenario.mockImplementation(() => async dispatch => {
    dispatch({ type: GET_SCENARIO_SUCCESS, scenario });
    return scenario;
  });

  Storage.get.mockImplementation((key, defaultValue) => defaultValue);
  Storage.merge.mockImplementation((key, defaultValue) => defaultValue);

  /** @GENERATED: END **/

  /** @TEMPLATE: BEGIN **/
  commonProps = {};
  commonState = JSON.parse(JSON.stringify(original));
  /** @TEMPLATE: END **/
});

afterEach(() => {
  /** @TEMPLATE: BEGIN **/
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.resetAllMocks();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
  /** @TEMPLATE: END **/
});

test('CohortRoomSelector', () => {
  expect(CohortRoomSelector).toBeDefined();
});

/** @GENERATED: BEGIN **/
test('Render 1 1', async done => {
  const Component = CohortRoomSelector;
  const props = {
    ...commonProps,
    chat,
    cohort,
    scenario
  };

  const state = {
    ...commonState
  };

  state.chat = chat;
  state.scenario = scenario;
  state.user = user;
  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/** @GENERATED: BEGIN **/
test('Render 2 1', async done => {
  const Component = CohortRoomSelector;
  const props = {
    ...commonProps,
    chat,
    scenario
  };

  const state = {
    ...commonState
  };

  state.chat = chat;
  state.scenario = scenario;
  state.user = user;
  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/* INJECTION STARTS HERE */

test('Has chats in state', async done => {
  const Component = CohortRoomSelector;

  const props = {
    ...commonProps,
    chat,
    cohort,
    scenario,
    user
  };

  const state = {
    ...commonState,
    chat,
    chats,
    cohort,
    scenario,
    user,
    users,
    usersById
  };

  const emitter = new Emitter();

  globalThis.mockSocket.emit.mockImplementation(emitter.emit);

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();
  done();
});

// test('Fallbacks for state.chat, state.scenario, state.cohort (missing)', async done => {
//   const Component = CohortRoomSelector;

//   const props = {
//     ...commonProps,
//     chat,
//     cohort,
//     scenario,
//     user
//   };

//   const state = {
//     ...commonState,
//     chat: null,
//     cohort: null,
//     scenario: null,
//     user,
//     users,
//     usersById
//   };

//   const emitter = new Emitter();

//   globalThis.mockSocket.emit.mockImplementation(emitter.emit);

//   const ConnectedRoutedComponent = reduxer(Component, props, state);

//   await render(<ConnectedRoutedComponent {...props} />);
//   expect(serialize()).toMatchSnapshot();
//   done();
// });

// test('Fallbacks for state.chat, state.scenario, state.cohort (unloaded)', async done => {
//   const Component = CohortRoomSelector;

//   const props = {
//     ...commonProps,
//     chat,
//     cohort,
//     scenario,
//     user
//   };

//   const state = {
//     ...commonState,
//     chat: {id: null},
//     cohort: {id: null},
//     scenario: {id: null},
//     user,
//     users,
//     usersById
//   };

//   const emitter = new Emitter();

//   globalThis.mockSocket.emit.mockImplementation(emitter.emit);

//   const ConnectedRoutedComponent = reduxer(Component, props, state);

//   await render(<ConnectedRoutedComponent {...props} />);
//   expect(serialize()).toMatchSnapshot();
//   done();
// });

// test('Fallbacks for state.chat, state.scenario, state.cohort (unavailable)', async done => {
//   const Component = CohortRoomSelector;

//   const props = {
//     ...commonProps,
//     chat: null,
//     cohort: null,
//     scenario: null,
//     user
//   };

//   const state = {
//     ...commonState,
//     chat: {id: null},
//     cohort: {id: null},
//     scenario: {id: null},
//     user,
//     users,
//     usersById
//   };

//   const emitter = new Emitter();

//   globalThis.mockSocket.emit.mockImplementation(emitter.emit);

//   const ConnectedRoutedComponent = reduxer(Component, props, state);

//   await render(<ConnectedRoutedComponent {...props} />);
//   expect(serialize()).toMatchSnapshot();
//   done();
// });

// test('On RUN_CHAT_LINK, receives list with waiting users, personas missing', async (done) => {
//   const Component = CohortRoomSelector;

//   scenario.personas = [];

//   const props = {
//     ...commonProps,
//     chat,
//     cohort,
//     scenario,
//     user,
//   };

//   const state = {
//     ...commonState,
//     chat,
//     cohort,
//     scenario,
//     user,
//     users,
//     usersById,
//   };

//   const emitter = new Emitter();

//   globalThis.mockSocket.emit.mockImplementation(emitter.emit);
//   globalThis.mockSocket.on.mockImplementation(emitter.on);
//   globalThis.mockSocket.off.mockImplementation(emitter.off);

//   let count = 0;

//   chatActions.getLinkedChatUsersByChatId.mockImplementation(
//     () => async (dispatch) => {
//       users = count
//         ? [
//             {
//               ...users[0],
//               persona_id: 2,
//             },
//           ]
//         : [
//             {
//               ...users[0],
//               persona_id: 2,
//             },
//             {
//               ...users[1],
//               persona_id: 3,
//             },
//           ];

//       count++;

//       dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
//       return users;
//     }
//   );

//   const ConnectedRoutedComponent = reduxer(Component, props, state);

//   await render(<ConnectedRoutedComponent {...props} />);
//   expect(serialize()).toMatchSnapshot();

//   await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
//   expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
//     Array [
//       Array [
//         "run-chat-link",
//         [Function],
//       ],
//     ]
//   `);
//   expect(serialize()).toMatchSnapshot();

//   globalThis.mockSocket.emit('run-chat-link', {});

//   await waitFor(() =>
//     expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled()
//   );
//   expect(serialize()).toMatchSnapshot();

//   globalThis.mockSocket.emit('run-chat-link', {});

//   await waitFor(() =>
//     expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled()
//   );
//   expect(serialize()).toMatchSnapshot();

//   done();
// });

// describe('With cohort', () => {
//   test('Send CREATE_USER_CHANNEL', async done => {
//     const Component = CohortRoomSelector;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort,
//       scenario,
//       user
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user,
//       users,
//       usersById
//     };

//     const emitter = new Emitter();

//     globalThis.mockSocket.emit.mockImplementation(emitter.emit);

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();

//     await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
//     expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
//       Array [
//         Array [
//           "create-user-channel",
//           Object {
//             "user": Object {
//               "email": "super@email.com",
//               "id": 999,
//               "is_anonymous": false,
//               "is_super": true,
//               "personalname": "Super User",
//               "roles": Array [
//                 "participant",
//                 "super_admin",
//               ],
//               "username": "super",
//             },
//           },
//         ],
//       ]
//     `);
//     expect(serialize()).toMatchSnapshot();
//     done();
//   });

//   test('Chat has no users yet', async done => {
//     const Component = CohortRoomSelector;

//     // Make sure there are no users in the chat
//     chat = {
//       ...chat,
//       users: [],
//       usersById: {}
//     };

//     const props = {
//       ...commonProps,
//       chat,
//       cohort,
//       scenario,
//       user
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user
//     };

//     const emitter = new Emitter();

//     globalThis.mockSocket.emit.mockImplementation(emitter.emit);
//     globalThis.mockSocket.on.mockImplementation(emitter.on);
//     globalThis.mockSocket.off.mockImplementation(emitter.off);

//     chatActions.getChatById.mockImplementation(() => async dispatch => {
//       dispatch({ type: GET_CHAT_SUCCESS, chat });
//       return chat;
//     });

//     chatActions.getLinkedChatUsersByChatId.mockImplementation(
//       () => async dispatch => {
//         const users = [];
//         dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
//         return users;
//       }
//     );

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();

//     await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
//     expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
//       Array [
//         Array [
//           "run-chat-link",
//           [Function],
//         ],
//       ]
//     `);
//     expect(serialize()).toMatchSnapshot();

//     globalThis.mockSocket.emit('run-chat-link', {});

//     await waitFor(() =>
//       expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled()
//     );
//     expect(serialize()).toMatchSnapshot();
//     done();
//   });

//   test('On RUN_CHAT_LINK, receives empty list', async done => {
//     const Component = CohortRoomSelector;

//     // Make sure there are no users in the chat
//     chat = {
//       ...chat,
//       users: [],
//       usersById: {}
//     };

//     const props = {
//       ...commonProps,
//       chat,
//       cohort,
//       scenario,
//       user
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user
//     };

//     const emitter = new Emitter();

//     globalThis.mockSocket.emit.mockImplementation(emitter.emit);
//     globalThis.mockSocket.on.mockImplementation(emitter.on);
//     globalThis.mockSocket.off.mockImplementation(emitter.off);

//     chatActions.getLinkedChatUsersByChatId.mockImplementation(
//       () => async dispatch => {
//         const users = [];
//         dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
//         return users;
//       }
//     );

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();

//     await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
//     expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
//       Array [
//         Array [
//           "run-chat-link",
//           [Function],
//         ],
//       ]
//     `);
//     expect(serialize()).toMatchSnapshot();

//     globalThis.mockSocket.emit('run-chat-link', {});

//     await waitFor(() =>
//       expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled()
//     );
//     expect(serialize()).toMatchSnapshot();
//     done();
//   });

//   test('On RUN_CHAT_LINK, receives list, but no one is assigned yet', async (done) => {
//     const Component = CohortRoomSelector;

//     const unassignedUser = {
//       ...superUser,
//       persona_id: null,
//     };

//     chat = {
//       ...chat,
//       users: [unassignedUser],
//       usersById: {
//         [unassignedUser.id]: unassignedUser,
//       },
//     };

//     const props = {
//       ...commonProps,
//       cohort,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const emitter = new Emitter();

//     globalThis.mockSocket.emit.mockImplementation(emitter.emit);
//     globalThis.mockSocket.on.mockImplementation(emitter.on);
//     globalThis.mockSocket.off.mockImplementation(emitter.off);

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();

//     await waitFor(() => expect(chatActions.getChatById).toHaveBeenCalled());
//     expect(chatActions.getChatById.mock.calls).toMatchInlineSnapshot(`
//       Array [
//         Array [
//           1,
//         ],
//       ]
//     `);

//     await waitFor(() =>
//       expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled()
//     );
//     expect(chatActions.getLinkedChatUsersByChatId.mock.calls)
//       .toMatchInlineSnapshot(`
//       Array [
//         Array [
//           1,
//         ],
//       ]
//     `);

//     await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
//     expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
//       Array [
//         Array [
//           "run-chat-link",
//           [Function],
//         ],
//       ]
//     `);
//     expect(serialize()).toMatchSnapshot();

//     globalThis.mockSocket.emit('run-chat-link', {});

//     await waitFor(() =>
//       expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled()
//     );
//     expect(serialize()).toMatchSnapshot();
//     done();
//   });

//   test('On RUN_CHAT_LINK, receives list with waiting users', async (done) => {
//     const Component = CohortRoomSelector;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort,
//       scenario,
//       user,
//       users,
//       usersById,
//     };

//     const emitter = new Emitter();

//     globalThis.mockSocket.emit.mockImplementation(emitter.emit);
//     globalThis.mockSocket.on.mockImplementation(emitter.on);
//     globalThis.mockSocket.off.mockImplementation(emitter.off);

//     let count = 0;

//     chatActions.getLinkedChatUsersByChatId.mockImplementation(
//       () => async (dispatch) => {
//         users = count
//           ? [
//               {
//                 ...users[0],
//                 persona_id: 2,
//               },
//             ]
//           : [
//               {
//                 ...users[0],
//                 persona_id: 2,
//               },
//               {
//                 ...users[1],
//                 persona_id: 3,
//               },
//             ];

//         count++;

//         dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
//         return users;
//       }
//     );

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();

//     await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
//     expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
//       Array [
//         Array [
//           "run-chat-link",
//           [Function],
//         ],
//       ]
//     `);
//     expect(serialize()).toMatchSnapshot();

//     globalThis.mockSocket.emit('run-chat-link', {});

//     await waitFor(() =>
//       expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled()
//     );
//     expect(serialize()).toMatchSnapshot();

//     globalThis.mockSocket.emit('run-chat-link', {});

//     await waitFor(() =>
//       expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled()
//     );
//     expect(serialize()).toMatchSnapshot();

//     done();
//   });

// });

// describe('Without cohort', () => {
//   test('Send CREATE_USER_CHANNEL', async done => {
//     const Component = CohortRoomSelector;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort: null,
//       scenario,
//       user
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//       users,
//       usersById
//     };

//     const emitter = new Emitter();

//     globalThis.mockSocket.emit.mockImplementation(emitter.emit);

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();

//     await waitFor(() => expect(globalThis.mockSocket.emit).toHaveBeenCalled());
//     expect(globalThis.mockSocket.emit.mock.calls).toMatchInlineSnapshot(`
//       Array [
//         Array [
//           "create-user-channel",
//           Object {
//             "user": Object {
//               "email": "super@email.com",
//               "id": 999,
//               "is_anonymous": false,
//               "is_super": true,
//               "personalname": "Super User",
//               "roles": Array [
//                 "participant",
//                 "super_admin",
//               ],
//               "username": "super",
//             },
//           },
//         ],
//       ]
//     `);
//     expect(serialize()).toMatchSnapshot();
//     done();
//   });

//   test('Chat has no users yet', async done => {
//     const Component = CohortRoomSelector;

//     // Make sure there are no users in the chat
//     chat = {
//       ...chat,
//       users: [],
//       usersById: {}
//     };

//     const props = {
//       ...commonProps,
//       chat,
//       cohort: null,
//       scenario,
//       user
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user
//     };

//     const emitter = new Emitter();

//     globalThis.mockSocket.emit.mockImplementation(emitter.emit);
//     globalThis.mockSocket.on.mockImplementation(emitter.on);
//     globalThis.mockSocket.off.mockImplementation(emitter.off);

//     chatActions.getChatById.mockImplementation(() => async dispatch => {
//       dispatch({ type: GET_CHAT_SUCCESS, chat });
//       return chat;
//     });

//     chatActions.getLinkedChatUsersByChatId.mockImplementation(
//       () => async dispatch => {
//         const users = [];
//         dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
//         return users;
//       }
//     );

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();

//     await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
//     expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
//       Array [
//         Array [
//           "run-chat-link",
//           [Function],
//         ],
//       ]
//     `);
//     expect(serialize()).toMatchSnapshot();

//     globalThis.mockSocket.emit('run-chat-link', {});

//     await waitFor(() =>
//       expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled()
//     );
//     expect(serialize()).toMatchSnapshot();
//     done();
//   });

//   test('On RUN_CHAT_LINK, receives empty list', async done => {
//     const Component = CohortRoomSelector;

//     // Make sure there are no users in the chat
//     chat = {
//       ...chat,
//       users: [],
//       usersById: {}
//     };

//     const props = {
//       ...commonProps,
//       chat,
//       cohort: null,
//       scenario,
//       user
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user
//     };

//     const emitter = new Emitter();

//     globalThis.mockSocket.emit.mockImplementation(emitter.emit);
//     globalThis.mockSocket.on.mockImplementation(emitter.on);
//     globalThis.mockSocket.off.mockImplementation(emitter.off);

//     chatActions.getLinkedChatUsersByChatId.mockImplementation(
//       () => async dispatch => {
//         const users = [];
//         dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
//         return users;
//       }
//     );

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();

//     await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
//     expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
//       Array [
//         Array [
//           "run-chat-link",
//           [Function],
//         ],
//       ]
//     `);
//     expect(serialize()).toMatchSnapshot();

//     globalThis.mockSocket.emit('run-chat-link', {});

//     await waitFor(() =>
//       expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled()
//     );
//     expect(serialize()).toMatchSnapshot();
//     done();
//   });

//   test('On RUN_CHAT_LINK, receives list, but no one is assigned yet', async (done) => {
//     const Component = CohortRoomSelector;

//     const unassignedUser = {
//       ...superUser,
//       persona_id: null,
//     };

//     chat = {
//       ...chat,
//       users: [unassignedUser],
//       usersById: {
//         [unassignedUser.id]: unassignedUser,
//       },
//     };

//     const props = {
//       ...commonProps,
//       cohort: null,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//     };

//     const emitter = new Emitter();

//     globalThis.mockSocket.emit.mockImplementation(emitter.emit);
//     globalThis.mockSocket.on.mockImplementation(emitter.on);
//     globalThis.mockSocket.off.mockImplementation(emitter.off);

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();

//     await waitFor(() => expect(chatActions.getChatById).toHaveBeenCalled());
//     expect(chatActions.getChatById.mock.calls).toMatchInlineSnapshot(`
//       Array [
//         Array [
//           1,
//         ],
//       ]
//     `);

//     await waitFor(() =>
//       expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled()
//     );
//     expect(chatActions.getLinkedChatUsersByChatId.mock.calls)
//       .toMatchInlineSnapshot(`
//       Array [
//         Array [
//           1,
//         ],
//       ]
//     `);

//     await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
//     expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
//       Array [
//         Array [
//           "run-chat-link",
//           [Function],
//         ],
//       ]
//     `);
//     expect(serialize()).toMatchSnapshot();

//     globalThis.mockSocket.emit('run-chat-link', {});

//     await waitFor(() =>
//       expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled()
//     );
//     expect(serialize()).toMatchSnapshot();
//     done();
//   });

//   test('On RUN_CHAT_LINK, receives list with waiting users', async (done) => {
//     const Component = CohortRoomSelector;

//     const props = {
//       ...commonProps,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//     };

//     const state = {
//       ...commonState,
//       chat,
//       cohort: null,
//       scenario,
//       user,
//       users,
//       usersById,
//     };

//     const emitter = new Emitter();

//     globalThis.mockSocket.emit.mockImplementation(emitter.emit);
//     globalThis.mockSocket.on.mockImplementation(emitter.on);
//     globalThis.mockSocket.off.mockImplementation(emitter.off);

//     let count = 0;

//     chatActions.getLinkedChatUsersByChatId.mockImplementation(
//       () => async (dispatch) => {
//         users = count
//           ? [
//               {
//                 ...users[0],
//                 persona_id: 2,
//               },
//             ]
//           : [
//               {
//                 ...users[0],
//                 persona_id: 2,
//               },
//               {
//                 ...users[1],
//                 persona_id: 3,
//               },
//             ];

//         count++;

//         dispatch({ type: GET_CHAT_USERS_SUCCESS, users });
//         return users;
//       }
//     );

//     const ConnectedRoutedComponent = reduxer(Component, props, state);

//     await render(<ConnectedRoutedComponent {...props} />);
//     expect(serialize()).toMatchSnapshot();

//     await waitFor(() => expect(globalThis.mockSocket.on).toHaveBeenCalled());
//     expect(globalThis.mockSocket.on.mock.calls).toMatchInlineSnapshot(`
//       Array [
//         Array [
//           "run-chat-link",
//           [Function],
//         ],
//       ]
//     `);
//     expect(serialize()).toMatchSnapshot();

//     globalThis.mockSocket.emit('run-chat-link', {});

//     await waitFor(() =>
//       expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled()
//     );
//     expect(serialize()).toMatchSnapshot();

//     globalThis.mockSocket.emit('run-chat-link', {});

//     await waitFor(() =>
//       expect(chatActions.getLinkedChatUsersByChatId).toHaveBeenCalled()
//     );
//     expect(serialize()).toMatchSnapshot();

//     done();
//   });
// });
