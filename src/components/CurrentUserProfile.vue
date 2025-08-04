<template>
  <Card class="card-footer">
    <CardHeader>
      <CardTitle>My account</CardTitle>
      <CardDescription>
        View and change account information and settings.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent class="form">
        <div class="form-fields">
          <label for="email-to-edit">Email</label>
          <span v-if="mode === Mode.VIEW"> {{ userToEdit.email }}</span>
          <BaseInput
            v-else
            type="email"
            id="email-to-edit"
            v-model="userToEdit.email"
          />
          <label for="email-to-nickname">Nickname</label>
          <span v-if="mode === Mode.VIEW"> {{ userToEdit.nickname }}</span>
          <BaseInput
            v-else
            type="text"
            id="nickname-to-edit"
            v-model="userToEdit.nickname"
          />
          <label for="current-password">Current password</label>
          <span v-if="mode === Mode.VIEW"> {{ userToEdit.password }}</span>
          <BaseInput
            v-else
            type="password"
            id="current-password"
            v-model="userToEdit.password"
          />
          <label for="new-password">New password</label>
          <span v-if="mode === Mode.VIEW"> {{ userToEdit.newPassword }}</span>
          <BaseInput
            v-else
            type="password"
            id="new-password"
            v-model="userToEdit.newPassword"
          />
          <label for="is-private">Is private</label>
          <span v-if="mode === Mode.VIEW">
            {{ userToEdit.isPrivate ? "Yes" : "No" }}</span
          >
          <input
            v-else
            type="checkbox"
            id="is-private"
            v-model="userToEdit.isPrivate"
          />
        </div>

        <div class="error">{{ error }}</div>
      </form>
    </CardContent>
    <CardFooter class="card-footer">
      <div v-if="mode === Mode.VIEW" class="button-block">
        <BaseButton @click="enterEditMode">Edit</BaseButton>
      </div>
      <div v-else class="button-block">
        <BaseButton @click="updateUser">Save</BaseButton>
        <BaseButton @click="resetToViewMode">Cancel</BaseButton>
      </div>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import type { TUserToEdit } from "@/schemas/user";
import { useAuthStore } from "@/stores/auth-store";
import { onMounted, ref } from "vue";
import BaseButton from "./BaseButton.vue";
import BaseInput from "./BaseInput.vue";

enum Mode {
  VIEW,
  EDIT,
}

const authStore = useAuthStore();

const userToEdit = ref<Required<TUserToEdit>>({
  email: "",
  nickname: "",
  password: "",
  newPassword: "",
  isPrivate: false,
});
const error = ref("");

onMounted(() => {
  resetToViewMode();
});

const mode = ref(Mode.VIEW);

function enterEditMode() {
  mode.value = Mode.EDIT;
  userToEdit.value = {
    email: authStore.currentUser.value?.email ?? "",
    nickname: authStore.currentUser.value?.nickname ?? "",
    password: "",
    newPassword: "",
    isPrivate: authStore.currentUser.value?.isPrivate ?? false,
  };
}

async function updateUser() {
  console.log(userToEdit.value);
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
    email: authStore.currentUser.value?.email ?? "",
    nickname: authStore.currentUser.value?.nickname ?? "",
    password: "",
    newPassword: "",
    isPrivate: authStore.currentUser.value?.isPrivate ?? false,
  };
  error.value = "";
}
</script>

<style scoped>
.card {
  padding: calc(var(--step) * 2);
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(var(--step) * 3);
  border-radius: var(--radius-lg);
  background-color: white;
  gap: calc(var(--step) * 3);
}

.form-fields {
  display: grid;
  grid-template-columns: auto 1fr;
  row-gap: calc(var(--step) * 3);
  column-gap: calc(var(--step) * 2);
}

.button-block {
  display: flex;
  gap: calc(var(--step) * 2);
}

.error {
  color: var(--destructive);
}

.card-footer {
  justify-content: end;
}
</style>
