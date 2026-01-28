<script setup>
import authApi from '@/api/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import customButtonComponent from '@/components/customButtonComponent.vue'
import passwordInput from '@/components/passwordInput.vue'
import { useI18n } from 'vue-i18n'
import PasswordValidator from 'password-validator'
import createNotification from '@/notification/notification'
import notificationTypes from '@/enums/notificationTypes'

const { t } = useI18n()

const userStore = useUserStore()

const formData = ref({
  emailOrUsername: '',
  password: '',
})

const router = useRouter()

const login = async (e) => {
  e.preventDefault()
  const passwordSchema = new PasswordValidator()
  passwordSchema
    .is()
    .min(10)
    .max(50)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits()
    .has()
    .symbols()
    .has()
    .not()
    .spaces()
  if (passwordSchema.validate(formData.value.password)) {
    try {
      const response = await authApi.login({
        emailOrUsername: formData.value.emailOrUsername,
        password: formData.value.password,
      })
      if (response.status === 200) {
        userStore.fetchUser()
        router.push('/')
      }
    } catch {
      return
    }
  } else {
    createNotification(t('validateUser.passwordWarning'), notificationTypes.Warning, 5)
  }
}
</script>

<template>
  <!--
    Main form container with flex layout to position form elements and logo side by side.
    On mobile devices, the logo is hidden and the form takes full width.
  -->
  <form @submit.prevent="login">
    <!-- Container for all login information elements -->
    <div class="userLogin-info-container">
      <!-- Form heading -->
      <span class="section-title">{{ t('formData.login') }}</span>

      <!-- Grid container for form fields and controls -->
      <div class="userLogin-info">
        <!-- Email/Username field -->
        <label for="">{{ t('login.or') }}</label>
        <input type="text" v-model="formData.emailOrUsername" dir="ltr" required />

        <!-- Password field -->
        <label for="">{{ t('formData.password') }}</label>
        <passwordInput
          class="pass"
          v-model="formData.password"
          dir="ltr"
          :required="true"
        ></passwordInput>

        <!-- Password recovery link -->
        <p>
          {{ t('login.reminder') }}
          <RouterLink to="/resetPassword">{{ t('login.click') }}</RouterLink>
        </p>

        <div class="controls">
          <!-- Submit button -->
          <customButtonComponent
            class="login-btn"
            :buttonType="'submit'"
            :content="t('formData.login')"
          ></customButtonComponent>
        </div>

        <span class="signup-link">
          {{ t('login.create') }} <RouterLink to="/signup"> {{ t('formData.signup') }} </RouterLink>
        </span>
      </div>
    </div>

    <!-- Company logo displayed on the right side of the form (hidden on mobile) -->
    <img src="../assets/Images/secondaryLogo.svg" alt="Company Logo" />
  </form>
</template>

<style scoped>
/*
  Main form styling:
  - Centered on page with shadow effect
  - Fixed dimensions for desktop view
  - Flex layout to position form elements and logo
*/
form {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 1px 2px 4px var(--text-color);
  width: 900px;
  padding: 50px;
  margin: 100px auto;
  box-sizing: border-box;
}

/* Form heading styling */
.section-title {
  color: var(--main-color);
  font-size: 54px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  margin: 0 0 25px 0;
}

/* Container for login form elements */
.userLogin-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Grid layout for form fields */
.userLogin-info {
  width: 500px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
}

/* Label styling */
.userLogin-info label {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 500;
}

/* Input field base styling */
input {
  display: flex;
  align-items: center;
  width: 90%;
  height: 30px;
  box-sizing: border-box;
  line-height: 30px;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  border: none;
  box-shadow: 1px 1px 2px 0 var(--text-color);
  border-radius: 5px;
  margin-left: 0;
  outline: none;
  caret-color: var(--main-color);
  padding: 0px 15px;
  margin: auto;
}

.pass {
  width: 90%;
  margin: auto;
  direction: ltr;
}

/* Input focus state */
input:focus {
  box-shadow: none;
  border: 2px solid var(--main-color);
}

/* Paragraph styling for password recovery text */
p {
  grid-column: 1/3;
  display: block;
  text-align: center;
}

.controls {
  grid-column: 1/3;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Submit button styling */
.controls .login-btn {
  background-color: var(--controls-color);
  font-size: 18px;
  width: 150px;
}

/* Company logo styling */
img {
  width: 400px;
  height: 400px;
}

.signup-link {
  grid-column: 1/3;
  margin: 10px auto;
}

/*
  Responsive Design Breakpoints:
  The following media queries adjust the layout for different screen sizes
*/

/* Tablet view (max-width: 992px) */
@media (max-width: 992px) {
  form {
    width: 600px;
  }

  .section-title {
    font-size: 42px;
  }

  .userLogin-info {
    gap: 20px;
  }

  /* Hide logo on tablet view */
  img {
    display: none;
  }

  .controls .login-btn {
    font-size: 16px;
  }
}

/* Mobile view (max-width: 767px) */
@media (max-width: 767px) {
  form {
    width: 80%;
    border: none;
    box-shadow: none;
    margin: 50px auto;
    padding: 0;
  }

  .userLogin-info-container {
    width: 100%;
  }

  /* Adjust grid layout for mobile */
  .userLogin-info {
    width: fit-content;
    /* grid-template-rows: repeat(4, auto);
    grid-template-columns: auto 1fr; */
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: start;
  }

  /* Mobile label adjustments */
  .userLogin-info label {
    font-size: 12px;
    display: flex;
    height: 100%;
    align-items: center;
  }

  /* Mobile input field adjustments */
  .userLogin-info input {
    width: 250px;
    height: 23px;
    margin: 0;
    padding: 9px;
    font-size: 12px;
  }

  .pass {
    width: 250px;
    margin: 0;
  }

  /* Date input specific adjustments */
  input[type='date'] {
    font-size: 12px;
  }

  /* Mobile focus state */
  input:focus {
    border: 2px solid var(--main-color);
  }

  p {
    font-size: 13px;
  }

  .signup-link {
    font-size: 13px;
  }

  .controls {
    height: fit-content;
    width: 100%;
  }

  /* Mobile button adjustments */
  .controls .login-btn {
    font-size: 16px;
    width: 150px;
  }
}

* a {
  text-decoration: none;
  font-weight: 600;
  color: var(--main-color);
}
</style>
