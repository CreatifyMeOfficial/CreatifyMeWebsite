import api from './index';
import apiCallWrapper from './apiCallWrapper';

export default {
  async getComments({ page = 1, limit = 10, sort = '-createdAt' }) {
    return await apiCallWrapper(() => api.get('/comments', { params: { page, limit, sort } }));
  },
  async getMyComments({ page = 1, limit = 10, sort = '-createdAt' }) {
    return await apiCallWrapper(() => api.get('/user/comments', { params: { page, limit, sort } }));
  },
  async createComment({ comment }) {
    return await apiCallWrapper(() => api.post('/user/comments', { comment }));
  },
  async deleteComment({ commentId = 0 }) {
    return await apiCallWrapper(() => api.delete(`/user/comments/${commentId}`));
  },
  async updateComment({ commentId = 0, comment }) {
    return await apiCallWrapper(() => api.patch(`/user/comments/${commentId}`, { comment }));
  }
};
