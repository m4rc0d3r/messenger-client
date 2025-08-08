<template>
  <li
    @click="emit('select')"
    :class="{
      'chat-card': true,
      'chat-card__selected': selected,
      'chat-card__no-selected': !selected,
    }"
  >
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
        >{{ sender?.nickname }}:
        {{ chat.messages[chat.messages.length - 1].text }}</span
      >
    </div>
  </li>
</template>

<script setup lang="ts">
import { type TChat } from "@/schemas/chat";
import type { TUser } from "@/schemas/user";
import { useAuthStore } from "@/stores/auth-store";
import { useUserStore } from "@/stores/user-store";
import { Users } from "lucide-vue-next";
import { computed, onMounted, onUpdated, ref } from "vue";

const props = defineProps<{
  chat: TChat;
  selected: boolean;
}>();

const emit = defineEmits({
  select() {
    return true;
  },
});

const authStore = useAuthStore();
const userStore = useUserStore();

const sender = ref<TUser>();

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
  gap: 0.5rem;
  align-items: center;
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

.chat-cover {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: cover;
  border-radius: 100%;
}

.empty-chat-cover {
  width: 1.5rem;
  height: 1.5rem;
}

.text-data {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
