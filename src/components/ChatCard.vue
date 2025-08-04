<template>
  <li
    @click="emit('select')"
    :class="{
      'chat-card': true,
      'chat-card__selected': selected,
      'chat-card__no-selected': !selected,
    }"
  >
    <span>{{ chat.name }}</span>
    <span v-if="chat.messages.length > 0"
      >{{ sender?.nickname }}:
      {{ chat.messages[chat.messages.length - 1].text }}</span
    >
  </li>
</template>

<script setup lang="ts">
import type { TChat } from "@/schemas/chat";
import type { TUser } from "@/schemas/user";
import { useUserStore } from "@/stores/user-store";
import { onMounted, onUpdated, ref } from "vue";

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

.chat-card__no-selected:hover {
  background-color: var(--secondary);
  cursor: pointer;
}

.chat-card__selected {
  background-color: var(--primary);
  color: var(--primary-foreground);
}
</style>
