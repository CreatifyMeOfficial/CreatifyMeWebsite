<script setup>
import Comment from '@/components/commentCard.vue'
import commentsApi from '@/api/comments'
import { onMounted, ref, watch, computed, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()

const user = ref(undefined)
watch(
  () => userStore.user,
  (newUser) => {
    user.value = newUser
  },
  { immediate: true },
)

const { locale } = useI18n()
const direction = computed(() => {
  return locale.value === 'ar' ? 'rtl' : 'ltr'
})

const { t } = useI18n()
const comments = ref([])
const page = ref(1)
const sortParams = ref('-createdAt')
const commentsLimit = 10
const commentsTotal = ref(0)
const myCommentsOnly = ref(false)
const commentCardRefs = ref([])
const isLoadingComments = ref(true)

// أضف computed للأيقونات
const previousIcon = computed(() => {
  return 'fa-solid fa-chevron-left'
})

const nextIcon = computed(() => {
  return 'fa-solid fa-chevron-right'
})

onMounted(async () => {
  const savedPage = sessionStorage.getItem('CommentsView')
  page.value = savedPage ? parseInt(savedPage) : 1
  await loadComments()
})

watch(page, async (newPage) => {
  sessionStorage.setItem('CommentsView', newPage)
})

onUnmounted(() => {
  sessionStorage.removeItem('CommentsView')
})

async function loadComments() {
  try {
    isLoadingComments.value = true
    comments.value = []
    let response = {}
    // Check to see which comments to load (all the comments, the users own comments only)
    if (myCommentsOnly.value) {
      response = await commentsApi.getMyComments({
        page: page.value,
        limit: commentsLimit,
        sort: sortParams.value,
      })
    } else {
      response = await commentsApi.getComments({
        page: page.value,
        limit: commentsLimit,
        sort: sortParams.value,
      })
    }
    comments.value = response.data.comments
    commentsTotal.value = response.data.commentsTotal
    isLoadingComments.value = false
  } catch {
    return
  }
}

function handleCardSelected(currentCard) {
  // Stop the edit on all the comment cards but the clicked card
  commentCardRefs.value.forEach((card) => {
    if (card.$el !== currentCard) {
      card.editStarted = false
    }
  })
}

onMounted(async () => {
  await loadComments()
})

watch(page, async (newPage) => {
  page.value = newPage
  await loadComments()
})

watch(sortParams, async (newSortParams) => {
  sortParams.value = newSortParams
  page.value = 1 // Reset the page to the first one to avoid users confusion
  await loadComments()
})

watch(myCommentsOnly, async (newVal) => {
  myCommentsOnly.value = newVal
  page.value = 1 // Reset the page to the first one to avoid getting blank pages when the myCommentsOnly is true and the user is currently on a page number higher than his total comments pages count
  await loadComments()
})

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // This makes it animate nicely instead of jumping
  })
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
  <div class="comments-container">
    <div class="sort-controls">
      <div class="ownership-select">
        <input type="checkbox" name="my-comments" id="myComments" v-model="myCommentsOnly" />
        <label for="myComments"> {{ t('comment.cheackBoxLabel') }} </label>
      </div>
      <div class="sel">
        <span>{{ t('comment.sort') }}</span>
        <select v-model="sortParams">
          <option value="-createdAt">{{ t('comment.newest') }}</option>
          <option value="createdAt">{{ t('comment.oldest') }}</option>
        </select>
        <span class="arrow"></span>
      </div>
    </div>
    <Comment
      v-for="comment in comments"
      :key="comment._id"
      :commentId="comment._id"
      :comment="comment.comment"
      :userImage="comment.createdBy.image"
      :userName="comment.createdBy.userName"
      :enableModification="user?.userName === comment.createdBy.userName"
      @commentDeleted="loadComments"
      @commentUpdated="loadComments"
      @cardSelected="handleCardSelected"
      ref="commentCardRefs"
    />
    <div class="message" v-if="comments.length === 0 && !isLoadingComments">
      <p class="message-attintion" v-if="!myCommentsOnly">{{ t('comment.messageOne') }}</p>
      <p class="message-attintion" v-if="myCommentsOnly">{{ t('comment.messageTwo') }}</p>
    </div>
    <template v-if="isLoadingComments">
      <div v-for="index in 10" :key="index" class="placeholder">
        <div class="right"></div>
        <div class="left"></div>
      </div>
    </template>
    <div class="controls" v-if="comments.length !== 0">
      <button :class="{ disabled: page <= 1 }" @click="previousPage" class="prev-btn">
        <i :class="previousIcon"></i>
      </button>
      <span class="page-number">
        {{ page }}
      </span>
      <button
        :class="{ disabled: page * commentsLimit >= commentsTotal }"
        @click="nextPage"
        class="next-btn"
      >
        <i :class="nextIcon"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.comments-container {
  width: 80%;
  padding: 25px 0;
  margin: 25px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
}

