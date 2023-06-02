<template>
  <div class="layout">
    <div class="left-bar">
      <FindUserInput @click-on-user="showUserProfile" />
      <ChatList
        :chats="chats"
        :selected-chat="selectedChat"
        @select="selectChat"
      />
    </div>
    <ChatArea :chat="selectedChat" @send-message="addMessageToChat" />
    <ModalWindow
      v-if="userProfileVisibility && selectedUser"
      @close="userProfileVisibility = false"
    >
      <FoundUserProfile :user="selectedUser" @create-chat="createChat" />
    </ModalWindow>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useChatStore } from "@/stores/chat-store";
import { Notification, NotificationStatus } from "@/schemas/notification";
import { useNotificationStore } from "@/stores/notification-store";
import { type TChat, type TCreateChat } from "@/schemas/chat";
import { APIError } from "@/schemas/api-error";
import ChatList from "@/components/ChatList.vue";
import ChatArea from "@/components/ChatArea.vue";
import ModalWindow from "@/components/ModalWindow.vue";
import FoundUserProfile from "@/components/FoundUserProfile.vue";
import FindUserInput from "@/components/FindUserInput.vue";
import type { TMessage } from "@/schemas/message";
import { webSocketConnection } from "@/http/websocket";
import {
  WebSocketDataType,
  type ISendTokenDTO,
} from "@/schemas/websocket-data";
import { useAuthStore } from "@/stores/auth-store";
import type { TUser } from "@/schemas/user";

const router = useRouter();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();

const chatStore = useChatStore();
const chats = ref<TChat[]>([]);
const selectedChat = ref<TChat>();
const userProfileVisibility = ref(false);
const selectedUser = ref<TUser>();

onMounted(async () => {
  const result = await chatStore.getChatsOfUser();
  if (result instanceof Error) {
    if (result instanceof APIError) {
      notificationStore.add(
        new Notification(NotificationStatus.FAILURE, result.message),
      );
    }
    router.push("/login");
  } else {
    chats.value = chatStore.chats.value;
    if (chats.value.length === 0) {
      notificationStore.add(
        new Notification(NotificationStatus.SUCCESS, "You don't have chats"),
      );
    }
    webSocketConnection.connect();
  }
});

function selectChat(chat: TChat) {
  selectedChat.value = chat;
}

function addMessageToChat(chatId: TChat["id"], message: TMessage) {
  chatStore.addMessageToChat(chatId, message);
}

function showUserProfile(user: TUser) {
  selectedUser.value = user;
  userProfileVisibility.value = true;
}

async function createChat(chat: TCreateChat) {
  const result = await chatStore.createChat(chat);
  if (result instanceof Error) {
    notificationStore.add(
      new Notification(NotificationStatus.FAILURE, result.message),
    );
  }
  userProfileVisibility.value = false;
}

webSocketConnection.addEventListener("SendMessage", (e) => {
  const message = (e as CustomEvent<TMessage>).detail;
  addMessageToChat(message.chatId, message);
});

webSocketConnection.addEventListener("CreateChat", async (e) => {
  const chat = (e as CustomEvent<TChat>).detail;
  chatStore.chats.value.push(chat);
  await chatStore.getAllMessagesFromChat(chat.id);
});
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 1fr 3fr;
  overflow: hidden;
  padding-bottom: 8px;
}

.left-bar {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 8px;
  overflow: hidden;
}

.left-bar > * {
  margin-top: 8px;
}

.left-bar > *:first-child {
  margin-top: 0;
}
</style>
