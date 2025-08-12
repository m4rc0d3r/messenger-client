<template>
  <div v-if="chat" class="chat-area">
    <ChatHeader :chat="chat" v-model:message-filter="messageFilter" />
    <ChatMessageList
      :messages="filteredMessages"
      @enter-message-editing-mode="enterMessageEditingMode"
    />
    <div class="input-block">
      <textarea
        ref="message-input"
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
        @keydown.esc="resetToSendMode"
      >
      </textarea>
      <BaseButton
        v-if="mode === Mode.SEND"
        class="input-block__button"
        @click="sendMessage"
        >Send</BaseButton
      >
      <div class="input-block__buttons" v-else>
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
import BaseButton from "@/components/BaseButton.vue";
import ChatHeader from "@/components/ChatHeader.vue";
import ChatMessageList from "@/components/ChatMessageList.vue";
import type { TChat } from "@/schemas/chat";
import {
  MESSAGE_DISCRIMINATOR,
  MessageOriginType,
  type ForwardedMessage,
  type OriginalMessage,
  type TMessage,
  type TMessageToSend,
} from "@/schemas/message";
import { Notification, NotificationStatus } from "@/schemas/notification";
import { MessageService } from "@/services/message-service";
import { Str } from "@/shared";
import { useChatStore } from "@/stores/chat-store";
import { useMessageStore } from "@/stores/message-store";
import { useNotificationStore } from "@/stores/notification-store";
import { ref, useTemplateRef, watchEffect } from "vue";

enum Mode {
  SEND,
  EDIT,
}

const props = defineProps<{
  chat?: TChat;
}>();

const notificationStore = useNotificationStore();
const chatStore = useChatStore();
const messageStore = useMessageStore();

const messageToSendOrToEdit = ref<TMessageToSend["text"]>("");
const messageFilter = ref("");
const filteredMessages = ref<TMessage[]>(props.chat?.messages ?? []);
const mode = ref(Mode.SEND);
const editedMessage = ref<Omit<OriginalMessage, "originType">>({
  id: 1,
  text: "",
  date: new Date(Date.now()),
  senderId: 1,
  chatId: 1,
});
const resetMessageToViewMode = ref<() => void>();

const messageInput = useTemplateRef("message-input");

watchEffect(async () => {
  filteredMessages.value = await getFilteredMessages();
});

watchEffect(() => {
  props.chat;
  (messageInput.value as HTMLTextAreaElement | null)?.focus();
});

async function getFilteredMessages() {
  if (messageFilter.value.length === 0) return props.chat?.messages ?? [];

  if (!props.chat) return [];

  const originalMessages = (
    await Promise.all(
      props.chat.messages
        .filter(
          (message): message is ForwardedMessage =>
            message.originType === MessageOriginType.forwarded,
        )
        .map(({ messageId }) => messageStore.getMessageById(messageId)),
    )
  ).filter((value): value is OriginalMessage => !(value instanceof Error));

  return (
    props.chat.messages.filter((message) =>
      (message[MESSAGE_DISCRIMINATOR] === MessageOriginType.original
        ? message.text
        : originalMessages.find(({ id }) => id === message.messageId)?.text ??
          Str.EMPTY
      )
        .toLocaleLowerCase()
        .includes(messageFilter.value.toLocaleLowerCase()),
    ) ?? []
  );
}

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
  message: OriginalMessage,
  resetToViewMode: () => void,
) {
  mode.value = Mode.EDIT;
  if (editedMessage.value && resetMessageToViewMode.value) {
    resetMessageToViewMode.value();
  }
  editedMessage.value = message;
  messageToSendOrToEdit.value = editedMessage.value.text;
  resetMessageToViewMode.value = resetToViewMode;
  (messageInput.value as HTMLTextAreaElement | null)?.focus();
}

async function editMessage() {
  editedMessage.value.text = messageToSendOrToEdit.value;
  await chatStore.editMessage({
    originType: MessageOriginType.original,
    ...editedMessage.value,
  });
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
  padding: calc(var(--step) * 2);
  gap: calc(var(--step) * 2);
}

.input-block__input {
  resize: none;
  flex-grow: 1;
  border: 1px solid var(--primary);
  border-radius: var(--radius-sm);
  font-family: "Roboto", sans-serif;
}

.input-block__input:focus-visible {
  outline: calc(var(--step) / 2) solid var(--primary);
}

.input-block__button {
  align-self: center;
}

.input-block__buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: calc(var(--step) * 2);
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
