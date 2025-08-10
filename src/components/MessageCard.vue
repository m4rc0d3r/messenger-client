<template>
  <li
    :class="{
      'message-card': true,
      'my-message-wrapper':
        authStore.currentUser.value?.id === message.senderId,
      'message-from-someone-else-wrapper':
        authStore.currentUser.value?.id !== message.senderId,
    }"
  >
    <Card
      :class="{
        'message-card': true,
      }"
    >
      <CardHeader class="message-card-header">
        <CardTitle>{{ sender?.nickname }}</CardTitle>
        <CardDescription v-if="forwardedBy">
          Forwarded by {{ forwardedBy.nickname }}
        </CardDescription>
        <CardAction class="message-card-action">
          <button
            ref="menuBtn"
            @click="isMenuOpen = !isMenuOpen"
            class="menu-btn"
          >
            <EllipsisVertical />
          </button>
          <Popover
            v-model="isMenuOpen"
            :anchor="menuBtn"
            :placement="
              authStore.currentUser.value?.id === message.senderId
                ? 'left'
                : 'bottom'
            "
            class="message-card-action-popover"
          >
            <template #default>
              <ul class="message-card-action-list">
                <li>
                  <button
                    @click="
                      () => {
                        isMenuOpen = false;
                        tryToForwardMessage(message);
                      }
                    "
                  >
                    Forward
                  </button>
                </li>
                <li
                  v-if="
                    message.originType === MessageOriginType.original &&
                    authStore.currentUser.value?.id === message.senderId &&
                    !isEditedNow
                  "
                >
                  <button
                    @click="
                      () => {
                        isMenuOpen = false;
                        enterEditMode();
                      }
                    "
                  >
                    Edit
                  </button>
                </li>
                <li
                  v-if="
                    authStore.currentUser.value?.id === message.senderId &&
                    !isEditedNow
                  "
                >
                  <button
                    @click="
                      () => {
                        isMenuOpen = false;
                        deleteMessageWindowVisibility = true;
                      }
                    "
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </template>
          </Popover>
        </CardAction>
      </CardHeader>
      <CardContent class="message-card-content">
        <pre class="message__text">{{ messageText }}</pre>
      </CardContent>
      <CardFooter class="message-card-footer">
        <time :datetime="message.date.toISOString()">{{
          new Intl.DateTimeFormat("en", {
            dateStyle: "long",
            timeStyle: "medium",
          }).format(message.date)
        }}</time>
      </CardFooter>
    </Card>
    <ModalWindow
      v-if="chatsWindowVisibility"
      @close="chatsWindowVisibility = false"
    >
      <Card class="forward-message-card">
        <CardHeader>
          <CardTitle>Forward message</CardTitle>
          <CardDescription
            >Select the chat you want to forward the message
            to.</CardDescription
          >
        </CardHeader>
        <CardContent>
          <ChatList
            :chats="chatStore.chats.value"
            :selected-chat-index="-1"
            :focused-chat-index="0"
            @select="
              (index: number) =>
                forwardMessage(chatStore.chats.value[index], message)
            "
          />
        </CardContent>
      </Card>
    </ModalWindow>
    <ModalWindow
      v-if="deleteMessageWindowVisibility"
      @close="deleteMessageWindowVisibility = false"
    >
      <div class="delete-message-window">
        <p>Are you sure you want to delete the message?</p>
        <div class="delete-message-window__buttons">
          <BaseButton
            ref="delete-message-yes-button"
            @click="deleteMessage(message)"
            >Yes</BaseButton
          >
          <BaseButton @click="deleteMessageWindowVisibility = false"
            >No</BaseButton
          >
        </div>
      </div>
    </ModalWindow>
  </li>
</template>

<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import ChatList from "@/components/ChatList.vue";
import ModalWindow from "@/components/ModalWindow.vue";
import Popover from "@/components/Popover.vue";
import type { TChat } from "@/schemas/chat";
import {
  MESSAGE_DISCRIMINATOR,
  MessageOriginType,
  type OriginalMessage,
  type TMessage,
} from "@/schemas/message";
import { Notification, NotificationStatus } from "@/schemas/notification";
import type { TUser } from "@/schemas/user";
import { useAuthStore } from "@/stores/auth-store";
import { useChatStore } from "@/stores/chat-store";
import { useMessageStore } from "@/stores/message-store";
import { useNotificationStore } from "@/stores/notification-store";
import { useUserStore } from "@/stores/user-store";
import { EllipsisVertical } from "lucide-vue-next";
import {
  computed,
  nextTick,
  onMounted,
  ref,
  useTemplateRef,
  watchEffect,
} from "vue";

const authStore = useAuthStore();
const userStore = useUserStore();
const chatStore = useChatStore();
const messageStore = useMessageStore();
const notificationStore = useNotificationStore();

