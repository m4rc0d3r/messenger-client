<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/register">Register</RouterLink>
    <RouterLink to="/login">Login</RouterLink>
    <button @click="logout">Logout</button>
  </nav>
  <RouterView />
</template>

<script setup lang="ts">
import { useRouter, RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";

const router = useRouter();
const authStore = useAuthStore();

async function logout() {
  await authStore.logout();
  router.push("/login");
}
</script>

<style scoped></style>
