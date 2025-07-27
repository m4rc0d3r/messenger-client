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
      <div class="buttons">
        <span
          @click="tryToForwardMessage(message)"
          class="button-to-manage-message"
          >Forward</span
        >
        <span
          v-if="
            authStore.currentUser.value?.id === message.senderId && !isEditedNow
          "
          @click="enterEditMode"
          class="button-to-manage-message"
          >Edit</span
        >
        <span
          v-if="
            authStore.currentUser.value?.id === message.senderId && !isEditedNow
          "
          @click="deleteMessageWindowVisibility = true"
          class="button-to-manage-message"
          >Delete</span
        >
      </div>
    </div>
    <pre class="message__text">{{ message.text }}</pre>
    <span class="message__date">{{ message.date.toISOString() }}</span>
    <ModalWindow
      v-if="chatsWindowVisibility"
      @close="chatsWindowVisibility = false"
    >
      <ChatList
        :chats="chatStore.chats.value"
        :selected-chat="undefined"
        @select="(chat) => forwardMessage(chat, message)"
      />
    </ModalWindow>
    <ModalWindow
      v-if="deleteMessageWindowVisibility"
      @close="deleteMessageWindowVisibility = false"
    >
      <div class="delete-message-window">
        <p>Are you sure you want to delete the message?</p>
        <div class="delete-message-window__buttons">
          <BaseButton @click="deleteMessage(message)">Yes</BaseButton>
          <BaseButton @click="deleteMessageWindowVisibility = false"
            >No</BaseButton
          >
        </div>
      </div>
    </ModalWindow>
  </li>
</template>

<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import ChatList from "@/components/ChatList.vue";
import ModalWindow from "@/components/ModalWindow.vue";
import type { TChat } from "@/schemas/chat";
import type { TMessage } from "@/schemas/message";
import { Notification, NotificationStatus } from "@/schemas/notification";
import type { TUser } from "@/schemas/user";
import { useAuthStore } from "@/stores/auth-store";
import { useChatStore } from "@/stores/chat-store";
import { useNotificationStore } from "@/stores/notification-store";
import { useUserStore } from "@/stores/user-store";
import { onMounted, ref } from "vue";

const authStore = useAuthStore();
const userStore = useUserStore();
const chatStore = useChatStore();
const notificationStore = useNotificationStore();

const props = defineProps<{
  message: TMessage;
}>();

const emit = defineEmits<{
  "enter-edit-mode": [reset: typeof resetToViewMode];
}>();

const sender = ref<TUser>();
const isEditedNow = ref(false);
const chatsWindowVisibility = ref(false);
const deleteMessageWindowVisibility = ref(false);

onMounted(async () => {
  sender.value = await userStore.getUserById(props.message.senderId);
});

async function deleteMessage(message: TMessage) {
  await chatStore.deleteMessage(message);
}

function enterEditMode() {
  emit("enter-edit-mode", resetToViewMode);
  isEditedNow.value = true;
}

function resetToViewMode() {
  isEditedNow.value = false;
}

async function forwardMessage(chat: TChat, message: TMessage) {
  const result = await chatStore.forwardMessage(message, chat);
  if (result instanceof Error) {
    notificationStore.add(
      new Notification(
        NotificationStatus.FAILURE,
        "You can't forward this message due to the sender's privacy settings",
      ),
    );
  }
  chatsWindowVisibility.value = false;
}

async function tryToForwardMessage(message: TMessage) {
  const sender = await userStore.getUserByIdFromServer(message.senderId);
  console.log("Sender:", sender);
  if (!(sender instanceof Error) && sender.isPrivate) {
    notificationStore.add(
      new Notification(
        NotificationStatus.FAILURE,
        "You can't forward this message due to the sender's privacy settings",
      ),
    );
  } else {
    chatsWindowVisibility.value = true;
  }
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

.button-to-manage-message {
  color: rgb(83, 68, 68);
}

.button-to-manage-message:hover {
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

.delete-message-window {
  padding: 20px;
}

.delete-message-window > * {
  margin-top: 10px;
}

.delete-message-window > *:first-child {
  margin-top: 0;
}

.delete-message-window__buttons {
  display: flex;
  justify-content: space-evenly;
}
</style>
