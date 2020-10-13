import {
  fetchImplementation,
  mounter,
  reduxer,
  snapshot,
  state,
} from '../bootstrap';
import {
  unmountComponentAtNode
} from 'react-dom';
import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/react';
import DataTableMenu from '../../components/Cohorts/DataTableMenu.jsx';

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const sharedProps = {
  history: {
    push() {},
  },
};

test('DataTableMenu', () => {
  expect(DataTableMenu).toBeDefined();
});

test('Snapshot 1', () => {
  const props = {
    ...sharedProps,
  };
  const mounted = mounter(reduxer(DataTableMenu, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/
