<script>
// Component definition with props configuration
export default {
  // Props that this component accepts
  props: {
    path: '', // Font Awesome icon class path
    title: '', // Title text for the feature
    desc: '', // Description text for the feature
  },
}
</script>

<template>
  <!-- Main container for the feature/test component -->
  <div class="test-part">
    <div class="test-title">
      <!-- Dynamic icon using Font Awesome classes -->
      <i :class="[path]"></i>
      <span>{{ title }}</span>
    </div>
    <p class="test-desc">{{ desc }}</p>
  </div>
</template>

<style scoped>
/* Main container styling */
.test-part {
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.test-title {
  gap: 10px;
}

/* Icon styling */
.test-title i {
  background-color: var(--main-color);
  color: var(--elements-color);
  border-radius: 50%;
  padding: 10px;
}

/* Title container styling */
.test-part .test-title {
  display: flex;
  align-items: center;
  width: 100%;
}

/* Title text styling */
.test-part .test-title span {
  font-family: 'Montserrat', sans-serif;
  font-size: 22px;
  color: var(--main-color);
}

/* Description text styling */
.test-part .test-desc {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  color: var(--text-color);
  margin-inline-start: 50px;
}

@media (max-width: 1199px) {
  .test-part {
    width: 100%;
  }

  .test-title {
    gap: 15px;
  }

  .test-title i {
    padding: 8px;
    font-size: 14px;
    box-sizing: content-box;
  }

  .test-part .test-title span {
    font-size: 18px;
  }

  .test-part .test-desc {
    font-size: 15px;

  }
}

@media (max-width: 767px) {
  .test-title i {
    font-size: 10px;
  }

  .test-part .test-title span {
    font-size: 12px;
  }

  .test-part .test-desc {
    font-size: 10px;
  }
}
</style>
