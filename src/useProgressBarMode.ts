
/*
  The modes form a state machine with the following flow

  init -----> active -> complete --
  ^  \                            |
  |   \----\                      |
  |         \                     |
  |          \                    |
  |           ▾                   |
  ---------  hibernate <-----------

  hibernate: no animation is running the bar is invisible
  init: Preparing to potentially show the animation.
  active: the animation is running slowly to 80%
  complete: the animation runs quickly to 100%
*/
import { useEffect, useState } from 'react';

export type Mode = 'hibernate' | 'init' | 'active' | 'complete';

export let activeRequests = 0;

export function useProgressBarMode() {
  const [ mode, setMode ] = useState<Mode>('hibernate');

  useEffect(() => {
    if (mode === 'complete') {
      // Moving to hibernate after 1 second to allow the close animation to complete
      const timeout = setTimeout(() => {
        setMode('hibernate');
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }

    if (mode === 'active' && activeRequests === 0) {
      // No pending requests anymore, move to complete if there are still no pending requests after 200 milliseconds
      const timeout = setTimeout(() => {
        setMode('complete');
      }, 200);

      return () => {
        clearTimeout(timeout);
      };
    }

    if (mode === 'init') {
      if (activeRequests > 0) {
        // There are pending requests, move to active if there are still pending requests after 100 milliseconds
        const timeout = setTimeout(() => {
          setMode('active');
        }, 100);

        return () => {
          clearTimeout(timeout);
        };
      } else {
        // No pending requests anymore, move to hibernate
        setMode('hibernate');
      }
    }

    if (activeRequests > 0 && mode === 'hibernate') {
      setMode('init');
    }
  }, [ activeRequests, mode, setMode ]);

  return { mode };
}

export function newRequest() {
  activeRequests++;
}

export function requestCompleted() {
  if (activeRequests > 0) {
    activeRequests--;
  }
}

/**
 * Sets the number of activeRequests manually.
 *
 * This method exists for testing purposes, so you should not
 * use it.
 *
 * @export
 * @param {number} value
 */
export function setActiveRequests(value: number) {
  activeRequests = value;
}
