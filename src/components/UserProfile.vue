<template>
  <Card class="card-footer">
    <CardHeader>
      <CardTitle>User profile</CardTitle>
    </CardHeader>
    <CardContent class="found-user-profile">
      <span>Email: {{ user.email }}</span>
      <span>Nickname: {{ user.nickname }}</span>
    </CardContent>
    <CardFooter class="card-footer">
      <BaseButton
        v-if="!chatWithUserAlreadyExists"
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
        }) && chat.type === ChatType.dialogue
      );
    }),
  );
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

.card-footer {
  justify-content: end;
}
</style>
