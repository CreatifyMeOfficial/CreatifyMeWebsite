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
const isCalculatingResult = ref(false);
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
    isCalculatingResult.value = true;
    const response = await questionsApi.calculateResults({ answers: answers });
    if (response.status === 200) {
      localStorage.removeItem('Answers');
      router.push('/result');
    }
  } catch {
    return;
  }
  finally {
    isCalculatingResult.value = false;
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
  <div class="test-container">
    <div class="questions" :class="{ blur: isCalculatingResult }">
      <!-- Progress Bar -->
      <press v-if="!isLoadingTest" :totalQuestions="questions.length" :answeredQuestions="answeredQuestionsCount"
        class="progress-section" />
      <TestQuestion class="question-template" v-for="(question, index) in questions" :key="question._id"
        :question="question[questionField]" :number="index + 1"
        :savedSelection="answers.find((ans) => ans.questionId === question._id)?.value" :questionId="question._id"
        :class="{
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
    <!-- Start of waiting for result calculation popup -->
    <div class="calculation-popup" v-if="isCalculatingResult">
      <div class="creatify-loader">
        <div class="shape">
          <img src="../assets/Images/waitingAnimation.svg" alt="">
        </div>
        <div class="info">
          <i class="fa-solid fa-maximize"></i>
          <p>{{ t('test.waitingForResult') }}</p>
        </div>
      </div>
    </div>
    <!-- End of waiting for result calculation popup -->
  </div>
</template>

<style scoped>
.text-container {
  position: relative;
}

.questions {
  width: 100%;
  padding: 50px 0;
}

.questions.blur {
  filter: blur(2px);
  pointer-events: none;
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

/* Start of waiting for result calculation popup */
.calculation-popup {
  position: absolute;
  width: 500px;
  height: 300px;
  left: calc(50% - 250px);
  top: calc(50% - 150px);
  background: var(--elements-color);
  box-shadow: 1px 2px 4px var(--text-color);
  border-radius: 5px;
  z-index: 2;
}

.creatify-loader {
  text-align: center;
  padding: 40px;
}

.shape {
  display: flex;
  justify-content: center;
}


.calculation-popup .info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.calculation-popup .info i {
  color: var(--main-color);
}

.calculation-popup .info p {
  margin: 25px 0;
  color: var(--text-color);
  font-weight: 600;
}

/* End of waiting for result calculation popup */

@media (max-width: 767px) {

  /* Start of waiting for result calculation popup */
  .calculation-popup {
    width: 350px;
    height: 250px;
    top: calc(50% - 125px);
    left: calc(50% - 175px);
  }

  .shape img {
    width: 250px;
  }

  .calculation-popup .info p {
    font-size: 10px;
  }

  /* End of waiting for result calculation popup */
  .controls button {
    width: 100px;
    padding: 5px 10px;
    font-size: 14px;
  }
}
</style>
