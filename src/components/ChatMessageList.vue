<template>
  <ul v-if="messages.length > 0" ref="messageList" class="message-list">
    <MessageCard
      v-for="message in messages"
      :key="message.id"
      :message="message"
      @enter-edit-mode="
        (resetToViewMode: () => void) =>
          emit('enter-message-editing-mode', message, resetToViewMode)
      "
    />
  </ul>
  <div v-else class="no-messages-wrapper">
    <p class="no-messages">There are no messages in this chat yet.</p>
  </div>
</template>

<script setup lang="ts">
import MessageCard from "@/components/MessageCard.vue";
import type { TMessage } from "@/schemas/message";
import { onMounted, onUpdated, ref } from "vue";

defineProps<{
  messages: TMessage[];
}>();

const emit = defineEmits<{
  "enter-message-editing-mode": [
    message: TMessage,
    resetToViewMode: () => void,
  ];
}>();

const messageList = ref<HTMLUListElement>();

function scrollToLastMessage() {
  if (messageList.value) {
    messageList.value.scroll({
      top: messageList.value.scrollHeight,
      behavior: "smooth",
    });
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
  padding: 12px;
}

.message-list > * {
  margin-top: 12px;
  margin-left: 12px;
  margin-right: 12px;
}

.message-list > *:first-child {
  margin-top: 0;
}

.no-messages-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  background: linear-gradient(to right, #d4d9b7, #66997d);
}

.no-messages {
  font-size: 36px;
  text-align: center;
}
</style>
