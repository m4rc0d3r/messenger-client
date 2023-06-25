import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { AuthService } from "@/services/auth-service";
import type {
  TRegistrationAndLoginResponse,
  TUser,
  TUserToEdit,
  TUserToLogin,
  TUserToRegister,
} from "@/schemas/user";

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
      _currentUser.value = {
        id: result.id_user,
        email: result.email,
        nickname: result.nickname,
      };
    }
    return result;
  }

  async function login(user: TUserToLogin) {
    const result = await AuthService.login(user);
    if (!(result instanceof Error)) {
      _token.value = result.token;
      _currentUser.value = {
        id: result.id_user,
        email: result.email,
        nickname: result.nickname,
      };
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
      email: user.email,
      nickname: user.nickname,
      password: user.password,
      new_password: user.newPassword,
      private_acc: user.isPrivate,
    });
    if (!(result instanceof Error)) {
      _currentUser.value = {
        id: result.id_user,
        email: result.email,
        nickname: result.nickname,
        isPrivate: result.private_acc,
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
