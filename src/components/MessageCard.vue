<template>
  <li
    :class="{
      'message-card': true,
      'my-message': authStore.currentUser.value?.id === message.senderId,
      'message-from-someone-else':
        authStore.currentUser.value?.id !== message.senderId,
    }"
  >
    <div class="message__header">
      <span class="message__sender">{{ sender?.nickname }}</span>
      <div
        v-if="
          authStore.currentUser.value?.id === message.senderId && !isEditedNow
        "
        class="buttons"
      >
        <span @click="enterEditMode" class="button">Edit</span>
        <span @click="deleteMessage(message)" class="button">Delete</span>
      </div>
    </div>
    <pre class="message__text">{{ message.text }}</pre>
    <span class="message__date">{{ message.date.toISOString() }}</span>
  </li>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { TMessage } from "@/schemas/message";
import { useAuthStore } from "@/stores/auth-store";
import { useUserStore } from "@/stores/user-store";
import { useChatStore } from "@/stores/chat-store";
import type { TUser } from "@/schemas/user";

const authStore = useAuthStore();
const userStore = useUserStore();
const chatStore = useChatStore();

const props = defineProps<{
  message: TMessage;
}>();

const emit = defineEmits({
  "enter-edit-mode"(reset: typeof resetToViewMode) {
    return true;
  },
});

const sender = ref<TUser>();
const isEditedNow = ref(false);

onMounted(async () => {
  sender.value = await userStore.getUserById(props.message.senderId);
});

async function deleteMessage(message: TMessage) {
  const result = await chatStore.deleteMessage(message);
}

function enterEditMode() {
  emit("enter-edit-mode", resetToViewMode);
  isEditedNow.value = true;
}

function resetToViewMode() {
  isEditedNow.value = false;
}
</script>

<style scoped>
.message-card {
  background-color: white;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  max-width: 70%;
  /* overflow: auto; */
}

.message-card > * {
  /* text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap; */
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

.message__header {
  display: flex;
  justify-content: space-between;
}

.buttons {
  display: flex;
  flex-direction: column;
}

.button {
  color: rgb(83, 68, 68);
}

.button:hover {
  text-decoration: underline;
  cursor: pointer;
}

.message__sender {
  align-self: flex-start;
}

.message__text {
  font-family: inherit;
  align-self: flex-start;
  margin: 10px 0;
}

.message__date {
  align-self: flex-end;
}
</style>
