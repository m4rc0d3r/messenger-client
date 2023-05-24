<template>
  <div class="found-user-profile">
    <span>Email: {{ user.email }}</span>
    <span>Nickname: {{ user.nickname }}</span>
    <BaseButton
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
import type { TUser } from "@/schemas/user";
import BaseButton from "@/components/BaseButton.vue";
import { ChatType, type TCreateChat } from "@/schemas/chat";

const props = defineProps<{
  user: TUser;
}>();

const emit = defineEmits({
  "create-chat"(chat: TCreateChat) {
    return true;
  },
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
