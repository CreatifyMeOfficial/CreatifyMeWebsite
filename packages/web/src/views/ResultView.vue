<script setup>
import { onMounted, ref, computed } from 'vue'
import resultApi from '@/api/questions'

const result = ref([])
const description = ref({ ar: '', en: '' })
const isLoadingResult = ref(true)
const isNotificationBoxVisible = ref(false)
const notificationInfo = ref({ link: '', info: { ar: '', en: '' } })

async function loadResult() {
  const response = await resultApi.getResult()
  if (response.status === 200) {
    result.value = response.data.result
    description.value = {
      ar: result.value['arabicDescription'].split('\n'),
      en: result.value['englishDescription'].split('\n'),
    }
    isLoadingResult.value = false
  } else if (response.status === 401) {
    isNotificationBoxVisible.value = true
    notificationInfo.value = {
      link: '/signup',
      info: { ar: 'الرجاء تسجيل الدخول أولاً', en: 'Please sign up first' },
    }
  } else if (response.status === 404) {
    isNotificationBoxVisible.value = true
    notificationInfo.value = {
      link: '/test',
      info: { ar: 'الرجاء إجراء الإختبار أولاً', en: 'Please take the test first' },
    }
  }
}

const resultField = computed(() => {
  return localStorage.getItem('userLanguage') === 'ar' ? 'ar' : 'en'
})

onMounted(async () => {
  await loadResult()
})
</script>

<template>
  <div class="container">
    <div class="code-placeholder" v-if="isLoadingResult && !isNotificationBoxVisible"></div>
    <h1 class="title" v-if="!isLoadingResult && !isNotificationBoxVisible">{{ result.code }}</h1>
    <div class="buttom" v-if="isLoadingResult && !isNotificationBoxVisible"></div>

    <div class="result-part">
      <div class="par" v-if="isLoadingResult && !isNotificationBoxVisible"></div>
      <p v-if="!isLoadingResult && !isNotificationBoxVisible">{{ description[resultField][0] }}</p>
      <div class="second-result-part">
        <div class="one" v-if="isLoadingResult && !isNotificationBoxVisible">
          <div class="left" v-if="isLoadingResult && !isNotificationBoxVisible"></div>
          <div class="image" v-if="isLoadingResult && !isNotificationBoxVisible"></div>
        </div>
        <div class="une" v-if="!isLoadingResult && !isNotificationBoxVisible">
          <p>{{ description[resultField][1] }}</p>
          <img src="../assets/Images/SVG/res1.png" alt="" />
        </div>

        <div class="two" v-if="isLoadingResult && !isNotificationBoxVisible">
          <div class="image"></div>
          <div class="left"></div>
        </div>
        <div class="deux">
          <img v-if="!isLoadingResult && !isNotificationBoxVisible" src="../assets/Images/SVG/res2.png" alt="" />
          <p>{{ description[resultField][2] }}</p>
        </div>
        <div class="three" v-if="isLoadingResult && !isNotificationBoxVisible">
          <div class="left"></div>
          <div class="image"></div>
        </div>
        <div class="trois">
          <p>{{ description[resultField][3] }}</p>
          <img v-if="!isLoadingResult && !isNotificationBoxVisible" src="../assets/Images/SVG/res3.png" alt="" />
        </div>
      </div>
      <div class="sm" v-if="isLoadingResult && !isNotificationBoxVisible">
        <div class="small"></div>
        <div class="small"></div>
        <div class="small"></div>
        <div class="small"></div>
      </div>
      <p v-for="section in description[resultField].slice(4)" :key="section">
        {{ section }}
      </p>
    </div>
  </div>
  <div class="notification-box" v-if="isNotificationBoxVisible">
    <p>{{ notificationInfo.info[resultField] }}</p>
    <router-link class="ok-btn" :to="notificationInfo.link">ok</router-link>
  </div>
</template>

<style scoped>
.container {
  /* position: relative; */
  display: flex;
  flex-direction: column;
  margin: 20px auto;
  padding: 50px;
  text-align: center;
  width: 80%;
  border-radius: 10px;
}

.title {
  text-align: center;
  color: var(--main-color);
}

.buttom {
  border-bottom: 4px solid var(--text-color);
  margin: 20px auto 40px;
  width: 55%;
  text-align: center;
}

.result-part .align-text-center {
  text-align: center;
}

.result-part .second-result-part {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
}

.result-part .second-result-part div {
  display: flex;
  align-items: center;
}

.result-part p,
.second-result-part p {
  text-align: center;
}

.result-part .second-result-part img {
  width:250px;
  margin: 10px 25px;
}

.code-placeholder {
  width: 20%;
  height: 30px;
  background-color: var(--placeholder-background);
  border-radius: 5px;
  margin: 30px auto;
}

.par {
  width: 100%;
  height: 100px;
  background-color: var(--placeholder-background);
  border-radius: 5px;
}

.one,
.two,
.three {
  display: flex;
  justify-content: space-between;
}

.two {
  margin-top: -100px;
}
.three {
  margin-top: -100px;
}

.left {
  width: 50%;
  height: 100px;
  background-color: var(--placeholder-background);
  border-radius: 5px;
}

.image {
  width: 200px;
  height: 200px;
  margin: 100px 25px;
  background-color: var(--placeholder-background);
}


.small {
  width: 100%;
  margin: 0 auto;
  height: 60px;
  background-color: var(--placeholder-background);
  border-radius: 5px;
  margin-bottom: 10px;
}

.notification-box {
  width: 350px;
  height: 150px;
  padding: 25px 50px;
  position: absolute;
  left: calc(50% - 150px);
  top: calc(40% - 50px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--main-color);
  box-shadow: 2px 1px 0 var(--main-color);
  border-radius: 10px;
  box-sizing: border-box;
}

.notification-box p{
  font-weight: bold;
  font-size: 20px;
}

.notification-box .ok-btn {
  width: 50px;
  background-color: var(--controls-color);
  margin: 20px 0PX;
  text-decoration: none;
  display: flex;
  justify-content: center;
  padding: 5px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 20px;
  color: var(--text-color);
}

@media (min-width: 768px) and (max-width: 991px) {
  .container {
    width: 90%;
  }
 .result-part .second-result-part img {
    width: 300px;
  }
}


@media (max-width: 767px) {
  .container {
    padding: 10px;
    margin-top: 10px;
  }

  .container .title {
    margin: 5px auto;
  }

  .container .buttom {
    margin: 10px auto 10px;
  }

  .par{
    margin-bottom: 20px
  }

  .one,.three{
    flex-direction: column-reverse;
  }



  .two{
    flex-direction: column;
  }

  .result-part .second-result-part div {
    margin: 10px;
    /* flex-direction: column; */
  }

  .result-part .second-result-part .une ,
  .result-part .second-result-part .trois{
    flex-direction: column-reverse;
  }


  .result-part .second-result-part .deux{
    flex-direction: column;
  }

  .result-part .second-result-part div .left{
    width: 100%;
  }

  .result-part .second-result-part img {
    width: 200px;
  }

  .notification-box{
    width: 200px;
    height: 100px;
    top: calc(30% - 50px);
    left: calc(50% - 100px);
    padding: 20px;
  }

  .notification-box p{
    font-size: 12px;
    font-weight: normal;
  }

  .notification-box .ok-btn{
    width: 30px;
    font-size: 12px;
    margin: 0;
    padding: 3px 1px;
  }

}
</style>
