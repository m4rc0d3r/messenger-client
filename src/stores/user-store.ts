import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { AuthService } from "@/services/auth-service";
import type {
  TRegistrationAndLoginResponse,
  TUser,
  TUserToLogin,
  TUserToRegister,
} from "@/schemas/user";
import { UserService } from "@/services/user-service";
import { useNotificationStore } from "./notification-store";
import { Notification, NotificationStatus } from "@/schemas/notification";

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
        _users.value.set(result.id_user, {
          id: result.id_user,
          email: result.email,
          nickname: result.nickname,
        });
      }
    }

    return _users.value.get(id);
  }

  return { getUserById };
});
