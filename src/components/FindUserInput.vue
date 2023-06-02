<template>
  <div class="find-user-block">
    <input
      v-model="userDataToFind"
      @input="findUsers"
      type="text"
      class="find-user-block__input"
    />
    <div class="find-user-block__found-users-wrapper">
      <ul class="find-user-block__found-users">
        <FoundUserCard
          v-for="user in foundUsers"
          :key="user.id"
          :user="user"
          @click="emit('click-on-user', user)"
        />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import FoundUserCard from "@/components/FoundUserCard.vue";
import { Notification, NotificationStatus } from "@/schemas/notification";
import type { TUser } from "@/schemas/user";
import { UserService } from "@/services/user-service";
import { ref } from "vue";
import { type TCreateChat, ChatType } from "@/schemas/chat";
import { useAuthStore } from "@/stores/auth-store";
import { useChatStore } from "@/stores/chat-store";
import { useNotificationStore } from "@/stores/notification-store";

const authStore = useAuthStore();
const chatStore = useChatStore();
const notificationStore = useNotificationStore();

const emit = defineEmits({
  "click-on-user"(user: TUser) {
    return true;
  },
});

const userDataToFind = ref("");
const foundUsers = ref<TUser[]>([]);

async function findUsers() {
  if (userDataToFind.value.length > 2) {
    const result = await UserService.getUsersByEmailOrNickname(
      userDataToFind.value,
    );
    if (!(result instanceof Error)) {
      foundUsers.value = result
        // .filter((user) => {
        //   if (user.id_user !== authStore.currentUser.value?.id) {
        //     const message = chatStore.chats.value
        //       .filter((chat) => chat.type === ChatType.DIALOGUE)
        //       .find((chat) => {
        //         return chat.messages.find(
        //           (message) => message.senderId === user.id_user,
        //         );
        //       });
        //     return !message;
        //   }
        //   return false;
        // })
        .map((user) => {
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
</script>

<style scoped>
.find-user-block {
  display: flex;
  flex-direction: column;
}

.find-user-block__input {
  width: 100%;
}

.find-user-block__found-users-wrapper {
  position: relative;
}

.find-user-block__found-users {
  width: 100%;
  position: absolute;
  overflow: auto;
  max-height: 200px;
  background: linear-gradient(to right, #d4d9b7, #66997d);
}

.find-user-block__found-users > * {
  margin-top: 4px;
}

.find-user-block__found-users > *:first-child {
  margin-top: 0;
}
</style>
