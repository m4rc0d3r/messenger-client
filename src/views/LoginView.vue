<template>
  <div>
    <form ref="form" @submit.prevent class="form">
      <div class="fields-to-fill">
        <label for="email">Email</label>
        <BaseInput v-model="user.email" type="email" id="email" required />
        <label for="password">Password</label>
        <BaseInput
          v-model="user.password"
          type="password"
          id="password"
          required
        />
      </div>
      <BaseButton @click="login">Login</BaseButton>
      <div>
        <span
          >Don't have an account?
          <RouterLink to="/register" class="link">Create</RouterLink></span
        >
      </div>
      <div class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";
import type { TUserToLogin } from "@/schemas/user";

const router = useRouter();
const authStore = useAuthStore();

const form = ref<HTMLFormElement>();
const user = ref<Required<TUserToLogin>>({
  email: "",
  password: "",
});
const error = ref("");

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
.form {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(230, 222, 222);
  padding: 20px;
}

form > * {
  margin-top: 12px;
}

form > *:first-child {
  margin-top: 0;
}

.fields-to-fill {
  display: grid;
  grid-template-columns: auto 1fr;
  row-gap: 12px;
  column-gap: 8px;
}

.error {
  color: red;
}

.link {
  text-decoration: none;
}
</style>
