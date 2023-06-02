import axios from "axios";
import { AxiosError, type AxiosResponse } from "axios";
import { HTTP_SERVER_URL } from "@/env";
import type {
  TRegistrationAndLoginResponse,
  TUserFromServer,
  TUserToEditToServer,
  TUserToLogin,
  TUserToRegister,
} from "@/schemas/user";
import { APIError } from "@/schemas/api-error";
import { defaultAPI } from "@/http/axios/default-api";

export class AuthService {
  public static async register(user: TUserToRegister) {
    try {
      const response = await axios.post<TRegistrationAndLoginResponse>(
        `${HTTP_SERVER_URL}users/register`,
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

  public static async login(user: TUserToLogin) {
    try {
      const response = await axios.post<TRegistrationAndLoginResponse>(
        `${HTTP_SERVER_URL}users/login`,
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
    console.log("User to edit:", user);
    try {
      const response = await defaultAPI.post<TUserFromServer>(
        `${HTTP_SERVER_URL}users/edituser`,
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
