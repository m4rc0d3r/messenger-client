<template>
  <Card class="card-footer">
    <CardHeader>
      <CardTitle>User profile</CardTitle>
    </CardHeader>
    <CardContent class="found-user-profile">
      <div class="avatar-wrapper">
        <img
          v-if="user.avatar"
          :src="user.avatar"
          alt="Avatar"
          class="avatar-image"
        />
        <User v-else class="empty-avatar-icon" />
      </div>
      <div class="text-data">
        <span>Email: {{ user.email }}</span>
        <span>Nickname: {{ user.nickname }}</span>
      </div>
    </CardContent>
    <CardFooter class="card-footer">
      <BaseButton
        v-if="!chatWithUserAlreadyExists"
        ref="create-chat-button"
        class="create-chat-button"
        @click="
          emit('create-chat', {
            type: ChatType.dialogue,
            interlocutorId: user.id,
          })
        "
        >Create chat</BaseButton
      >
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import { User } from "lucide-vue-next";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { ChatType, type TCreateChat } from "@/schemas/chat";
import type { TUser } from "@/schemas/user";
import { useChatStore } from "@/stores/chat-store";
import { nextTick, onMounted, ref, useTemplateRef } from "vue";
const props = defineProps<{
  user: TUser;
}>();

const emit = defineEmits<{
  "create-chat": [chat: TCreateChat];
}>();

const chatWithUserAlreadyExists = ref(false);
const createChatButton = useTemplateRef("create-chat-button");

onMounted(() => {
  chatWithUserAlreadyExists.value = Boolean(
    useChatStore().chats.value.find((chat) => {
      return (
        chat.users.find((user) => {
          return user.id === props.user.id;
        }) && chat.type === ChatType.dialogue
      );
    }),
  );
});

onMounted(async () => {
  await nextTick();
  (
    createChatButton.value as {
      buttonRef: HTMLButtonElement | null | undefined;
    }
  )?.buttonRef?.focus();
});
</script>

<style scoped>
.card {
  padding: calc(var(--step) * 2);
}

.found-user-profile {
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: calc(var(--step) * 3);
}

.avatar-wrapper {
  place-self: center;
}

.avatar-image {
  width: 6rem;
  height: 6rem;
  object-fit: cover;
  border-radius: 100%;
}

.empty-avatar-icon {
  width: 6rem;
  height: 6rem;
}

.text-data {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-footer {
  justify-content: end;
}

.create-chat-button:focus {
  outline: 0.25rem solid black;
}
</style>
