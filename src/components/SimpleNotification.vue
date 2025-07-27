<template>
  <div
    :class="{
      notification: true,
      success: notification.status === 'SUCCESS',
      failure: notification.status === 'FAILURE',
    }"
  >
    <span class="notification-message">{{ notification.message }}</span>
    <input
      class="notification__delete-button"
      type="image"
      src="https://cdn-icons-png.flaticon.com/512/57/57165.png"
      alt="Delete message"
      title="Delete message"
      @click="emit('delete')"
    />
  </div>
</template>

<script setup lang="ts">
import { Notification } from "@/schemas/notification";

defineProps({
  notification: {
    type: Notification,
    required: true,
  },
});

const emit = defineEmits({
  delete() {
    return true;
  },
});
</script>

<style scoped>
.notification {
  margin: 5px 0;
  padding: 5px 10px;
  display: flex;
}
.success {
  background-color: lightgreen;
}

.failure {
  background-color: pink;
}

.notification-message {
  margin-right: 5px;
}

.notification__delete-button {
  height: 20px;
  width: 20px;
}
</style>
