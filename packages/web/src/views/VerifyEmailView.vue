<script setup>
import customButtonComponent from '../components/customButtonComponent.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue';
import authApi from '@/api/auth';
import createNotification from '@/notification/notification';
import notificationTypes from '@/enums/notificationTypes';
import { useUserStore } from '@/stores/user';
const { t } = useI18n()


const verificationCode = ref('')
const canResend = ref(false)

const userStore = useUserStore();
const router = useRouter();

onMounted(async() => {
  await sendCode();
})

const submitCode = async () => {
  if(verificationCode.value === '' || !verificationCode.value){
    createNotification(t('verifyEmail.warningMessage'), notificationTypes.Warning, 5)
    return
  }
  try {
    const response = await authApi.verifyUser({ verificationCode: verificationCode.value });
    if (response.status === 200) {
      userStore.fetchUser();
      router.push('/test');
    }
  } catch{
    return;
  }
}


const sendCode = async () => {
  try{
    canResend.value = false;
    EnableResend();
    const response = await authApi.sendVerificationEmail();
  }catch{
    return
  }
}

function EnableResend(){
  setTimeout(() => {
    canResend.value = true
  }, 60000);
}

</script>
<template>
<div class="container">
    <span>{{ t("verifyEmail.title") }}</span>
    <p>{{ t("verifyEmail.description") }}</p>
    <input class="verify-code" v-model="verificationCode" placeholder="_ _ _ _ _ _"></input>
    <customButtonComponent
            :buttonType="'button'"
            :content="t('verifyEmail.verify')"
            @click="submitCode">
        </customButtonComponent>
    <p v-if="canResend" class="resend-code">
        {{ t("verifyEmail.resend1") }} <button class="resend" @click="sendCode">{{t("verifyEmail.click")  }}</button> {{ t("verifyEmail.resend2") }}
    </p>
    <p v-if="!canResend" class="resend-code">
        {{ t("verifyEmail.waitMessage") }}
    </p>
</div>
</template>
<style scoped>
.container{
    width: 40%;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    margin: 100px auto;
    box-shadow: 1px 2px 4px var(--text-color);
}

.container span{
    font-size: 20px;
    font-weight: 700;
    color: var(--main-color);
}
.container p{
    font-size: 18px;
}
.container .verify-code{
    width: 120px;
    height: 40px;
    font-size: 24px;
    background-color: var(--placeholder-background);
    padding: 5px 10px;
    border: 1px solid var(--placeholder-background-content);
    border-radius: 5px;
    margin: 5px 0 15px 0;
    text-align: center;
    outline: none;
    caret-color: var(--main-color);
    letter-spacing: 3px;
    box-sizing: border-box;
}

.container .verify-code:focus{
    box-shadow: none;
    border: 2px solid var(--main-color);
}

.container .verify-code::placeholder {
  color: var(--placeholder-background-content);
  letter-spacing: 1px;
  font-size: 18px;
}

.container .resend-code{
    font-size: 22px;
    padding: 0;
}

.container button.resend {

    text-align: center;

  background: transparent;
  color: var(--main-color);
  cursor: pointer;
  text-decoration: underline;
  font-weight: 600;
  margin: 0;
  padding: 0;
  border: none;
  /* width: 180px; */

}


     .container button{
        margin: 10px 0  25px 0;
        background-color: var(--controls-color);
        width: 70px;
     }
     .container .resend-code{
        font-size: 12px;
     }

@media (min-width: 767px) and (max-width: 1199px){
    .container{
        min-width: 500px;
    }

    .container span{
        font-size: 18px;
        font-weight: 500px;
    }

    .container p{
        font-size: 14px;
        text-align: center;
    }

    .container .verify-code{
      font-size: 20px;
      width: 100px;
      height: 35px;
      letter-spacing: 2px;

    }

    .container .verify-code::placeholder {
        font-size: 12px;
    }

    .container .resend-code{
        font-size: 10px;
    }

    .container .resend-code button.resend {
      font-size: 12px;
      width: 60px;
    }

}
@media (max-width: 766px) {
    .container{
        width: 75%;
        max-width: 400px;
    }

    .container span{
        font-size: 16px;
        font-weight: 500px;
    }

    .container p{
        font-size: 12px;
        text-align: center;
    }

    .container .verify-code{
      font-size: 14px;
      width: 90px;
      height: 25px;
      padding:5px 5px;
      letter-spacing: 5px;
    }

    .container button{
        width: 60px;
     }

    .container .verify-code::placeholder {
        font-size: 14px;
    }


    .container .resend-code{

        font-size: 12px;
    }

    .container .resend-code button.resend {
      font-size: 12px;
      width: 60px;
    }

}
</style>
