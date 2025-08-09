<script setup lang="ts">
import ChatNotificationToastItem from "./ToastItem.vue";
import { useChatNotificationsStore } from "./store";

const chatNotificationsStore = useChatNotificationsStore();
</script>

<template>
  <div class="toast-wrapper">
    <ul class="notifications">
      <li
        v-for="notification in chatNotificationsStore.notifications"
        :key="notification.id"
      >
        <ChatNotificationToastItem
          :notification="notification"
          @close="chatNotificationsStore.remove(notification.id)"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.toast-wrapper {
  position: fixed;
  top: 2rem;
  right: 2rem;
  bottom: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.notifications {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 0.5rem;
  max-height: 100%;
  overflow: auto;
}
</style>
