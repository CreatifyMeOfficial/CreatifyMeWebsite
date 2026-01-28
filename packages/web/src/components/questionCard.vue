<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
<template>
  <div class="question-card">
    <span class="column-header">{{ t('adminPanel.question') + ` ( ${questionNumber} )` }}</span>
    <span class="column-header">MBTI</span>
    <span class="column-header">Holland</span>
    <span v-show="!editStarted" class="column-header">{{ t('adminPanel.edit') }}</span>
    <span v-show="editStarted" class="column-header">{{ t('adminPanel.save') }}</span>
    <span v-show="!editStarted" class="column-header">{{ t('adminPanel.delete') }}</span>
    <span v-show="editStarted" class="column-header">{{ t('adminPanel.cancel') }}</span>
    <div class="question">
      <span ref="enContent" class="question-content en">{{ questionEn }}</span>
      <span ref="arContent" class="question-content ar">{{ questionAr }}</span>
    </div>
    <span v-show="!editStarted" class="attribute">{{ mbtiAttribute }}</span>
    <select v-show="editStarted" v-model="mbtiAttr" name="MBTISelect" ref="MBTISelect">
      <option value="J">J</option>
      <option value="P">P</option>
      <option value="T">T</option>
      <option value="F">F</option>
      <option value="N">N</option>
      <option value="S">S</option>
      <option value="E">E</option>
      <option value="I">I</option>
      <option value="none">none</option>
    </select>
    <span v-show="!editStarted" class="attribute">{{ hollandAttribute }}</span>
    <select v-show="editStarted" v-model="hollandAttr" name="HollandSelect" ref="HollandSelect">
      <option value="RR">R</option>
      <option value="II">I</option>
      <option value="AA">A</option>
      <option value="SS">S</option>
      <option value="EE">E</option>
      <option value="CC">C</option>
    </select>
    <button v-show="!editStarted" class="edit" @click="editStarted = true">
      <i class="fa-solid fa-pen"></i>
    </button>
    <button v-show="editStarted" class="update" @click="updateQuestion">
      <i class="fa-solid fa-floppy-disk"></i>
    </button>
    <button v-show="!editStarted" @click="Delete"><i class="fa-solid fa-trash"></i></button>
    <button v-show="editStarted" class="cancel" @click="editStarted = false">
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
</template>

<script>
import questionsApi from '@/api/questions'

export default {
  name: 'QuestionCard',
  data() {
    return {
      editStarted: false,
      hollandAttr: this.hollandAttribute,
      mbtiAttr: this.mbtiAttribute,
    }
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
    questionNumber: {
      type: Number,
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
          this.$emit('itemDeleted')
        }
      } catch {
        return
      }
    },

    async updateQuestion() {
      try {
        const response = await questionsApi.updateQuestion({
          questionId: this.questionId,
          questionEn: this.$refs.enContent.innerText,
          questionAr: this.$refs.arContent.innerText,
          HollandAttribute: this.$refs.HollandSelect.value,
          MBTIAttribute: this.$refs.MBTISelect.value,
        })

        if (response.status === 200) {
          this.$emit('itemUpdated')
        }
      } catch {
        return
      } finally {
        this.editStarted = false
      }
    },
  },

  watch: {
    editStarted(newVal) {
      this.$refs.enContent.contentEditable = newVal
      this.$refs.arContent.contentEditable = newVal
      if (newVal === false) {
        this.$refs.enContent.innerText = this.questionEn
        this.$refs.arContent.innerText = this.questionAr
        this.hollandAttr = this.hollandAttribute
        this.mbtiAttr = this.mbtiAttribute
      } else {
        this.$refs.enContent.focus()
      }
    },
  },
}
</script>

<style scoped>
.question-card {
  display: grid;
  grid-template-columns: 1fr repeat(4, auto);
  grid-template-rows: auto auto;
  gap: 10px 25px;
  border: 1px solid var(--text-color);
  box-shadow: 1px 1px 2px 0 var(--text-color);
  padding: 10px 25px;
  width: 90%;
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
