<template>
  <div class="header">
    <div v-if="chat.type === ChatType.POLYLOGUE">
      <BaseButton @click="userAddWindowVisibility = true">Add user</BaseButton>
    </div>
  </div>
  <Teleport to="body">
    <ModalWindow
      v-if="userAddWindowVisibility"
      @close="userAddWindowVisibility = false"
    >
      <FindUserInput @click-on-user="addUserToChat" />
    </ModalWindow>
  </Teleport>
</template>

<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import ModalWindow from "@/components/ModalWindow.vue";
import FindUserInput from "@/components/FindUserInput.vue";
import { type TChat, ChatType } from "@/schemas/chat";
import { ref } from "vue";
import { useChatStore } from "@/stores/chat-store";
import type { TUser } from "@/schemas/user";
import { useNotificationStore } from "@/stores/notification-store";
import { Notification, NotificationStatus } from "@/schemas/notification";

const props = defineProps<{
  chat: TChat;
}>();

const chatStore = useChatStore();
const notificationStore = useNotificationStore();

const userAddWindowVisibility = ref(false);

async function addUserToChat(user: TUser) {
  const result = await chatStore.addUserToChat({
    userId: user.id,
    chatId: props.chat.id,
  });
  if (result instanceof Error) {
    notificationStore.add(
      new Notification(NotificationStatus.FAILURE, result.message),
    );
  }
  userAddWindowVisibility.value = false;
}
</script>

<style scoped>
.header {
  background-color: aqua;
  padding: 16px;
}
</style>
