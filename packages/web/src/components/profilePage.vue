<script setup>
import { onMounted, ref, nextTick } from 'vue'
import customButtonComponent from './customButtonComponent.vue'
import authApi from '@/api/auth'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'
import { parsePhoneNumberWithError } from 'libphonenumber-js'
import IntlTelInput from 'intl-tel-input/vue'
import 'intl-tel-input/styles'

const phoneInput = ref(null)
const fileInput = ref(null)

const { t } = useI18n()
const userInfo = ref({})
const formattedBirthDate = ref('')
const phone = ref('')
const userStore = useUserStore()

const countryChanged = (country) => {
  userInfo.value.countryKey = country
}

async function loadUser() {
  try {
    const response = await authApi.getUser()
    if (response.data.user) {
      userInfo.value = response.data.user
      formattedBirthDate.value = formatDateForInput(userInfo.value.birthDate)

      if (userInfo.value.phone) {
        const parsed = parsePhoneNumberWithError(userInfo.value.phone)
        phone.value = parsed.nationalNumber

        await nextTick()
        if (phoneInput.value?.instance) {
          phoneInput.value.instance.setCountry(parsed.country.toLowerCase())
        }
      }
    }
  } catch {
    return
  }
}

function formatDateForInput(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

async function updateUser(e) {
  e.preventDefault()
  try {
    const response = await authApi.updateUser({
      firstName: userInfo.value.firstName,
      lastName: userInfo.value.lastName,
      birthDate: formattedBirthDate.value,
      phone: phone.value,
      countryKey: userInfo.value.countryKey,
    })
  } catch {
    return
  }
}

function handleFileChange(event) {
  // Get the first file from the file dialog
  const file = event.target.files[0]
  if (file) {
    // Attach the image to form data
    const formData = new FormData()
    formData.append('file', file)
    updateImage(formData)
  }
}

async function updateImage(formData) {
  try {
    const response = await authApi.updateImage(formData)
    if (response.status === 200) {
      await loadUser()
      userStore.fetchUser()
    }
  } catch {
    return
  }
}

onMounted(loadUser)
</script>
<template>
  <div class="profile">
    <div v-if="userStore.user && !userStore.user.isVerified" class="verification-warning">
      <i class="fa-solid fa-circle-exclamation"></i>
      <p>
        {{ t('profile.verificationWarning') }}<router-link to="/verifyEmail"> {{ t('profile.verificationLink') }}</router-link>
      </p>

    </div>
    <div class="profile-container">
      <div class="icon">
        <img :src="userInfo?.image" alt="" />
        <input
          type="file"
          style="display: none"
          ref="fileInput"
          v-on:change="handleFileChange"
          accept="*.png,*.jpg"
        />

        <input type="file" style="display: none" ref="fileInput" v-on:change="handleFileChange" />
        <button @click="fileInput.click()">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      </div>
      <div class="border"></div>
      <div class="info">
        <span class="description"> {{ t('profile.title') }} </span>
        <form @submit.prevent="updateUser">
          <div class="inputs">
            <label for="first">{{ t('profile.firstName') }}</label>
            <input type="text" name="" id="first" v-model="userInfo.firstName" />
          </div>
          <div class="inputs">
            <label for="last">{{ t('profile.lastName') }}</label>
            <input type="text" name="" id="last" v-model="userInfo.lastName" />
          </div>
          <div class="inputs">
            <label for="birth">{{ t('profile.birthday') }}</label>
            <input type="date" name="" id="birth" v-model="formattedBirthDate" />
          </div>
          <div class="inputs">
            <label for="">{{ t('profile.phoneNumber') }}</label>
            <IntlTelInput
              ref="phoneInput"
              :options="{
                strictMode: true,
                nationalMode: true,
              }"
              v-model="phone"
              type="tel"
              name="phone"
              required
              @changeCountry="countryChanged"
            />
          </div>
          <div class="buttons">
            <customButtonComponent
              class="cancel"
              :buttonType="'button'"
              :content="t('buttons.cancel')"
              @click="loadUser"
            ></customButtonComponent>
            <customButtonComponent
              class="save"
              :buttonType="'submit'"
              :content="t('buttons.save')"
            ></customButtonComponent>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
.profile {
  margin: 0 auto;
  padding: 0;
  width: 100%;
}

