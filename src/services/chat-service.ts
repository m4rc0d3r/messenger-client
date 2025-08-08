import { defaultAPI } from "@/http/axios/default-api";
import { APIError } from "@/schemas/api-error";
import type {
  AddUserToChatToServer,
  TChatFromServer,
  TCreateChatToServer,
} from "@/schemas/chat";
import type { TMessageFromServer } from "@/schemas/message";
import { AxiosError, type AxiosResponse } from "axios";

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
        chat,
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

  public static async addUserToChat(userToChat: AddUserToChatToServer) {
    try {
      const response = await defaultAPI.post<{}>(
        "chats/addusertochat",
        userToChat,
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

  public static async getAllMessagesFromChat(chatId: TChatFromServer["id"]) {
    try {
      const response = await defaultAPI.get<TMessageFromServer[]>(
        `messages/getallmessagesfromchat?chatId=${chatId}`,
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
