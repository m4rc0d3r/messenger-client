import { defaultAPI } from "@/http/axios/default-api";
import { APIError } from "@/schemas/api-error";
import type {
  OriginalMessage,
  TMessage,
  TMessageFromServer,
  TMessageToDelete,
  TMessageToDeleteToServer,
  TMessageToEdit,
  TMessageToEditToServer,
  TMessageToForward,
  TMessageToForwardToServer,
  TMessageToSend,
  TMessageToSendToServer,
  TOriginalMessageFromServer,
} from "@/schemas/message";
import { AxiosError, type AxiosResponse } from "axios";

export class MessageService {
  public static async getMessages() {
    try {
      const response = await defaultAPI.get<TMessageFromServer[]>(
        "messages/getallmessages",
      );

      return response.data.map(({ data }) => data);
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

  public static async getMessageById(id: OriginalMessage["id"]) {
    try {
      const response = await defaultAPI.get<TOriginalMessageFromServer>(
        `messages/getmessagebyid/${id}`,
      );

      return response.data.data;
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
        ...response.data.data,
        date: new Date(response.data.data.createdAt),
        senderId: response.data.data.authorId,
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

  public static async forwardMessage(data: TMessageToForward) {
    try {
      const response = await defaultAPI.post<boolean>(
        "messages/resendmessage",
        {
          data,
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
