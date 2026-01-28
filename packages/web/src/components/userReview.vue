<script>
// Define the component with props for receiving data
export default {
  // Component props configuration
  props: {
    img: {
      type: String,
      default: '',
    }, // Prop for user image (currently empty string as default)
    title: {
      type: String,
      default: '',
    }, // Prop for user title/name (empty string default)
    desc: {
      type: String,
      default: '',
    }, // Prop for user description (empty string default)
  },
}
</script>

<template>
  <!-- User info card container -->
  <div class="user-info">
    <!-- User profile image (currently using placeholder) -->
    <img :src="img" alt="" />
    <div class="review">
      <span>{{ title }}</span>
      <p>{{ desc }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Main container styling for user info card */
.user-info {
  width: 200px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--elements-color);
  border: none;
  border-radius: 20px;
  box-shadow: 0 1px 2px 0 var(--text-color);
  box-sizing: border-box;
  padding: 0 15px;
}

.user-info .review {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Profile image styling */
.user-info img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 25px 0;
}

/* User name/title styling */
.user-info span {
  color: var(--main-color);
  font-family: 'Playball', cursive;
  font-size: 20px;
}

/* User description text styling */
.user-info p {
  color: var(--text-color);
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  text-align: center;
  height: 80px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  white-space: pre-wrap;
}

@media (max-width: 1199px) {
  /* Change elements positioning inside of this component */
  .user-info {
    width: 100%;
    height: 85px;
    flex-direction: row;
    column-gap: 15px;
    padding: 10px 20px;
  }

  .user-info .review {
    align-items: flex-start;
  }

  .user-info img {
    width: 50px;
    height: 50px;
    grid-area: icon;
    margin: 0;
  }

  .user-info span {
    font-size: 18px;
  }

  .user-info p {
    height: 40px;
    margin: 5px;
    font-size: 12px;
    text-align: start;
    -webkit-line-clamp: 2;
  }
}

@media (max-width: 767px) {
  .user-info span {
    font-size: 16px;
  }

  .user-info p {
    font-size: 10px;
    height: 30px;
  }

  .user-info img{
    width: 40px;
    height: 40px;
  }
}
</style>
