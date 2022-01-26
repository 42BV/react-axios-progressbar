import { useProgressBarMode } from '../src/useProgressBarMode';
import { act, renderHook } from '@testing-library/react-hooks';

jest.useFakeTimers();

describe('Hook: useProgressBarMode', () => {
  it('should trigger all modes when the request takes long enough to complete', () => {
    expect.assertions(11);

    const { result } = renderHook(() => useProgressBarMode());

    expect(result.current.mode).toBe('hibernate');

    act(() => {
      result.current.newRequest();
    });

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

    act(() => {
      result.current.requestCompleted();
    });

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

    const { result } = renderHook(() => useProgressBarMode());

    act(() => {
      result.current.newRequest();
    });

    expect(result.current.mode).toBe('init');

    act(() => {
      jest.advanceTimersByTime(50);
    });

    expect(result.current.mode).toBe('init');

    act(() => {
      result.current.requestCompleted();
    });

    expect(result.current.mode).toBe('hibernate');

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.mode).toBe('hibernate');
  });

  it('should not change mode when multiple requests are triggered while mode is active', () => {
    expect.assertions(4);

    const { result } = renderHook(() => useProgressBarMode());

    act(() => {
      result.current.newRequest();
    });

    expect(result.current.mode).toBe('init');

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.mode).toBe('active');

    act(() => {
      result.current.newRequest();
    });

    expect(result.current.mode).toBe('active');

    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.mode).toBe('active');
  });

  it('should not change mode when multiple requests are triggered within 100 milliseconds', () => {
    expect.assertions(3);

    const { result } = renderHook(() => useProgressBarMode());

    act(() => {
      result.current.newRequest();
    });

    expect(result.current.mode).toBe('init');

    act(() => {
      jest.advanceTimersByTime(50);
    });

    expect(result.current.mode).toBe('init');

    act(() => {
      result.current.newRequest();
    });

    expect(result.current.mode).toBe('init');
  });
});
