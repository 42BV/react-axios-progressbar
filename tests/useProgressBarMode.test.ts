import { Mode, useProgressBarMode } from '../src/useProgressBarMode';
import * as ActiveRequests from '../src/useActiveRequests';
import { act, renderHook } from '@testing-library/react';
import axios from 'axios';

const { useStateMock, useEffectMock } = vi.hoisted(() => ({
  useStateMock: vi.fn(),
  useEffectMock: vi.fn()
}));

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return { ...actual, useState: useStateMock, useEffect: useEffectMock };
});

vi.useFakeTimers();

describe('Hook: useProgressBarMode', () => {
  function setup({
    mode,
    activeRequests
  }: {
    mode: Mode;
    activeRequests: number;
  }) {
    const setModeSpy = vi.fn();
    useStateMock.mockReturnValue([mode, setModeSpy]);
    vi.spyOn(ActiveRequests, 'useActiveRequests').mockReturnValue(
      activeRequests
    );
    useEffectMock.mockImplementation((f: () => void) => f());

    renderHook(() => useProgressBarMode(axios));

    return { setModeSpy };
  }

  it('should set mode to init when mode is hibernate and a new request is started', () => {
    expect.assertions(2);

    const { setModeSpy } = setup({ mode: 'hibernate', activeRequests: 1 });

    expect(setModeSpy).toBeCalledTimes(1);
    expect(setModeSpy).toBeCalledWith('init');
  });

  it('should set mode to hibernate when mode is init and activeRequests becomes 0', () => {
    expect.assertions(2);

    const { setModeSpy } = setup({ mode: 'init', activeRequests: 0 });

    expect(setModeSpy).toBeCalledTimes(1);
    expect(setModeSpy).toBeCalledWith('hibernate');
  });

  it('should set mode to active when mode is init and there are still active requests after 100 milliseconds', () => {
    expect.assertions(3);

    const { setModeSpy } = setup({ mode: 'init', activeRequests: 1 });

    act(() => {
      vi.advanceTimersByTime(99);
    });

    expect(setModeSpy).toBeCalledTimes(0);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(setModeSpy).toBeCalledTimes(1);
    expect(setModeSpy).toBeCalledWith('active');
  });

  it('should not set mode to active when mode is init and request completed within 100 milliseconds', () => {
    expect.assertions(2);

    type Destructor = () => void;
    let clearEffect: void | Destructor;
    useEffectMock.mockImplementationOnce(
      (f: () => void | Destructor) => (clearEffect = f())
    );

    const { setModeSpy } = setup({ mode: 'init', activeRequests: 1 });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(setModeSpy).toBeCalledTimes(0);

    // @ts-expect-error Test mock
    clearEffect();

    act(() => {
      vi.runAllTimers();
    });

    expect(setModeSpy).toBeCalledTimes(0);
  });

  it('should set mode to complete when mode is active and there are no active requests after 200 milliseconds', () => {
    expect.assertions(3);

    const { setModeSpy } = setup({ mode: 'active', activeRequests: 0 });

    act(() => {
      vi.advanceTimersByTime(199);
    });

    expect(setModeSpy).toBeCalledTimes(0);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(setModeSpy).toBeCalledTimes(1);
    expect(setModeSpy).toBeCalledWith('complete');
  });

  it('should not set mode to complete when mode is active and a new request is started within 200 milliseconds', () => {
    expect.assertions(2);

    type Destructor = () => void;
    let clearEffect: void | Destructor;
    useEffectMock.mockImplementationOnce(
      (f: () => void | Destructor) => (clearEffect = f())
    );

    const { setModeSpy } = setup({ mode: 'active', activeRequests: 0 });

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(setModeSpy).toBeCalledTimes(0);

    // @ts-expect-error Test mock
    clearEffect();

    act(() => {
      vi.runAllTimers();
    });

    expect(setModeSpy).toBeCalledTimes(0);
  });

  it('should set mode to hibernate after 1000 milliseconds when mode is complete', () => {
    expect.assertions(3);

    const { setModeSpy } = setup({ mode: 'complete', activeRequests: 0 });

    act(() => {
      vi.advanceTimersByTime(999);
    });

    expect(setModeSpy).toBeCalledTimes(0);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(setModeSpy).toBeCalledTimes(1);
    expect(setModeSpy).toBeCalledWith('hibernate');
  });

  it('should not set mode to hibernate when mode is complete and a new request is started within 1000 milliseconds', () => {
    expect.assertions(2);

    type Destructor = () => void;
    let clearEffect: void | Destructor;
    useEffectMock.mockImplementationOnce(
      (f: () => void | Destructor) => (clearEffect = f())
    );

    const { setModeSpy } = setup({ mode: 'complete', activeRequests: 0 });

    act(() => {
      vi.advanceTimersByTime(950);
    });

    expect(setModeSpy).toBeCalledTimes(0);

    // @ts-expect-error Test mock
    clearEffect();

    act(() => {
      vi.runAllTimers();
    });

    expect(setModeSpy).toBeCalledTimes(0);
  });
});