const props = defineProps<{
  message: TMessage;
}>();

const emit = defineEmits<{
  "enter-edit-mode": [reset: typeof resetToViewMode];
}>();

const sender = ref<TUser>();
const isEditedNow = ref(false);
const chatsWindowVisibility = ref(false);
const deleteMessageWindowVisibility = ref(false);

const forwardedBy = ref<TUser>();
const originalMessage = ref<OriginalMessage>();

const isMenuOpen = ref(false);
const menuBtn = ref<HTMLElement | null>(null);

const deleteMessageYesButton = useTemplateRef("delete-message-yes-button");

onMounted(async () => {
  if (props.message[MESSAGE_DISCRIMINATOR] === MessageOriginType.original) {
    sender.value = await userStore.getUserById(props.message.senderId);
  } else {
    const [fwdBy, orMsg] = await Promise.all([
      userStore.getUserById(props.message.senderId),
      messageStore.getMessageById(props.message.messageId),
    ]);
    if (fwdBy) {
      forwardedBy.value = fwdBy;
    }
    if (!(orMsg instanceof Error)) {
      originalMessage.value = orMsg;
      sender.value = await userStore.getUserById(orMsg.senderId);
    }
  }
});

const messageText = computed(() =>
  props.message[MESSAGE_DISCRIMINATOR] === MessageOriginType.original
    ? props.message.text
    : originalMessage.value?.text,
);

watchEffect(async () => {
  if (deleteMessageWindowVisibility.value) {
    await nextTick();
    (
      deleteMessageYesButton.value as {
        buttonRef: HTMLButtonElement | null | undefined;
      }
    )?.buttonRef?.focus();
  }
});

async function deleteMessage(message: TMessage) {
  const result = await chatStore.deleteMessage(message);
  if (result instanceof Error) {
    notificationStore.add(
      new Notification(
        NotificationStatus.FAILURE,
        result.message === "Internal server error"
          ? "Failed to delete message."
          : result.message,
      ),
    );
  }
  deleteMessageWindowVisibility.value = false;
}

function enterEditMode() {
  emit("enter-edit-mode", resetToViewMode);
  isEditedNow.value = true;
}

function resetToViewMode() {
  isEditedNow.value = false;
}

async function forwardMessage(chat: TChat, message: TMessage) {
  const result = await chatStore.forwardMessage(message, chat);
  if (result instanceof Error) {
    notificationStore.add(
      new Notification(
        NotificationStatus.FAILURE,
        "You can't forward this message due to the sender's privacy settings",
      ),
    );
  }
  chatsWindowVisibility.value = false;
}

async function tryToForwardMessage(message: TMessage) {
  const sender = await userStore.getUserByIdFromServer(message.senderId);
  if (!(sender instanceof Error) && sender.isPrivate) {
    notificationStore.add(
      new Notification(
        NotificationStatus.FAILURE,
        "You can't forward this message due to the sender's privacy settings",
      ),
    );
  } else {
    chatsWindowVisibility.value = true;
  }
}
</script>

<style scoped>
.my-message-wrapper {
  align-self: flex-end;
  max-width: 70%;
}

.my-message-wrapper > * {
  text-overflow: ellipsis;
}

.message-from-someone-else-wrapper {
  align-self: flex-start;
}

.message-card {
  gap: calc(var(--step) * 2);
  padding: calc(var(--step) * 2);
}

.message-card-header,
.message-card-content,
.message-card-footer {
  padding: 0;
}

.message-card-action > * {
  color: var(--primary);
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

.message-card-action-popover {
  background-color: var(--background);
}

.message-card-action-list {
  display: flex;
  flex-direction: column;
  gap: calc(var(--step) * 2);
  background-color: var(--background);
}

.message-card-action-list > li {
  display: flex;
  border-radius: var(--radius-lg);
}

.message-card-action-list > li:hover {
  background-color: aqua;
}

.message-card-action-list > li > button {
  border: none;
  background-color: transparent;
  color: var(--primary);
  width: 100%;
  text-align: left;
  font-size: 1rem;
}

.message__text {
  font-family: inherit;
}

.delete-message-window {
  padding: calc(var(--step) * 3);
  display: flex;
  flex-direction: column;
  gap: calc(var(--step) * 2);
  border-radius: var(--radius-lg);
  background-color: white;
}

.delete-message-window__buttons {
  display: flex;
  justify-content: space-evenly;
}

.delete-message-window__buttons > *:focus {
  outline: 0.25rem solid black;
}

.message-card-footer {
  justify-content: end;
}

.forward-message-card {
  padding: calc(var(--step) * 2);
}

.forward-message-card-content {
  padding: var(--step);
}
</style>
