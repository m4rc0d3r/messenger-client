<template>
  <div class="found-user-profile">
    <span>Email: {{ user.email }}</span>
    <span>Nickname: {{ user.nickname }}</span>
    <BaseButton
      v-if="!chatWithUserAlreadyExists"
      @click="
        emit('create-chat', {
          type: ChatType.DIALOGUE,
          interlocutorId: user.id,
        })
      "
      >Create chat</BaseButton
    >
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import { ChatType, type TCreateChat } from "@/schemas/chat";
import type { TUser } from "@/schemas/user";
import { useChatStore } from "@/stores/chat-store";
import { onMounted, ref } from "vue";

const props = defineProps<{
  user: TUser;
}>();

const emit = defineEmits<{
  "create-chat": [chat: TCreateChat];
}>();

const chatWithUserAlreadyExists = ref(false);

onMounted(() => {
  chatWithUserAlreadyExists.value = Boolean(
    useChatStore().chats.value.find((chat) => {
      return (
        chat.users.find((user) => {
          return user.id === props.user.id;
        }) && chat.type === ChatType.DIALOGUE
      );
    }),
  );
});
</script>

<style scoped>
.found-user-profile {
  display: flex;
  flex-direction: column;
  padding: 12px;
}

.found-user-profile > * {
  margin-top: 8px;
}

.found-user-profile > *:first-child {
  margin-top: 0;
}
</style>
