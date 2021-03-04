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

async function waitForPopper() {
  // Popper update() - https://github.com/popperjs/react-popper/issues/350
  await act(async () => await null);
}

/** @TEMPLATE: END **/

/** @GENERATED: BEGIN **/

import ChatMessageDeleteButton from '../../components/Chat/ChatMessageDeleteButton.jsx';
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

test('ChatMessageDeleteButton', () => {
  expect(ChatMessageDeleteButton).toBeDefined();
});

/** @GENERATED: BEGIN **/
test('Render 1 1', async done => {
  const Component = ChatMessageDeleteButton;
  const props = {
    ...commonProps,
    'aria-label': 'Delete this thing',
    onCancel: jest.fn(),
    onConfirm: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/* INJECTION STARTS HERE */

test('Delete, No, then Yes', async done => {
  const Component = ChatMessageDeleteButton;

  const props = {
    ...commonProps,
    'aria-label': 'Delete this thing',
    onCancel: jest.fn(),
    onConfirm: jest.fn()
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  await render(<ConnectedRoutedComponent {...props} />);
  expect(serialize()).toMatchSnapshot();

  const deletables = screen.queryAllByLabelText('Delete this thing');

  expect(deletables.length).toBe(1);
  const deletable = deletables[0];

  userEvent.click(deletable);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /No/i }));
  await waitForPopper();
  await waitFor(() => expect(props.onCancel).toHaveBeenCalled());
  expect(serialize()).toMatchSnapshot();

  userEvent.click(deletable);
  await waitForPopper();
  expect(serialize()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Yes/i }));
  await waitForPopper();
  await waitFor(() => expect(props.onConfirm).toHaveBeenCalled());
  expect(serialize()).toMatchSnapshot();

  done();
});
