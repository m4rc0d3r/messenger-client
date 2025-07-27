import { HTTP_SERVER_URL } from "@/env";
import { defaultAPI } from "@/http/axios/default-api";
import { APIError } from "@/schemas/api-error";
import type { TUser, TUserFromServer } from "@/schemas/user";
import { AxiosError, type AxiosResponse } from "axios";

export class UserService {
  public static async getUserById(id: TUser["id"]) {
    try {
      const response = await defaultAPI.get<TUserFromServer>(
        `${HTTP_SERVER_URL}users/getuserbyid?id=${id}`,
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
