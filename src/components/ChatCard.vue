<template>
  <li
    @click="emit('select')"
    :class="{ 'chat-card': true, 'chat-card__selected': selected }"
  >
    <span>{{ chat.name }}</span>
    <span v-if="chat.messages.length > 0"
      >{{ sender?.nickname }}:
      {{ chat.messages[chat.messages.length - 1].text }}</span
    >
  </li>
</template>

<script setup lang="ts">
import { defineProps, onMounted, onUpdated, ref } from "vue";
import type { TChat } from "@/schemas/chat";
import type { TUser } from "@/schemas/user";
import { useUserStore } from "@/stores/user-store";
import { useChatStore } from "@/stores/chat-store";

const props = defineProps<{
  chat: TChat;
  selected: boolean;
}>();

const emit = defineEmits({
  select() {
    return true;
  },
});

const userStore = useUserStore();
const chatStore = useChatStore();

const sender = ref<TUser>();

onMounted(async () => {
  await updateSender();
});

onUpdated(async () => {
  await updateSender();
});

async function updateSender() {
  if (props.chat.messages.length > 0) {
    sender.value = await userStore.getUserById(
      props.chat.messages[props.chat.messages.length - 1].senderId,
    );
  }
}
</script>

<style scoped>
.chat-card {
  list-style-type: none;
  border-radius: 8px;
  max-width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chat-card > * {
  text-overflow: ellipsis;
}

.chat-card:hover {
  background-color: aqua;
  cursor: pointer;
}

.chat-card__selected {
  background-color: #369bb4;
}
</style>
