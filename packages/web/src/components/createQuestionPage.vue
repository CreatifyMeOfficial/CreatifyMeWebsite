<script setup>
import questionsApi from '@/api/questions'
import notificationTypes from '@/enums/notificationTypes'
import createNotification from '@/notification/notification'
import customButtonComponent from './customButtonComponent.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

import { ref } from 'vue'

const englishQuestion = ref('')
const arabicQuestion = ref('')
const selectedMbti = ref('')
const selectedHolland = ref('')

async function createQuestion() {
  if (
    !englishQuestion.value ||
    !arabicQuestion.value ||
    !selectedMbti.value ||
    !selectedHolland.value
  ) {
    createNotification(
      t('notifications.emptyQuestion'),
      notificationTypes.Warning,
      5,
    )
    return
  }

  if (englishQuestion.value.length < 10 || arabicQuestion.value.length < 10){
    createNotification(t('notifications.shortQuestion'), notificationTypes.Warning, 5,)
    return
  }

  try {
    const response = await questionsApi.createQuestion({
      questionAr: arabicQuestion.value,
      questionEn: englishQuestion.value,
      MBTIAttribute: selectedMbti.value,
      HollandAttribute: selectedHolland.value,
    })
    englishQuestion.value = ''
    arabicQuestion.value = ''
    selectedMbti.value = ''
    selectedHolland.value = ''
  } catch {
    return
  }
}
</script>

<template>
  <!-- Main container for the question creation form -->
  <div class="question-container">
    <!-- Section for entering question text in multiple languages -->
    <div class="question-part">
      <span>{{ t('adminPanel.enterQuestion') }}</span>
      <div class="question-inputs">
        <!-- English question input -->
        <label for="">{{ t('adminPanel.enterEnQ') }}</label>
        <input type="text" v-model="englishQuestion" dir="auto" />
        <!-- Arabic question input -->
        <label for="">{{ t('adminPanel.enterArQ') }}</label>
        <input type="text" v-model="arabicQuestion" dir="auto" />
      </div>
    </div>

    <!-- MBTI personality type selection section -->
    <div class="mbti-part content">
      <span>MBTI :</span>
      <table>
        <tbody>
          <!-- MBTI trait headers -->
          <tr class="row1">
            <td>J</td>
            <td>P</td>
            <td>T</td>
            <td>F</td>
            <td>N</td>
            <td>S</td>
            <td>E</td>
            <td>I</td>
            <td>None</td>
          </tr>
          <!-- Radio buttons for selecting MBTI traits -->
          <tr class="row2">
            <td><input type="radio" value="J" name="mbti" v-model="selectedMbti" /></td>
            <td><input type="radio" value="P" name="mbti" v-model="selectedMbti" /></td>
            <td><input type="radio" value="T" name="mbti" v-model="selectedMbti" /></td>
            <td><input type="radio" value="F" name="mbti" v-model="selectedMbti" /></td>
            <td><input type="radio" value="N" name="mbti" v-model="selectedMbti" /></td>
            <td><input type="radio" value="S" name="mbti" v-model="selectedMbti" /></td>
            <td><input type="radio" value="E" name="mbti" v-model="selectedMbti" /></td>
            <td><input type="radio" value="I" name="mbti" v-model="selectedMbti" /></td>
            <td><input type="radio" value="none" name="mbti" v-model="selectedMbti" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Holland Code (RIASEC) selection section -->
    <div class="holand-part content">
      <span>HOLAND :</span>
      <table>
        <tbody>
          <!-- Holland Code headers -->
          <tr class="row1">
            <td>R</td>
            <td>I</td>
            <td>A</td>
            <td>S</td>
            <td>E</td>
            <td>C</td>
          </tr>
          <!-- Radio buttons for selecting Holland Codes -->
          <tr class="row2">
            <td><input type="radio" value="RR" name="holand" v-model="selectedHolland" /></td>
            <td><input type="radio" value="II" name="holand" v-model="selectedHolland" /></td>
            <td><input type="radio" value="AA" name="holand" v-model="selectedHolland" /></td>
            <td><input type="radio" value="SS" name="holand" v-model="selectedHolland" /></td>
            <td><input type="radio" value="EE" name="holand" v-model="selectedHolland" /></td>
            <td><input type="radio" value="CC" name="holand" v-model="selectedHolland" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Submit button for creating the question -->
    <div class="create-btn">
      <customButtonComponent
        @click="createQuestion"
        :content="t('buttons.create')"
      ></customButtonComponent>
    </div>
  </div>
</template>

<style scoped>
/* Main container styling */
.question-container {
  width: 70%;
  margin: 50px auto;
}

/* Question input section styling */
.question-container .question-part {
  width: 100%;
}

/* Section title styling */
.question-container .question-part span {
  font-size: 26px;
  margin: 20px 0;
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
}

/* Grid layout for question inputs */
.question-container .question-part .question-inputs {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 25px;
  margin-left: 5%;
  margin-top: 25px;
}

/* Label styling for question inputs */
.question-container .question-part .question-inputs label {
  font-family: 'Montserrat', sans-serif;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

/* Input field styling */
.question-container .question-part .question-inputs input {
  width: 80%;
  height: 30px;
  border: none;
  border-radius: 10px;
  box-shadow: 1px 1px 2px var(--text-color);
  outline: none;
  font-size: 20px;
  display: flex;
  align-items: center;
  padding: 2px 10px;
}

/* Focus state for input fields */
.question-container .question-part input:focus {
  box-shadow: none;
  border: 2px solid var(--main-color);
  caret-color: var(--main-color);
}

/* Common styling for MBTI and Holland sections */
.question-container .content {
  width: 80%;
  margin: 50px 0;
  display: flex;
  flex-direction: column;
}

/* Section title styling */
.question-container .content span {
  font-size: 22px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  margin-left: 3%;
}

/* Table cell styling for personality type options */
.content table tr td {
  font-size: 20px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  text-align: center;
}

/* Radio button styling */
.content table tr td input {
  margin: 0;
  scale: 1.3;
  accent-color: var(--main-color);
  cursor: pointer;
}

/* Create button container */
.create-btn {
  display: flex;
  justify-content: flex-end;
  width: 80%;
}

/* Create button styling */
.create-btn button {
  width: 120px;
  border: none;
  border-radius: 10px;
  box-shadow: 1px 1px 1px 0 var(--text-color);
  background-color: var(--controls-color);
  font-size: 20px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  padding: 5px 0;
  cursor: pointer;
  transition: all 0.1s 0s linear;
  box-sizing: border-box;
}

/* Create button hover effect */
.create-btn button:hover {
  scale: 1.05;
}

/* Responsive design for mobile devices */
@media (max-width: 767px) {
  .question-container {
    width: 90%;
  }
  /* Adjust question section for mobile */
  .question-container .question-part span {
    font-size: 18px;
  }
  .question-container .question-part .question-inputs {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  /* Adjust labels for mobile */
  .question-container .question-part .question-inputs label {
    font-size: 14px;
  }

  /* Adjust inputs for mobile */
  .question-container .question-part .question-inputs input {
    width: 90%;
    font-size: 14px;
    padding: 0 10px;
  }

  /* Adjust section titles for mobile */
  .question-container .content span {
    font-size: 16px;
  }

  /* Adjust table cells for mobile */
  .content table tr td {
    font-size: 14px;
  }

  /* Adjust create button for mobile */
  .create-btn button {
    font-size: 14px;
    width: 80px;
    border-radius: 8px;
    font-weight: 700;
    transition: none;
  }

  /* Remove hover effect on mobile */
  .create-btn button:hover {
    scale: 1;
  }
}
</style>
