import api from ".";
import apiCallWrapper from './apiCallWrapper';

export default {
  async getPersonalities({ language = "en", page = 1, limit = 10 }) {
    return await apiCallWrapper(() => api.get('/personalities', { params: { page, limit, language } }));
  },
  async addTagToPersonality({ personalityId = 0, tagId = 0 }) {
    return await apiCallWrapper(() => api.patch(`/personalities/add-tag/${personalityId}`, { tagId }));
  },
  async removeTagToPersonality({ personalityId = 0, tagId = 0 }) {
    return await apiCallWrapper(() => api.patch(`/personalities/remove-tag/${personalityId}`, { tagId }));
  }
};
