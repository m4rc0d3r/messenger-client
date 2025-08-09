import { defaultAPI } from "@/http/axios/default-api";
import { APIError } from "@/schemas/api-error";
import type { TChat } from "@/schemas/chat";
import type {
  TMessage,
  TMessageFromServer,
  TMessageToDelete,
  TMessageToDeleteToServer,
  TMessageToEdit,
  TMessageToEditToServer,
  TMessageToForwardToServer,
  TMessageToSend,
  TMessageToSendToServer,
} from "@/schemas/message";
import { AxiosError, type AxiosResponse } from "axios";

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
        message satisfies TMessageToSendToServer,
      );

      return {
        ...response.data,
        date: new Date(response.data.createdAt),
        senderId: response.data.authorId,
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
        messageToEdit satisfies TMessageToEditToServer,
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
        message satisfies TMessageToDeleteToServer,
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

  public static async forwardMessage(messageTorward: TMessage, chat: TChat) {
    try {
      const response = await defaultAPI.post<boolean>(
        "messages/resendmessage",
        {
          messageId: messageTorward.id,
          chatId: chat.id,
        } satisfies TMessageToForwardToServer,
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
