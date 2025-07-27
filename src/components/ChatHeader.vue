<template>
  <div class="header">
    <div v-if="chat.type === ChatType.DIALOGUE">
      <h3 @click="userProfileVisibility = true" class="chat-name">
        {{ interlocutor?.nickname }}
      </h3>
    </div>
    <div v-else>
      <h3 @click="showChatInfoWindowVisibility = true" class="chat-name">
        {{ chat.name }}
      </h3>
    </div>
    <div>
      <label for="message-filter">Filter messages</label>
      <BaseInput
        type="text"
        :modelValue="messageFilter"
        @update:model-value="(value) => emit('update:messageFilter', value)"
        id="message-filter"
      />
    </div>
  </div>
  <Teleport to="body">
    <ModalWindow
      v-if="showChatInfoWindowVisibility"
      @close="showChatInfoWindowVisibility = false"
    >
      <div class="chat-info-content">
        <p class="members-title">Members</p>
        <ul class="user-list">
          <UserCard
            v-for="user in chat.users"
            :key="user.id"
            :user="user"
            @click="showUserProfile(user)"
          />
        </ul>
        <BaseButton @click="userAddWindowVisibility = true"
          >Add user</BaseButton
        >
      </div>
    </ModalWindow>
  </Teleport>
  <Teleport to="body">
    <ModalWindow
      v-if="userAddWindowVisibility"
      @close="userAddWindowVisibility = false"
    >
      <FindUserInput
        :user-data-to-find="userDataToFind"
        :found-users="foundUsers"
        @update:user-data-to-find="
          (value) => {
            userDataToFind = value;
            findUsers();
          }
        "
        @click-on-user="addUserToChat"
      />
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
const foundUsers = ref<TUser[]>([]);
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
      foundUsers.value = result.map((user) => {
        return {
          id: user.id_user,
          email: user.email,
          nickname: user.nickname,
        };
      });
    }
  } else {
    foundUsers.value = [];
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
  foundUsers.value = [];
}

function getInterlocutor() {
  if (props.chat.type === ChatType.DIALOGUE) {
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
  background-color: aqua;
  padding: 16px;
}

.chat-name {
  font-size: 24px;
  cursor: pointer;
}

.chat-name:hover {
  font-size: 28px;
}

.user-list {
  padding: 12px;
}

.user-list > * {
  margin-top: 8px;
}

.user-list > *:first-child {
  margin-top: 0;
}

.chat-info-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
}

.members-title {
  font-size: 18px;
}
</style>
