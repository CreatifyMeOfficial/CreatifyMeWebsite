<template>
  <div class="comment" @click="$emit('cardSelected', $el)">
    <div class="user">
      <p class="name">{{ userName }}</p>
      <img class="image" :src="userImage" alt="" />
    </div>

    <div class="com" ref="content">
      <p>{{ comment }}</p>
    </div>
    <div class="controls">
      <div v-show="enableModification && !editStarted">
        <button class="edit" @click="editStarted = true"><i class="fa-solid fa-pen"></i></button>
        <button class="del" @click="openDeleteWarning"><i class="fa-solid fa-trash"></i></button>
      </div>

      <warningUp
        v-if="showWarning"
        :message="t('warningMassage.deleteComment')"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />

      <div v-show="enableModification && editStarted">
        <button class="cancel" @click="editStarted = false">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <button class="update" @click="updateComment">
          <i class="fa-solid fa-floppy-disk"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import commentsApi from '@/api/comments'
import warningUp from './warningPopUp.vue'

export default {
  data() {
    return {
      editStarted: false,
      showWarning: false,
    }
  },
  components: {
  warningUp,
  },
  props: {
    userImage: {
      type: String,
      default: '',
    },
    userName: {
      type: String,
      default: '',
    },
    comment: {
      type: String,
      default: '',
    },
    commentId: {
      type: String,
      default: '',
    },
    enableModification: {
      type: Boolean,
      default: false,
    },
  },
  methods: {

    openDeleteWarning() {
      this.showWarning = true
    },

    // تأكيد الحذف
    async confirmDelete() {
      this.showWarning = false
      await this.deleteComment()
    },

    // إلغاء
    cancelDelete() {
      this.showWarning = false
    },

    async deleteComment() {
      try {
        const response = await commentsApi.deleteComment({ commentId: this.commentId })
        if (response.status === 200) {
          this.$emit('commentDeleted')
        }
      } catch {
        return
      }
    },
    async updateComment() {
      try {
        const response = await commentsApi.updateComment({
          commentId: this.commentId,
          // Remove leading/trailing whitespace and normalize newlines
          comment: this.$refs.content.innerText.replace(/^\s+|\s+$/g, '').replace(/\r?\n$/, ''),
        })
        if (response.status === 200) {
          this.$emit('commentUpdated')
        }
      } catch {
        return
      } finally {
        this.editStarted = false
      }
    },
  },
  watch: {
    editStarted(newVal) {
      this.$refs.content.contentEditable = newVal
      if (newVal === false) {
        this.$refs.content.innerText = this.comment
      } else {
        this.$refs.content.focus()
      }
    },
  },
  emits: {
    cardSelected: null,
  },
}
</script>

<script setup>
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n()
</script>
<style scoped>
.comment {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 75px;
  box-sizing: border-box;
  border: 1px solid black;
  border-radius: 12px;
  padding: 0 10px;
  box-shadow: 1px 1px 2px 0 var(--text-color);
  transition: all 0.1s 0s linear;
  direction: ltr;
}

.comment:hover {
  transform: scale(1.01);
}

.comment .user {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 110px;
}
.comment .user .image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.comment .user .name {
  text-align: center;
  font-size: 12px;
  margin: 5px auto;
  font-weight: bold;
}
.comment .com {
  font-size: 12px;
  width: 80%;
  height: 50px;
  display: flex;
  align-items: start;
  color: var(--text-color);
  outline: none;
  font-family: 'Montserrat', sans-serif;
  overflow-y: auto;
  word-break: break-word;
  padding: 0 25px;
  /* display scroll bar */
  scrollbar-width: thin;
  scrollbar-color: var(--main-color) var(--background-color);
}

.comment .com p {
  word-wrap: wrap;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.comment .com:focus {
  text-align: start;
  border: 2px solid var(--main-color) !important;
  caret-color: var(--main-color);
}

.comment .controls {
  width: 75px;
  display: flex;
  justify-content: space-between;
  margin: auto;
}

.comment .controls button {
  background-color: transparent;
  cursor: pointer;
  transition: all 0.1s 0s linear;
}

button i {
  font-size: 18px;
}

.comment .controls button:hover {
  scale: 1.1;
  text-shadow: 0 0 1px var(--text-color);
}

.comment .controls .edit,
.comment .controls .update {
  border-style: none;
  border-radius: 2px;
}
.comment .controls .edit i,
.comment .controls .update i {
  color: var(--text-color);
}

.comment .controls .del,
.comment .controls .cancel {
  border-style: none;
  border-radius: 2px;
}

.comment .controls .del i,
.comment .controls .cancel i {
  color: var(--danger-color);
}

@media (max-width: 767px) {
  .comment .user {
    width: 75px;
  }
  .comment .user .name {
  font-size: 10px;
  font-weight: 500;

  }
  .comment .controls {
    width: 25px;
  }
  .comment .com p {
    font-size: 9px;
  }
  button i {
    font-size: 14px;
  }
}
</style>
