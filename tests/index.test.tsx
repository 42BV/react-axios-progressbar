import React from 'react';
import { ProgressBar } from '../src/index';

import * as ProgressBarMode from '../src/useProgressBarMode';
import { Mode } from '../src/useProgressBarMode';
import { render } from '@testing-library/react';
import axios from 'axios';

describe('Component: ProgressBar', () => {
  function setup({
    mode,
    style
  }: {
    mode: Mode;
    style?: Record<string, unknown>;
  }) {
    vi.spyOn(ProgressBarMode, 'useProgressBarMode').mockReturnValue({
      mode
    });

    const { container } = render(
      <ProgressBar style={style} axiosInstance={axios} />
    );

    return { container };
  }

  describe('ui', () => {
    test('mode: hibernate', () => {
      const { container } = setup({ mode: 'hibernate', style: undefined });
      expect(container.firstChild).toBeNull();
    });

    test('mode: init', () => {
      const { container } = setup({ mode: 'init', style: undefined });
      expect(container).toMatchSnapshot();
      expect(container.firstChild).toHaveStyle({
        width: '0%',
        transition: 'width 30s ease-in'
      });
    });

    test('mode: active', () => {
      const { container } = setup({ mode: 'active', style: undefined });
      expect(container.firstChild).toHaveStyle({
        width: '80%',
        transition: 'width 30s ease-in'
      });
    });

    test('mode: complete', () => {
      const { container } = setup({ mode: 'complete', style: undefined });
      expect(container.firstChild).toHaveStyle({
        width: '100%',
        transition: 'width 0.8s ease-in'
      });
    });

    test('custom style', () => {
      const { container } = setup({
        mode: 'active',
        style: { backgroundColor: 'red', height: '10px', left: '10px' }
      });
      const el = container.firstChild as HTMLElement;
      expect(el.style.backgroundColor).toBe('red');
      expect(container.firstChild).toHaveStyle({
        height: '10px',
        left: '10px'
      });
    });
  });
});
