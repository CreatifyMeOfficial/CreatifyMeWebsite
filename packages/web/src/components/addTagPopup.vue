<script setup>
import tagsApi from '@/api/tags'
import { onMounted, ref, computed } from 'vue'

const tags = ref([])
const searchValue = ref('')

const props = defineProps({
  excludedTags: {
    type: Array,
    default: () => [],
  },
})

const visibleTags = computed(() => {
  const query = searchValue.value.trim().toLowerCase()
  const excludedTagNames = props.excludedTags.map((t) => t.tag) // Get the names of the tags to exclude
  let filtered = tags.value.filter((t) => !excludedTagNames.includes(t.tag))
  if (!query) return filtered
  return filtered.filter((t) => (t.tag || '').toLowerCase().includes(query))
})

const emit = defineEmits(['closed', 'tagSelected'])

async function loadTags() {
  try {
    const response = await tagsApi.getTags()
    tags.value = response.data.tags
  } catch {
    return
  }
}

function tagSelected(tag) {
  emit('tagSelected', tag)
}

function closed() {
  emit('closed')
}

// visibleTags is derived via computed; no watchers needed

onMounted(async () => {
  await loadTags()
})
</script>

<template>
  <div class="popup">
    <span>Add Tag</span>
    <button @click="closed"><i class="fa-solid fa-xmark"></i></button>
    <!-- Search input section -->
    <div class="search-part">
      <input class="input-search" type="text" placeholder="Search" v-model="searchValue" />
      <i class="fa-solid fa-magnifying-glass"></i>
    </div>
    <div class="tags-container">
      <div
        class="tag"
        v-for="tag in visibleTags"
        :key="tag._id"
        @click="tagSelected({ tagId: tag._id, tagContent: tag.tag })"
      >
        {{ tag.tag }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup {
  width: 300px;
  height: 200px;
  border-radius: 15px;
  background-color: var(--background-color);
  border: 1px solid var(--text-color);
  box-shadow: 1px 1px 2px 0 var(--text-color);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  row-gap: 10px;
  position: relative;
}

.popup span {
  font-weight: 500;
}

.popup button {
  background-color: transparent;
  border: none;
  position: absolute;
  right: 10px;
  top: 10px;
  color: var(--danger-color);
}

.popup button:hover {
  text-shadow: 0.5px 0.5px 1px var(--text-color);
}

.search-part {
  display: flex;
  align-items: center;
  position: relative;
}

/* Search input field styling */
.search-part .input-search {
  width: 100%;
  height: 20px;
  width: 200px;
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

.tags-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 2px 5px;
  max-height: 200px;
  overflow: auto;
}

.tags-container .tag {
  width: 120px;
  height: 25px;
  font-size: 8px;
  font-weight: 500;
  padding: 0 2px;
  border-radius: 3px;
  background-color: var(--secondary-color);
  color: var(--background-color);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 1px 0px var(--text-color);
  cursor: pointer;
  font-family: 'Playfair Display', serif;
}

.tags-container .tag:hover {
  scale: 1.05;
}

@media (max-width: 767px) {
  .popup {
    height: 100px;
    width: 250px;
  }

  .popup span {
    font-size: 10px;
  }

  .search-part .input-search {
    font-size: 10px;
  }

  .search-part .input-search::placeholder {
    font-size: 10px;
  }

  .tags-container .tag {
    width: 80px;
    height: 20px;
    font-size: 6px;
  }
}
</style>
