<template>
  <ul class="chat-list">
    <ChatCard
      v-for="chat in chats"
      :key="chat.id"
      :chat="chat"
      :selected="chat === selectedChat"
      @select="emit('select', chat)"
    />
  </ul>
</template>

<script setup lang="ts">
import ChatCard from "@/components/ChatCard.vue";
import type { TChat } from "@/schemas/chat";

defineProps<{
  chats: TChat[];
  selectedChat?: TChat;
}>();

const emit = defineEmits<{
  select: [chat: TChat];
}>();
</script>

<style scoped>
.chat-list {
  overflow: auto;
  max-width: 100%;
}
.chat-list > * {
  margin-top: 12px;
}

.chat-list > *:first-child {
  margin-top: 0;
}
</style>
