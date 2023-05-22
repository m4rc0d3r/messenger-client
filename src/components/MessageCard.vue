<template>
  <li
    :class="{
      'message-card': true,
      'my-message': authStore.currentUser.value?.id === message.senderId,
      'message-from-someone-else':
        authStore.currentUser.value?.id !== message.senderId,
    }"
  >
    <span class="message__sender">{{ sender?.nickname }}</span>
    <span class="message__text">{{ message.text }}</span>
    <span class="message__date">{{ message.date.toISOString() }}</span>
  </li>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from "vue";
import type { TMessage } from "@/schemas/message";
import { useAuthStore } from "@/stores/auth-store";
import { useUserStore } from "@/stores/user-store";
import type { TUser } from "@/schemas/user";

const authStore = useAuthStore();
const userStore = useUserStore();

const props = defineProps<{
  message: TMessage;
}>();

const sender = ref<TUser>();

onMounted(async () => {
  sender.value = await userStore.getUserById(props.message.senderId);
});
</script>

<style scoped>
.message-card {
  background-color: yellowgreen;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.my-message {
  align-self: flex-end;
  max-width: 70%;
}

.my-message > * {
  text-overflow: ellipsis;
}

message-from-someone-else {
  align-self: flex-start;
}

.message__sender {
  align-self: flex-start;
}

.message__text {
  align-self: flex-start;
}

.message__date {
  align-self: flex-end;
}
</style>
