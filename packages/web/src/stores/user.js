// stores/user.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import authApi from '@/api/auth';
import isLoggedIn from '@/helperMethods/checkLoginState';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  function clearUser() {
    this.user = null;
  }

  async function fetchUser() {
    isLoading.value = true;

    if (isLoggedIn()) {
      try {
        const response = await authApi.getUser();
        user.value = response?.data?.user;
      } catch {
        user.value = null;
      }
    }
  }

  return { user, isLoading, error, fetchUser, clearUser };
});
