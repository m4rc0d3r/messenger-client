<template>
  <div class="page">
    <Card class="card">
      <CardHeader class="card-header">
        <CardTitle>Login</CardTitle>
        <CardDescription
          >Log in to your account to access messages.</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form ref="form" @submit.prevent class="form">
          <div class="form-fields">
            <label for="email">Email</label>
            <BaseInput
              ref="email-input"
              v-model="user.email"
              type="email"
              id="email"
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
          <BaseButton @click="login">Login</BaseButton>
        </form>
      </CardContent>
      <CardFooter class="card-footer">
        <span
          >Don't have an account?
          <RouterLink to="/register" class="link">Create</RouterLink></span
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
import type { TUserToLogin } from "@/schemas/user";
import { useAuthStore } from "@/stores/auth-store";
import { onMounted, ref, useTemplateRef } from "vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const emailInput = useTemplateRef("email-input");

const form = ref<HTMLFormElement>();
const user = ref<Required<TUserToLogin>>({
  email: "",
  password: "",
});
const error = ref("");

onMounted(() => {
  (
    emailInput.value as {
      inputRef: HTMLInputElement | null | undefined;
    }
  )?.inputRef?.focus();
});

async function login() {
  if (form.value?.checkValidity()) {
    const result = await authStore.login(user.value);
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

.error {
  color: var(--destructive);
}

.link {
  text-decoration: none;
}
</style>
