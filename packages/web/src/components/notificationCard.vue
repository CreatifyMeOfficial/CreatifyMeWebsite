<script setup>
import notificationTypes from '../enums/notificationTypes'
</script>
<template>
  <div
    class="notification-card"
    ref="notificationCard"
    v-if="!destroy"
    :class="[cardType, { hidden: hidden }]"
  >
    <div class="content">
      <i v-if="cardType === notificationTypes.Error" class="fa-solid fa-circle-exclamation"></i>
      <i
        v-else-if="cardType === notificationTypes.Warning"
        class="fa-solid fa-circle-exclamation"
      ></i>
      <i v-else-if="cardType === notificationTypes.Success" class="fa-solid fa-circle-check"></i>
      <span class="msg">{{ message }}</span>
    </div>
    <span class="timer" ref="timer"></span>
  </div>
</template>

<script>
export default {
  mounted() {
    // Set the timer bar animation length to match the card visibility duration
    this.$refs.timer.style.animationDuration = `${this.visibilityTimer}s`
    // Set the fadeout effect duration to end when the object is destroyed
    this.$refs.notificationCard.style.transitionDuration = `${this.fadeOutTimer}s`
    // Start hiding the card after the visibility time ends
    setTimeout(() => {
      this.hidden = true
    }, this.visibilityTimer * 1000)
    setTimeout(
      () => {
        // Destroy the card after the timer is done and the fadeout effect is done
        this.destroy = true
      },
      (this.visibilityTimer + this.fadeOutTimer) * 1000,
    )
  },
  props: {
    message: {
      type: String,
      default: '',
    },
    cardType: {
      type: String,
      default: notificationTypes.Success,
    },
    visibilityTimer: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      hidden: false,
      fadeOutTimer: 0.3,
      destroy: false,
    }
  },
}
</script>

<style scoped>
.notification-card {
  min-width: 250px;
  max-width: 500px;
  height: 50px;
  box-shadow: 0 0 4px 0 var(--text-color);
  background-color: var(--background-color);
  display: grid;
  padding-top: 5px;
  grid-template-rows: 80% 20%;
  box-sizing: border-box;
  font-size: 12px;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
  visibility: visible;
  opacity: 1;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
  flex-shrink: 0;
}

[style*='--direction: ltr'] {
  .notification-card {
    border-radius: 10px 0 0 10px;
    margin-left: 5px;
  }
}

[style*='--direction: rtl'] {
  .notification-card {
    border-radius: 0 10px 10px 0;
    margin-right: 5px;
  }
}

.notification-card.hidden {
  opacity: 0;
}

.notification-card.Success {
  color: var(--success-color);
}

.notification-card.Warning {
  color: var(--warning-color);
}

.notification-card.Error {
  color: var(--danger-color);
}

.notification-card .content {
  display: flex;
  align-items: center;
  column-gap: 10px;
  padding: 0 10px;
  overflow: hidden;
  
}

.notification-card .content i {
  font-size: 16px;
}

.notification-card .content .msg{
  font-size: 14px;
  font-weight: 500;
}

.notification-card .timer {
  background-color: var(--secondary-color);
  height: 3px;
  align-self: flex-end;
  justify-self: end;
  animation-name: timer-animation;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes timer-animation {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

@media (max-width: 767px) {
  .notification-card {
    font-size: 8px;
    max-width: 250px;
    height: 55px;
  }

  .notification-card .content .msg{
    font-size: 10px;
  }
}
</style>
