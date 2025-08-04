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
import { useAuthStore } from "@/stores/auth-store";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const form = ref<HTMLFormElement>();
const user = ref<Required<TUserToRegister>>({
  nickname: "",
  email: "",
  password: "",
});
const error = ref("");

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

.error {
  color: var(--destructive);
}

.link {
  text-decoration: none;
}
</style>
