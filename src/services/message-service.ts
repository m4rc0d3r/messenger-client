import { AxiosError, type AxiosResponse } from "axios";
import { APIError } from "@/schemas/api-error";
import { defaultAPI } from "@/http/axios/default-api";
import type {
  TMessage,
  TMessageFromServer,
  TMessageToDelete,
  TMessageToDeleteToServer,
  TMessageToEdit,
  TMessageToEditToServer,
  TMessageToSend,
  TMessageToSendToServer,
} from "@/schemas/message";

export class MessageService {
  public static async getMessages() {
    try {
      const response = await defaultAPI.get<TMessageFromServer[]>(
        "messages/getallmessages",
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

  public static async sendMessage(message: TMessageToSend) {
    try {
      const response = await defaultAPI.post<TMessageFromServer>(
        "messages/sendmessage",
        {
          text_message: message.text,
          id_chat: message.chatId,
        } as TMessageToSendToServer,
      );

      return {
        id: response.data.id_message,
        text: response.data.text_message,
        date: new Date(response.data.data_time),
        senderId: response.data.rk_user,
        chatId: response.data.rk_chat,
      } as TMessage;
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

  public static async editMessage(messageToEdit: TMessageToEdit) {
    try {
      const response = await defaultAPI.post<TMessageFromServer>(
        "messages/editmessage",
        {
          id_message: messageToEdit.id,
          text_message: messageToEdit.text,
          rk_chat: messageToEdit.chatId,
        } as TMessageToEditToServer,
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

  public static async deleteMessage(message: TMessageToDelete) {
    try {
      const response = await defaultAPI.post<boolean>(
        "messages/deletemessage",
        {
          id_message: message.id,
          rk_chat: message.chatId,
        } as TMessageToDeleteToServer,
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
