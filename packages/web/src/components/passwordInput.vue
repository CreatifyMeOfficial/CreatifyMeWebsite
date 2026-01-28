<script setup></script>

<template>
  <div>
    <input
      :type="showPassword ? 'text' : 'password'"
      :name="inputName"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :required="required"
    />
    <i class="fa-solid fa-eye" v-if="showPassword" @click="showPassword = !showPassword"></i>
    <i class="fa-solid fa-eye-slash" v-else @click="showPassword = !showPassword"></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPassword: false,
    }
  },

  emits: ['update:modelValue'],

  props: {
    inputName: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
div {
  position: relative;
}

input[type='password'] {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.2rem;
}

/* Hide the default eye icon from password input box in the Edge browser.*/
input[type='password']::-ms-reveal {
  display: none;
}

input {
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  line-height: 30px;

  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  border: none;
  box-shadow: 1px 1px 2px 0 var(--text-color);
  border-radius: 5px;
  margin-left: 0;
  outline: none;
  caret-color: var(--main-color);
  padding: 0px 15px;
}

input:focus {
  box-shadow: none;
  border: 2px solid var(--main-color);
}

i {
  position: absolute;
  top: 20%;
  right: 10px;
  color: gray;
}

@media (min-width: 767px) and (max-width: 992px) {
  input {
    font-size: 14px;
  }

  input[type='password'] {
    font-size: 0.9rem;
  }
}

@media (max-width: 767px) {
  input {
    font-size: 12px;
    height: 23px;
  }

  input[type='password'] {
    font-size: 0.7rem;
  }
}
</style>
