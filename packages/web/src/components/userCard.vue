<script setup>
import usersApi from '@/api/users'
import UserRoles from '@/enums/userRoles'
import warningUp from './warningPopUp.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()
const showWarning = ref(false)

const props = defineProps({
  userId: {
    type: String,
    default: '',
  },
  userName: {
    type: String,
    default: '',
  },
  profileImage: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    default: UserRoles.USER,
  },
})

async function deleteUser() {

}

function openDeleteWarning(){
  showWarning.value = true
}
      // تأكيد الحذف
async function confirmDelete() {
  showWarning.value = false
  await deleteUser()
}

function cancelDelete() {
  showWarning.value = false
}
const currentRole = ref(props.role)
const needUpdate = ref(false)

const resetNeedUpdate = () => {
  needUpdate.value = false
  currentRole.value = props.role
}

defineExpose({
  resetNeedUpdate,
})

async function updateUserRole() {
  const response = await usersApi.updateUserRole({
    userId: props.userId,
    role: currentRole.value,
  })
  emit('roleChanged')
}

const emit = defineEmits(['cardSelected'])

function roleChanged(newRole) {
  currentRole.value = newRole
  needUpdate.value = true
}
</script>

<template>
  <div class="user-card" @click="$emit('cardSelected', $el)">
    <span class="column-heading">{{ t('adminPanel.image') }}</span>
    <span class="column-heading">{{ t('adminPanel.userName') }}</span>
    <span class="column-heading">Admin</span>
    <span class="column-heading">User</span>
    <span class="column-heading">Super Admin</span>
    <span class="column-heading">{{ t('adminPanel.delete') }}</span>
    <img :src="profileImage" />
    <span>{{ userName }}</span>
    <div>
      <input
        type="radio"
        :name="userName + 'Role'"
        :value="UserRoles.ADMIN"
        :checked="currentRole === UserRoles.ADMIN"
        @change="roleChanged(UserRoles.ADMIN)"
      />
    </div>
    <div>
      <input
        type="radio"
        :name="userName + 'Role'"
        :value="UserRoles.USER"
        :checked="currentRole === UserRoles.USER"
        @change="roleChanged(UserRoles.USER)"
      />
    </div>
    <div>
      <input
        type="radio"
        :name="userName + 'Role'"
        :value="UserRoles.SUPER_ADMIN"
        :checked="currentRole === UserRoles.SUPER_ADMIN"
        @change="roleChanged(UserRoles.SUPER_ADMIN)"
      />
    </div>
    <button class="delete-button" @click="openDeleteWarning"><i class="fa-solid fa-trash"></i></button>
    <warningUp
      v-if="showWarning"
      :message="t('warningMassage.deleteUser')"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
    <div class="controls" :class="{ visible: needUpdate }">
      <button class="cancel-button" @click="resetNeedUpdate">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <button class="update-button" @click="updateUserRole"><i class="fa-solid fa-pen"></i></button>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  display: grid;
  grid-template-columns: auto 1fr auto auto auto auto;
  grid-template-rows: repeat(2, 1fr);
  width: 100%;
  border: 1px solid var(--text-color);
  box-shadow: 1px 1px 2px 0 var(--text-color);
  box-sizing: border-box;
  padding: 15px 25px;
  border-radius: 25px;
  gap: 10px 25px;
  align-items: center;
  cursor: pointer;
  transition: all 0.1s 0s linear;
}

.user-card:hover {
  transform: scale(1.01);
}

.user-card > * {
  margin: 0 auto;
}

.user-card .column-heading {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.user-card img {
  width: 30px;
  height: 30px;
  background-color: transparent;
  border-radius: 50%;
}

.user-card input[type='radio'] {
  accent-color: var(--main-color);
  transform: scale(1.3);
  margin: 0 10px;
  cursor: pointer;
  transition: all 0.1s 0s linear;
}

.user-card input[type='radio']:hover {
  scale: 1.1;
}

.user-card button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  width: 30px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  box-shadow: 1px 1px 1px 0 var(--text-color);
  transition: all 0.1s 0s linear;
}

.user-card button:hover {
  transform: scale(1.1);
}

.user-card .delete-button {
  background-color: var(--danger-color);
  color: var(--background-color);
}

.user-card .controls {
  max-height: 0;
  overflow: hidden;
  gap: 10px;
  display: flex;
  grid-column: 6;
  transition: all 0.1s 0s linear;
}

.user-card .controls.visible {
  max-height: 200px;
  padding: 2px;
}

.user-card .controls .cancel-button {
  background-color: var(--controls-color);
}

.user-card .controls .update-button {
  background-color: var(--secondary-color);
}

@media (max-width: 767px) {
  .user-card {
    font-size: 8px;
    gap: 5px;
  }

  .user-card button {
    padding: 4px 5px;
  }

  .user-card button i {
    font-size: 10px;
  }

  .user-card input[type='radio'] {
    scale: 0.6;
  }

  .user-card input[type='radio']:hover {
    scale: 0.7;
  }

  .user-card .controls {
  gap: 5px;
}

.user-card .controls .cancel-button , .user-card .controls .update-button{
  width: 20px;
}

}
</style>
