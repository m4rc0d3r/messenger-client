import axios from "axios";
import { AxiosError, type AxiosResponse } from "axios";
import { HTTP_SERVER_URL } from "@/env";
import type {
  TRegistrationAndLoginResponse,
  TUser,
  TUserFromServer,
  TUserToLogin,
  TUserToRegister,
} from "@/schemas/user";
import { APIError } from "@/schemas/api-error";
import { defaultAPI } from "@/http/axios/default-api";

export class UserService {
  public static async getUserById(id: TUser["id"]) {
    try {
      const response = await defaultAPI.get<TUserFromServer>(
        `${HTTP_SERVER_URL}users/getuserbyid?id=${id}`,
      );
      console.log(response);

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
  public static async getUsersByEmailOrNickname(
    str: TUser["email"] | TUser["nickname"],
  ) {
    try {
      const response = await defaultAPI.get<TUserFromServer[]>(
        `${HTTP_SERVER_URL}users/finduser?user_data_to_find=${str}`,
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
