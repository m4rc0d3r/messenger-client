<template>
  <li class="found-user-card">
    <span>{{ user.email }}</span>
    <span>{{ user.nickname }}</span>
  </li>
</template>

<script setup lang="ts">
import type { TUser } from "@/schemas/user";

const props = defineProps<{
  user: TUser;
}>();
</script>

<style scoped>
.found-user-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
}

.found-user-card:hover {
  background-color: aqua;
  cursor: pointer;
}
</style>
