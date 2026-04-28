<script setup>
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import resultApi from '@/api/questions'
import paymentsApi from '@/api/payments'

const { t } = useI18n()
const result = ref([])
const description = ref({ ar: '', en: '' })
const isLoadingResult = ref(true)
const isNotificationBoxVisible = ref(false)
const notificationInfo = ref({ link: '', info: { ar: '', en: '' } })

// This is used to split the api result into the 5 sections
const resultSections = computed(() => [
  { key: 'keyTraits', contentKey: 'keyTraits', icon: 'fa-solid fa-fingerprint' },
  { key: 'strengths', contentKey: 'strengths', icon: 'fa-solid fa-bolt' },
  { key: 'manifestation', contentKey: 'manifestation', icon: 'fa-solid fa-mountain' },
  { key: 'selfDevelopment', contentKey: 'selfDevelopment', icon: 'fa-solid fa-seedling' },
  {
    key: 'careerRecommendation',
    contentKey: 'careerRecommendation',
    icon: 'fa-solid fa-briefcase',
  },
])

async function loadResult() {
  const response = await resultApi.getResult()
  if (response.status === 200) {
    result.value = response.data.result
    description.value = {
      ar: result.value['arabicDescription'],
      en: result.value['englishDescription'],
    }
    isLoadingResult.value = false
  } else if (response.status === 401) {
    isNotificationBoxVisible.value = true
    // Is action determine if the value has a function that need execution or not.
    notificationInfo.value = {
      isAction: false,
      link: '/signup',
      info: { ar: 'الرجاء تسجيل الدخول أولاً', en: 'Please sign up first' },
    }
  } else if (response.status === 404) {
    isNotificationBoxVisible.value = true
    notificationInfo.value = {
      isAction: false,
      link: '/test',
      info: { ar: 'الرجاء إجراء الإختبار أولاً', en: 'Please take the test first' },
    }
  } else if (response.status === 402) {
    isNotificationBoxVisible.value = true
    notificationInfo.value = {
      isAction: true,
      action: async () => {
        const res = await paymentsApi.createOrder()
        window.location.href = res.data.url
      },
      info: { ar: 'الرجاء دفع الرسوم أولاً', en: 'Please pay the fees first' },
    }
  }
}

const resultField = computed(() => {
  return localStorage.getItem('userLanguage') === 'ar' ? 'ar' : 'en'
})

// Check if this point has 4 sections not 3
const hasExtraSection = computed(() => {
  const d = description.value[resultField.value]
  return d && d[3]
})

function asPoints(value) {
  // Check if the value is an array then remove any falsy values and return the clean array.
  if (Array.isArray(value)) return value.filter(Boolean)
  // Check if the value is a single value not an array then check if it is not empty or undefined then return it in an array.
  if (value != null && value !== '') return [String(value)]
  return []
}

onMounted(async () => {
  await loadResult()
})
</script>

<template>
  <div class="result-page">
    <template v-if="isLoadingResult && !isNotificationBoxVisible">
      <div class="skeleton skeleton-title" />
      <div class="skeleton skeleton-divider" />
      <div class="result-cards">
        <div class="skeleton-card" v-for="n in 6" :key="n">
          <div class="skeleton skeleton-card-title" />
          <div class="skeleton skeleton-point" v-for="i in 4" :key="i" />
        </div>
      </div>
    </template>

    <template v-else-if="!isNotificationBoxVisible">
      <h1 class="result-title">{{ result.code }}</h1>
      <div class="result-divider" />

      <div class="result-cards">
        <section class="result-card" v-for="section in resultSections" :key="section.key">
          <h2 class="result-card-title">
            <i :class="section.icon" class="result-card-icon" aria-hidden="true"></i>
            {{ t(`testResult.${section.key}`) }}
          </h2>
          <ul class="result-card-points">
            <li
              v-for="(point, i) in asPoints(description[resultField][section.contentKey])"
              :key="i"
              class="result-card-point"
            >
              {{ point }}
            </li>
          </ul>
        </section>
        <section class="result-card" v-if="hasExtraSection">
          <p class="result-card-content">{{ description[resultField][3] }}</p>
        </section>
      </div>
    </template>
  </div>

  <div class="notification-box" v-show="isNotificationBoxVisible">
    <p>{{ notificationInfo.info[resultField] }}</p>
    <router-link class="ok-btn" :to="notificationInfo.link" v-if="!notificationInfo.isAction">{{
      t('buttons.ok')
    }}</router-link>
    <button class="ok-btn" @click="notificationInfo.action" v-if="notificationInfo.isAction">
      {{ t('buttons.ok') }}
    </button>
  </div>
</template>

<style scoped>
.result-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 1.5rem 0;
  width: 100%;
  min-height: 60vh;
}

.result-title {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: var(--main-color);
  text-align: center;
  letter-spacing: 0.02em;
}

