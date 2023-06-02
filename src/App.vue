<template>
  <div class="layout">
    <nav
      v-if="route.path !== '/register' && route.path !== '/login'"
      class="main-menu"
    >
      <div>
        <RouterLink v-if="authStore.isLoggedIn" to="/" class="main-menu__item"
          >Home</RouterLink
        >
        <RouterLink
          v-if="authStore.isLoggedIn"
          to="/about"
          class="main-menu__item"
          >About</RouterLink
        >
        <span
          v-if="authStore.isLoggedIn"
          class="main-menu__item"
          @click="groupChatCreationVisibility = true"
          >Create chat</span
        >
      </div>
      <div>
        <RouterLink
          v-if="!authStore.isLoggedIn"
          to="/register"
          class="main-menu__item"
          >Register</RouterLink
        >
        <RouterLink
          v-if="!authStore.isLoggedIn"
          to="/login"
          class="main-menu__item"
          >Login</RouterLink
        >
        <span
          v-if="authStore.isLoggedIn"
          @click="showUserProfile"
          class="main-menu__item"
        >
          {{ authStore.currentUser.value?.nickname }}</span
        >
        <span
          v-if="authStore.isLoggedIn"
          @click="logout"
          class="main-menu__item"
        >
          Logout
        </span>
      </div>
    </nav>
    <RouterView />
  </div>
  <div class="notifications-wrapper" v-if="notifications.length > 0">
    <SimpleNotification
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
      @delete="notificationStore.remove(notification.id)"
    />
  </div>
  <ModalWindow v-if="userProfileVisibility" @close="hideUserProfile">
    <UserProfile />
  </ModalWindow>
  <ModalWindow
    v-if="groupChatCreationVisibility"
    @close="groupChatCreationVisibility = false"
  >
    <GroupChatCreation @create="createGroupChat" />
  </ModalWindow>
</template>

<script setup lang="ts">
import { useRouter, useRoute, RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth-store";
import { useNotificationStore } from "@/stores/notification-store";
import ModalWindow from "@/components/ModalWindow.vue";
import UserProfile from "@/components/UserProfile.vue";
import SimpleNotification from "@/components/SimpleNotification.vue";
import GroupChatCreation from "./components/GroupChatCreation.vue";
import { webSocketConnection } from "@/http/websocket";
import { ref } from "vue";
import { useChatStore } from "./stores/chat-store";
import { ChatType } from "./schemas/chat";
import { Notification, NotificationStatus } from "./schemas/notification";

const notificationStore = useNotificationStore();
const notifications = notificationStore.notifications;

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const userProfileVisibility = ref(false);
const groupChatCreationVisibility = ref(false);

function showUserProfile() {
  userProfileVisibility.value = true;
}

function hideUserProfile() {
  userProfileVisibility.value = false;
}

async function createGroupChat(name: string) {
  const result = useChatStore().createChat({ type: ChatType.POLYLOGUE, name });
  if (result instanceof Error) {
    notificationStore.add(
      new Notification(NotificationStatus.FAILURE, result.message),
    );
  }
  groupChatCreationVisibility.value = false;
}

async function logout() {
  await authStore.logout();
  webSocketConnection.close();
  webSocketConnection.removeAllListeners();
  router.push("/login");
}
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-menu {
  background-color: #369bb4;
  display: flex;
  font-size: 1.75rem;
  justify-content: space-between;
}

.main-menu__item {
  text-decoration: none;
  color: white;
  cursor: pointer;
  display: inline-block;
  box-sizing: border-box;
  margin-right: 10px;
  padding: 10px 15px;
}

.main-menu__item:last-child {
  margin-right: 0;
}

.notifications-wrapper {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
