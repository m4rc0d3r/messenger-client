<template>
  <div v-if="chat" class="chat-area">
    <ChatMessageList :messages="chat.messages" />
    <div class="input-block">
      <textarea
        v-model="messageToSend"
        class="input-block__input"
        rows="5"
        @keypress.enter="sendMessage"
      ></textarea>
      <button @click="sendMessage" class="input-block__button">Send</button>
    </div>
  </div>
  <div v-else>Select a chat to view messages</div>
</template>

<script setup lang="ts">
import { defineProps, ref, type Ref } from "vue";
import ChatMessageList from "@/components/ChatMessageList.vue";
import type { TChat } from "@/schemas/chat";
import type { TMessage, TMessageToSend } from "@/schemas/message";
import { MessageService } from "@/services/message-service";
import { Notification, NotificationStatus } from "@/schemas/notification";
import { useNotificationStore } from "@/stores/notification-store";

const props = defineProps<{
  chat?: TChat;
}>();

const emit = defineEmits({
  "send-message"(chatId: TChat["id"], message: TMessage) {
    return true;
  },
});

const notificationStore = useNotificationStore();

const messageToSend = ref<TMessageToSend["text"]>("");

async function sendMessage() {
  if (props.chat) {
    const result = await MessageService.sendMessage({
      text: messageToSend.value,
      chatId: props.chat.id,
    });
    if (result instanceof Error) {
      notificationStore.add(
        new Notification(NotificationStatus.FAILURE, result.message),
      );
    } else {
      messageToSend.value = "";
      emit("send-message", props.chat.id, result);
    }
  }
}
</script>

<style scoped>
.chat-area {
  background-color: grey;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.input-block {
  display: flex;
}

.input-block__input {
  resize: none;
  flex-grow: 1;
}
</style>
