import { Notification, NotificationStatus } from "@/schemas/notification";
import type { TUser } from "@/schemas/user";
import { UserService } from "@/services/user-service";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useNotificationStore } from "./notification-store";

export const useUserStore = defineStore("user", () => {
  const _users = ref<Map<TUser["id"], TUser>>(new Map());

  async function getUserById(id: TUser["id"]) {
    if (!_users.value.has(id)) {
      const result = await UserService.getUserById(id);
      if (result instanceof Error) {
        useNotificationStore().add(
          new Notification(
            NotificationStatus.SUCCESS,
            "Failed to get user information",
          ),
        );
        return;
      } else {
        _users.value.set(result.id, result);
      }
    }

    return _users.value.get(id);
  }

  async function getUserByIdFromServer(id: TUser["id"]) {
    const result = await UserService.getUserById(id);
    if (result instanceof Error) {
      useNotificationStore().add(
        new Notification(
          NotificationStatus.SUCCESS,
          "Failed to get user information",
        ),
      );
      return result;
    } else {
      return result satisfies TUser;
    }
  }

  return { getUserById, getUserByIdFromServer };
});
