import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.api.creatifymeweb.com/api/v1',
  withCredentials: true,
  timeout: 100000
});

export default api;
