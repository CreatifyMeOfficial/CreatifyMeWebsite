<template>
  <div class="progress-container">
    <div class="progress-percentage">
      {{ currentProgress }}%
    </div>
    <div class="progress-bar">
      <div
        class="progress-fill"
        :style="{ width: currentProgress + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed} from 'vue'

const props = defineProps({
  totalQuestions: {
    type: Number,
    default: 0
  },
  answeredQuestions: {
    type: Number,
    default: 0
  }
})

const currentProgress = computed(() => {
  if (props.totalQuestions === 0) return 0
  return Math.round((props.answeredQuestions / props.totalQuestions) * 100)
})
</script>

<style scoped>
.progress-container {
  width: 50%;
  margin: 0 auto 20px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background-color: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: var(--main-color);
  border-radius: 6px;
  transition: width 0.5s ease-in-out;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.progress-percentage {
  margin: 0 auto 10px;
  font-size: 16px;
  font-weight: bold;
  color: var(--text-color);
  text-align: center;
}

@media (max-width: 767px) {
  .progress-container {
    margin: 20px auto 30px;
    padding: 0 10px;
  }

  .progress-bar {
    height: 10px;
  }

  .progress-percentage {
    font-size: 14px;
  }
}
</style>
