<template>
  <Card
    :class="{
      'chat-card': true,
      'chat-card__selected': selected,
      'chat-card__no-selected': !selected,
      class: true,
    }"
  >
    <CardContent class="card-content">
      <img
        v-if="chatCover"
        :src="chatCover"
        alt="Chat cover"
        class="chat-cover"
      />
      <Users v-else class="empty-chat-cover" />
      <div class="text-data">
        <span>{{ chat.name }}</span>
        <span v-if="chat.messages.length > 0"
          >{{ lastMessageSender }}: {{ lastMessageText }}</span
        >
      </div>
      <div
        v-if="
          showActionButton &&
          (chat.authorId === authStore.currentUser.value?.id ||
            chat.type === ChatType.dialogue)
        "
        class="chat-card-action"
      >
        <button
          ref="menuBtn"
          @click.stop="isMenuOpen = !isMenuOpen"
          class="menu-btn"
        >
          <EllipsisVertical />
        </button>
        <Popover
          v-model="isMenuOpen"
          :anchor="menuBtn"
          placement="right"
          class="chat-card-action-popover"
        >
          <template #default>
            <ul class="chat-card-action-list">
              <li>
                <button
                  @click="
                    () => {
                      isMenuOpen = false;
                      deleteChatWindowVisibility = true;
                    }
                  "
                >
                  Delete
                </button>
              </li>
            </ul>
          </template>
        </Popover>
      </div>
    </CardContent>
  </Card>
  <ModalWindow
    v-if="deleteChatWindowVisibility"
    @close="deleteChatWindowVisibility = false"
  >
    <div class="delete-chat-window">
      <p>Are you sure you want to delete the chat?</p>
      <div class="delete-chat-window__buttons">
        <BaseButton ref="delete-chat-yes-button" @click="deleteChat(chat)"
          >Yes</BaseButton
        >
        <BaseButton @click="deleteChatWindowVisibility = false">No</BaseButton>
      </div>
    </div>
  </ModalWindow>
</template>

<script setup lang="ts">
import { Card, CardContent } from "@/components/card";
import ModalWindow from "@/components/ModalWindow.vue";
import Popover from "@/components/Popover.vue";
import { ChatType, type TChat } from "@/schemas/chat";
import { MESSAGE_DISCRIMINATOR, MessageOriginType } from "@/schemas/message";

import BaseButton from "@/components/BaseButton.vue";
import type { TUser } from "@/schemas/user";
import { Str } from "@/shared";
import { useAuthStore } from "@/stores/auth-store";
import { useMessageStore } from "@/stores/message-store";
import { EllipsisVertical } from "lucide-vue-next";

import { Notification, NotificationStatus } from "@/schemas/notification";
import { useChatStore } from "@/stores/chat-store";
import { useNotificationStore } from "@/stores/notification-store";
import { useUserStore } from "@/stores/user-store";
import { computedAsync } from "@vueuse/core";
import { Users } from "lucide-vue-next";
import {
  computed,
  onMounted,
  onUpdated,
  ref,
  useTemplateRef,
  watchEffect,
} from "vue";

const props = defineProps<{
  chat: TChat;
  selected: boolean;
  showActionButton?: boolean | undefined;
  class?: string | undefined;
}>();

const authStore = useAuthStore();
const userStore = useUserStore();
const chatStore = useChatStore();
const notificationStore = useNotificationStore();
const messageStore = useMessageStore();

const sender = ref<TUser>();

const deleteChatWindowVisibility = ref(false);
const isMenuOpen = ref(false);
const menuBtn = ref<HTMLElement | null>(null);
const deleteChatYesButton = useTemplateRef("delete-chat-yes-button");

const chatCover = computed(() => {
  return props.chat.users.find(
    ({ id }) =>
      authStore.currentUser.value && id !== authStore.currentUser.value.id,
  )?.avatar;
});

onMounted(async () => {
  await updateSender();
});

onUpdated(async () => {
  await updateSender();
});

