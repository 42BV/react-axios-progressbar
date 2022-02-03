import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import toJson from 'enzyme-to-json';
import { ProgressBar } from '../src/index';

import * as ProgressBarMode from '../src/useProgressBarMode';
import { Mode } from '../src/useProgressBarMode';

Enzyme.configure({ adapter: new Adapter() });

describe('Component: ProgressBar', () => {
  function setup({ mode, style }: { mode: Mode; style?: Record<string, unknown> }) {
    jest.spyOn(ProgressBarMode, 'useProgressBarMode').mockReturnValue({
      mode
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
        style: { backgroundColor: 'red', height: '10px', left: '10px' }
      });

      expect(toJson(progressBar)).toMatchSnapshot();
    });
  });
});
