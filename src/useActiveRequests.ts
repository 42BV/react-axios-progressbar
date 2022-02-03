import { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export function useActiveRequests() {
  const [ activeRequests, setActiveRequests ] = useState(0);

  function onNewRequest(config: AxiosRequestConfig) {
    setActiveRequests(activeRequests + 1);
    return config;
  }

  function decreaseActiveRequests() {
    setActiveRequests(Math.max(activeRequests - 1, 0));
  }

  function onRequestFulfilled(response: AxiosResponse) {
    decreaseActiveRequests();
    return response;
  }

  function onRequestRejected(error: unknown) {
    decreaseActiveRequests();
    return Promise.reject(error);
  }

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(onNewRequest);
    const responseInterceptor = axios.interceptors.response.use(onRequestFulfilled, onRequestRejected);

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    }
  });

  return activeRequests;
}
