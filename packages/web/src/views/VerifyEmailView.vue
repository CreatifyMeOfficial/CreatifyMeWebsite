<script setup>
import customButtonComponent from '../components/customButtonComponent.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue';
import authApi from '@/api/auth';
import createNotification from '@/notification/notification';
import notificationTypes from '@/enums/notificationTypes';
const { t } = useI18n()

const verificationCode = ref('')
const canResend = ref(false)

const router = useRouter();

onMounted(async() => {
  await resendCode();
})

const submitCode = async () => {
  if(verificationCode.value === '' || !verificationCode.value){
    createNotification(t('verifyEmail.warningMessage'), notificationTypes.Warning, 5)
    return
  }
  try {
    const response = await authApi.verifyUser({ verificationCode: verificationCode.value });
    if (response.status === 200) {
      createNotification(t('verifyEmail.successMessage'), notificationTypes.Success, 5)
      router.push('/');
    }
  } catch{
    return;
  }
}


const resendCode = async () => {
  try{
    canResend.value = false;
    const response = await authApi.resendVerificationEmail();
    EnableResend();
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
    <p v-show="canResend" class="resend-code">
        {{ t("verifyEmail.resend1") }} <button v-show="canResend" class="resend" @click="resendCode">{{t("verifyEmail.click")  }}</button> {{ t("verifyEmail.resend2") }}
    </p>
    <p v-show="!canResend" class="resend-code">
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
    width: 180px;
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
    letter-spacing: 10px;
    box-sizing: border-box;
}

.container .verify-code:focus{
    box-shadow: none;
    border: 2px solid var(--main-color);
}

.container .verify-code::placeholder {
  color: var(--placeholder-background-content);
  letter-spacing: 1px;
}

.container button.resend {
  background: transparent;
  color: var(--main-color);
  cursor: pointer;
  text-decoration: underline;
  font-weight: 600;
  margin: 0;
  padding: 0;
}


.container button{
    margin: 10px 0  25px 0;
    background-color: var(--controls-color);
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
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
        font-size: 22px;
        width: 150px;
        height: 40px;
    }

    .container .resend-code{
        font-size: 10px;
    }

    .container .resend-code button.resend {
      font-size: 12px;
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
        width: 120px;
        height: 25px;
        padding:5px 5px;
    }

    .container .resend-code{
        font-size: 8px;
    }

    .container .resend-code button.resend {
      font-size: 10px;
    }

}
</style>