.result-divider {
  width: min(55%, 200px);
  height: 4px;
  margin: 1.25rem auto 2rem;
  background: linear-gradient(90deg, transparent, var(--main-color), transparent);
  border-radius: 2px;
}

.result-cards {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
  width: 100%;
  text-align: start;
}

.result-card {
  padding: 1.25rem 1.5rem;
  background: var(--elements-color);
  border-radius: 12px;
  border: 1px solid rgba(90, 72, 158, 0.12);
  box-shadow: 0 2px 8px rgba(90, 72, 158, 0.06);
  width: 40%;
  box-sizing: border-box;
}

.result-card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.3;
}

.result-card-icon {
  font-size: 1.125rem;
  color: var(--main-color);
  flex-shrink: 0;
}

.result-card-points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.result-card-point {
  padding: 0.5rem 0.75rem;
  padding-inline-start: 1rem;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-color);
  background: var(--background-color);
  border-radius: 8px;
  border-inline-start: 3px solid var(--main-color);
  box-shadow: 0 1px 2px rgba(90, 72, 158, 0.06);
}

.result-card-content {
  margin: 0;
  font-size: 1rem;
  line-height: 1.65;
  color: var(--text-color);
  white-space: pre-wrap;
}

/* Skeleton loading */
.skeleton {
  background: linear-gradient(
    105deg,
    var(--placeholder-background) 0%,
    var(--placeholder-background-content) 50%,
    var(--placeholder-background) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.2s ease-in-out infinite;
  border-radius: 8px;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.skeleton-title {
  width: min(40%, 180px);
  height: 32px;
  margin: 0 auto;
  border-radius: 10px;
}

.skeleton-divider {
  width: min(55%, 200px);
  height: 4px;
  margin: 1.25rem auto 2rem;
  background: var(--placeholder-background);
  border-radius: 2px;
  animation: none;
}

.skeleton-card {
  padding: 1.25rem 1.5rem;
  background: var(--elements-color);
  border-radius: 12px;
  border: 1px solid rgba(90, 72, 158, 0.12);
  box-shadow: 0 2px 8px rgba(90, 72, 158, 0.06);
  width: 40%;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.skeleton-card-title {
  width: 45%;
  height: 22px;
  border-radius: 6px;
}

.skeleton-point {
  height: 48px;
  border-radius: 8px;
}

/* Notification */
.notification-box {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(22, 23, 25, 0.4);
  z-index: 100;
}

.notification-box::before {
  content: '';
  position: absolute;
  inset: 0;
}

.notification-box p {
  position: relative;
  z-index: 1;
  margin: 0 0 1.25rem;
  padding: 1.5rem 2rem;
  background: var(--background-color);
  border: 2px solid var(--main-color);
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
  color: var(--text-color);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.notification-box .ok-btn {
  position: relative;
  z-index: 1;
  min-width: 80px;
  padding: 0.5rem 1.25rem;
  background: var(--controls-color);
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-color);
  text-decoration: none;
  text-align: center;
  transition:
    filter 0.2s,
    transform 0.1s;
}

.notification-box .ok-btn:hover {
  filter: brightness(1.05);
}

.notification-box .ok-btn:active {
  transform: scale(0.98);
}

@media (max-width: 767px) {
  .result-page {
    padding: 0.75rem 0;
    min-height: auto;
  }

  .result-title {
    font-size: 1.375rem;
    padding: 0 0.25rem;
  }

  .result-divider {
    margin: 0.75rem auto 1.25rem;
  }

  .result-cards {
    gap: 1rem;
  }

  .result-card {
    padding: 1rem 1rem;
    min-width: 320px;
  }

  .result-card-title {
    font-size: 1.0625rem;
    margin-bottom: 0.5rem;
    gap: 0.375rem;
  }

  .result-card-icon {
    font-size: 1rem;
  }

  .result-card-points {
    gap: 0.5rem;
  }

  .result-card-point {
    padding: 0.5rem 0.625rem;
    padding-inline-start: 0.75rem;
    font-size: 0.9375rem;
    line-height: 1.55;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .result-card-content {
    font-size: 0.9375rem;
  }

  .skeleton-title {
    width: min(50%, 140px);
  }

  .skeleton-divider {
    margin: 0.75rem auto 1.25rem;
  }

  .skeleton-card {
    padding: 1rem 1rem;
    min-width: 300px;
    gap: 0.5rem;
  }

  .skeleton-card-title {
    height: 20px;
  }

  .skeleton-point {
    height: 44px;
  }

  .notification-box {
    padding: 1rem;
  }

  .notification-box p {
    font-size: 0.9375rem;
    padding: 1rem 1.25rem;
    margin-bottom: 1rem;
    max-width: 100%;
  }

  .notification-box .ok-btn {
    font-size: 0.9375rem;
    padding: 0.5rem 1rem;
    min-width: 72px;
  }
}
</style>
