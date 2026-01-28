<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import authApi from '@/api/auth'
import customButtonComponent from '@/components/customButtonComponent.vue'
import passwordInput from '@/components/passwordInput.vue'
import IntlTelInput from 'intl-tel-input/vueWithUtils'
import 'intl-tel-input/styles'
import { useI18n } from 'vue-i18n'
import createNotification from '@/notification/notification'
import notificationTypes from '@/enums/notificationTypes'
import validateUser from '@/helperMethods/validateUser'

const { t } = useI18n()

const formData = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  countryKey: '',
  phone: '',
  birthDate: '',
})

const userStore = useUserStore()
const router = useRouter()

const countryChanged = (country) => {
  formData.value.countryKey = country
}

const Register = async (e) => {
  const userState = validateUser({
    firstName: formData.value.firstName,
    lastName: formData.value.lastName,
    userName: formData.value.username,
    email: formData.value.email,
    password: formData.value.password,
    confirmPassword: formData.value.confirmPassword,
    countryKey: formData.value.countryKey,
    phone: formData.value.phone,
    birthDate: formData.value.birthDate,
  }, t)
  e.preventDefault()
  if (!userState.state) {
    createNotification(userState.msg, notificationTypes.Warning, 5)
    return
  }
  try {
    const response = await authApi.register({
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      userName: formData.value.username,
      email: formData.value.email,
      password: formData.value.password,
      confirmPassword: formData.value.confirmPassword,
      countryKey: formData.value.countryKey,
      phone: formData.value.phone,
      birthDate: formData.value.birthDate,
    })

    if (response.status === 201) {
      userStore.fetchUser()
      router.push('/verifyEmail')
    }
  } catch {
    return
  }
}
</script>

<template>
  <!-- Main form container with centered alignment and shadow effect -->
  <form @submit.prevent="Register">
    <!-- Form title -->
    <span class="section-title">{{ t('formData.signup') }}</span>

    <!-- Container for form fields and logo -->
    <div class="user-info-container">
      <!-- Grid layout for user information fields -->
      <div class="user-info">
        <!-- First Name input field -->
        <label for="">{{ t('signup.firstName') }}</label>
        <input type="text" v-model="formData.firstName" dir="ltr" required />

        <!-- Last Name input field -->
        <label for="">{{ t('signup.lastName') }}</label>
        <input type="text" v-model="formData.lastName" dir="ltr" required />

        <!-- Username input field -->
        <label for="">{{ t('signup.userName') }}</label>
        <input type="text" v-model="formData.username" dir="ltr" required />

        <!-- Email input field with built-in format validation -->
        <label for="">{{ t('signup.email') }}</label>
        <input type="email" v-model="formData.email" dir="ltr" required />

        <!-- Password field (hidden input) -->
        <label for="">{{ t('formData.password') }}</label>
        <passwordInput
          class="pass"
          v-model="formData.password"
          dir="ltr"
          :required="true"
        ></passwordInput>

        <!-- Password confirmation field -->
        <label for="">{{ t('signup.confirmPassword') }} </label>
        <passwordInput
          class="pass"
          v-model="formData.confirmPassword"
          :required="true"
          dir="ltr"
        ></passwordInput>

        <!-- Phone number field -->
        <label for="">{{ t('signup.phone') }}</label>
        <!-- <input type="phone" v-model="formData.phone" id="phone" name="phone" required /> -->
        <IntlTelInput
          :options="{
            strictMode: true,
            separateDialCode: true,
          }"
          type="tel"
          v-model="formData.phone"
          name="phone"
          required
          dir="ltr"
          @changeCountry="countryChanged"
        />

        <!-- Date picker for date of birth -->
        <label for="">{{ t('signup.date') }} </label>
        <input type="date" v-model="formData.birthDate" required />

        <div class="controls">
          <!-- Form submission button -->
          <customButtonComponent
            class="controls-btn"
            :buttonType="'submit'"
            :content="t('signup.signupBtn')"
            dir="ltr"
          ></customButtonComponent>
        </div>

        <span class="login-link">
          {{ t('signup.warn') }} <RouterLink to="/login"> {{ t('formData.login') }} </RouterLink>
        </span>
      </div>

      <!-- Company/application logo displayed alongside the form -->
      <img src="../assets/Images/secondaryLogo.svg" alt="Company Logo" />
    </div>
  </form>
</template>

<style scoped>
/* Main form styling */
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  box-shadow: 1px 2px 4px var(--text-color);
  width: 900px;
  padding: 50px;
  margin: 100px auto;
  box-sizing: border-box;
}

