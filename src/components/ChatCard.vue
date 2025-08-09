<template>
  <Card
    @click="emit('select')"
    :class="{
      'chat-card': true,
      'chat-card__selected': selected,
      'chat-card__no-selected': !selected,
    }"
  >
    <CardContent class="card-content">
      <img
        v-if="chatCover"
        :src="chatCover"
        alt="Chat cover"
        class="chat-cover"
      />
      <Users v-else class="empty-chat-cover" />
      <div class="text-data">
        <span>{{ chat.name }}</span>
        <span v-if="chat.messages.length > 0"
          >{{ lastMessageSender }}: {{ lastMessageText }}</span
        >
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from "@/components/card";
import { type TChat } from "@/schemas/chat";
import { MESSAGE_DISCRIMINATOR, MessageOriginType } from "@/schemas/message";
import type { TUser } from "@/schemas/user";
import { Str } from "@/shared";
import { useAuthStore } from "@/stores/auth-store";
import { useMessageStore } from "@/stores/message-store";
import { useUserStore } from "@/stores/user-store";
import { computedAsync } from "@vueuse/core";
import { Users } from "lucide-vue-next";
import { computed, onMounted, onUpdated, ref } from "vue";

const props = defineProps<{
  chat: TChat;
  selected: boolean;
}>();

const emit = defineEmits({
  select() {
    return true;
  },
});

const authStore = useAuthStore();
const userStore = useUserStore();
const messageStore = useMessageStore();

const sender = ref<TUser>();

const chatCover = computed(() => {
  return props.chat.users.find(
    ({ id }) =>
      authStore.currentUser.value && id !== authStore.currentUser.value.id,
  )?.avatar;
});

onMounted(async () => {
  await updateSender();
});

onUpdated(async () => {
  await updateSender();
});

const lastMessageText = computedAsync(async () => {
  const lastMessage = props.chat.messages[props.chat.messages.length - 1];
  if (!lastMessage) return Str.EMPTY;

  if (lastMessage[MESSAGE_DISCRIMINATOR] === MessageOriginType.original)
    return lastMessage.text;

  const originalMessage = await messageStore.getMessageById(
    lastMessage.messageId,
  );
  if (originalMessage instanceof Error) return Str.EMPTY;

  return originalMessage.text;
});

const lastMessageSender = computedAsync(async () => {
  const lastMessage = props.chat.messages[props.chat.messages.length - 1];
  if (!lastMessage) return Str.EMPTY;

  if (lastMessage[MESSAGE_DISCRIMINATOR] === MessageOriginType.original)
    return props.chat.users.find(({ id }) => id === lastMessage.senderId)
      ?.nickname;

  const originalMessage = await messageStore.getMessageById(
    lastMessage.messageId,
  );
  if (originalMessage instanceof Error) return Str.EMPTY;

  const sender = await userStore.getUserById(originalMessage.senderId);
  if (!sender) return Str.EMPTY;

  return sender.nickname;
});

async function updateSender() {
  if (props.chat.messages.length > 0) {
    sender.value = await userStore.getUserById(
      props.chat.messages[props.chat.messages.length - 1].senderId,
    );
  }
}
</script>

<style scoped>
.chat-card {
  list-style-type: none;
  border-radius: 8px;
  max-width: 100%;
  overflow: hidden;
}

.chat-card > * {
  text-overflow: ellipsis;
}

.chat-card__no-selected:hover {
  background-color: var(--secondary);
  cursor: pointer;
}

.chat-card__selected {
  background-color: var(--primary);
  color: var(--primary-foreground);
}

.card-content {
  padding: 0;
  display: flex;
  gap: calc(var(--step) * 4);
  align-items: center;
}

.chat-cover {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: cover;
  border-radius: 100%;
  flex-shrink: 0;
}

.empty-chat-cover {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.text-data {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
