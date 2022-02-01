import { activeRequests, newRequest, requestCompleted, setActiveRequests, useProgressBarMode } from '../src/useProgressBarMode';
import { act, renderHook } from '@testing-library/react-hooks';

jest.useFakeTimers();

describe('Hook: useProgressBarMode', () => {
  it('should trigger all modes when the request takes long enough to complete', async () => {
    expect.assertions(11);

    const { result, rerender } = renderHook(() => useProgressBarMode());

    expect(result.current.mode).toBe('hibernate');

    newRequest();
    rerender();

    expect(result.current.mode).toBe('init');

    act(() => {
      jest.advanceTimersByTime(99);
    });

    expect(result.current.mode).toBe('init');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current.mode).toBe('active');

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.mode).toBe('active');

    requestCompleted();
    rerender();

    expect(result.current.mode).toBe('active');

    act(() => {
      jest.advanceTimersByTime(199);
    });

    expect(result.current.mode).toBe('active');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current.mode).toBe('complete');

    act(() => {
      jest.advanceTimersByTime(999);
    });

    expect(result.current.mode).toBe('complete');

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current.mode).toBe('hibernate');

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.mode).toBe('hibernate');
  });

  it('should move back to "hibernate" when the request completes within 100 milliseconds', () => {
    expect.assertions(4);

    const { result, rerender } = renderHook(() => useProgressBarMode());

    newRequest();
    rerender();

    expect(result.current.mode).toBe('init');

    act(() => {
      jest.advanceTimersByTime(50);
    });

    expect(result.current.mode).toBe('init');

    requestCompleted();
    rerender();

    expect(result.current.mode).toBe('hibernate');

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.mode).toBe('hibernate');
  });

  it('should not change mode when multiple requests are triggered while mode is active', () => {
    expect.assertions(4);

    const { result, rerender } = renderHook(() => useProgressBarMode());

    newRequest();
    rerender();

    expect(result.current.mode).toBe('init');

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.mode).toBe('active');

    newRequest();
    rerender();

    expect(result.current.mode).toBe('active');

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.mode).toBe('active');
  });

  it('should not change mode when multiple requests are triggered within 100 milliseconds', () => {
    expect.assertions(3);

    const { result, rerender } = renderHook(() => useProgressBarMode());

    newRequest();
    rerender();

    expect(result.current.mode).toBe('init');

    act(() => {
      jest.advanceTimersByTime(50);
    });

    expect(result.current.mode).toBe('init');

    newRequest();
    rerender();

    expect(result.current.mode).toBe('init');
  });
});

test('newRequest', () => {
  setActiveRequests(0);
  expect(activeRequests).toBe(0);
  newRequest();
  expect(activeRequests).toBe(1);
});

describe('requestCompleted', () => {
  it('should decrease activeRequests when activeRequests above 0', () => {
    setActiveRequests(1);
    expect(activeRequests).toBe(1);
    requestCompleted();
    expect(activeRequests).toBe(0);
  });

  it('should not decrease activeRequests when activeRequests 0', () => {
    setActiveRequests(0);
    expect(activeRequests).toBe(0);
    requestCompleted();
    expect(activeRequests).toBe(0);
  });
});
