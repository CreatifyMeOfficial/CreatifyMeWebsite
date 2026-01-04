<script setup>
import UserCard from './userCard.vue'
import usersApi from '@/api/users'
import { onMounted, ref, watch, computed } from 'vue'
import spinner from '@/components/loadingSpinner.vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const users = ref([])
const page = ref(1)
const usersLimit = 4
const totalUsers = ref(0)
const userCardRefs = ref([])
const isLoadingUsers = ref(true)

const direction = computed(() => {
  return locale.value === 'ar' ? 'rtl' : 'ltr'
})

async function loadUsers() {
  try {
    const response = await usersApi.getUsers({
      page: page.value,
      limit: usersLimit,
    })
    if (response.status === 200) {
      users.value = response.data.users
      totalUsers.value = response.data.total
      // Reset needUpdate for all cards when page changes
      userCardRefs.value.forEach((card) => card?.resetNeedUpdate())
    }
    isLoadingUsers.value = false
  } catch {
    return
  }
}

function handleCardSelected(currentCard) {
  // Reset needUpdate for all cards except the current one
  userCardRefs.value.forEach((card) => {
    if (card.$el !== currentCard) {
      card?.resetNeedUpdate()
    }
  })
}

async function refreshPage() {
  users.value = []
  await loadUsers()
}

onMounted(async () => {
  await loadUsers()
})

watch(page, async (newPage) => {
  page.value = newPage
  await loadUsers()
})

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // This makes it animate nicely instead of jumping
  })
  let container = document.getElementById('usersContainer')
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
  <div class="users-container" id="usersContainer">
    <UserCard
      v-for="user in users"
      :key="user._id"
      :userId="user._id"
      :userName="user.userName"
      :profileImage="user.image"
      :role="user.role"
      @cardSelected="handleCardSelected"
      @roleChanged="refreshPage"
      ref="userCardRefs"
    ></UserCard>
    <spinner v-show="isLoadingUsers"></spinner>
    <div class="controls" v-show="!isLoadingUsers" :dir="direction">
      <button :class="{ disabled: page <= 1 }" @click="previousPage">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <span>
        {{ page }}
      </span>
      <button :class="{ disabled: page * usersLimit >= totalUsers }" @click="nextPage">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.users-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  row-gap: 25px;
  box-sizing: border-box;
  position: relative;
}

.users-container .controls {
  display: flex;
  align-items: center;
  gap: 25px;
}

.users-container .controls span {
  font-weight: bold;
}

.users-container .controls button {
  background-color: var(--controls-color);
  outline: none;
  border: none;
  padding: 2px 10px;
  box-shadow: 1px 1px 2px 0 var(--text-color);
  border-radius: 2px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.users-container .controls button.disabled {
  opacity: 0.6;
  pointer-events: none;
  cursor: not-allowed;
}

.users-container .controls button:hover {
  scale: 1.02;
}

[dir='rtl'] .fa-chevron-left,
[dir='rtl'] .fa-chevron-right {
  transform: scaleX(-1);
}

@media (max-width: 767px) {
  .users-container {
    padding: 25px;
    margin: auto;
  }
}
</style>
