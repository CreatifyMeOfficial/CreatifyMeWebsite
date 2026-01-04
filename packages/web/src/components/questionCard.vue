<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
<template>
  <div class="question-card">
    <span class="column-header">{{ t('adminPanel.question') }}</span>
    <span class="column-header">MBTI</span>
    <span class="column-header">Holland</span>
    <span class="column-header">{{ t('adminPanel.delete') }}</span>
    <div class="question">
      <span class="question-content en">{{ questionEn }}</span>
      <span class="question-content ar">{{ questionAr }}</span>
    </div>
    <span class="attribute">{{ mbtiAttribute }}</span>
    <span class="attribute">{{ hollandAttribute }}</span>
    <button @click="Delete"><i class="fa-solid fa-trash"></i></button>
  </div>
</template>

<script>
import questionsApi from '@/api/questions'
import notificationTypes from '@/enums/notificationTypes'
import createNotification from '@/notification/notification'

export default {
  name: 'QuestionCard',
  data() {
    return {}
  },
  props: {
    questionId: {
      type: String,
    },
    mbtiAttribute: {
      type: String,
    },
    hollandAttribute: {
      type: String,
    },
    questionAr: {
      type: String,
    },
    questionEn: {
      type: String,
    },
  },
  methods: {
    async Delete() {
      try {
        const response = await questionsApi.deleteQuestion({ questionId: this.questionId })
        if (response.status === 200) {
          createNotification('Question deleted successfully!', notificationTypes.Success, 5)
          this.$emit('itemDeleted', () => {})
        }
      } catch {
        return
      }
    },
  },
}
</script>

<style scoped>
.question-card {
  display: grid;
  grid-template-columns: 1fr repeat(3, auto);
  grid-template-rows: auto auto;
  gap: 10px 25px;
  border: 1px solid var(--text-color);
  box-shadow: 1px 1px 2px 0 var(--text-color);
  padding: 10px 25px;
  width: 90%;
  padding: 10px 25px;
  border-radius: 25px;
  box-sizing: border-box;
  align-items: center;
  text-align: center;
  transition: all 0.1s 0s linear;
  cursor: pointer;
  font-family: 'poppins';
}

.question-card:hover {
  transform: scale(1.01);
}

.question-card .column-header {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.question-card .question {
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
}

.question-card .question .question-content {
  text-wrap: nowrap;
  padding: 4px 0;
  min-width: 100%;
  text-align: start;
  overflow-y: auto;
}

.question-card .question .question-content.en {
  direction: ltr;
}

.question-card .question .question-content.ar {
  direction: rtl;
}

.question-card .question :first-child {
  border-bottom: solid 1px var(--text-color);
}

.question-card button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  margin: auto;
  background-color: var(--danger-color);
  color: var(--background-color);
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  box-shadow: 1px 1px 1px 0 var(--text-color);
  transition: all 0.1s 0s linear;
}

.question-card button:hover {
  transform: scale(1.1);
}

@media (max-width: 767px) {
  .question-card {
    font-size: 8px;
    gap: 5px 10px;
  }

  .question-card button {
    padding: 4px 5px;
  }

  .question-card button i {
    font-size: 10px;
  }
}
</style>
