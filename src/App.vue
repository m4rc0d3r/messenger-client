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
        <button
          v-if="authStore.isLoggedIn"
          class="main-menu__item"
          @click="groupChatCreationVisibility = true"
        >
          Create chat
        </button>
      </div>
      <div class="right-menu">
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
        <button
          v-if="authStore.isLoggedIn"
          @click="showUserProfile"
          class="main-menu__item me-section"
        >
          <img
            v-if="authStore.currentUser.value?.avatar"
            :src="authStore.currentUser.value?.avatar"
            alt="My avatar"
            class="me-section-image"
          />
          <User v-else class="me-section-icon" />
          <span>
            {{ authStore.currentUser.value?.nickname }}
          </span>
        </button>
        <button
          v-if="authStore.isLoggedIn"
          @click="logout"
          class="main-menu__item"
        >
          Logout
        </button>
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
  <ChatNotificationToast />
  <ModalWindow v-if="userProfileVisibility" @close="hideUserProfile">
    <CurrentUserProfile />
  </ModalWindow>
  <ModalWindow
    v-if="groupChatCreationVisibility"
    @close="groupChatCreationVisibility = false"
  >
    <GroupChatCreation @create="createGroupChat" />
  </ModalWindow>
  <audio
    src="/mixkit-confirmation-tone-2867.wav"
    id="new-message-sound"
  ></audio>
</template>

<script setup lang="ts">
import ChatNotificationToast from "@/components/chat-notifications/Toast.vue";
import CurrentUserProfile from "@/components/CurrentUserProfile.vue";
import ModalWindow from "@/components/ModalWindow.vue";
import SimpleNotification from "@/components/SimpleNotification.vue";
import { webSocketConnection } from "@/http/websocket";
import { useAuthStore } from "@/stores/auth-store";
import { useNotificationStore } from "@/stores/notification-store";
import { User } from "lucide-vue-next";
import { ref, watchEffect } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import GroupChatCreation from "./components/GroupChatCreation.vue";
import { ChatType } from "./schemas/chat";
import { Notification, NotificationStatus } from "./schemas/notification";
import { Str } from "./shared";
import { useChatStore } from "./stores/chat-store";

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
  const result = useChatStore().createChat({ type: ChatType.polylogue, name });
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
  if (!["/register", "/login"].includes(location.pathname)) {
    router.push("/login");
  }
}

watchEffect(() => {
  if (authStore.token.value === Str.EMPTY) {
    logout();
  }
});
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-menu {
  background-color: var(--primary);
  color: var(--primary-foreground);
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
  border: none;
  background-color: transparent;
  font-size: 1.75rem;
}

.main-menu__item:hover {
  text-decoration: underline;
}

.main-menu__item:last-child {
  margin-right: 0;
}

.right-menu {
  display: flex;
  align-items: center;
}

.me-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.me-section-image {
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
}

.me-section-icon {
  width: 2rem;
  height: 2rem;
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
