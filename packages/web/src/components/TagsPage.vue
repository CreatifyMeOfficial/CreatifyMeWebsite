<script setup>
import { onMounted, ref ,computed} from 'vue'
import customButtonComponent from './customButtonComponent.vue'
import tagsApi from '@/api/tags'
import createNotification from '@/notification/notification'
import notificationTypes from '@/enums/notificationTypes'
import spinner from '@/components/loadingSpinner.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activeIndex = ref(null)
const tags = ref([])
const tagContent = ref('')
const isLoadingTags = ref(true)
const searchValue = ref('')

const visibleTags = computed(() => {
  const query = searchValue.value.trim().toLowerCase()
  if (!query) return tags.value
  return tags.value.filter((t) => (t.tag || '').toLowerCase().includes(query))
})

function toggleTag(index) {
  if (activeIndex.value === index) {
    activeIndex.value = null
  } else {
    activeIndex.value = index
  }
}

async function loadTags() {
  try {
    const response = await tagsApi.getTags()
    tags.value = response.data.tags
    isLoadingTags.value = false
  } catch {
    return
  }
}

async function createTag() {
  try {
    const response = await tagsApi.createTag({ tag: tagContent.value })
    if (response.status === 201) {
      await loadTags()
      createNotification('A new tag was created successfully', notificationTypes.Success, 5)
    }
  } catch {
    return
  } finally {
    tagContent.value = ''
  }
}

async function deleteTag() {
  try {
    const response = await tagsApi.deleteTag({ tagId: tags.value[activeIndex.value]._id })
    if (response.status === 200) {
      await loadTags()
      createNotification('The tag was deleted successfully', notificationTypes.Success, 5)
    }
  } catch {
    return
  }
}

onMounted(async () => {
  await loadTags()
})
</script>

<template>
  <div class="container">
    <div class="upper">
      <p class="title">{{ t('adminPanel.addTag') }}</p>
      <input class="inp" type="text" v-model="tagContent" />
      <customButtonComponent
        :content="t('buttons.create')"
        class="add-button"
        @click="createTag"
      ></customButtonComponent>
    </div>
    <div class="lower">
      <p>{{ t('adminPanel.tagsTitle') }}</p>
      <div class="search-part">
        <input class="input-search" type="text" placeholder="Search" v-model="searchValue" />
        <i class="fa-solid fa-magnifying-glass"></i>
      </div>
      <div class="tags">
        <spinner v-show="isLoadingTags"></spinner>
        <div
          v-for="(tag, index) in visibleTags"
          :key="index"
          class="tag"
          @click="toggleTag(index)"
          :class="{ active: activeIndex === index }"
        >
          <span>{{ tag.tag }}</span>
          <i class="fa-solid fa-trash-can" @click="deleteTag"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
<style scoped>
.container {
  margin: 50px auto;
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  width: 500px;
  gap: 14px;
}

.upper .title {
  font-family: 'Montserrat alternates';
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
}

.upper input {
  box-sizing: border-box;
  box-sizing: border-box;
  max-width: 250px;
  width: 60%;
  height: 30px;
  margin: auto;
  border-radius: 5px;
  font-size: 16px;
  padding-left: 10px;
  outline: none;
  caret-color: var(--main-color); /* Custom cursor color */
  direction: ltr;
}

.upper input:focus {
  box-shadow: none;
  border: 2px solid var(--main-color);
}

.upper .add-button {
  background-color: var(--secondary-color);
  color: var(--elements-color);
  width: 100px;
}

.lower {
  width: 80%;
}
.lower p {
  text-align: center;
  font-weight: bold;
  font-size: 22px;
  color: var(--main-color);
  margin-bottom: 20px;
  padding-top: 25px;
  border-top: 2px solid var(--text-color);
}


.search-part {
  width: 200px;
  margin: 0 auto;
  display: flex;
  text-align: center;
  align-items: center;
  position: relative;
  margin-bottom: 20px;
}

/* Search input field styling */
.search-part .input-search {
  height: 25px;
  box-sizing: border-box;
  font-size: 12px;
  font-family: 'Poppins', sans-serif;
  border-radius: 15px;
  box-shadow: 1px 1px 2px 0 var(--text-color);
  color: var(--text-color);
  border: none;
  text-align: center;
  font-size: 10px;
  padding: 0 20px;
  background-color: var(--elements-color);
}

/* Search placeholder text styling */
.search-part .input-search::placeholder {
  font-family: 'Poppins', sans-serif;
  font-size: 12px;
  font-style: italic;
}

/* Change input default border color on focus */
.input-search {
  box-sizing: border-box;
  outline: none;
}

.input-search:focus {
  box-shadow: none !important;
  border: 1px solid var(--main-color) !important;
  caret-color: var(--main-color);
}

/* Search icon styling */
.search-part i {
  position: absolute;
  font-size: 10px;
  left: 10px;
  top: 5px;
  color: var(--icon-color);
}

.tags {
  /* width: 100%; */
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  align-content: flex-start;
  height: 50vh;
  overflow-y: scroll;
  overflow-x: visible;
  position: relative;
}

.tag {
  width: 120px;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 5px;
  background-color: var(--controls-color);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.tag span {
  width: 90%;
  text-align: center;
  font-size: 8px;
  font-weight: 500;
  margin: 0 5px;
  text-wrap: wrap;
  word-wrap: break-word;
}

.tag:hover {
  transform: translateY(-3px);
}

.tag.active {
  height: 60px;
  padding: 8px;
}

.tag i {
  display: none;
  font-size: 8px;
  color: var(--elements-color);
  background-color: var(--danger-color);
  text-align: center;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.tag.active i {
  display: block;
}

.tag.active i:hover {
  background-color: #c0392b;
  transform: scale(1.1);
}

@media (max-width: 767px) {
  .container {
    width: 90%;
  }

  .upper {
    width: 320px;
  }

  .upper .title {
    font-size: 10px;
  }

  .upper input {
    height: 25px;
    width: 150px;
  }

  .upper .add-button {
    width: 50px;
    font-size: 10px;
  }

  .lower {
  width: 90%;
}

  .lower p {
    font-size: 14px;
  }

  .tags {
    width: 100%;
  }

  .tag {
    height: 25px;
    width: 75px;
    gap: 5px;
  }

  .tag span {
    font-size: 6px;
  }

  .tag.active {
    height: 40px;
  }

  .tag i {
    font-size: 5px;
    padding: 3px;
  }
}
</style>
