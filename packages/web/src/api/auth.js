import api from './index';
import apiCallWrapper from './apiCallWrapper';

export default {
  async login({ emailOrUsername, password }) {
    return await apiCallWrapper(() => api.post('/user/login', { emailOrUsername, password }));
  },
  async register({ userName, firstName, lastName, phone, countryKey, email, password, confirmPassword, birthDate }) {
    return await apiCallWrapper(() => api.post('/user/signup', { userName, firstName, lastName, phone, countryKey, email, password, confirmPassword, birthDate }));
  },
  async logout() {
    return await apiCallWrapper(() => api.post('/user/logout'));
  },
  async getUser() {
    return await apiCallWrapper(() => api.get('/user/get-user'));
  },
  async updatePassword({ oldPassword, newPassword, confirmPassword }) {
    return await apiCallWrapper(() => api.patch('/user/change-password', { oldPassword, newPassword, confirmPassword }));
  },
  async updateUser({ userName, firstName, lastName, phone, countryKey, birthDate }) {
    return await apiCallWrapper(() => api.patch('/user/update-user', { userName, firstName, lastName, phone, countryKey, birthDate }));
  },
  async updateImage(imageData) {
    return await apiCallWrapper(() => api.post('/user/upload-image', imageData));
  },
  async deleteMyAccount() {
    return await apiCallWrapper(() => api.delete('/user/delete-user'));
  }
};
