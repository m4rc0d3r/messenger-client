<template>
  <div>
    <form ref="form" @submit.prevent class="form">
      <div class="fields-to-fill">
        <label for="email">Email</label>
        <input v-model="user.email" type="email" id="email" required />
        <label for="nickname">Nickname</label>
        <input v-model="user.nickname" type="text" id="nickname" required />
        <label for="password">Password</label>
        <input v-model="user.password" type="password" id="password" required />
      </div>
      <button @click="register">Register</button>
      <div>
        <span
          >Do you already have an account?
          <RouterLink to="/login">Login</RouterLink></span
        >
      </div>
      <div class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";
import type { TUserToRegister } from "@/schemas/user";

const router = useRouter();
const authStore = useAuthStore();

const form = ref<HTMLFormElement>();
const user = ref<TUserToRegister>({
  nickname: "",
  email: "",
  password: "",
});
const error = ref("");

async function register() {
  // if (form.value?.checkValidity()) {
  const result = await authStore.register(user.value);
  if (result instanceof Error) {
    error.value = result.message;
  } else {
    router.push("/");
  }
  // }
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
}

.fields-to-fill {
  display: grid;
  grid-template-columns: auto 1fr;
}

.error {
  color: red;
}
</style>
