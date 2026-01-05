<script setup>
import CustomButtonComponent from '@/components/customButtonComponent.vue'
</script>
<template>
  <div class="container">
    <div class="welcome-message">
      <h2>We're Here to Help!</h2>
      <p>
        Thank you for taking the time to report this issue. Your feedback helps us improve and
        provide a better experience for everyone.
      </p>
      <p>
        Please provide as much detail as possible about the bug you encountered, and we'll
        investigate it right away.
      </p>
    </div>
    <span class="title">Report a Bug:</span>
    <textarea id="bug" name="bug" rows="5"></textarea>
    <div class="sel">
      <select>
        <option value="1">Bug in test page</option>
        <option value="2">Other</option>
      </select>
      <div class="logo"><i class="fa-solid fa-bug"></i></div>
    </div>
    <CustomButtonComponent :buttonType="'button'" class="btn" :content="'Report Bug'" />
  </div>
</template>

<style scoped>
.container {
  width: 60%;
  margin: 100px auto;
  box-shadow: 1px 2px 4px var(--text-color);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 25px;
  padding: 50px 100px;
  box-sizing: border-box;
}

.container .welcome-message h2 {
  color: var(--main-color);
  text-shadow: 0 0 2px var(--text-color);
}

.container .welcome-message p {
  padding: 0 25px;
}

.title {
  padding-bottom: 15px;
  font-weight: bold;
  font-size: 22px;
}

textarea {
  margin-bottom: 15px;
  border-radius: 5px;
  font-family: 'Poppins', sans-serif;
  caret-color: var(--main-color);
  padding-left: 10px;
  width: 100%;
}

textarea:focus {
  border: 2px solid var(--main-color);
  outline: none;
}

.sel {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
  column-gap: 15px;
  align-self: flex-start;
}

.sel select {
  padding: 5px;
  text-align: center;
  background-color: var(--background-color);
  color: var(--text-color);
  border-radius: 6px;
  border: 0.5px solid black;
  box-shadow: 1px 1px 2px 0 var(--text-color);
}

.logo i {
  font-size: 20px;
  color: var(--text-color);
  padding-right: 10px;
}

.btn {
  width: fit-content;
  margin: 0 auto;
  color: var(--text-color);
  background-color: var(--controls-color);
}

@media (max-width: 991px) {
  .container {
    width: 90%;
    border: none;
    box-shadow: none;
    margin-top: 50px;
    padding: 25px;
    row-gap: 10px;
  }

  .title {
    font-size: 16px;
  }
}
</style>
