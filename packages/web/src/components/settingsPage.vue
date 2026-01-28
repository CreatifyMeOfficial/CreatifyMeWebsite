<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import customButtonComponent from './customButtonComponent.vue'
import PasswordInput from './passwordInput.vue'
import authApi from '@/api/auth'
import createNotification from '@/notification/notification'
import notificationTypes from '@/enums/notificationTypes'
import warningUp from '@/components/warningPopUp.vue'
const { t } = useI18n()

const { locale } = useI18n()
const userStore = useUserStore()

const receiveEmails = ref(userStore.user?.receiveEmails || false)

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const selectedLanguage = ref(locale.value)

const showWarning = ref(false)

// Function to update CSS direction based on language
const updateDirection = (language) => {
  const direction = language === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.style.setProperty('--direction', direction)
}

// Watch for language changes and update the locale and direction
watch(selectedLanguage, (newLang) => {
  locale.value = newLang
  updateDirection(newLang)
  // Save to localStorage for persistence
  localStorage.setItem('userLanguage', newLang)
})

watch(receiveEmails, async (newVal) => {
  const response = await authApi.toggleReceiveEmails({ receiveEmails: newVal })
  if (response.status === 200) {
    userStore.fetchUser()
  }
})

// Load saved language preference on component mount
const loadSavedLanguage = () => {
  const savedLanguage = localStorage.getItem('userLanguage')
  if (savedLanguage) {
    selectedLanguage.value = savedLanguage
    locale.value = savedLanguage
    updateDirection(savedLanguage)
  }
}

const updatePassword = async () => {
  if (
    oldPassword.value !== '' &&
    newPassword.value !== '' &&
    confirmPassword.value !== '' &&
    confirmPassword.value === newPassword.value &&
    newPassword.value !== oldPassword.value
  ) {
    const response = await authApi.updatePassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    })
    if (response.status === 200) {
      oldPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    }
  }
}

const deleteMyAccount = async () => {
  const response = await authApi.deleteMyAccount()
  if (response.status === 200) {
    userStore.clearUser()
  }
}

function openDeleteWarning(){
  showWarning.value = true
}
      // تأكيد الحذف
async function confirmDelete() {
  showWarning.value = false
  await deleteMyAccount()
}

function cancelDelete() {
  showWarning.value = false
}

// Initialize on mount
loadSavedLanguage()
</script>

<template>
  <!-- Main settings container -->
  <div class="settings-container">
    <!-- Language selection section -->
    <div class="settings-lang">
      <span>{{ t('settings.language.title') }}</span>
      <div class="lang-option">
        <div>
          <!-- English language radio button -->
          <input type="radio" name="selectLang" id="en" value="en" v-model="selectedLanguage" />
          <label for="en">English</label>
        </div>
        <div>
          <!-- Arabic language radio button -->
          <input type="radio" name="selectLang" id="ar" value="ar" v-model="selectedLanguage" />
          <label for="ar">العربية</label>
        </div>
      </div>
    </div>

    <!-- Notification preferences section -->
    <div class="settings-notific">
      <span>{{ t('settings.notifications.title') }}</span>
      <div class="notific-option">
        <!-- Notification toggle checkbox -->
        <input type="checkbox" v-model="receiveEmails" id="notific" />
        <label for="notific">{{ t('settings.notifications.description') }}</label>
      </div>
    </div>

    <!-- Password change section -->
    <div class="settings-pass">
      <span>{{ t('settings.password.title') }}</span>
      <div class="password-part">
        <!-- Old password input -->
        <label for="">{{ t('settings.password.oldPassword') }}</label>
        <PasswordInput class="password-input" v-model="oldPassword"></PasswordInput>
        <!-- New password input -->
        <label for="">{{ t('settings.password.newPassword') }}</label>
        <!-- <input type="text" name="" /> -->
        <PasswordInput class="password-input" v-model="newPassword"></PasswordInput>

        <!-- Confirm new password input -->
        <label for="">{{ t('settings.password.confirmPassword') }}</label>
        <PasswordInput class="password-input" v-model="confirmPassword"></PasswordInput>
      </div>
      <!-- Change password button -->
      <customButtonComponent
        class="change-btn"
        :buttonType="'button'"
        :content="t('buttons.change')"
        @click="updatePassword"
      ></customButtonComponent>
    </div>

    <!-- Account deletion section -->
    <div class="account-delete">
      <span>{{ t('settings.account.title') }}</span>
      <!-- Warning message about account deletion -->
      <p>{{ t('settings.account.deleteWarning') }}</p>
      <!-- Delete account button -->
      <customButtonComponent
        class="delete-btn"
        :buttonType="'button'"
        :content="t('buttons.delete')"
        @click="openDeleteWarning"
      ></customButtonComponent>
    </div>
    <warningUp
      v-if="showWarning"
      :message="t('warningMassage.deleteAccount')"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<style scoped>
