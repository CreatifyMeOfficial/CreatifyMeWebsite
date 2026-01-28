<template>
  <Teleport to="body">
    <div class="overlay">
      <div class="container">
        <div class="info" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
          <div class="icon"><i class="fa-solid fa-circle-exclamation"></i></div>
          <p class="description">{{ message }}</p>
        </div>
        <span class="for-sure"> {{ t('warningMassage.forSure') }}</span>
        <div class="controls">
          <customButtonComponent :content="t('buttons.ok')" @click="emit('confirm')" />

          <customButtonComponent :content="t('buttons.cancel')" @click="emit('cancel')" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import customButtonComponent from './customButtonComponent.vue'

const { t, locale } = useI18n()
const emit = defineEmits(['confirm', 'cancel'])

defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>
<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.container {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 26%; /* ⬅️ أضيق */
  max-width: 360px; /* ⬅️ حد أعلى أنحف */
  min-width: 260px; /* ⬅️ أقل حد */

  height: auto;
  max-height: 75vh;

  padding: 20px 25px;
  border-radius: 15px;
  box-shadow: 1px 2px 4px var(--text-color);
  background-color: var(--background-color);
  z-index: 998;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.container .for-sure {
  text-align: center;
}

/* EN */
.info[dir='ltr'] .icon {
  margin-left: auto;
}

/* AR */
.info[dir='rtl'] .icon {
  margin-right: auto;
}

.info[dir='ltr'] .description {
  direction: ltr;
  text-align: left;
}

.info[dir='rtl'] .description {
  direction: rtl;
  text-align: right;
}

.description {
  text-align: center;
  word-break: break-word;
  overflow-wrap: break-word;
  width: 80%;
}

.container .icon {
  color: var(--warning-color);
  text-align: center;
  margin: 10px 0;
}

.container .icon i {
  font-size: 20px;
}

.container .controls {
  text-align: center;
  margin: 10px;
}

.container .controls button {
  margin: 0 20px;
  width: 70px;
  color: var(--text-color);
  background-color: var(--controls-color);
}

@media (min-width: 992px) {
  .container {
    width: 26%;
    max-height: 70vh;
  }

  .description {
    word-break: break-word;
    overflow-wrap: break-word;
    margin: 10px 0 10px;
    font-size: 15px;
  }

  .container .icon {
    margin: 5px 0;
  }

  .container .for-sure {
    font-size: 14px;
  }

  .container .controls button {
    font-size: 14px;
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .container {
    width: 48%; /* ⬅️ أقل من 55% */
    max-height: 75vh;
    padding: 16px 20px;
  }

  .description {
    font-size: 14px;
  }

  .for-sure {
    font-size: 12px;
  }
  .container .controls button {
    font-size: 12px;
    width: 65px;
  }

  .container .icon i {
    font-size: 16px;
  }
}

@media (max-width: 767px) {
  .container {
    width: 68%; /* ⬅️ أنحف بشكل واضح */
    max-width: 260px; /* ⬅️ شكل مودال نظيف */
    min-width: 220px; /* ⬅️ أقل حد آمن للعربي */

    max-height: 60vh;
    padding: 10px 12px;
    top: 32%;
  }

  .description {
    font-size: 11px;
    word-break: break-word;
    overflow-wrap: break-word;
    margin: 5px 5px 0;
  }

  .for-sure {
    font-size: 10px;
  }

  .container .icon {
    margin: 5px 0 0;
  }
  .container .controls button {
    width: 52px;
    font-size: 9px;
  }

  .container .controls {
    margin: 5px;
  }

  .container .icon i {
    font-size: 14px;
  }
}
</style>
