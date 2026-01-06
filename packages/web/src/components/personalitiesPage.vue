<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import personalityCard from './personalityCard.vue'
import personalitiesApi from '@/api/personalities'
import spinner from '@/components/loadingSpinner.vue'

const personalities = ref([])
const page = ref(1)
const personalitiesLimit = 10
const personalitiesTotal = ref(0)
// This will hold references to all personalityCard components
const cardRefs = ref([])
const isLoadingPersonality = ref(true)

const language = computed(() => {
  return localStorage.getItem('userLanguage')
})

function cardFocus(payload) {
  // Close all other popups except the one that triggered the event
  cardRefs.value.forEach((card) => {
    if (card.$el !== payload) {
      card?.closePopup()
    }
  })
}

async function loadPersonalities() {
  try {
    isLoadingPersonality.value = true
    const response = await personalitiesApi.getPersonalities({
      language: language.value,
      page: page.value,
      limit: personalitiesLimit,
    })
    personalities.value = response.data.personalities
    personalitiesTotal.value = response.data.personalitiesTotal
    isLoadingPersonality.value = false
  } catch {
    return
  }
}

function tagAdded(tag, tagId, personalityId) {
  const personality = personalities.value.find((p) => p._id === personalityId)
  personality.tags.push({ tag: tag, _id: tagId })
}

function tagRemoved(tag, personalityId) {
  const personality = personalities.value.find((p) => p._id === personalityId)
  // Find the index of the tag object with the matching tag value
  const tagIndex = personality.tags.findIndex((t) => t.tag === tag)
  if (tagIndex !== -1) {
    personality.tags.splice(tagIndex, 1)
  }
}

onMounted(async () => {
  await loadPersonalities()
})

watch(page, async (newPage) => {
  page.value = newPage
  await loadPersonalities()
})

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // This makes it animate nicely instead of jumping
  })
  let container = document.getElementById('personalitiesContainer')
  container.scrollTop = 0
}

function nextPage() {
  page.value++
  scrollToTop()
}

function previousPage() {
  page.value--
  scrollToTop()
}
</script>
<template>
  <div class="container" id="personalitiesContainer">
    <personalityCard
      v-for="personality in personalities"
      :key="personality._id"
      :id="personality._id"
      :code="personality.code"
      :description="personality.description"
      :tags="personality.tags"
      v-show="!isLoadingPersonality"
      ref="cardRefs"
      @focus="cardFocus"
      @tagAdded="tagAdded"
      @tagRemoved="tagRemoved"
    ></personalityCard>
    <spinner v-show="isLoadingPersonality"></spinner>
    <div class="controls" v-if="personalities.length !== 0 && !isLoadingPersonality" :dir="direction">
      <button :class="{ disabled: page <= 1 }" @click="previousPage">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <span>
        {{ page }}
      </span>
      <button :class="{ disabled: page >= personalitiesTotal / 10 }" @click="nextPage">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 80%;
  height: 100vh;
  display: flex;
  margin: 0px auto;
  padding: 25px 0;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 25px;
  overflow-y: scroll;
  position: relative;
}

.controls {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 25px;
  margin: 25px 0;
  justify-content: center;
  direction: ltr;
}

.controls span {
  font-weight: bold;
}

.controls button {
  background-color: var(--controls-color);
  outline: none;
  border: none;
  padding: 2px 10px;
  box-shadow: 1px 1px 2px 0 var(--text-color);
  border-radius: 2px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  width: 30px;
  height: 30px;

}

.controls button.disabled {
  opacity: 0.6;
  pointer-events: none;
  cursor: not-allowed;
}

.controls button:hover {
  scale: 1.02;
}

[dir='rtl'] .fa-chevron-left,
[dir='rtl'] .fa-chevron-right {
  transform: scaleX(-1);
}

@media (max-width: 767px) {
  .controls button {
  width: 25px;
  height: 25px;
  }

  .container {
    width: 90%;
  }
}
</style>
