<template>
  <ul class="chat-list">
    <ChatCard
      v-for="chat in chats"
      :key="chat.id"
      :chat="chat"
      :selected="chat === selectedChat"
      class="chat-card"
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
  display: flex;
  flex-direction: column;
}

.chat-card {
  padding: calc(var(--step) * 2);
}
</style>
