import api from ".";
import apiCallWrapper from "./apiCallWrapper";

export default {
  async createOrder() {
    return await apiCallWrapper(() => api.post('/payment/pay'));
  }
};
