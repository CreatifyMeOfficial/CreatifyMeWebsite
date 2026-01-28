import api from ".";
import apiCallWrapper from './apiCallWrapper';

export default {
  async getUsers({page = 1, limit = 4 , userName}) {
    return await apiCallWrapper(() => api.get('/users', { params: {page, limit , userName} }));
  },
  async updateUserRole({ userId, role }) {
    return await apiCallWrapper(() => api.patch(`/users/change-role/${userId}`, { role }));
  }
};
