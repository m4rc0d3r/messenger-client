<template>
  <ul v-if="messages.length > 0" ref="messageList" class="message-list">
    <MessageCard
      v-for="message in messages"
      :key="message.id"
      :message="message"
    />
  </ul>
  <p v-else>No messages</p>
</template>

<script setup lang="ts">
import { defineProps, ref, onUpdated, onMounted } from "vue";
import MessageCard from "@/components/MessageCard.vue";
import type { TMessage } from "@/schemas/message";

const props = defineProps<{
  messages: TMessage[];
}>();

const messageList = ref<HTMLUListElement>();

function scrollToLastMessage() {
  if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight;
  }
}

onMounted(() => {
  setTimeout(scrollToLastMessage, 100);
});

onUpdated(() => {
  setTimeout(scrollToLastMessage, 100);
});
</script>

<style scoped>
.message-list {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: start;
  flex-grow: 1;
  background: linear-gradient(to right, #d4d9b7, #66997d);
}

.message-list > * {
  margin-top: 12px;
  margin-left: 12px;
  margin-right: 12px;
}

.message-list > *:first-child {
  margin-top: 0;
}
</style>
