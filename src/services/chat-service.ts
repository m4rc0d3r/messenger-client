import { AxiosError, type AxiosResponse } from "axios";
import { APIError } from "@/schemas/api-error";
import { defaultAPI } from "@/http/axios/default-api";
import type {
  TChatFromServer,
  TCreateChat,
  TCreateChatToServer,
} from "@/schemas/chat";
import type { TMessageFromServer } from "@/schemas/message";

export class ChatService {
  public static async getChatsOfUser() {
    try {
      const response = await defaultAPI.get<TChatFromServer[]>(
        "chats/getchats",
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

  public static async createChat(chat: TCreateChatToServer) {
    try {
      const response = await defaultAPI.post<TChatFromServer>(
        "chats/createchat",
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
