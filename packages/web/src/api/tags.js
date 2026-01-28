import api from ".";
import apiCallWrapper from './apiCallWrapper';

export default {
  async getTags() {
    return await apiCallWrapper(() => api.get('/tags'));
  },
  async createTag({ tag }) {
    return await apiCallWrapper(() => api.post('/tags', { tag }));
  },
  async deleteTag({ tagId = 0 }) {
    return await apiCallWrapper(() => api.delete(`/tags/${tagId}`));
  }
};
