<template>
  <li class="found-user-card">
    <div class="avatar-wrapper">
      <img
        v-if="user.avatar"
        :src="user.avatar"
        alt="Avatar"
        class="avatar-image"
      />
      <User v-else class="empty-avatar-icon" />
    </div>
    <div class="text-data">
      <span>{{ user.email }}</span>
      <span>{{ user.nickname }}</span>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { TUser } from "@/schemas/user";
import { User } from "lucide-vue-next";

defineProps<{
  user: TUser;
}>();
</script>

<style scoped>
.found-user-card {
  display: flex;
  gap: 0.5rem;
  border-radius: 8px;
}

.avatar-wrapper {
  position: relative;
  place-self: center;
}

.avatar-image {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: cover;
  border-radius: 100%;
}

.empty-avatar-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.text-data {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
