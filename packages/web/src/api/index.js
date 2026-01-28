import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.api.creatifymeweb.com/api/v1',
  withCredentials: true,
  timeout: 100000,
});

api.interceptors.request.use(
  (config) => {
    // This code runs before every request is sent
    const lang = localStorage.getItem('userLanguage') || 'en';

    // Update the header dynamically
    config.headers['Accept-Language'] = lang;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
