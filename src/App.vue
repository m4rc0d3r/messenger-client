<template>
  <div class="layout">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/register">Register</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
      <button @click="logout">Logout</button>
      <span>Current User: {{ authStore.currentUser }}</span>
    </nav>
    <RouterView />
  </div>
  <div class="notifications-wrapper" v-if="notifications.length > 0">
    <SimpleNotification
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
      @delete="notificationStore.remove(notification.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter, RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";
import { useNotificationStore } from "@/stores/notification-store";
import SimpleNotification from "@/components/SimpleNotification.vue";
import { webSocketConnection } from "@/http/websocket";

const notificationStore = useNotificationStore();
const notifications = notificationStore.notifications;

const router = useRouter();
const authStore = useAuthStore();

async function logout() {
  await authStore.logout();
  webSocketConnection.close();
  router.push("/login");
}
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.notifications-wrapper {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
