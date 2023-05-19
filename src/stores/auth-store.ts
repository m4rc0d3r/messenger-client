import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { AuthService } from "@/services/auth-service";
import type { TUserLoginDTO, TUserRegisterDTO } from "@/schemas/user";

export const useAuthStore = defineStore("auth", () => {
  const _token = ref("");

  const token = computed(() => _token);
  const isLoggedIn = computed(() => _token.value.length > 0);

  async function register(user: TUserRegisterDTO) {
    const result = await AuthService.register(user);
    if (!(result instanceof Error)) {
      _token.value = result.token;
    }
    return result;
  }

  async function login(user: TUserLoginDTO) {
    const result = await AuthService.login(user);
    if (!(result instanceof Error)) {
      _token.value = result.token;
    }
    return result;
  }

  async function logout() {
    _token.value = "";
    await Promise.resolve();
    return { status: 200, data: "Successful logout" };
  }

  return { token, isLoggedIn, register, login, logout };
});
