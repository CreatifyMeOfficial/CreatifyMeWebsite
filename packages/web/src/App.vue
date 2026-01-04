<script setup>
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import { onMounted } from 'vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()

onMounted(() => {
  userStore.fetchUser()
})
</script>

<template>
  <div class="main-container">
    <NavBar></NavBar>
    <div class="page-content">
      <div class="notifications">
        <div class="notification-container" id="notificationContainer"></div>
      </div>
      <router-view></router-view>
    </div>
    <Footer></Footer>
  </div>
</template>

<style scoped>
.main-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* This prevents flex items from overflowing */
  direction: var(--direction);
}

.notifications {
  width: 100%;
  z-index: 997;
  position: sticky;
  top: 0px;
  display: flex;
  justify-content: flex-end;
}

.notification-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: start;
  row-gap: 10px;
  max-height: 165px;
  padding: 10px 0 10px 0;
  overflow-y: hidden;
}

@media (max-width: 767px){
  .notification-container{
    max-height: 180px;
  }
}
</style>
