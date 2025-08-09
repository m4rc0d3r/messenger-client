import { useConfigStore } from "@/config";
import { defaultAPI } from "@/http/axios/default-api";
import { APIError } from "@/schemas/api-error";
import type {
  TRegistrationAndLoginResponse,
  TUserFromServer,
  TUserToEditToServer,
  TUserToLogin,
  TUserToRegister,
} from "@/schemas/user";
import { pinia } from "@/stores/pinia";
import axios, { AxiosError, type AxiosResponse } from "axios";

export class AuthService {
  public static async register(user: TUserToRegister) {
    try {
      const formData = new FormData();

      for (const [key, value] of Object.entries(user)) {
        if (value !== null) {
          formData.set(key, value);
        }
      }

      const response = await axios.postForm<TRegistrationAndLoginResponse>(
        `${useConfigStore(pinia).config.serverApp.httpUrl}/users/register`,
        formData,
      );

      return response.data;
    } catch (e) {
      if (e instanceof AxiosError && e.response) {
        return new APIError(
          (e.response as AxiosResponse<APIError>).data.message,
          (e.response as AxiosResponse<APIError>).data.code,
        );
      } else {
        return new Error("Unexpected error");
      }
    }
  }

  public static async login(user: TUserToLogin) {
    try {
      const response = await axios.post<TRegistrationAndLoginResponse>(
        `${useConfigStore(pinia).config.serverApp.httpUrl}/users/login`,
        user,
      );

      return response.data;
    } catch (e) {
      if (e instanceof AxiosError && e.response) {
        return new APIError(
          (e.response as AxiosResponse<APIError>).data.message,
          (e.response as AxiosResponse<APIError>).data.code,
        );
      } else {
        return new Error("Unexpected error");
      }
    }
  }

  public static async updateUserData(user: TUserToEditToServer) {
    try {
      const response = await defaultAPI.post<TUserFromServer>(
        `${useConfigStore(pinia).config.serverApp.httpUrl}/users/edituser`,
        user,
      );

      return response.data;
    } catch (e) {
      if (e instanceof AxiosError && e.response) {
        return new APIError(
          (e.response as AxiosResponse<APIError>).data.message,
          (e.response as AxiosResponse<APIError>).data.code,
        );
      } else {
        return new Error("Unexpected error");
      }
    }
  }
}
