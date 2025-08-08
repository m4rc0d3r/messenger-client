<template>
  <li
    :class="{
      'message-card': true,
      'my-message-wrapper':
        authStore.currentUser.value?.id === message.senderId,
      'message-from-someone-else-wrapper':
        authStore.currentUser.value?.id !== message.senderId,
    }"
  >
    <Card
      :class="{
        'message-card': true,
      }"
    >
      <CardHeader>
        <CardTitle>{{ sender?.nickname }}</CardTitle>
        <CardAction class="message-card-action">
          <button @click="tryToForwardMessage(message)">Forward</button>
          <button
            v-if="
              authStore.currentUser.value?.id === message.senderId &&
              !isEditedNow
            "
            @click="enterEditMode"
          >
            Edit
          </button>
          <button
            v-if="
              authStore.currentUser.value?.id === message.senderId &&
              !isEditedNow
            "
            @click="deleteMessageWindowVisibility = true"
          >
            Delete
          </button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <pre class="message__text">{{ message.text }}</pre>
      </CardContent>
      <CardFooter class="message-card-footer">
        <time :datetime="message.date.toISOString()">{{
          new Intl.DateTimeFormat("en", {
            dateStyle: "long",
            timeStyle: "medium",
          }).format(message.date)
        }}</time>
      </CardFooter>
    </Card>
    <ModalWindow
      v-if="chatsWindowVisibility"
      @close="chatsWindowVisibility = false"
    >
      <Card class="forward-message-card">
        <CardHeader>
          <CardTitle>Forward message</CardTitle>
          <CardDescription
            >Select the chat you want to forward the message
            to.</CardDescription
          >
        </CardHeader>
        <CardContent>
          <ChatList
            :chats="chatStore.chats.value"
            :selected-chat="undefined"
            @select="(chat: TChat) => forwardMessage(chat, message)"
          />
        </CardContent>
      </Card>
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
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
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
.my-message-wrapper {
  align-self: flex-end;
  max-width: 70%;
}

.my-message-wrapper > * {
  text-overflow: ellipsis;
}

.message-from-someone-else-wrapper {
  align-self: flex-start;
}

.message-card {
  gap: calc(var(--step) * 2);
  padding: calc(var(--step) * 2);
}

.message-card-action > * {
  color: var(--primary);
  background-color: transparent;
  border: none;
}

.message-card-action > *:hover {
  text-decoration: underline;
  cursor: pointer;
}

.message__text {
  font-family: inherit;
}

.delete-message-window {
  padding: calc(var(--step) * 3);
  display: flex;
  flex-direction: column;
  gap: calc(var(--step) * 2);
  border-radius: var(--radius-lg);
  background-color: white;
}

.delete-message-window__buttons {
  display: flex;
  justify-content: space-evenly;
}

.message-card-footer {
  justify-content: end;
}

.forward-message-card {
  padding: calc(var(--step) * 2);
}

.forward-message-card-content {
  padding: var(--step);
}
</style>
