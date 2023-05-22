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
import { defineProps, ref, onUpdated } from "vue";
import MessageCard from "@/components/MessageCard.vue";
import type { TMessage } from "@/schemas/message";

const props = defineProps<{
  messages: TMessage[];
}>();

const lastMessage = ref(props.messages[props.messages.length - 1]);

const messageList = ref<HTMLUListElement>();

function scrollToLastMessage() {
  if (messageList.value) {
    messageList.value.scrollTop = messageList.value?.scrollHeight;
  }
}

onUpdated(() => {
  // if (lastMessage.value.chatId !== props.messages[0].chatId) {
  //   lastMessage.value = props.messages[props.messages.length - 1];
  //   return;
  // }

  // if (lastMessage.value === props.messages[props.messages.length - 2]) {
  //   scrollToLastMessage();
  //   lastMessage.value = props.messages[props.messages.length - 1];
  // }
  scrollToLastMessage();
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
