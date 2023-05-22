import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { AuthService } from "@/services/auth-service";
import type {
  TRegistrationAndLoginResponse,
  TUser,
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

  return { token, isLoggedIn, currentUser, register, login, logout };
});
