<script setup>
import { onMounted, ref ,computed} from 'vue'
import questionsApi from '@/api/questions'
import spinner from '@/components/loadingSpinner.vue'
import { useI18n } from 'vue-i18n'
const questions = ref([])
const page = ref(1)
const isLoadingQuestion = ref(true)
const { locale } = useI18n()

const direction = computed(() => {
  return locale.value === 'ar' ? 'rtl' : 'ltr'
})

async function loadQuestions() {
  try {
    const response = await questionsApi.getQuestions()
    questions.value = response.data.questions
    isLoadingQuestion.value = false
  } catch {
    return
  }
}

async function handelItemDeletion() {
  await loadQuestions()
  page.value = 1
}

onMounted(async () => {
  await loadQuestions()
})
</script>

<template>
  <div class="question-container">
    <QuestionCard
      v-for="(question, index) in questions"
      :key="question._id"
      :questionId="question._id"
      :questionAr="index + 1 + ' - ' + question.questionAr"
      :questionEn="index + 1 + ' - ' + question.questionEn"
      :hollandAttribute="question.HollandAttribute"
      :mbtiAttribute="question.MBTIAttribute"
      :class="{ hiddenQuestion: !(index >= (page - 1) * 4 && index < page * 4) }"
      @itemDeleted="handelItemDeletion"
    ></QuestionCard>
    <spinner v-show="isLoadingQuestion"></spinner>
    <div class="controls" v-show="!isLoadingQuestion" :dir="direction">
      <button @click="page--" :class="{ disabled: page <= 1 }">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <span>
        {{ page }}
      </span>
      <button @click="page++" :class="{ disabled: page >= questions.length / 4 }">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import QuestionCard from './questionCard.vue'
import apiCallWrapper from '@/api/apiCallWrapper'
import { fa } from 'intl-tel-input/i18n';
export default {
  components: { QuestionCard },
  name: 'QuestionsPage',
  data() {
    return {}
  },
  methods: {},
}
</script>

<style scoped>
.question-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 25px;
  padding: 25px 0;
  position: relative;
}

.question-container .hiddenQuestion {
  display: none;
}

.question-container .controls {
  display: flex;
  align-items: center;
  gap: 25px;
}

.question-container .controls span {
  font-weight: bold;
}

.question-container .controls button {
  background-color: var(--controls-color);
  outline: none;
  border: none;
  padding: 2px 10px;
  box-shadow: 1px 1px 2px 0 var(--text-color);
  border-radius: 2px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.question-container .controls button:hover {
  scale: 1.02;
}

.question-container .controls button.disabled {
  opacity: 0.6;
  pointer-events: none;
  cursor: not-allowed;
}

[dir="rtl"] .fa-chevron-left,
[dir="rtl"] .fa-chevron-right {
  transform: scaleX(-1);
}

@media (max-width: 767px) {
  .question-container {
    margin: auto;
  }
}
</style>
