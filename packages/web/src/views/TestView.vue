<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import questionsApi from '../api/questions.js';
import TestQuestion from '../components/testQuestion.vue';
import createNotification from '@/notification/notification.js';
import notificationTypes from '@/enums/notificationTypes.js';
import press from '@/components/progressBar.vue';
import isLoggedIn from '@/helperMethods/checkLoginState';
import customButtonComponent from '@/components/customButtonComponent.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
const questions = ref([]);
const page = ref(1);
const pageQuestionLimit = 4;
const isLoadingTest = ref(true);
let answers = [];



// computed property للحصول على الحقل المناسب بناءً على اللغة
const questionField = computed(() => {
  return localStorage.getItem('userLanguage') === 'ar' ? 'questionAr' : 'questionEn';
});

const descriptionField = computed(() => {
  return localStorage.getItem('userLanguage') === 'ar' ? 'arabicDescription' : 'englishDescription';
});

const answeredQuestionsCount = ref(0);

onMounted(async () => {
  const savedAnswers = localStorage.getItem('Answers');
  if (savedAnswers) {
    answers = JSON.parse(savedAnswers);
    answeredQuestionsCount.value = answers.length;
  }
  if (!isLoggedIn()) {
    createNotification(t('notifications.loginRequired'), notificationTypes.Warning, 5);
  }

  await loadQuestions();
});


onMounted(async () => {
  // استرجاع الصفحة من sessionStorage فقط عند الدخول
  const savedPage = sessionStorage.getItem('TestView');
  page.value = savedPage ? parseInt(savedPage) : 1;
  await loadQuestions();
});

watch(page, async (newPage) => {
  // حفظ الصفحة في sessionStorage
  sessionStorage.setItem('TestView', newPage);
  await loadQuestions();
});

onUnmounted(() => {
  sessionStorage.removeItem('TestView');
});


const loadQuestions = async () => {
  try {
    const response = await questionsApi.getQuestions();
    questions.value = response.data.questions;
    isLoadingTest.value = false;
  } catch {
    return;
  }
};

function handleAnswerChange(payload) {
  const existingAnswerIndex = answers.findIndex((ans) => ans.questionId === payload.questionId);
  if (existingAnswerIndex !== -1) {
    answers[existingAnswerIndex].value = payload.selectedValue;
  } else {
    answers.push({
      questionId: payload.questionId,
      value: payload.selectedValue,
    });
    answeredQuestionsCount.value = answers.length;
  }
  localStorage.setItem('Answers', JSON.stringify(answers));
}

async function submitAnswers() {
  try {
    const questionsElements = document.getElementsByClassName('question-template');
    if (
      questionsElements.length === 0 ||
      Object.keys(answers).length !== questionsElements.length
    ) {
      createNotification('Please answer all the questions', notificationTypes.Warning, 5);
      return;
    }
    const response = await questionsApi.calculateResults({ answers: answers });
    if (response.status === 200) {
      localStorage.removeItem('Answers');
      router.push('/result');
    }
  } catch {
    return;
  }
}

// تحقق من شرط لجعل زر submit مفعل بحال الإجابة على جميع الاسئلة
const isSubmit = computed(() => {
  return answeredQuestionsCount.value >= questions.value.length;
});
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // This makes it animate nicely instead of jumping
  });
}

function nextPage() {
  page.value++;
  scrollToTop();
}

function previousPage() {
  page.value--;
  scrollToTop();
}
</script>

<template>
  <div class="questions">
    <!-- Progress Bar -->
    <press v-if="!isLoadingTest" :totalQuestions="questions.length" :answeredQuestions="answeredQuestionsCount"
      class="progress-section" />
    <TestQuestion class="question-template" v-for="(question, index) in questions" :key="question._id"
      :question="question[questionField]" :number="index + 1"
      :savedSelection="answers.find((ans) => ans.questionId === question._id)?.value" :questionId="question._id" :class="{
        hiddenQuestion: !(
          index >= (page - 1) * pageQuestionLimit && index < page * pageQuestionLimit
        ),
      }" :displayInfo="index % pageQuestionLimit === 0" @answer-changed="handleAnswerChange"></TestQuestion>
    <div class="placeholder" v-show="isLoadingTest">
      <div class="up"></div>
      <div class="down"></div>
    </div>

    <div class="placeholder" v-show="isLoadingTest">
      <div class="up"></div>
      <div class="down"></div>
    </div>
    <div class="placeholder" v-show="isLoadingTest">
      <div class="up"></div>
      <div class="down"></div>
    </div>
    <div class="placeholder" v-show="isLoadingTest">
      <div class="up"></div>
      <div class="down"></div>
    </div>
    <div class="controls">
      <div class="navigation-btn">
        <customButtonComponent v-if="page > 1" @click="previousPage" :content="t('buttons.previous')">
        </customButtonComponent>
        <customButtonComponent v-if="page < questions.length / pageQuestionLimit" @click="nextPage"
          :content="t('buttons.next')"></customButtonComponent>
      </div>
      <customButtonComponent class="submit-btn" :disabled="!isSubmit" @click="submitAnswers"
        :content="t('buttons.submit')"></customButtonComponent>
    </div>
  </div>
</template>

<style scoped>
.questions {
  width: 100%;
  padding: 50px 0;
}

.questions .question-template.hiddenQuestion {
  display: none;
}

.placeholder {
  width: 50%;
  margin: auto;
  margin-bottom: 50px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: right;
  align-items: start;
  row-gap: 25px;
}

.up {
  width: 70%;
  height: 30px;
  background-color: var(--placeholder-background);
  border-radius: 5px;
  margin: 0 30px;
}

.down {
  width: 100%;
  height: 50px;
  background-color: var(--placeholder-background);
  border-radius: 5px;
}

.controls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 25px;
  direction: var(--direction);
}

.controls button,
.submit-btn {
  padding: 5px 25px;
  width: 150px;
  background-color: var(--controls-color);
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  margin: 0 10px;
  border: none;
  cursor: pointer;
  box-shadow: 1px 1px 4px 0 var(--text-color);
  transition: transform 0.15s 0 linear;
}

.controls button:hover {
  transform: scale(1.1);
}

.hidden {
  visibility: hidden;
}

@media (max-width: 767px) {
  .controls button {
    width: 100px;
    padding: 5px 10px;
    font-size: 14px;
  }
}
</style>
