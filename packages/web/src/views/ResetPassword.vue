<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import authApi from '@/api/auth'
import PasswordInput from '@/components/passwordInput.vue'
import CustomButtonComponent from '@/components/customButtonComponent.vue'
import createNotification from '@/notification/notification'
import notificationTypes from '@/enums/notificationTypes'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const showEmailInput = ref(true)

const router = useRouter();

// بيانات المدخلات / Input data
const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const resetPasswordCode = ref('')
const canResend = ref(false)



const resetPassword = async () => {
  if(resetPasswordCode.value === '' || newPassword.value === '' || confirmPassword.value === '' || email.value === ''){
    createNotification(t('reset.warningMessage'), notificationTypes.Error, 5)
    return
  }
  if(newPassword.value !== confirmPassword.value){
    createNotification(t('reset.passwordMismatch'), notificationTypes.Error, 5)
    return
  }
  try {
    const response = await authApi.resetPassword({email: email.value, passwordResetCode: resetPasswordCode.value, newPassword: newPassword.value, confirmPassword: confirmPassword.value});
    if (response.status === 200) {
      router.push('/login');
    }
  } catch(error){
    return;
  }
}


const sendCode = async () =>{
  try{
    if(email.value === ''){
      createNotification(t('reset.emailInputWarningMessage'),notificationTypes.Error, 5)
      return;
    }
    canResend.value = false;
    EnableResend();
    const response = await authApi.sendPasswordResetEmail({email: email.value});
    if(response.status === 200){
      showEmailInput.value = false;
    }
  }catch{
    return
  }
}

const EnableResend = ()=>{
    setTimeout(() => {
    canResend.value = true
  }, 60000);
}

</script>

<template>
  <div v-if="showEmailInput" class="container">
    <h2 class="title">{{ t('reset.emailInputTitle') }}</h2>
        <p class="description">
      {{ t('reset.emailInputDescription') }}
    </p>
    <input class="email" type="email" v-model="email">

    <div class="controls">
        <CustomButtonComponent
        class="controls-btn"
        :buttonType="'button'"
        :content="t('reset.send')"
        @click="sendCode"
      />
    </div>
  </div>
  <div v-else class="container">
    <h2 class="title">{{ t('reset.title') }}</h2>

    <p class="description">
      {{ t('reset.description') }}
    </p>
    <input class="verify-code" v-model="resetPasswordCode" placeholder="_ _ _ _ _ _"></input>
    <h3 class="change">{{ t('reset.title') }}</h3>

    <!-- كلمة المرور الجديدة / New password -->
    <div class="password">
      <label class="lab">{{ t('reset.add')}}</label>
      <PasswordInput
        v-model="newPassword"
        class="pass"
        dir="ltr"
        :placeholder="t('reset.addPlaceholder')"
      />
    </div>

    <!-- تأكيد كلمة المرور / Confirm password -->
    <div class="password">
      <label class="lab">{{ t('reset.confirm') }}</label>
      <PasswordInput
        v-model="confirmPassword"
        class="pass word"
        dir="ltr"
        :placeholder="t('reset.confirmPlaceholder')"
      />
    </div>
    <p v-if="canResend" class="resend-code">
        {{ t("verifyEmail.resend1") }} <button class="resend" @click="sendCode">{{t("verifyEmail.click")  }}</button> {{ t("verifyEmail.resend2") }}
    </p>
    <p v-if="!canResend" class="resend-code">
        {{ t("verifyEmail.waitMessage") }}
    </p>

    <!-- زر الحفظ / Save button -->
    <div class="controls">
      <CustomButtonComponent
        class="controls-btn"
        :buttonType="'button'"
        :content="t('reset.save')"
        @click="resetPassword"
      />
    </div>
  </div>
</template>

<style scoped>
.container{
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 50px auto;
  padding: 50px;
  box-shadow: 1px 2px 4px var(--text-color);
  border-radius: 8px;

}

.container p{
  font-size: 18px;
  text-align: center;
}

.title{
  text-align: center;
  color: var(--main-color);
  margin-bottom:10px ;
}

.description{
  margin-bottom:30px ;
}

.change{
  font-weight: 500;
  margin-top: 30px;
  margin-bottom: 20px;
}

.container .verify-code,
.container .email{
    height: 40px;
    background-color: var(--placeholder-background);
    padding: 5px 10px;
    border: 1px solid var(--placeholder-background-content);
    border-radius: 5px;
    margin: 5px auto 15px ;
    text-align: center;
    outline: none;
    caret-color: var(--main-color);
    box-sizing: border-box;
}

.container .verify-code{
  width: 120px;
  font-size: 24px;
  letter-spacing: 3px;
}

.container .email {
  width: 350px;
  font-size: 20px;
  direction: ltr;
}

.container .verify-code:focus,
.container .email:focus{
    box-shadow: none;
    border: 2px solid var(--main-color);
}

.container .verify-code::placeholder {
  color: var(--placeholder-background-content);
  letter-spacing: 1px;
  font-size: 18px;
}

.password{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  margin: 0 auto 20px;
}

.password .pass{
  width: 300px;
}

.container .resend-code{
    font-size: 12px;
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
}

.controls{
  text-align: center;
  margin-top: 30px;
}

.controls .controls-btn {
  background-color: var(--controls-color);
  font-size: 18px;
  width: 100px;
  height: 45px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.lab {
  font-weight: 500;
  color: var(--text-color);
}

@media(max-width:1199px) and (min-width:991px){
    .container{
    width: 70%;
  }
  .password{
    width: 80%;
  }
}

/* التكيف مع الشاشات المختلفة / Responsive design */
@media(max-width:991px) and (min-width:768px){
  .password{
    width: 95%;
  }

  .password .pass{
    width: 250px;
    font-size: 16px;
  }

  .password .lab {
    font-size: 14px;
  }

  .container .verify-code
  .container .email{
    font-size: 27px;
    height: 40px;
  }

  .container .verify-code{
    width: 125px;
    letter-spacing: 2px;
  }


  .container .verify-code::placeholder,
  .container .email::placeholder {
      font-size: 12px;
  }


  :deep(.password input[type="password"]) {
    font-size: 16px;
  }
}

@media(max-width:767px){
  .container{
    width: 90%;
    box-shadow: none;
    margin: 20px auto;
    padding: 20px;
  }

  .title{
    font-size: 24px;
  }

  .description{
    font-size: 14px;
  }

  .change{
    font-size: 16px;
  }

  .password{
    flex-direction: column;
    row-gap: 10px;
    margin-bottom: 20px;
  }

  .password .pass{
    width: 100%;
    max-width: 300px;
  }

  .container .verify-code,
  .container .email {
    font-size: 18px;
    height: 35px;
    padding: 5px;
  }

  .container .verify-code{
    width: 100px;
    letter-spacing: 5px;
  }

  .container .email{
    width: 250px;
  }

  .container button{
    width: 60px;
  }

  .container .verify-code::placeholder,
  .container .email::placeholder {
    font-size: 14px;
  }

  .lab{
    font-size: 14px;
  }
  :deep(.password input[type="password"]) {
    font-size: 14px;
  }
}

:deep(.password input[type="password"]) {
  font-size: 18px;
}
</style>