/* Main container styling */
.settings-container {
  width: 65%;
  margin: 40px auto;
}

/* Common styling for all settings sections */
.settings-lang,
.settings-notific,
.settings-pass {
  border-bottom: 1px solid var(--text-color);
  margin: 0 auto;
  padding: 25px 0px;
}

/* Section title styling */
.settings-lang span,
.settings-notific span,
.settings-pass span,
.account-delete span {
  font-size: 20px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
}

/* Language options container */
.lang-option {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  margin: 10px 50px;
}

/* Individual language option */
.lang-option div {
  display: flex;
  align-items: center;
  column-gap: 10px;
}

/* Notification option styling */
.settings-notific .notific-option {
  display: flex;
  align-items: start;
  column-gap: 10px;
}

/* Radio button and checkbox styling */
.lang-option div input,
.settings-notific .notific-option input {
  margin: 5px 0 0 0;
  accent-color: var(--main-color);
  scale: 1.2;
}

/* Label styling for inputs */
.lang-option div label,
.settings-notific div label {
  font-size: 18px;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
}

/* Notification option container */
.settings-notific .notific-option {
  margin: 10px 50px;
}

/* Password change form grid layout */
.settings-pass .password-part {
  display: grid;
  width: 100%;
  margin: 10px 50px;
  grid-template-columns: auto 1fr;
  gap: 20px;
}

/* Password form labels */
.settings-pass .password-part label {
  width: fit-content;
  text-align: center;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
}

/* Password input fields */
.password-part .password-input {
  width: 70%;
  margin: auto;
  direction: ltr;
}

/* Button positioning in password and delete sections */
.settings-pass .change-btn,
.account-delete .delete-btn {
  display: block;
  margin: 20px auto 0;
  width: 100px;
}

/* Change password button colors */
.settings-pass .change-btn {
  background-color: var(--secondary-color);
  color: var(--elements-color);
}

/* Account deletion warning text */
.account-delete p {
  font-size: 18px;
  font-family: 'Montserrat', sans-serif;
  margin: 10px 50px;
}

/* Delete account button colors */
.account-delete .delete-btn {
  color: var(--elements-color);
  background-color: var(--danger-color);
}

@media (min-width: 767px) and (max-width: 992px) {
  .settings-pass .change-btn,
  .account-delete .delete-btn,
  .settings-btn .save-btn,
  .settings-btn .cancel-btn {
    width: 70px;
  }

  .settings-pass .password-part {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px 0;
    gap: 10px;
  }

  .password-part .password-input {
    width: 100%;
    max-width: 350px;
  }
}

/* Mobile responsive styles */
@media (max-width: 767px) {
  /* Adjust container width for mobile */
  .settings-container {
    width: 90%;
  }

  /* Smaller font sizes for mobile */
  .settings-lang span,
  .settings-notific span,
  .settings-pass span,
  .account-delete span {
    font-size: 14px;
  }

  .settings-lang .lang-option {
    margin: 10px 20px;
  }

  /* Adjust notification checkbox alignment */
  .settings-notific div {
    align-items: start;
  }

  .settings-notific div input {
    margin-top: 4px;
  }

  .settings-notific .notific-option {
    margin: 10px 20px;
  }

  /* Smaller radio buttons for mobile */
  .lang-option input {
    width: 8px;
    height: 8px;
  }

  /* Smaller checkbox for mobile */
  .settings-notific .notific-option input {
    margin: 0;
    scale: 1;
  }

  /* Smaller labels for mobile */
  .lang-option div label,
  .settings-notific div label,
  .settings-pass .password-part label {
    font-size: 12px;
  }

  /* Stack password fields vertically on mobile */
  .settings-pass .password-part {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px 0;
    gap: 10px;
  }

  /* Smaller password inputs for mobile */
  .password-part .password-input {
    width: 100%;
    max-width: 300px;
    margin: 0;
  }

  /* Smaller warning text for mobile */
  .account-delete p {
    font-size: 12px;
    margin: 10px 20px;
  }

  .settings-pass .change-btn,
  .account-delete .delete-btn,
  .settings-btn .save-btn,
  .settings-btn .cancel-btn {
    width: 65px;
  }
}
</style>
