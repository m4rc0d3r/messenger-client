<template>
  <div class="page">
    <Card class="card">
      <CardHeader class="card-header">
        <CardTitle>Registration</CardTitle>
        <CardDescription
          >Create an account to be able to communicate with other
          users.</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form ref="form" @submit.prevent class="form">
          <div class="form-fields">
            <div class="avatar-form-field">
              <label for="email">Avatar</label>
              <div class="avatar-wrapper">
                <button
                  type="button"
                  class="select-avatar-button"
                  @click="clickAvatarInput"
                >
                  <img
                    v-if="user.avatar"
                    :src="getAvatarSource()"
                    alt="Avatar"
                    class="avatar-image"
                  />
                  <User v-else class="empty-avatar-icon" />
                </button>
                <button
                  v-if="user.avatar"
                  class="clear-avatar-button"
                  @click="clearAvatar"
                >
                  <Trash />
                </button>
                <input
                  ref="avatar-input"
                  type="file"
                  class="avatar-input"
                  :accept="avatarInputAccept"
                  @change="onAvatarInputChange"
                />
              </div>
              <p>Allowed extensions: {{ ACCEPTABLE_AVATAR_EXTENSIONS }}</p>
            </div>
            <label for="email">Email</label>
            <BaseInput v-model="user.email" type="email" id="email" required />
            <label for="nickname">Nickname</label>
            <BaseInput
              v-model="user.nickname"
              type="text"
              id="nickname"
              required
            />
            <label for="password">Password</label>
            <BaseInput
              v-model="user.password"
              type="password"
              id="password"
              required
            />
          </div>
          <BaseButton @click="register">Register</BaseButton>
        </form>
      </CardContent>
      <CardFooter class="card-footer">
        <span
          >Do you already have an account?
          <RouterLink to="/login" class="link">Login</RouterLink></span
        >
        <div class="error">{{ error }}</div>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import type { TUserToRegister } from "@/schemas/user";
import { File as FileModule, Str } from "@/shared";
import { useAuthStore } from "@/stores/auth-store";
import { Trash, User } from "lucide-vue-next";
import { ref, useTemplateRef } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const form = ref<HTMLFormElement>();
const user = ref<Required<TUserToRegister>>({
  nickname: Str.EMPTY,
  email: Str.EMPTY,
  password: Str.EMPTY,
  avatar: Str.EMPTY,
});
const error = ref(Str.EMPTY);

const AVATAR_FILE_CONSTRAINTS = {
  mimeType: [
    FileModule.MimeType.gif,
    FileModule.MimeType.jpeg,
    FileModule.MimeType.png,
    FileModule.MimeType.svg,
  ] satisfies FileModule.MimeType[],
};

const avatarInput = useTemplateRef("avatar-input");
const avatarInputAccept = Object.values(AVATAR_FILE_CONSTRAINTS.mimeType).join(
  Str.COMMA,
);
const ACCEPTABLE_AVATAR_EXTENSIONS = Object.values(
  AVATAR_FILE_CONSTRAINTS.mimeType,
)
  .map((value) => FileModule.ExtensionByMimeType[value])
  .join(Str.COMMA_WITH_SPACE)
  .toLocaleUpperCase();

function getAvatarSource() {
  return typeof user.value.avatar === "string" || user.value.avatar === null
    ? user.value.avatar ?? Str.EMPTY
    : URL.createObjectURL(user.value.avatar);
}

function clickAvatarInput() {
  (avatarInput.value as HTMLInputElement | null)?.click();
}

function clearAvatar() {
  user.value.avatar = null;
  if (avatarInput.value) {
    (
      avatarInput.value as {
        value: string;
      }
    ).value = Str.EMPTY;
  }
}

function onAvatarInputChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    user.value.avatar = file;
  }
}

async function register() {
  if (form.value?.checkValidity()) {
    const result = await authStore.register(user.value);
    if (result instanceof Error) {
      error.value = result.message;
    } else {
      router.push("/");
    }
  }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-grow: 1;
  overflow: auto;
}

.card {
  margin: auto;
}

.card-header > * {
  text-align: center;
}

.card-footer {
  flex-direction: column;
  gap: calc(var(--step) * 2);
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  position: relative;
  padding: 1rem;
  place-self: center;
}

.select-avatar-button {
  padding: 0.5rem;
  border-radius: 100%;
  border: none;
}

.avatar-image {
  width: 4.5rem;
  height: 4.5rem;
  object-fit: cover;
  border-radius: 100%;
}

.clear-avatar-button {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 100%;
  color: var(--destructive-foreground);
  background-color: var(--destructive);
  border: none;
  aspect-ratio: 1;
}

.clear-avatar-button > * {
  margin: auto;
}

.avatar-wrapper:hover .clear-avatar-button {
  display: inline-flex;
}

.avatar-input {
  display: none;
}

.empty-avatar-icon {
  width: 4.5rem;
  height: 4.5rem;
}

.error {
  color: var(--destructive);
}

.link {
  text-decoration: none;
}
</style>
