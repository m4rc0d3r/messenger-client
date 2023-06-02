<template>
  <form @submit.prevent class="form">
    <div class="fields-to-fill">
      <label for="email-to-edit">Email</label>
      <span v-if="mode === Mode.VIEW"> {{ userToEdit.email }}</span>
      <input
        v-else
        type="email"
        id="email-to-edit"
        v-model="userToEdit.email"
      />
      <label for="email-to-nickname">Nickname</label>
      <span v-if="mode === Mode.VIEW"> {{ userToEdit.nickname }}</span>
      <input
        v-else
        type="text"
        id="nickname-to-edit"
        v-model="userToEdit.nickname"
      />
      <label for="current-password">Current password</label>
      <span v-if="mode === Mode.VIEW"> {{ userToEdit.password }}</span>
      <input
        v-else
        type="password"
        id="current-password"
        v-model="userToEdit.password"
      />
      <label for="new-password">New password</label>
      <span v-if="mode === Mode.VIEW"> {{ userToEdit.newPassword }}</span>
      <input
        v-else
        type="password"
        id="new-password"
        v-model="userToEdit.newPassword"
      />
    </div>
    <div v-if="mode === Mode.VIEW" class="button-block">
      <BaseButton @click="enterEditMode">Edit</BaseButton>
    </div>
    <div v-else class="button-block">
      <BaseButton @click="updateUser">Save</BaseButton>
      <BaseButton @click="resetToViewMode">Cancel</BaseButton>
    </div>
    <div class="error">{{ error }}</div>
  </form>
</template>

<script setup lang="ts">
import type { TUserToEdit } from "@/schemas/user";
import BaseButton from "@/components/BaseButton.vue";
import { useAuthStore } from "@/stores/auth-store";
import { onMounted, ref } from "vue";

enum Mode {
  VIEW,
  EDIT,
}

const authStore = useAuthStore();

const userToEdit = ref<TUserToEdit>({
  email: "",
  nickname: "",
  password: "",
  newPassword: "",
});
const error = ref("");

onMounted(() => {
  resetToViewMode();
});

const mode = ref(Mode.VIEW);

function enterEditMode() {
  mode.value = Mode.EDIT;
  userToEdit.value = {
    email: authStore.currentUser.value?.email,
    nickname: authStore.currentUser.value?.nickname,
    password: "",
    newPassword: "",
  };
}

async function updateUser() {
  const result = await authStore.updateUserData(userToEdit.value);
  if (result instanceof Error) {
    error.value = result.message;
  } else {
    resetToViewMode();
  }
}

function resetToViewMode() {
  mode.value = Mode.VIEW;
  userToEdit.value = {
    email: authStore.currentUser.value?.email,
    nickname: authStore.currentUser.value?.nickname,
    password: "",
    newPassword: "",
  };
  error.value = "";
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: center;
}

.form > * {
  margin-top: 12px;
}

.form > *:first-child {
  margin-top: 0;
}

.fields-to-fill {
  display: grid;
  grid-template-columns: auto auto;
  grid-row-gap: 12px;
  grid-column-gap: 12px;
}

.button-block {
  display: flex;
  justify-content: space-evenly;
}

.error {
  color: red;
}
</style>
