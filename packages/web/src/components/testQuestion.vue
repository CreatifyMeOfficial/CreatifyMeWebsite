<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="question-template">
    <label :id="question" class="question">
      <span class="question-number">{{ number }} -</span>
      <span class="question-content">{{ question }}</span>
    </label>
    <div class="question-block">
      <span class="info" :class="{ hidden: !displayInfo }"> {{ t('test.disagree') }} </span>
      <div class="answers">
        <span class="answer"
          ><input value="1" v-model="selectedValue" :name="number" type="radio"
        /></span>
        <span class="answer"
          ><input value="2" v-model="selectedValue" :name="number" type="radio"
        /></span>
        <span class="answer"
          ><input value="3" v-model="selectedValue" :name="number" type="radio"
        /></span>
        <span class="answer"
          ><input value="4" v-model="selectedValue" :name="number" type="radio"
        /></span>
        <span class="answer"
          ><input value="5" v-model="selectedValue" :name="number" type="radio"
        /></span>
      </div>
      <span class="info" :class="{ hidden: !displayInfo }"> {{ t('test.agree') }} </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'testQuestion',
  data() {
    return {
      selectedValue: this.savedSelection || '0',
    }
  },
  props: {
    number: {
      type: Number,
      default: 0,
    },
    question: {
      type: String,
      default: '',
    },
    questionId: {
      type: String,
      default: '',
    },
    savedSelection: {
      type: String,
      default: '0',
    },
    displayInfo: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    selectedValue(newVal) {
      this.$emit('answer-changed', {
        questionId: this.questionId,
        selectedValue: newVal,
      })
    },
  },
}
</script>

<style scoped>
.question-template {
  width: 90%;
  margin: 0 auto 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 25px;
}

.question {
  font-size: 22px;
  direction: var(--direction);
  width: 60%;
}

.question-block {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  direction: ltr;
  gap: 25px;
}

.question-block .info.hidden {
  visibility: hidden;
}

.question-block .info {
  font-size: 18px;
  font-weight: 600;
  color: var(--main-color);
}

.answers {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  position: relative;
}

.answers .answer {
  position: relative;
  border-radius: 50%;
  box-sizing: border-box;
  border: solid 3px var(--main-color);
}

.answers :nth-child(1).answer,
.answers :nth-child(5).answer {
  height: 30px;
  width: 30px;
}

.answers :nth-child(2).answer,
.answers :nth-child(4).answer {
  height: 25px;
  width: 25px;
}

.answers :nth-child(3).answer {
  height: 20px;
  width: 20px;
}

.answers .answer input[type='radio'] {
  margin: 0;
  height: 100%;
  width: 100%;
  /* Hide the checkbox */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
}

.answers .answer:has(input:checked)::before {
  content: '';
  height: calc(100% - 6px);
  width: calc(100% - 6px);
  box-sizing: border-box;
  left: 3px;
  top: 3px;
  border-radius: 50%;
  position: absolute;
  background-color: var(--main-color);
}

@media (max-width: 767px) {
  .question {
    font-size: 16px;
    width: 80%;
  }

  .answers {
    width: 60%;
  }

  .question-block .info {
    font-size: 14px;
  }
}
</style>
