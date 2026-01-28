<script setup>
import { getCurrentInstance, ref } from 'vue'
import addTagPopup from './addTagPopup.vue'
import personalitiesApi from '@/api/personalities'

const currentInstance = getCurrentInstance()
const isPopupOpen = ref(false)

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  code: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  tags: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['focus', 'tagAdded', 'tagRemoved'])

function togglePopup() {
  isPopupOpen.value = !isPopupOpen.value
  if (isPopupOpen.value) {
    // Emit the focus event and pass this element inside of it.
    emit('focus', currentInstance.proxy.$el)
  }
}

function closePopup() {
  isPopupOpen.value = false
}

async function addTag(payload) {
  try {
    const response = await personalitiesApi.addTagToPersonality({
      tagId: payload.tagId,
      personalityId: props.id,
    })
    if (response.status === 200) {
      emit('tagAdded', payload.tagContent, payload.tagId, props.id)
    }
  } catch {
    return
  }
}

async function removeTag(payload) {
  try {
    const response = await personalitiesApi.removeTagToPersonality({
      tagId: payload.tagId,
      personalityId: props.id,
    })
    if (response.status === 200) {
      emit('tagRemoved', payload.tagContent, props.id)
    }
  } catch {
    return
  }
}

defineExpose({
  closePopup,
})
</script>
<template>
  <div class="card">
    <div class="info">
      <h1 class="main">{{ code }}</h1>
      <p class="description">{{ description }}</p>
      <div class="inf">
        <div class="add-tag">
          <i class="fa-solid fa-circle-plus icon" @click="togglePopup()"></i>
          <addTagPopup
            class="popup"
            v-if="isPopupOpen"
            :excludedTags="tags"
            @closed="isPopupOpen = false"
            @tagSelected="addTag"
          ></addTagPopup>
        </div>
        <div class="tags">
          <div class="tag" v-for="tag in tags" :key="tag._id">
            {{ tag.tag }}
            <i class="fa fa-minus" @click="removeTag({ tagId: tag._id, tagContent: tag.tag })"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script></script>

<style scoped>
.card {
  margin: 0 auto;
  padding: 50px;
  width: 550px;
  height: 700px;
  box-sizing: border-box;
  background-color: var(--elements-color);
  box-shadow: 1px 1px 4px 0 var(--text-color);
  border: 1px solid var(--text-color);
  border-radius: 10px;
}

.info {
  text-align: center;
  display: grid;
  grid-template-rows: auto 500px 80px;
  height: 100%;
  overflow-y: visible;
}

.main {
  color: var(--main-color);
  text-align: center;
  font-size: 24px;
  grid-row: 1;
}

.description {
  text-align: left;
  margin-bottom: 40px;
  font-size: 10px;
  grid-row: 2;
  overflow-y: auto;
}

.inf {
  grid-row: 3;
  padding-top: 5px;
  row-gap: 10;
  display: flex;
  position: relative;
}

.inf .add-tag {
  width: fit-content;
  margin-right: 5px;
}

.inf .add-tag .popup {
  position: absolute;
  bottom: 75px;
}

[style*='--direction: rtl'] {
  .inf .add-tag .popup {
    right: 0;
  }
}

[style*='--direction: ltr'] {
  .inf .add-tag .popup {
    left: 0;
  }
}

.inf .tags {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  row-gap: 10px;
  flex-wrap: wrap;
}

.inf .tag {
  font-size: 6px;
  height: 15px;
  padding: 5px 15px;
  color: var(--background-color);
  background-color: var(--secondary-color);
  margin-right: 10px;
  box-shadow: 1px 1px 1px 0 var(--text-color);
  border-radius: 5px;
  display: flex;
  align-items: center;
  position: relative;
}

.inf .tag i {
  display: none;
  border-radius: 50%;
  padding: 2px;
  font-size: 8px;
  box-sizing: border-box;
  position: absolute;
  right: 2px;
  top: calc(15 / 2);
}

.inf .tag:hover i {
  display: inline;
}

.inf .tag i:hover {
  background-color: var(--danger-color);
}

.icon {
  margin: auto 0;
  font-size: 25px;
  color: var(--secondary-color);
  background-color: var(--elements-color);
  cursor: pointer;
  box-shadow: 1px 1px 2px 0 var(--text-color);
  border-radius: 50%;
  position: relative;
}

@media (max-width: 767px) {
  .card {
    width: 500px;
  }

  .main {
    font-size: 16px;
  }

  .inf .tag {
    height: 10px;
    font-size: 7px;
    padding: 5px 12px;
    margin-right: 5px;
  }

  .inf .tag i {
    font-size: 5px;
    top: calc(10 / 2);
  }

  .icon {
    font-size: 22px;
  }
}
</style>
