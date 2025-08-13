<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { EVENT_BUS_INJECTION_KEY } from "@/event-bus/bus";
import { EventBusEventType } from "@/event-bus/event";
import { ChatType } from "@/schemas/chat";
import { MESSAGE_DISCRIMINATOR, MessageOriginType } from "@/schemas/message";
import { Str } from "@/shared";
import { useAuthStore } from "@/stores/auth-store";
import { useChatStore } from "@/stores/chat-store";
import { useUserStore } from "@/stores/user-store";
import { computedAsync } from "@vueuse/core";
import { X } from "lucide-vue-next";
import { computed, inject } from "vue";
import {
  type ChatNotification,
  ChatNotificationType,
  DISCRIMINATOR,
} from "./chat-notification";
import { useChatNotificationsStore } from "./store";

const props = defineProps<{
  notification: ChatNotification;
}>();

const emit = defineEmits<{
  close: [];
}>();

const authStore = useAuthStore();
const chatStore = useChatStore();
const userStore = useUserStore();
const chatNotificationsStore = useChatNotificationsStore();

const eventBus = inject(EVENT_BUS_INJECTION_KEY);

const TITLE_BY_CHAT_NOTIFICATION_TYPE: Record<ChatNotificationType, string> = {
  NEW_MESSAGE: "New message",
  NEW_CHAT: "New chat",
  NEW_CHAT_MEMBER: "New chat member",
};

const title = computed(
  () => TITLE_BY_CHAT_NOTIFICATION_TYPE[props.notification[DISCRIMINATOR]],
);

const content = computedAsync(async () => {
  const errorText = "Failed to retrieve required data.";
  const notification = props.notification;
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
    return [
      "User ",
      notification.payload.user.nickname,
      " has been added to ",
      ...(chatId.value === notification.selectedChatId
        ? ["this chat"]
        : ["the group chat ", chatName]),
      Str.PERIOD,
    ].join(Str.EMPTY);
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
      ? `User "${senderNickname}" ${
        notification.payload[MESSAGE_DISCRIMINATOR] ===
            MessageOriginType.original
          ? "sent"
          : "forwarded"
      } you a message in personal chat.`
      : `User "${senderNickname}" ${
        notification.payload[MESSAGE_DISCRIMINATOR] ===
            MessageOriginType.original
          ? "sent"
          : "forwarded"
      } a message to the chat "${chat.name}".`;
  }
  }
});

function selectChat() {
  const notification = props.notification;
  eventBus?.dispatchEvent(EventBusEventType.SELECT_CHAT, {
    id:
      notification[DISCRIMINATOR] === ChatNotificationType.NEW_CHAT
        ? notification.payload.id
        : notification[DISCRIMINATOR] === ChatNotificationType.NEW_CHAT_MEMBER
          ? notification.payload.chat.id
          : notification.payload.chatId,
  });
  chatNotificationsStore.remove(props.notification.id);
}

const chatId = computed(() =>
  props.notification[DISCRIMINATOR] === ChatNotificationType.NEW_CHAT
    ? props.notification.payload.id
    : props.notification[DISCRIMINATOR] === ChatNotificationType.NEW_CHAT_MEMBER
      ? props.notification.payload.chat.id
      : props.notification.payload.chatId,
);
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
    <CardFooter
      v-if="chatId !== notification.selectedChatId"
      class="card-footer"
    >
      <BaseButton @click="selectChat">Go to chat</BaseButton>
    </CardFooter>
  </Card>
</template>

<style scoped>
.card {
  padding: 1.5rem;
  background-color: var(--secondary);
  color: var(--secondary-foreground);
  gap: calc(var(--step) * 2);
}

.card-footer {
  justify-content: end;
}
</style>