watchEffect(async () => {
  if (deleteChatWindowVisibility.value) {
    setTimeout(() => {
      (
        deleteChatYesButton.value as {
          buttonRef: HTMLButtonElement | null | undefined;
        }
      )?.buttonRef?.focus();
    }, 0);
  }
});
const lastMessageText = computedAsync(async () => {
  const lastMessage = props.chat.messages[props.chat.messages.length - 1];
  if (!lastMessage) return Str.EMPTY;

  if (lastMessage[MESSAGE_DISCRIMINATOR] === MessageOriginType.original)
    return lastMessage.text;

  const originalMessage = await messageStore.getMessageById(
    lastMessage.messageId,
  );
  if (originalMessage instanceof Error) return Str.EMPTY;

  return originalMessage.text;
});

const lastMessageSender = computedAsync(async () => {
  const lastMessage = props.chat.messages[props.chat.messages.length - 1];
  if (!lastMessage) return Str.EMPTY;

  if (lastMessage[MESSAGE_DISCRIMINATOR] === MessageOriginType.original)
    return props.chat.users.find(({ id }) => id === lastMessage.senderId)
      ?.nickname;

  const originalMessage = await messageStore.getMessageById(
    lastMessage.messageId,
  );
  if (originalMessage instanceof Error) return Str.EMPTY;

  const sender = await userStore.getUserById(originalMessage.senderId);
  if (!sender) return Str.EMPTY;

  return sender.nickname;
});

async function updateSender() {
  if (props.chat.messages.length > 0) {
    sender.value = await userStore.getUserById(
      props.chat.messages[props.chat.messages.length - 1].senderId,
    );
  }
}

async function deleteChat(chat: Pick<TChat, "id">) {
  const result = await chatStore.deleteChatOnServer(chat);
  if (result instanceof Error) {
    notificationStore.add(
      new Notification(
        NotificationStatus.FAILURE,
        result.message === "Internal server error"
          ? "Failed to delete chat."
          : result.message,
      ),
    );
  }
  deleteChatWindowVisibility.value = false;
}
</script>

<style scoped>
.chat-card {
  list-style-type: none;
  border-radius: 8px;
  width: 100%;
  overflow: hidden;
}

.chat-card > * {
  text-overflow: ellipsis;
}

.chat-card__no-selected:hover {
  background-color: var(--secondary);
  cursor: pointer;
}

.chat-card__selected {
  background-color: var(--primary);
  color: var(--primary-foreground);
}

.card-content {
  padding: 0;
  display: flex;
  gap: calc(var(--step) * 4);
  align-items: center;
}

.chat-cover {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: cover;
  border-radius: 100%;
  flex-shrink: 0;
}

.empty-chat-cover {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.text-data {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.text-data > * {
  text-align: left;
  font-size: 1rem;
}

.chat-card-action {
  margin-left: auto;
}

.chat-card-action > * {
  color: black;
  background-color: transparent;
  border: none;
}

.menu-btn {
  border-radius: 100%;
  aspect-ratio: 1;
}

.menu-btn:hover {
  background-color: lightgray;
}

.chat-card-action-popover {
  background-color: var(--background);
}

.chat-card-action-list {
  display: flex;
  flex-direction: column;
  gap: calc(var(--step) * 2);
  background-color: var(--background);
}

.chat-card-action-list > li {
  display: flex;
  border-radius: var(--radius-lg);
}

.chat-card-action-list > li:hover {
  background-color: aqua;
}

.chat-card-action-list > li > button {
  border: none;
  background-color: transparent;
  color: var(--primary);
  width: 100%;
  text-align: left;
  font-size: 1rem;
}

.chat__text {
  font-family: inherit;
}

.delete-chat-window {
  padding: calc(var(--step) * 3);
  display: flex;
  flex-direction: column;
  gap: calc(var(--step) * 2);
  border-radius: var(--radius-lg);
  background-color: white;
}

.delete-chat-window__buttons {
  display: flex;
  justify-content: space-evenly;
}

.delete-chat-window__buttons > *:focus {
  outline: 0.25rem solid black;
}
</style>
