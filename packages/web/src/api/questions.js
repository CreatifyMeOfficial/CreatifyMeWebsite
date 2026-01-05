import api from ".";
import apiCallWrapper from './apiCallWrapper';

export default {
  async getQuestions() {
    return await apiCallWrapper(() => api.get('/questions'));
  },
  async deleteQuestion({ questionId = 0 }) {
    return await apiCallWrapper(() => api.delete(`/questions/${questionId}`));
  },
  async calculateResults({ answers = [] }) {
    return await apiCallWrapper(() => api.post('/questions/calculate', { answers }));
  },
  async createQuestion({ questionAr, questionEn, MBTIAttribute, HollandAttribute }) {
    return await apiCallWrapper(() => api.post('/questions', { questionAr, questionEn, MBTIAttribute, HollandAttribute }));
  },
  async getResult() {
    return await apiCallWrapper(() => api.get('/questions/user-result'));
  },
};
