<template>
  <div class="header">
    <div v-if="chat.type === ChatType.dialogue">
      <h3 @click="userProfileVisibility = true" class="chat-name">
        {{ interlocutor?.nickname }}
      </h3>
    </div>
    <div v-else>
      <h3 @click="showChatInfoWindowVisibility = true" class="chat-name">
        {{ chat.name }}
      </h3>
    </div>
    <div class="filter-messages-block">
      <label for="message-filter">Filter messages</label>
      <BaseInput
        type="text"
        :modelValue="messageFilter"
        @update:model-value="(value: string) => emit('update:messageFilter', value)"
        id="message-filter"
      />
    </div>
  </div>
  <Teleport to="body">
    <ModalWindow
      v-if="showChatInfoWindowVisibility"
      @close="showChatInfoWindowVisibility = false"
    >
      <Card class="chat-info-card">
        <CardHeader>
          <CardTitle>Chat info</CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="chat-info-card-content">
            <li>
              <h4>Name</h4>
              <p>{{ chat.name }}</p>
            </li>
            <li>
              <h4>Members</h4>
              <ul class="chat-info-card-user-list">
                <UserCard
                  v-for="user in chat.users"
                  :key="user.id"
                  :user="user"
                  class="chat-info-user-card"
                  @click="showUserProfile(user)"
                />
              </ul>
            </li>
          </ul>
        </CardContent>
        <CardFooter class="chat-info-card-footer">
          <BaseButton @click="userAddWindowVisibility = true"
            >Add a participant</BaseButton
          >
        </CardFooter>
      </Card>
    </ModalWindow>
  </Teleport>
  <Teleport to="body">
    <ModalWindow
      v-if="userAddWindowVisibility"
      @close="userAddWindowVisibility = false"
    >
      <Card class="add-participant-card">
        <CardHeader>
          <CardTitle>Add a participant to the chat</CardTitle>
        </CardHeader>
        <CardContent>
          <FindUserInput
            :user-data-to-find="userDataToFind"
            :found-users="foundUsers"
            @update:user-data-to-find="
              (value: string) => {
                userDataToFind = value;
                findUsers();
              }
            "
            @click-on-user="addUserToChat"
          />
        </CardContent>
      </Card>
    </ModalWindow>
  </Teleport>
  <Teleport to="body">
    <ModalWindow
      v-if="userProfileVisibility && selectedUser"
      @close="userProfileVisibility = false"
    >
      <UserProfile :user="selectedUser" @create-chat="createChat" />
    </ModalWindow>
  </Teleport>
</template>

<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import FindUserInput from "@/components/FindUserInput.vue";
import ModalWindow from "@/components/ModalWindow.vue";
import UserCard from "@/components/UserCard.vue";
import UserProfile from "@/components/UserProfile.vue";
import { ChatType, type TChat, type TCreateChat } from "@/schemas/chat";
import { Notification, NotificationStatus } from "@/schemas/notification";
import type { TUser } from "@/schemas/user";
import { UserService } from "@/services/user-service";
import { useAuthStore } from "@/stores/auth-store";
import { useChatStore } from "@/stores/chat-store";
import { useNotificationStore } from "@/stores/notification-store";
import { onMounted, ref } from "vue";

const props = defineProps<{
  chat: TChat;
  messageFilter: string;
}>();

const emit = defineEmits<{
  "update:messageFilter": [value: string];
}>();

const chatStore = useChatStore();
const notificationStore = useNotificationStore();

const userAddWindowVisibility = ref(false);
const showChatInfoWindowVisibility = ref(false);
const userDataToFind = ref("");
const foundUsers = ref<TUser[] | null>(null);
const interlocutor = ref<TUser>();
const userProfileVisibility = ref(false);
const selectedUser = ref<TUser>();

onMounted(async () => {
  await getInterlocutor();
});

async function findUsers() {
  if (userDataToFind.value.length > 2) {
    const result = await UserService.getUsersByEmailOrNickname(
      userDataToFind.value,
    );
    if (!(result instanceof Error)) {
      foundUsers.value = result;
    }
  } else {
    foundUsers.value = null;
  }
}

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
  userDataToFind.value = "";
  foundUsers.value = null;
}

function getInterlocutor() {
  if (props.chat.type === ChatType.dialogue) {
    interlocutor.value = props.chat.users.find((user) => {
      return user.id !== useAuthStore().currentUser.value?.id;
    });
  }
}

function showUserProfile(user: TUser) {
  selectedUser.value = user;
  userProfileVisibility.value = true;
}

async function createChat(chat: TCreateChat) {
  const result = await chatStore.createChat(chat);
  if (result instanceof Error) {
    notificationStore.add(
      new Notification(NotificationStatus.FAILURE, result.message),
    );
  }
  userProfileVisibility.value = false;
  userDataToFind.value = "";
  foundUsers.value = [];
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  background-color: var(--secondary);
  padding: calc(var(--step) * 2);
}

.chat-name {
  font-size: 24px;
  cursor: pointer;
}

.chat-name:hover {
  cursor: pointer;
}

.filter-messages-block {
  display: flex;
  align-items: center;
  gap: calc(var(--step) * 2);
}

.chat-info-card,
.add-participant-card {
  padding: calc(var(--step) * 2);
}

.chat-info-card-content {
  display: flex;
  flex-direction: column;
  gap: calc(var(--step) * 4);
}

.chat-info-card-content > * {
  display: flex;
  flex-direction: column;
  gap: calc(var(--step) * 2);
}

.chat-info-card-user-list {
  display: flex;
  flex-direction: column;
  gap: calc(var(--step) * 2);
}

.chat-info-card-footer {
  justify-content: end;
}

.chat-info-user-card:hover {
  cursor: pointer;
}
</style>
