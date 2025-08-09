<template>
  <ul class="chat-list">
    <li v-for="(chat, index) in chats" :key="chat.id">
      <ChatCard
        :chat="chat"
        :selected="index === selectedChatIndex"
        class="chat-card"
        @select="emit('select', index)"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import ChatCard from "@/components/ChatCard.vue";
import type { TChat } from "@/schemas/chat";

defineProps<{
  chats: TChat[];
  selectedChatIndex: number;
}>();

const emit = defineEmits<{
  select: [index: number];
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
