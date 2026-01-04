<script setup>
import SideBar from '@/components/sideBar.vue'
import UsersPage from '@/components/usersPage.vue'
import QuestionsPage from '@/components/questionsPage.vue'
import createQuestionPage from '@/components/createQuestionPage.vue'
import TagsPage from '@/components/TagsPage.vue'
import personalitiesPage from '@/components/personalitiesPage.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()
const selectedTab = ref(0)


function tabChanged(payload) {
  selectedTab.value = payload.selectedItem
}
</script>

<template>
  <div class="admin-panel">
    <SideBar
      @itemChanged="tabChanged"
      :tabs="[
        t('adminPanel.sidebar.users'),
        t('adminPanel.sidebar.questions'),
        t('adminPanel.sidebar.addQuestion'),
        t('adminPanel.tagsTitle'),
        t('adminPanel.sidebar.personality'),
      ]"
    ></SideBar>
    <UsersPage v-if="selectedTab === 0" />
    <QuestionsPage v-else-if="selectedTab === 1"></QuestionsPage>
    <createQuestionPage
      v-else-if="selectedTab === 2"
    ></createQuestionPage>
    <TagsPage v-else-if="selectedTab === 3"></TagsPage>
    <personalitiesPage
      v-else-if="selectedTab === 4"
    ></personalitiesPage>
  </div>
</template>

<style scoped>
.admin-panel {
  display: flex;
  flex: 1;
  min-height: 0; /* Prevents flex items from overflowing */
  width: 100%;
}

@media (max-width: 767px) {
  .admin-panel {
    flex-direction: column;
  }
}
</style>
