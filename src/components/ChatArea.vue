<template>
  <div v-if="chat" class="chat-area">
    <ChatHeader :chat="chat" />
    <ChatMessageList :messages="chat.messages" />
    <div class="input-block">
      <textarea
        v-model="messageToSend"
        class="input-block__input"
        rows="5"
        @keypress="(ev: KeyboardEvent) => {
          if (ev.key === 'Enter' && !ev.shiftKey) {
            sendMessage();
          }
        }"
      ></textarea>
      <BaseButton @click="sendMessage" class="input-block__button"
        >Send</BaseButton
      >
    </div>
  </div>
  <div class="select-chat-message" v-else>
    <p>Select a chat to view messages</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, type Ref } from "vue";
import ChatMessageList from "@/components/ChatMessageList.vue";
import BaseButton from "@/components/BaseButton.vue";
import ChatHeader from "@/components/ChatHeader.vue";
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
      // emit("send-message", props.chat.id, result);
    }
  }
}
</script>

<style scoped>
.chat-area {
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
  border-radius: 8px;
  margin-right: 8px;
}

.select-chat-message {
  display: flex;
  justify-content: center;
  align-items: center;
}

.select-chat-message > * {
  font-size: 36px;
}
</style>
