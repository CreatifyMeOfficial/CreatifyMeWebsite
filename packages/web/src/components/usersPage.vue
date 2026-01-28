<script setup>
import UserCard from './userCard.vue';
import usersApi from '@/api/users';
import { onMounted, ref, watch, computed, onUnmounted } from 'vue';
import spinner from '@/components/loadingSpinner.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { locale } = useI18n();

const users = ref([]);
const page = ref(1);
const usersLimit = 4;
const totalUsers = ref(0);
const userCardRefs = ref([]);
const isLoadingUsers = ref(true);
const userSearch = ref();

const previousIcon = computed(() => {
  return 'fa-solid fa-chevron-left';
});

const nextIcon = computed(() => {
  return 'fa-solid fa-chevron-right';
});

onMounted(async () => {
  // استرجاع الصفحة من sessionStorage فقط عند الدخول
  const savedPage = sessionStorage.getItem('usersPage');
  page.value = savedPage ? parseInt(savedPage) : 1;
  await loadUsers();
});

watch(page, async (newPage) => {
  // حفظ الصفحة في sessionStorage
  sessionStorage.setItem('usersPage', newPage);
  await loadUsers();
});

onUnmounted(() => {
  sessionStorage.removeItem('usersPage');
});

const direction = computed(() => {
  return locale.value === 'ar' ? 'rtl' : 'ltr';
});

async function loadUsers() {
  try {
    isLoadingUsers.value = true;
    const response = await usersApi.getUsers({
      page: page.value,
      limit: usersLimit,
      userName: userSearch.value,
    });

    if (response.status === 200) {
      users.value = response.data.users;
      totalUsers.value = response.data.total;
      // Reset needUpdate for all cards when page changes
      userCardRefs.value.forEach((card) => card?.resetNeedUpdate());
    }
    isLoadingUsers.value = false;
  } catch {
    return;
  }
}

function handleCardSelected(currentCard) {
  // Reset needUpdate for all cards except the current one
  userCardRefs.value.forEach((card) => {
    if (card.$el !== currentCard) {
      card?.resetNeedUpdate();
    }
  });
}

async function refreshPage() {
  users.value = [];
  await loadUsers();
}

onMounted(async () => {
  await loadUsers();
});

watch(page, async (newPage) => {
  page.value = newPage;
  await loadUsers();
});

watch(userSearch, async (newVal) => {
  if (userSearch.value == "") {
    await loadUsers();
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // This makes it animate nicely instead of jumping
  });
  let container = document.getElementById('usersContainer');
  container.scrollTop = 0;
}

function nextPage() {
  page.value++;
  scrollToTop();
}

function previousPage() {
  page.value--;
  scrollToTop();
}
</script>

<template>
  <div class="users-container" id="usersContainer">
    <!-- Search input section -->
    <div class="search-part">
      <input type="text" class="input-search" @keypress.enter="loadUsers" :placeholder="t('search.placeholder')"
        v-model="userSearch" />
      <i class="fa-solid fa-magnifying-glass"></i>
    </div>
    <UserCard v-if="!isLoadingUsers" v-for="user in users" :key="user._id" :userId="user._id" :userName="user.userName"
      :profileImage="user.image" :role="user.role" :userSearch="user.userName" @cardSelected="handleCardSelected"
      @roleChanged="refreshPage" ref="userCardRefs"></UserCard>
    <spinner v-show="isLoadingUsers"></spinner>
    <div class="controls" v-show="!isLoadingUsers" :dir="direction">
      <button :class="{ disabled: page <= 1 }" @click="previousPage" class="prev-btn">
        <i :class="previousIcon"></i>
      </button>
      <span>
        {{ page }}
      </span>
      <button :class="{ disabled: page * usersLimit >= totalUsers }" @click="nextPage" class="next-btn">
        <i :class="nextIcon"></i>
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

/* Search input container styling */
.users-container .search-part {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
}

/* Search input field styling */
.users-container .search-part .input-search {
  width: 200px;
  height: 10px;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  border-radius: 15px;
  box-shadow: 1px 1px 2px 0 var(--text-color);
  color: var(--text-color);
  border: none;
  text-align: center;
  font-size: 18px;
  padding: 12px;
  background-color: var(--elements-color);
  margin: 20px 0;
  caret-color: var(--main-color);
}

.users-container .search-part .input-search:focus {
  box-shadow: none;
  border: 2px solid var(--main-color);
  outline: none;
}

/* Search placeholder text styling */
.users-container .search-part .input-search::placeholder {
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-style: italic;
}

/* Search icon styling */
.users-container .search-part i {
  position: absolute;
  left: calc(50% - 100px);
  color: var(--icon-color);
  padding: 5px;
  border-radius: 50%;
  font-size: 14px;
}


.users-container .controls {
  display: flex;
  align-items: center;
  gap: 25px;
  direction: ltr !important;
  /* إجبار الاتجاه من اليسار لليمين */
}

.prev-btn {
  grid-area: prev;
  justify-self: end;
}

.page-number {
  grid-area: page;
  font-weight: bold;
  font-size: 16px;
  min-width: 30px;
  text-align: center;
}

.next-btn {
  grid-area: next;
  justify-self: start;
}

/* إزالة أي تأثير لاتجاه RTL */
[dir='rtl'] .controls {
  direction: ltr !important;
  transform: none !important;
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
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
  transform: none !important;
}

@media (max-width: 767px) {
  .users-container .search-part .input-search {
    width: 150px;
    height: 5px;
    font-size: 14px;
    padding: 10px;
  }

  .users-container .search-part i {
    position: absolute;
    left: calc(50% - 75px);
    padding: 4px;
    font-size: 10px;
  }

  .users-container .search-part .input-search::placeholder {
    font-size: 12px;
  }

  .users-container .controls button {
    width: 25px;
    height: 25px;
  }

  .users-container {
    padding: 25px;
    margin: auto;
  }
}
</style>
