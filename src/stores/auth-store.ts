import type {
  TUser,
  TUserToEdit,
  TUserToLogin,
  TUserToRegister,
} from "@/schemas/user";
import { AuthService } from "@/services/auth-service";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const _token = ref("");
  const _currentUser = ref<TUser | null>();

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
      console.log(_currentUser.value);
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
