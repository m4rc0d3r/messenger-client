import type {
  TUser,
  TUserToEdit,
  TUserToLogin,
  TUserToRegister,
} from "@/schemas/user";
import { AuthService } from "@/services/auth-service";
import { Str } from "@/shared";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const _token = useStorage("_token", Str.EMPTY);
  const _currentUser = useStorage<TUser | null>(
    "_currentUser",
    null,
    undefined,
    {
      serializer: {
        read: (raw) => (typeof raw === "string" ? JSON.parse(raw) : null),
        write: (value) => JSON.stringify(value),
      },
    },
  );

  const token = computed(() => _token);
  const isLoggedIn = computed(() => _token.value.length > 0);
  const currentUser = computed(() => _currentUser);

  async function register(user: TUserToRegister) {
    const result = await AuthService.register(user);
    if (!(result instanceof Error)) {
      _token.value = result.token;
      _currentUser.value = result;
    }
    return result;
  }

  async function login(user: TUserToLogin) {
    const result = await AuthService.login(user);
    if (!(result instanceof Error)) {
      _token.value = result.token;
      _currentUser.value = result;
    }
    return result;
  }

  async function logout() {
    _token.value = "";
    _currentUser.value = null;
    await Promise.resolve();
    return { status: 200, data: "Successful logout" };
  }

  async function updateUserData(user: TUserToEdit) {
    const result = await AuthService.updateUserData({
      ...user,
      currentPassword: user.password,
    });
    if (!(result instanceof Error)) {
      _currentUser.value = {
        ...result,
        avatar: _currentUser.value?.avatar ?? null,
      };
    }
    return result;
  }

  return {
    token,
    isLoggedIn,
    currentUser,
    register,
    login,
    logout,
    updateUserData,
  };
});
