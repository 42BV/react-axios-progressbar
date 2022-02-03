import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useActiveRequests } from '../src/useActiveRequests';
import axios from 'axios';

jest.mock('axios');

describe('Hook: useActiveRequests', () => {
  beforeEach(() => {
    (axios.interceptors.response.use as jest.Mock).mockReset();
  });

  function setup({ activeRequests }: { activeRequests: number }) {
    const setActiveRequestsSpy = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValue([ activeRequests, setActiveRequestsSpy ]);

    renderHook(() => useActiveRequests());

    const interceptors = (axios.interceptors.request.use as jest.Mock).mock;
    const mockRequest = interceptors.calls[0][0];
    const mockResponseFulfilled = interceptors.calls[1][0];
    const mockResponseRejected = interceptors.calls[1][1];

    return { mockRequest, mockResponseFulfilled, mockResponseRejected, setActiveRequestsSpy };
  }

  it('should increase when starting a request', () => {
    expect.assertions(2);

    const { setActiveRequestsSpy, mockRequest } = setup({ activeRequests: 0 });

    mockRequest({ url: '/hello-world' });

    expect(setActiveRequestsSpy).toBeCalledTimes(1);
    expect(setActiveRequestsSpy).toBeCalledWith(1);
  });

  it('should decrease on success', () => {
    expect.assertions(2);

    const { setActiveRequestsSpy, mockResponseFulfilled } = setup({ activeRequests: 1 });

    mockResponseFulfilled({
      status: 200,
      statusText: 'Ok',
      data: 'some random response',
      config: {
        url: '/hello-world',
      },
      headers: {},
    });

    expect(setActiveRequestsSpy).toBeCalledTimes(1);
    expect(setActiveRequestsSpy).toBeCalledWith(0);
  });

  it('should decrease on failure', async () => {
    expect.assertions(3);

    const { setActiveRequestsSpy, mockResponseRejected } = setup({ activeRequests: 1 });

    await mockResponseRejected('some random error').catch((e: string) => expect(e).toBe('some random error'));

    expect(setActiveRequestsSpy).toBeCalledTimes(1);
    expect(setActiveRequestsSpy).toBeCalledWith(0);
  });

  it('should not accidentally decrease below 0', async () => {
    expect.assertions(2);

    const { setActiveRequestsSpy, mockResponseFulfilled } = setup({ activeRequests: 0 });

    await mockResponseFulfilled('some random error');

    expect(setActiveRequestsSpy).toBeCalledTimes(1);
    expect(setActiveRequestsSpy).toBeCalledWith(0);
  });
});
