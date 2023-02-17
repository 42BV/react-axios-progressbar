import { useEffect, useState } from 'react';
import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export function useActiveRequests(axiosInstance: AxiosInstance) {
  const [ activeRequests, setActiveRequests ] = useState(0);

  function onNewRequest(config: InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>) {
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
    const requestInterceptor = axiosInstance.interceptors.request.use(onNewRequest);
    const responseInterceptor = axiosInstance.interceptors.response.use(onRequestFulfilled, onRequestRejected);

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    }
  }, [axiosInstance]);

  return activeRequests;
}
