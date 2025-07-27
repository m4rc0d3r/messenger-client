import { useConfigStore } from "@/config";
import type { TChat } from "@/schemas/chat";
import type { TMessage } from "@/schemas/message";
import { Notification, NotificationStatus } from "@/schemas/notification";
import type { TAddedToChatUser } from "@/schemas/user";
import {
  WebSocketDataType,
  type IAddUserToChatDTO,
  type ICreateChatDTO,
  type IDeleteMessageDTO,
  type IEditMessageDTO,
  type ISendMessageDTO,
  type ISendTokenDTO,
  type IWebSocketDataDTO,
} from "@/schemas/websocket-data";
import { useAuthStore } from "@/stores/auth-store";
import { useNotificationStore } from "@/stores/notification-store";
import { pinia } from "@/stores/pinia";

class WebSocketConnection extends EventTarget {
  ws!: WebSocket;
  listeners: { type: string; callback: EventListenerOrEventListenerObject }[];

  constructor() {
    super();
    this.listeners = [];
  }

  connect() {
    if (this.ws) {
      this.close();
    }

    this.ws = new WebSocket(
      useConfigStore(pinia).config.serverApp.websocketUrl,
    );

    this.ws.onopen = () => {
      console.log("WebSocket connection established");
      this.send({
        type: WebSocketDataType.Token,
        data: useAuthStore(pinia).token.value,
      } as ISendTokenDTO);
    };

    this.ws.onerror = () => {
      console.log(
        "An error occurred while establishing a WebSocket connection",
      );
    };

    this.ws.onmessage = (ev: MessageEvent<string>) => {
      const messageEvent = JSON.parse(ev.data) as IWebSocketDataDTO<unknown>;
      switch (messageEvent.type) {
      case WebSocketDataType.Token: {
        const token = messageEvent.data as ISendTokenDTO["data"];
        this.dispatchEvent(
          new CustomEvent<ISendTokenDTO["data"]>(messageEvent.type, {
            detail: token,
          }),
        );
        break;
      }
      case WebSocketDataType.CreateChat: {
        const chat = messageEvent.data as ICreateChatDTO["data"];
        this.dispatchEvent(
          new CustomEvent<TChat>(messageEvent.type, {
            detail: {
              id: chat.id_chat,
              name: chat.name_chat,
              type: chat.rk_type_chat,
              link: chat.link,
              messages: [],
              users: chat.users.map((user) => {
                return {
                  id: user.id_user,
                  email: user.email,
                  nickname: user.nickname,
                };
              }),
            } as TChat,
          }),
        );
        break;
      }
      case WebSocketDataType.AddUserToChat: {
        const addedUser = messageEvent.data as IAddUserToChatDTO["data"];
        this.dispatchEvent(
          new CustomEvent<TAddedToChatUser>(messageEvent.type, {
            detail: {
              id: addedUser.id_user,
              email: addedUser.email,
              nickname: addedUser.nickname,
              chatId: addedUser.id_chat,
            } as TAddedToChatUser,
          }),
        );
        break;
      }
      case WebSocketDataType.SendMessage: {
        const message = messageEvent.data as ISendMessageDTO["data"];
        this.dispatchEvent(
          new CustomEvent<TMessage>(messageEvent.type, {
            detail: {
              id: message.id_message,
              text: message.text_message,
              date: new Date(message.data_time),
              senderId: message.rk_user,
              chatId: message.rk_chat,
            } as TMessage,
          }),
        );
        break;
      }
      case WebSocketDataType.EditMessage: {
        const message = messageEvent.data as IEditMessageDTO["data"];
        this.dispatchEvent(
          new CustomEvent<TMessage>(messageEvent.type, {
            detail: {
              id: message.id_message,
              text: message.text_message,
              date: new Date(message.data_time),
              senderId: message.rk_user,
              chatId: message.rk_chat,
            } as TMessage,
          }),
        );
        break;
      }
      case WebSocketDataType.DeleteMessage: {
        const message = messageEvent.data as IDeleteMessageDTO["data"];
        this.dispatchEvent(
          new CustomEvent<TMessage>(messageEvent.type, {
            detail: {
              id: message.id_message,
              text: message.text_message,
              date: new Date(message.data_time),
              senderId: message.rk_user,
              chatId: message.rk_chat,
            } as TMessage,
          }),
        );
        break;
      }
      default:
        useNotificationStore().add(
          new Notification(
            NotificationStatus.FAILURE,
            "WebSocket received an unexpected message",
          ),
        );
      }
      console.log("New message:", messageEvent);
    };
  }

  get status() {
    return this.ws.readyState;
  }

  send<T>(data: T) {
    this.ws.send(JSON.stringify(data));
  }

  close(...args: Parameters<typeof this.ws.close>) {
    this.ws.close(...args);
  }

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    super.addEventListener(type, callback, options);
    if (callback) {
      this.listeners.push({ type, callback });
    }
  }

  removeAllListeners() {
    for (const listener of this.listeners) {
      this.removeEventListener(listener.type, listener.callback);
    }
  }
}

export const webSocketConnection = new WebSocketConnection();