.sort-controls {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 16px;
  font-family: 'Poppins', sans-serif;
  color: var(--text-color);
  border-bottom: solid 2px var(--text-color);
}

.sort-controls .ownership-select {
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.sort-controls .ownership-select input[type='checkbox'] {
  accent-color: var(--main-color);
  scale: 1.2;
}

.sort-controls .ownership-select label {
  font-weight: 500;
  cursor: pointer;
  font-size: 16px;
}

.sort-controls .sel {
  display: flex;
  align-items: center;
  column-gap: 15px;
}
.sort-controls .sel select {
  font-size: 16px;
}

.sort-controls .sel span {
  font-weight: 500;
  font-size: 16px;
}

.comments-container .message {
  margin-top: 15%;
}

.comments-container .message-attintion {
  border: 1px solid var(--main-color);
  padding: 15px 25px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 22px;
  text-align: center;
}

.placeholder {
  display: flex;
  justify-content: space-between;
  text-align: center;
  align-items: center;
  width: 100%;
  height: 75px;
  box-sizing: border-box;
  background-color: var(--placeholder-background);
  border-radius: 12px;
  padding: 15px 10px;
}

.right {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--placeholder-background-content);
}

.left {
  margin: auto;
  width: 60%;
  height: 30px;
  border-radius: 5px;
  background-color: var(--placeholder-background-content);
}

select {
  padding: 5px 15px;
  text-align: center;
  background-color: var(--background-color);
  border-radius: 6px;
  border: 0.5px solid black;
  box-shadow: 1px 1px 2px 0 var(--text-color);
}

select:focus {
  outline: none;
}

.controls {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 25px;
  margin: 25px 0;
  justify-content: center;
  direction: ltr !important;
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
}

.controls button.disabled {
  opacity: 0.6;
  pointer-events: none;
  cursor: not-allowed;
}

.controls button:hover:not(.disabled) {
  scale: 1.02;
}

/* إزالة التعديلات القديمة على الأيقونات */
[dir='rtl'] .fa-chevron-left,
[dir='rtl'] .fa-chevron-right {
  transform: none !important;
}

/* الحفاظ على التنسيق في الأجهزة المحمولة */
@media (max-width: 767px) {
  .sort-controls {
    flex-direction: column-reverse;
    gap: 10px;
  }

  .sort-controls .sel {
    gap: 10px;
  }

  .sort-controls .ownership-select {
    gap: 5px;
  }

  .sort-controls .ownership-select input[type='checkbox'] {
    scale: 1;
  }

  .sort-controls .ownership-select label {
    font-size: 11px;
  }

  .sort-controls .sel select {
    font-size: 11px;
  }

  .sort-controls .sel span {
    font-size: 11px;
  }

  .comments-container .message-attintion {
    font-size: 14px;
  }

  /* تحسين عرض عناصر التحكم في الجوال */
  .controls {
    width: 160px;
    gap: 15px;
  }

  .controls button {
    width: 25px;
    height: 25px;
    font-size: 16px;
  }

  .page-number {
    font-size: 14px;
  }
}
</style>
