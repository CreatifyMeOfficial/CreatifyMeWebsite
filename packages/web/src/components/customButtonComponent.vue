<template>
  <button :type="buttonType">{{ content }}</button>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: {
    content: {
      type: String,
      default: '',
    },
    buttonType: {
      type: String,
      default: 'button',
    },
  },
}
</script>

<style scoped>
button {
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: all 0.1s linear;
  padding: 5px 10px;
  box-sizing: border-box;
  box-shadow: 1px 1px 2px 0 var(--text-color);
  text-align: center;
}

button:hover {
  scale: 1.02;
}

@media (max-width: 992px) {
  button{
    font-size: 14px;
  }
}

@media (max-width: 767px) {
  button{
    font-size: 12px;
  }
  button:hover {
    scale: 1;
  }
}
</style>