.verification-warning {
  background-color: var(--secondary-color);
  width: 100%;
  box-sizing: border-box;
  padding: 3px ;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border-bottom-right-radius:10px; */
  margin: auto;
}

.verification-warning i{
  color: var(--controls-color);
  font-size: 16px;
  margin: 0 5px;
}

.verification-warning p {
  /* margin: 0 5px; */
  color: var(--background-color);
  font-size: 10px;
  /* padding-right:10px ; */
}

.verification-warning a {
  color: var(--controls-color);
  font-weight: 500;
  text-decoration-color: var(--main-color);
  font-size: 12px;
  padding: 0 10px;
}

.profile-container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
  width: 75%;
  margin: 0 auto;
  position: relative;
  padding: 25px 0;
}

.profile-container .icon {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid var(--text-color);
  overflow: hidden;
}

.profile-container .icon img {
  width: 100%;
  height: 100%;
}

.profile-container .icon button {
  outline: none;
  background-color: transparent;
  border: none;
  position: absolute;
  width: 100%;
  text-align: center;
  left: 0;
  bottom: 0;
  height: 25px;
  background-color: var(--elements-color);
  cursor: pointer;
}

.profile-container .border {
  border-bottom: 2px solid var(--text-color);
  width: 40%;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.profile-container .info {
  text-align: left;
  width: 75%;
  max-width: 600px;
  margin-bottom: 10px;
}

.profile-container .info .description {
  font-size: 20px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  margin: 20px 0;
  display: block;
}

.profile-container .info form {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  gap: 15px;
}

.profile-container .info form .inputs {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom: 10px; */
}

.profile-container .info form .inputs input {
  width: 60%;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
  border: none;
  box-shadow: 1px 1px 2px 0 var(--text-color);
  border-radius: 5px;
  margin-left: 0;
  outline: none;
  caret-color: var(--main-color);
  padding: 3px 10px;
  caret-color: var(--main-color);
  padding: 3px 10px;
  text-align: left;
}

.info .inputs :deep(.iti) {
  width: calc(60% + 20px);
  display: block;
  position: relative;
}

.info .inputs :deep(.iti input) {
  width: 100% !important;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
  border: none;
  box-shadow: 1px 1px 2px 0 var(--text-color);
  border-radius: 5px;
  outline: none;
  caret-color: var(--main-color);
  padding: 3px 10px 3px 0; /* Extra left padding for the flag */
}

.info .inputs :deep(.iti__search-input) {
  text-align: center;
}

.info .inputs :deep(.iti input:focus) {
  box-shadow: none !important;
  border: solid 2px var(--main-color) !important;
}

.info .inputs :deep(.iti__dropdown-content) {
  position: relative;
}

.info .inputs :deep(.iti) {
  overflow: visible !important;
  direction: ltr;
}

* input:focus {
  box-shadow: none !important;
  border: solid 2px var(--main-color) !important;
}

.buttons {
  display: flex;
  width: 100%;
  justify-content: end;
  column-gap: 10px;
  padding: 10px;
}

.buttons .cancel {
  background-color: var(--controls-color);
  color: var(--text-color);
  width: 100px;
}
.buttons .save {
  background-color: var(--secondary-color);
  color: var(--background-color);
  width: 100px;
}

@media (min-width: 767px) and (max-width: 992px) {
  .buttons .save,
  .buttons .cancel {
    width: 70px;
  }
}

@media (max-width: 767px) {
  .profile-container {
    width: 100%;
    margin: 0 auto;
  }

  .verification-warning a{
    padding: 0 2px;
  }

  .profile-container .info {
    width: 80%;
  }

  .profile-container .info form {
    width: 100%;
  }

  .profile-container .info form .inputs {
    width: 100%;
    display: flex;
    min-height: 40px;
    /* grid-template-columns: auto 1fr; */
    justify-content: space-between;
    column-gap: 10px;
  }

  .profile-container .info form .inputs label {
    width: 30%;
    font-size: 14px;
  }

  .profile-container .info form .inputs input {
    width: 70%;
  }

  .info .inputs :deep(.iti) {
    width: 70%;
  }

  .info .inputs :deep(.iti__dropdown-content) {
    width: 100% !important;
  }

  .buttons .save,
  .buttons .cancel {
    width: 65px;
    font-size: 12px;
  }
}
</style>
