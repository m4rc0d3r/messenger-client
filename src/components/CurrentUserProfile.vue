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
          <div class="avatar-form-field">
            <label for="email">Avatar</label>
            <div class="avatar-wrapper">
              <img
                v-if="userToEdit.avatar"
                :src="userToEdit.avatar"
                alt="Avatar"
                class="avatar-image"
              />
              <User v-else class="empty-avatar-icon" />
            </div>
          </div>
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
import type { TUser, TUserToEdit } from "@/schemas/user";
import { Str } from "@/shared";
import { useAuthStore } from "@/stores/auth-store";
import { User } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import BaseButton from "./BaseButton.vue";
import BaseInput from "./BaseInput.vue";

enum Mode {
  VIEW,
  EDIT,
}

const authStore = useAuthStore();

const userToEdit = ref<Required<TUserToEdit & Pick<TUser, "avatar">>>({
  email: Str.EMPTY,
  nickname: Str.EMPTY,
  password: Str.EMPTY,
  newPassword: Str.EMPTY,
  isPrivate: false,
  avatar: Str.EMPTY,
});
const error = ref(Str.EMPTY);

onMounted(() => {
  resetToViewMode();
});

const mode = ref(Mode.VIEW);

function enterEditMode() {
  mode.value = Mode.EDIT;
  userToEdit.value = {
    email: authStore.currentUser.value?.email ?? Str.EMPTY,
    nickname: authStore.currentUser.value?.nickname ?? Str.EMPTY,
    password: Str.EMPTY,
    newPassword: Str.EMPTY,
    isPrivate: authStore.currentUser.value?.isPrivate ?? false,
    avatar: authStore.currentUser.value?.avatar ?? Str.EMPTY,
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
    email: authStore.currentUser.value?.email ?? Str.EMPTY,
    nickname: authStore.currentUser.value?.nickname ?? Str.EMPTY,
    password: Str.EMPTY,
    newPassword: Str.EMPTY,
    isPrivate: authStore.currentUser.value?.isPrivate ?? false,
    avatar: authStore.currentUser.value?.avatar ?? Str.EMPTY,
  };
  error.value = Str.EMPTY;
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

.avatar-form-field {
  grid-column: 1 / 3;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-wrapper {
  padding: 1rem;
}

.avatar-image {
  width: 4.5rem;
  height: 4.5rem;
  object-fit: cover;
  border-radius: 100%;
}

.empty-avatar-icon {
  width: 4.5rem;
  height: 4.5rem;
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
