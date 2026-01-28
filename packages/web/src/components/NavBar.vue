<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '../stores/user'
import authApi from '@/api/auth'
import { useI18n } from 'vue-i18n'
import fallbackProfileImage from '@/assets/Images/profilePlaceHolder.svg'

const { t } = useI18n()

const userStore = useUserStore()

const user = ref(userStore.user)
const image = ref('src/assets/Images/profilePlaceHolder.svg')

async function logout() {
  try {
    await authApi.logout()
    userStore.clearUser()
  } catch {
    return;
  }
}

watch(
  () => userStore.user,
  (newUser) => {
    user.value = newUser
    image.value = newUser?.image
  },
  { immediate: true },
)
</script>

<template>
  <nav :class="{ expanded: isExpanded }">
    <div class="image">
      <RouterLink to="/"><img src="../assets/images/CreatifyLog.svg" alt="" /></RouterLink>
    </div>
    <div class="controls">
      <ul class="nav-links" :class="{long:user?.role === 'admin' || user?.role === 'super_admin'}">
        <li class="nav-link">
          <RouterLink to="/" @click="isExpanded = false">{{ t('navbar.home') }}</RouterLink>
        </li>
        <li class="nav-link">
          <RouterLink to="/About" @click="isExpanded = false">{{ t('navbar.about') }}</RouterLink>
        </li>
        <li class="nav-link">
          <RouterLink to="/Test" @click="isExpanded = false">{{ t('navbar.test') }}</RouterLink>
        </li>
        <li class="nav-link" v-if="user?.role === 'admin' || user?.role === 'super_admin'">
          <RouterLink to="/AdminPanel" @click="isExpanded = false">{{
            t('navbar.adminPanel')
          }}</RouterLink>
        </li>
      </ul>
      <div class="expand-button" @click="((isExpanded = !isExpanded), (isProfileOpen = false))">
        <i class="fa-solid fa-bars"></i>
      </div>
      <img
        class="profile-image"
        @click="((isProfileOpen = !isProfileOpen), (isExpanded = false))"
        :src="image ? image : fallbackProfileImage"
        alt=""
      />
      <div class="profile-dropdown" :class="{ open: isProfileOpen }">
        <div class="profile-dropdown-item">
          <RouterLink to="/settings" @click="isProfileOpen = false">{{
            t('navbar.settings')
          }}</RouterLink>
        </div>
        <div class="profile-dropdown-item">
          <RouterLink to="/result" @click="isProfileOpen = false">{{
            t('navbar.result')
          }}</RouterLink>
        </div>
        <div class="profile-dropdown-item">
          <RouterLink to="/" v-if="user" class="without-hightlight" @click="((isProfileOpen = false), logout())">{{
            t('navbar.logout')
          }}</RouterLink>
          <RouterLink to="/signup" @click="isProfileOpen = false" v-else>{{
            t('navbar.signup')
          }}</RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isExpanded: false,
      isProfileOpen: false,
    }
  },
}
</script>

<style scoped>
nav {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--main-color);
  padding: 0 60px;
  box-sizing: border-box;
  position: relative;
  z-index: 999;
  box-shadow: 0 0 4px 0 var(--text-color);
}

.controls {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 70%;
  justify-content: flex-end;
}

.nav-links {
  list-style: none;
  display: flex;
  align-items: center;
  direction: var(--direction);
}

.controls a {
  padding: 10px;
  color: var(--background-color);
  font-size: 22px;
  font-family: 'Montserrat Alternates';
  text-decoration: none;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.image img {
  max-width: 100%;
  width: 40px;
  background-color: var(--background-color);
  border-radius: 50%;
  visibility: visible;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-left: 25px;
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0 0 0 10px;
  background-color: var(--main-color);
  z-index: 999;
  transition: all 0.1s 0s linear;
  height: 0;
  overflow: hidden;
  box-shadow: 0px 2px 3px 0 var(--text-color);
}

.profile-dropdown.open {
  padding: 10px 0;
  height: 110px;
}

.profile-dropdown-item a {
  font-size: 16px;
}

.router-link-active:not(.without-hightlight),
.router-link-exact-active:not(.without-hightlight) {
  color: var(--controls-color) !important;
}

.expand-button {
  display: none;
  color: var(--background-color);
  font-size: 32px;
}
nav .controls .expand i {
  transition: transform 0.3s 0s linear;
}

nav .controls .profile-link {
  display: none;
}

@media (max-width: 767px) {
  nav {
    padding: 0 20px;
  }

  nav .controls {
    padding: 0 20px;
  }

  nav .controls .nav-links {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    box-sizing: content-box;
    font-size: 32px;
    position: absolute;
    right: 0;
    top: 100%;
    transition: all 0.3s 0s linear;
    height: 0;
    width: 160px;
    margin: 0;
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    background-color: var(--main-color);
    border-radius: 0 0 0 5px;
    box-shadow: 0px 2px 3px 0 var(--text-color);
  }

  nav .nav-links .nav-link {
    padding: 0;
  }

  nav .nav-links .nav-link a {
    width: 100%;
    text-align: center;
    font-size: 18px;
  }

  /* Expand nav links container */
  nav.expanded .controls .nav-links {
    height: 150px;
  }

  nav.expanded .controls .nav-links.long {
    height: 200px;
  }

  .expand-button {
    display: flex;
  }

  nav .expand-button i {
    transition: all 0.2s linear;
  }

  nav.expanded .expand-button i {
    transform: rotateZ(90deg);
  }
}
</style>
