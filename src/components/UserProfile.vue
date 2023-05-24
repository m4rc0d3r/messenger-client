<template>
  <form @submit.prevent class="form">
    <div class="fields-to-fill">
      <label for="email-to-edit">Email</label>
      <span v-if="mode === Mode.VIEW"> {{ userToEditAuthData.email }}</span>
      <input
        v-else
        type="email"
        id="email-to-edit"
        v-model="userToEditAuthData.email"
      />
      <label for="current-password">Current password</label>
      <span v-if="mode === Mode.VIEW"> {{ userToEditAuthData.password }}</span>
      <input
        v-else
        type="password"
        id="current-password"
        v-model="userToEditAuthData.password"
      />
      <label for="new-password">New password</label>
      <span v-if="mode === Mode.VIEW">
        {{ userToEditAuthData.newPassword }}</span
      >
      <input
        v-else
        type="password"
        id="new-password"
        v-model="userToEditAuthData.newPassword"
      />
    </div>
    <div v-if="mode === Mode.VIEW" class="button-block">
      <button @click="enterEditMode">Edit</button>
    </div>
    <div v-else class="button-block">
      <button @click="updateUser">Save</button>
      <button @click="resetToViewMode">Cancel</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { TUserToEditAuthData } from "@/schemas/user";
import { useAuthStore } from "@/stores/auth-store";
import { onMounted, ref } from "vue";

enum Mode {
  VIEW,
  EDIT,
}

const authStore = useAuthStore();

const userToEditAuthData = ref<TUserToEditAuthData>({
  email: authStore.currentUser.value?.email,
  password: "",
  newPassword: "",
});

onMounted(() => {
  resetToViewMode();
});

const mode = ref(Mode.VIEW);

function enterEditMode() {
  mode.value = Mode.EDIT;
  userToEditAuthData.value = {
    email: authStore.currentUser.value?.email,
    password: "",
    newPassword: "",
  };
}

async function updateUser() {
  const result = await authStore.updateUserAuthData(userToEditAuthData.value);
}

function resetToViewMode() {
  mode.value = Mode.VIEW;
  userToEditAuthData.value = {
    email: authStore.currentUser.value?.email,
    password: "",
    newPassword: "",
  };
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
}

.fields-to-fill {
  display: grid;
  grid-template-columns: auto auto;
}

.button-block {
  display: flex;
  justify-content: space-evenly;
}
</style>
