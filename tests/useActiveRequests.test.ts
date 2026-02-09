import { renderHook } from '@testing-library/react';
import { useActiveRequests } from '../src/useActiveRequests';
import axios from 'axios';
import type { Mock } from 'vitest';

const { useStateMock } = vi.hoisted(() => ({
  useStateMock: vi.fn()
}));

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return { ...actual, useState: useStateMock };
});

vi.mock('axios', () => ({
  default: {
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() }
    }
  }
}));

describe('Hook: useActiveRequests', () => {
  beforeEach(() => {
    (axios.interceptors.request.use as Mock).mockClear();
    (axios.interceptors.response.use as Mock).mockClear();
  });

  function setup({ activeRequests }: { activeRequests: number }) {
    const setActiveRequestsSpy = vi.fn();
    useStateMock.mockReturnValue([activeRequests, setActiveRequestsSpy]);

    renderHook(() => useActiveRequests(axios));

    const mockRequest = (axios.interceptors.request.use as Mock).mock
      .calls[0][0];
    const mockResponseFulfilled = (axios.interceptors.response.use as Mock).mock
      .calls[0][0];
    const mockResponseRejected = (axios.interceptors.response.use as Mock).mock
      .calls[0][1];

    return {
      mockRequest,
      mockResponseFulfilled,
      mockResponseRejected,
      setActiveRequestsSpy
    };
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

    const { setActiveRequestsSpy, mockResponseFulfilled } = setup({
      activeRequests: 1
    });

    mockResponseFulfilled({
      status: 200,
      statusText: 'Ok',
      data: 'some random response',
      config: {
        url: '/hello-world'
      },
      headers: {}
    });

    expect(setActiveRequestsSpy).toBeCalledTimes(1);
    expect(setActiveRequestsSpy).toBeCalledWith(0);
  });

  it('should decrease on failure', async () => {
    expect.assertions(3);

    const { setActiveRequestsSpy, mockResponseRejected } = setup({
      activeRequests: 1
    });

    await mockResponseRejected('some random error').catch((e: string) =>
      expect(e).toBe('some random error')
    );

    expect(setActiveRequestsSpy).toBeCalledTimes(1);
    expect(setActiveRequestsSpy).toBeCalledWith(0);
  });

  it('should not accidentally decrease below 0', async () => {
    expect.assertions(2);

    const { setActiveRequestsSpy, mockResponseFulfilled } = setup({
      activeRequests: 0
    });

    await mockResponseFulfilled('some random error');

    expect(setActiveRequestsSpy).toBeCalledTimes(1);
    expect(setActiveRequestsSpy).toBeCalledWith(0);
  });
});