/* Form title styling */
.section-title {
  color: var(--main-color);
  font-size: 54px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  margin: 0 0 25px 0;
}

/* Container for form fields and logo */
.user-info-container {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}

/* Grid layout for form fields */
.user-info {
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
  position: relative;
  margin-bottom: 25px;
}

/* Label styling */
.user-info label {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 500;
}

/* Base input field styling */
input {
  display: flex;
  align-items: center;
  width: 300px;
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
  width: 300px;
  margin: auto;
  direction: ltr;
}

/* Focus state for input fields */
input:focus {
  box-shadow: none;
  border: 2px solid var(--main-color);
}

/* Special styling for date input */
input[type='date'] {
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
}

/* Date picker icon styling */
input[type='date']::-webkit-calendar-picker-indicator {
  padding: 5px;
  cursor: pointer;
  border-radius: 3px;
}

/* Logo image styling */
img {
  width: 250px;
  margin-bottom: 50px;
}

.controls {
  height: 60px;
  grid-column: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Submit button styling */
.controls .controls-btn {
  background-color: var(--controls-color);
  font-size: 18px;
  width: 100px;
}

.login-link {
  grid-column: 2;
  text-align: center;
}

.login-link a {
  font-weight: 600;
  text-decoration: none;
  color: var(--main-color);
}

/*
 * Responsive Design Breakpoints
 *
 * These media queries adapt the signup form layout for different screen sizes,
 * ensuring optimal usability across devices from desktop to mobile.
 */

/*
 * Tablet Breakpoint (max-width: 992px)
 * Adjusts the form for medium-sized screens like tablets
 */
@media (max-width: 992px) {
  /*
   * Form container adjustments:
   * - Reduces width to better fit tablet screens
   * - Slightly increases height to accommodate layout changes
   */
  form {
    width: 600px;
  }

  .section-title {
    font-size: 42px;
  }

  /*
   * User info grid adjustments:
   * - Increases gap between form elements for better touch target sizing
   */
  .user-info {
    gap: 20px;
  }

  /*
   * Hides the logo image to prioritize form content on smaller screens
   */
  img {
    display: none;
  }

  .controls {
    grid-column: 1/3;
  }

  /*
   * Button repositioning:
   * - Moves button to bottom left for better thumb reachability
   * - Adjusts bottom positioning to accommodate layout changes
   */

  .controls .controls-btn {
    font-size: 16px;
  }

  .login-link {
    grid-column: 1/3;
  }
}

/*
 * Mobile Breakpoint (max-width: 620px)
 * Optimizes the form for small screens (mobile phones)
 */
@media (max-width: 767px) {
  /*
   * Form container adjustments:
   * - Further reduces width for mobile screens
   * - Adjusts height to fit content
   * - Removes border and shadow for cleaner mobile appearance
   * - Centers form with auto margins
   * - Adjusts right padding for better spacing
   */
  form {
    width: 80%;
    border: none;
    box-shadow: none;
    margin: 50px auto;
    padding: 0;
  }

  /*
   * User info grid adjustments:
   * - Reduces gap between elements to fit more content vertically
   */
  .user-info {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: start;
    width: fit-content;
    /* grid-template-columns: 1fr;
    grid-template-rows: repeat(18, auto); */
    gap: 15px;
  }

  /*
   * Label adjustments:
   * - Reduces font size for mobile screens
   * - Aligns labels vertically centered with inputs
   */
  .user-info label {
    font-size: 12px;
    display: flex;
    height: 100%;
    /* align-items: center; */
  }

  /*
   * Input field adjustments:
   * - Reduces width and height for mobile screens
   * - Adds subtle border for better visibility
   */
  input {
    margin: 0;
    width: 250px;
    height: 23px;
    font-size: 12px;
  }

  .pass {
    width: 250px;
    margin: 0;
  }

  /*
   * Date input specific adjustments:
   * - Reduces font size to match other inputs
   */
  input[type='date'] {
    font-size: 12px;
  }

  /*
   * Focus state adjustment:
   * - Reduces border thickness on focus for mobile
   */
  input:focus {
    border: 2px solid var(--main-color);
  }

  .user-info-container .user-info .controls {
    width: 100%;
  }

  /*
   * Button adjustments:
   * - Reduces width and font size for mobile
   * - Adjusts padding for better proportions
   * - Repositions closer to inputs for better flow
   * - Maintains font weight for readability
   */

  .controls .controls-btn {
    font-size: 14px;
    width: 75px;
  }

  .login-link {
    grid-column: 1/3;
    font-size: 14px;
  }
}
</style>
