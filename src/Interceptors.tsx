import React, { useEffect } from 'react';
import axios from 'axios';

const Interceptor = () => {
  useEffect(() => {
    axios.interceptors.request.use(
        config => {    
          // eslint-disable-next-line no-param-reassign
          config.headers.Accept = '*/*';
          // eslint-disable-next-line no-param-reassign
          config.headers['Content-Type'] = 'application/json; charset=utf-8'
          return config;
        },
        error => {
          return Promise.reject(error)
      });
  }, []);

  useEffect(() => {
    axios.interceptors.response.use((response) => {
      return response.data;
    }, function (error) {
      return Promise.reject(error);
    });
  }, []);
  return (
    <div />
  );
};

export default Interceptor;
