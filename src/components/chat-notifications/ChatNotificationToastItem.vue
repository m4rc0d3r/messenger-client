<script setup lang="ts">
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { ChatType } from "@/schemas/chat";
import { useAuthStore } from "@/stores/auth-store";
import { useChatStore } from "@/stores/chat-store";
import { useUserStore } from "@/stores/user-store";
import { computedAsync } from "@vueuse/core";
import { X } from "lucide-vue-next";
import { computed } from "vue";
import {
  type ChatNotification,
  ChatNotificationType,
  DISCRIMINATOR,
} from "./chat-notification";

const { notification } = defineProps<{
  notification: ChatNotification;
}>();

const emit = defineEmits<{
  close: [];
}>();

const authStore = useAuthStore();
const chatStore = useChatStore();
const userStore = useUserStore();

const TITLE_BY_CHAT_NOTIFICATION_TYPE: Record<ChatNotificationType, string> = {
  NEW_MESSAGE: "New message",
  NEW_CHAT: "New chat",
  NEW_CHAT_MEMBER: "New chat member",
};

const title = computed(
  () => TITLE_BY_CHAT_NOTIFICATION_TYPE[notification[DISCRIMINATOR]],
);

const content = computedAsync(async () => {
  const errorText = "Failed to retrieve required data.";
  switch (notification[DISCRIMINATOR]) {
    case ChatNotificationType.NEW_CHAT: {
      return notification.payload.type === ChatType.dialogue
        ? `User "${
            notification.payload.users.find(
              ({ id }) => id !== authStore.currentUser.value?.id,
            )?.nickname
          }" has created a personal chat with you.`
        : `You have been added to the "${notification.payload.name}" group chat.`;
    }
    case ChatNotificationType.NEW_CHAT_MEMBER: {
      const chats = await chatStore.getChatsOfUser();
      if (chats instanceof Error) return errorText;

      const chatName = chats.value.find(
        ({ id }) => id === notification.payload.chat.id,
      )?.name;
      return `User "${notification.payload.user.nickname}" has been added to the group chat "${chatName}".`;
    }
    case ChatNotificationType.NEW_MESSAGE: {
      const chats = await chatStore.getChatsOfUser();
      if (chats instanceof Error) return errorText;

      const chat = chats.value.find(
        ({ id }) => id === notification.payload.chatId,
      );
      if (!chat) return errorText;

      const senderNickname = (
        await userStore.getUserById(notification.payload.senderId)
      )?.nickname;
      if (!senderNickname) return errorText;

      return chat.type === ChatType.dialogue
        ? `User "${senderNickname}" sent you a message in private chat.`
        : `User "${senderNickname}" sent a message to the chat "${chat.name}".`;
    }
  }
});
</script>

<template>
  <Card class="card">
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <CardAction @click="emit('close')">
        <X />
      </CardAction>
    </CardHeader>
    <CardContent>
      {{ content }}
    </CardContent>
  </Card>
</template>

<style scoped>
.card {
  padding: 1.5rem;
  background-color: var(--secondary);
  color: var(--secondary-foreground);
  gap: calc(var(--step) * 2);
}
</style>
