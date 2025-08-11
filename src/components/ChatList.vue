<template>
  <ul ref="chat-list" class="chat-list">
    <li v-for="(chat, index) in chats" :key="chat.id">
      <button class="chat-card-wrapper" @click="emit('select', index)">
        <ChatCard
          :chat="chat"
          :selected="index === selectedChatIndex"
          :show-action-button="showActionButton"
          class="chat-card"
        />
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import ChatCard from "@/components/ChatCard.vue";
import type { TChat } from "@/schemas/chat";
import { nextTick, onMounted, useTemplateRef } from "vue";

const props = defineProps<{
  chats: TChat[];
  selectedChatIndex: number;
  focusedChatIndex?: number | undefined;
  showActionButton?: boolean | undefined;
}>();

const emit = defineEmits<{
  select: [index: number];
}>();

const chatList = useTemplateRef("chat-list");

onMounted(async () => {
  if (
    !(typeof props.focusedChatIndex === "number" && props.focusedChatIndex >= 0)
  )
    return;

  await nextTick();
  (
    (chatList.value as HTMLUListElement | null)?.children
      .item(props.focusedChatIndex)
      ?.children.item(0) as HTMLButtonElement | undefined
  )?.focus();
});
</script>

<style scoped>
.chat-list {
  overflow: auto;
  max-width: 100%;
  display: flex;
  flex-direction: column;
}

.chat-card-wrapper {
  background-color: transparent;
  border: none;
  display: flex;
  width: 100%;
  padding: 0;
}

.chat-card-wrapper:focus {
  outline: 0.125rem solid black;
  outline-offset: -0.125rem;
  border-radius: var(--radius-lg);
}

.chat-card {
  padding: calc(var(--step) * 2);
  width: 100%;
}
</style>
