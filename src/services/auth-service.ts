import axios from "axios";
import { AxiosError, type AxiosResponse } from "axios";
import { SERVER_URL } from "@/env";
import type { TUserLoginDTO, TUserRegisterDTO } from "@/schemas/user";
import { APIError } from "@/schemas/api-error";

export class AuthService {
  public static async register(user: TUserRegisterDTO) {
    try {
      const response = await axios.post<{ token: string }>(
        `${SERVER_URL}users/register`,
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

  public static async login(user: TUserLoginDTO) {
    try {
      const response = await axios.post<{ token: string }>(
        `${SERVER_URL}users/login`,
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
