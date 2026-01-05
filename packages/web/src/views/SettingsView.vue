<script setup>
import sideBar from '@/components/sideBar.vue'
import settingsPage from '@/components/settingsPage.vue'
import profilePage from '@/components/profilePage.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()
const openedTab = ref(0)

function tabChanged(payload) {
  openedTab.value = payload.selectedItem
  
}
</script>

<template>
  <div class="container">
    <sideBar
      @itemChanged="tabChanged"
      :tabs="[t('sideBar.setting'), t('sideBar.profile')]"
    ></sideBar>
    <settingsPage v-if="openedTab === 0 "></settingsPage>
    <profilePage v-if="openedTab === 1 "></profilePage>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  height: auto;
}

@media (max-width: 767px) {
  .container {
    flex-direction: column;
  }
}
</style>
