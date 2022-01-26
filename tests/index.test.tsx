import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import toJson from 'enzyme-to-json';

Enzyme.configure({ adapter: new Adapter() });

import {
  ProgressBar,
  onNewRequest,
  onRequestRejected,
  onRequestFulfilled,
} from '../src/index';

import * as ProgressBarMode from '../src/useProgressBarMode';
import { Mode } from '../src/useProgressBarMode';

describe('Component: ProgressBar', () => {
  function setup({ mode, style }: { mode: Mode; style?: Record<string, unknown> }) {
    jest.spyOn(ProgressBarMode, 'useProgressBarMode').mockReturnValue({
      mode,
      newRequest: jest.fn(),
      requestCompleted: jest.fn()
    });

    const progressBar = shallow(<ProgressBar style={style} />);

    return { progressBar };
  }

  describe('ui', () => {
    test('mode: hibernate', () => {
      const { progressBar } = setup({ mode: 'hibernate', style: undefined });

      expect(toJson(progressBar)).toBe('');
    });

    test('mode: init', () => {
      const { progressBar } = setup({ mode: 'init', style: undefined });

      expect(toJson(progressBar)).toMatchSnapshot();
    });

    test('mode: active', () => {
      const { progressBar } = setup({ mode: 'active', style: undefined });

      expect(toJson(progressBar)).toMatchSnapshot();
    });

    test('mode: complete', () => {
      const { progressBar } = setup({ mode: 'complete', style: undefined });

      expect(toJson(progressBar)).toMatchSnapshot();
    });

    test('custom style', () => {
      const { progressBar } = setup({
        mode: 'active',
        style: { backgroundColor: 'red', height: '10px', left: '10px' },
      });

      expect(toJson(progressBar)).toMatchSnapshot();
    });
  });
});

describe('Axios interceptors', () => {
  function setup() {
    const newRequestSpy = jest.fn();
    const requestCompletedSpy = jest.fn();

    jest.spyOn(ProgressBarMode, 'useProgressBarMode').mockReturnValue({
      mode: 'hibernate',
      newRequest: newRequestSpy,
      requestCompleted: requestCompletedSpy
    });

    return { newRequestSpy, requestCompletedSpy };
  }

  it('should call "newRequest" when making a request', () => {
    const { newRequestSpy } = setup();

    onNewRequest({ url: '/hello-world' });

    expect(newRequestSpy).toBeCalledTimes(1);
  });

  it('should call "requestCompleted" on success', () => {
    const { requestCompletedSpy } = setup();

    onRequestFulfilled({
      status: 200,
      statusText: 'Ok',
      data: 'some random response',
      config: {
        url: '/hello-world',
      },
      headers: {},
    });

    expect(requestCompletedSpy).toBeCalledTimes(1);
  });

  it('should call "requestCompleted" on failure', async () => {
    expect.assertions(2);

    const { requestCompletedSpy } = setup();

    await onRequestRejected('some random error').catch(e => expect(e).toEqual('some random error'));

    expect(requestCompletedSpy).toBeCalledTimes(1);
  });
});
