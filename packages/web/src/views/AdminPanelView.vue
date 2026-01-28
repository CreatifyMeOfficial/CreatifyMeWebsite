<script setup>
import SideBar from '@/components/sideBar.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const { t } = useI18n()
const router = useRouter()
const selectedTab = ref(1)
const user = computed(() => userStore.user)

onMounted(() => {
  const route = router.currentRoute.value.path
  if (route === '/AdminPanel') {
    selectedTab.value = 0
  } else if (route === '/AdminPanel/questions') {
    selectedTab.value = 1
  } else if (route === '/AdminPanel/createQuestion') {
    selectedTab.value = 2
  } else if (route === '/AdminPanel/tags') {
    selectedTab.value = 3
  } else if (route === '/AdminPanel/personalities') {
    selectedTab.value = 4
  }
})

function tabChanged(payload) {
  if (payload.selectedItem === 0) {
    router.push('/AdminPanel')
  } else if (payload.selectedItem === 1) {
    router.push('/AdminPanel/questions')
  } else if (payload.selectedItem === 2) {
    router.push('/AdminPanel/createQuestion')
  } else if (payload.selectedItem === 3) {
    router.push('/AdminPanel/tags')
  } else if (payload.selectedItem === 4) {
    router.push('/AdminPanel/personalities')
  }
}
</script>

<template>
  <div class="admin-panel">
    <div v-if="user?.role === 'admin' || user?.role === 'super_admin'" class="admin-panel">
      <SideBar
        @itemChanged="tabChanged"
        :tabs="[
          t('adminPanel.sidebar.users'),
          t('adminPanel.sidebar.questions'),
          t('adminPanel.sidebar.addQuestion'),
          t('adminPanel.tagsTitle'),
          t('adminPanel.sidebar.personality'),
        ]"
        :openedTab="selectedTab"
      ></SideBar>
      <router-view />
    </div>
    <div v-else-if="user?.role === 'user'" class="no-access">
      <p class="title">{{ t('adminPanel.noAccess.title') }}</p>
      <p class="description">{{ t('adminPanel.noAccess.description') }}</p>
    </div>
  </div>
</template>

<style scoped>
.admin-panel {
  display: flex;
  flex: 1;
  min-height: 0; /* Prevents flex items from overflowing */
  width: 100%;
}

.no-access {
  width: 70%;
  padding: 100px;
  margin: 0 auto;
  font-size: 20px;
}

.no-access .title {
  text-align: center;
  color: var(--main-color);
  font-size: 40px;
}
.no-access .description {
  text-align: center;
  font-size: 22px;
}

@media (max-width: 991px) and (min-width: 768px) {
  .no-access {
    width: 70%;
    padding: 50px;
  }

  .no-access .title {
    font-size: 35px;
  }
  .no-access .description {
    font-size: 19px;
  }
}

@media (max-width: 767px) {
  .admin-panel {
    flex-direction: column;
  }

  .no-access {
    width: 80%;
    padding: 100px 50px;
  }

  .no-access .title {
    font-size: 28px;
  }
  .no-access .description {
    font-size: 16px;
  }
}
</style>
