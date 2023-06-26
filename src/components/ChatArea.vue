<template>
  <div v-if="chat" class="chat-area">
    <ChatHeader :chat="chat" v-model:message-filter="messageFilter" />
    <ChatMessageList
      :messages="filteredMessages"
      @enter-message-editing-mode="enterMessageEditingMode"
    />
    <div class="input-block">
      <textarea
        v-model="messageToSendOrToEdit"
        class="input-block__input"
        rows="5"
        @keypress="(ev: KeyboardEvent) => {
          if (ev.key === 'Enter' && !ev.shiftKey) {
            if (mode === Mode.SEND) {
              sendMessage();
            } else {
              editMessage();
            }
          }
        }"
      ></textarea>
      <BaseButton
        v-if="mode === Mode.SEND"
        @click="sendMessage"
        class="input-block__button"
        >Send</BaseButton
      >
      <div v-else>
        <BaseButton @click="editMessage">Save</BaseButton>
        <BaseButton @click="resetToSendMode">Cancel</BaseButton>
      </div>
    </div>
  </div>
  <div class="select-chat-message" v-else>
    <p>Select a chat to view messages</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type Ref } from "vue";
import ChatMessageList from "@/components/ChatMessageList.vue";
import BaseButton from "@/components/BaseButton.vue";
import ChatHeader from "@/components/ChatHeader.vue";
import type { TChat } from "@/schemas/chat";
import type { TMessage, TMessageToSend } from "@/schemas/message";
import { MessageService } from "@/services/message-service";
import { Notification, NotificationStatus } from "@/schemas/notification";
import { useNotificationStore } from "@/stores/notification-store";
import { useChatStore } from "@/stores/chat-store";

enum Mode {
  SEND,
  EDIT,
}

const props = defineProps<{
  chat?: TChat;
}>();

const emit = defineEmits({
  "send-message"(chatId: TChat["id"], message: TMessage) {
    return true;
  },
});

const notificationStore = useNotificationStore();
const chatStore = useChatStore();

const messageToSendOrToEdit = ref<TMessageToSend["text"]>("");
const messageFilter = ref("");
const mode = ref(Mode.SEND);
const editedMessage = ref<TMessage>({
  id: 1,
  text: "",
  date: new Date(Date.now()),
  senderId: 1,
  chatId: 1,
});
const resetMessageToViewMode = ref<() => void>();

const filteredMessages = computed(() => {
  return (
    props.chat?.messages.filter((message) =>
      message.text
        .toLocaleLowerCase()
        .includes(messageFilter.value.toLocaleLowerCase()),
    ) ?? []
  );
});

async function sendMessage() {
  if (props.chat) {
    const result = await MessageService.sendMessage({
      text: messageToSendOrToEdit.value,
      chatId: props.chat.id,
    });
    if (result instanceof Error) {
      notificationStore.add(
        new Notification(NotificationStatus.FAILURE, result.message),
      );
    } else {
      messageToSendOrToEdit.value = "";
    }
  }
}

function resetToSendMode() {
  mode.value = Mode.SEND;
  messageToSendOrToEdit.value = "";
  if (resetMessageToViewMode.value) {
    resetMessageToViewMode.value();
  }
}

function enterMessageEditingMode(
  message: TMessage,
  resetToViewMode: () => void,
) {
  mode.value = Mode.EDIT;
  if (editedMessage.value && resetMessageToViewMode.value) {
    resetMessageToViewMode.value();
  }
  editedMessage.value = message;
  messageToSendOrToEdit.value = editedMessage.value.text;
  resetMessageToViewMode.value = resetToViewMode;
}

async function editMessage() {
  editedMessage.value.text = messageToSendOrToEdit.value;
  const result = await chatStore.editMessage(editedMessage.value);
  if (resetMessageToViewMode.value) {
    resetMessageToViewMode.value();
  }
  messageToSendOrToEdit.value = "";
  mode.value = Mode.SEND;
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
