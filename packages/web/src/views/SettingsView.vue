<script setup>
import sideBar from '@/components/sideBar.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const { t } = useI18n()
const router = useRouter()
const selectedTab = ref(1)


onMounted(()=> {
  const route = router.currentRoute.value.path;
  if(route === '/settings'){
    selectedTab.value = 0
  }
  else if(route === '/settings/profile'){
    selectedTab.value = 1
  }
})

function tabChanged(payload) {
  if (payload.selectedItem === 0) {
    router.push('/settings')
  } else if (payload.selectedItem === 1) {
    router.push('/settings/profile')
  }
}
</script>

<template>
  <div class="container">
    <sideBar
      :tabs="[t('sideBar.setting'), t('sideBar.profile')]"
      :openedTab="selectedTab"
      @itemChanged="tabChanged"
    />
    <router-view />
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
