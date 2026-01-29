<script setup>
import { onMounted, ref ,computed ,watch, onUnmounted} from 'vue'
import questionsApi from '@/api/questions'
import spinner from '@/components/loadingSpinner.vue'
import { useI18n } from 'vue-i18n'
const questions = ref([])
const page = ref(1)
const isLoadingQuestion = ref(true)
const { locale } = useI18n()

const previousIcon = computed(() => {
  return 'fa-solid fa-chevron-left'
})

const nextIcon = computed(() => {
  return 'fa-solid fa-chevron-right'
})

const direction = computed(() => {
  return locale.value === 'ar' ? 'rtl' : 'ltr'
})

async function loadQuestions() {
  try {
    isLoadingQuestion.value = true
    const response = await questionsApi.getQuestions()
    questions.value = response.data.questions
    isLoadingQuestion.value = false
  } catch {
    return
  }
}

onMounted(async () => {
  const savedPage = sessionStorage.getItem('questionsPage')
  page.value = savedPage ? parseInt(savedPage) : 1
  await loadQuestions()
})

watch(page, async (newPage) => {
  sessionStorage.setItem('questionsPage', newPage)
})

onUnmounted(() => {
  sessionStorage.removeItem('questionsPage')
})


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
      v-if="!isLoadingQuestion"
      :key="question._id"
      :questionId="question._id"
      :questionNumber="index + 1"
      :questionAr="question.questionAr"
      :questionEn="question.questionEn"
      :hollandAttribute="question.HollandAttribute"
      :mbtiAttribute="question.MBTIAttribute"
      :class="{ hiddenQuestion: !(index >= (page - 1) * 4 && index < page * 4) }"
      @itemDeleted="handelItemDeletion"
      @itemUpdated="loadQuestions"
    ></QuestionCard>
    <spinner v-show="isLoadingQuestion"></spinner>
    <div class="controls" v-show="!isLoadingQuestion" :dir="direction">
      <button @click="page--" :class="{ disabled: page <= 1 }" class="prev-btn">
        <i :class="previousIcon"></i>
      </button>
      <span>
        {{ page }}
      </span>
      <button @click="page++" :class="{ disabled: page >= questions.length / 4 }" class="next-btn">
        <i :class="nextIcon"></i>
      </button>
    </div>
  </div>
</template>

<script>
import QuestionCard from './questionCard.vue'
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
  direction: ltr !important; /* إجبار الاتجاه من اليسار لليمين */
}

.prev-btn {
  grid-area: prev;
  justify-self: end;
}

.page-number {
  grid-area: page;
  font-weight: bold;
  font-size: 16px;
  min-width: 30px;
  text-align: center;
}

.next-btn {
  grid-area: next;
  justify-self: start;
}

/* إزالة أي تأثير لاتجاه RTL */
[dir='rtl'] .controls {
  direction: ltr !important;
  transform: none !important;
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
}

.question-container .controls button:hover {
  scale: 1.02;
}

.question-container .controls button.disabled {
  opacity: 0.6;
  pointer-events: none;
  cursor: not-allowed;
}

@media (max-width: 767px) {
  .question-container .controls button {
    width: 25px;
    height: 25px;
  }
  .question-container {
    margin: 0 auto;
  }
}
</style>
