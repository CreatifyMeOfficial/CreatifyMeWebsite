<script setup>
</script>
<template>
  <div class="spinner"></div>
</template>
<style scoped>
.spinner {
  position: absolute;
  left: calc(50% - 20px);
  top: calc(50% - 20px);
  width: 40px;
  height: 40px;
  border: 6px solid var(--placeholder-background); /* لون الخلفية */
  border-top: 6px solid var(--main-color); /* اللون الرئيسي */
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
