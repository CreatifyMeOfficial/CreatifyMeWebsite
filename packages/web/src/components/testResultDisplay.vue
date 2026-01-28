<script setup>
import CustomButtonComponent from './customButtonComponent.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineEmits(['displayClosed'])
</script>
<template>
  <div class="result-display" ref="resultDisplay">
    <span class="title">{{ t('testResult.title')}}</span>
    <div class="result">
      <img src="../assets/Images/test/resultDisplayFirstSectionImage.png" alt="" />
      <p class="align-text-center">{{ newContent[0] }}</p>
      <div class="second-part-result">
        <div class="one">
          <img  src="../assets/Images/test/resultDisplaySecondSectionImage.png" alt="" />
          <p class="align-text-center">{{ newContent[1] }}</p>
        </div>
        <div class="two">
          <p class="align-text-center">{{ newContent[2] }}</p>
          <img src="../assets/Images/test/resultDisplayThirdSectionImage.png"  alt="" /></div>
        </div>
      <p v-for="section in newContent.slice(3)" :key="section">{{ section }}</p>
      <img src="../assets/Images/test/resultDisplayFinalSectionImage.svg" alt="">
    </div>

    <CustomButtonComponent
      class="btn"
      :buttonType="'button'"
      :content="t('buttons.ok')"
      @click="$emit('displayClosed')"
    ></CustomButtonComponent>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newContent: this.content.split('\n'),
    }
  },
  props: {
    content: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
.result-display {
  position: fixed;
  width: 800px;
  height: 500px;
  left: calc(50% - 400px);
  top: calc(50% - 250px);
  border-radius: 25px;
  z-index: 999;
  background-color: var(--background-color);
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  row-gap: 25px;
  align-items: center;
  justify-items: center;
  padding: 25px 50px;
  box-sizing: border-box;
  box-shadow: 1px 2px 4px var(--text-color);
}

.result-display .title {
  font-size: 20px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  color: var(--text-color);
  margin-bottom: 20px;
}

.result-display .result {
  font-family: 'Poppins', sans-serif;
  text-align: start;
  width: 100%;
  height: 100%;
  padding: 25px;
  display: flex;
  flex-direction: column;
  color: var(--text-color);
  white-space: pre-line;
  direction: rtl;
  overflow-y: auto;
  /* display scroll bar */
  scrollbar-width: thin;
  scrollbar-color: var(--main-color) var(--background-color);
}

.result-display .result::-webkit-scrollbar-thumb {
  border-radius: 1px;
}

.result-display .result img {
  width: 75%;
  margin: auto;
}

.result-display .result .align-text-center {
  text-align: center;
}

.result-display .result .second-part-result {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 5px;
}

.result-display .result .second-part-result img {
  width: 60%;
}

.result-display .btn {
  width: 50px;
  background-color: var(--controls-color);
  margin-top: 20px;
}

@media(min-width:768px) and (max-width: 991px){
  .result-display {
    width: 70%;
    left: calc(50% - 35%);
  }
}

@media(max-width:767px){
  .result-display {
   width: 95%;
   left: calc(50% - 47.5%);
  }
  .result-display .result .second-part-result {
    display: flex;
    flex-direction: column;
  }
  .result-display .result .second-part-result .one {
    flex-direction: column;
    text-align: center;
  }

  .result-display .result .second-part-result .two{
    display: flex;
    flex-direction: column;
  }
  .result-display .result .second-part-result .two img{
    order: 1;
    width: 50%;
  }
  .result-display .result .second-part-result .two p{
    order: 2;
  }
}
</style>
