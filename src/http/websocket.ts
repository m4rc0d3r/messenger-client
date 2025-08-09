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
  ws: WebSocket | null;
  listeners: { type: string; callback: EventListenerOrEventListenerObject }[];

  constructor() {
    super();
    this.ws = null;
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
      this.send({
        type: WebSocketDataType.Token,
        data: useAuthStore(pinia).token.value,
      } as ISendTokenDTO);
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
              ...chat,
              messages: [],
              users: chat.participants,
            } as TChat,
          }),
        );
        break;
      }
      case WebSocketDataType.AddUserToChat: {
        const addedUser = messageEvent.data as IAddUserToChatDTO["data"];
        this.dispatchEvent(
          new CustomEvent<TAddedToChatUser>(messageEvent.type, {
            detail: addedUser satisfies TAddedToChatUser,
          }),
        );
        break;
      }
      case WebSocketDataType.SendMessage: {
        const { data: message } =
            messageEvent.data as ISendMessageDTO["data"];
        this.dispatchEvent(
          new CustomEvent<TMessage>(messageEvent.type, {
            detail: {
              ...message,
              date: new Date(message.createdAt),
              senderId: message.authorId,
            } as TMessage,
          }),
        );
        break;
      }
      case WebSocketDataType.EditMessage: {
        const { data: message } =
            messageEvent.data as IEditMessageDTO["data"];
        this.dispatchEvent(
          new CustomEvent<TMessage>(messageEvent.type, {
            detail: {
              ...message,
              date: new Date(message.createdAt),
              senderId: message.authorId,
            } as TMessage,
          }),
        );
        break;
      }
      case WebSocketDataType.DeleteMessage: {
        const { data: message } =
            messageEvent.data as IDeleteMessageDTO["data"];
        this.dispatchEvent(
          new CustomEvent<TMessage>(messageEvent.type, {
            detail: {
              ...message,
              date: new Date(message.createdAt),
              senderId: message.authorId,
            } satisfies TMessage,
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
    };
  }

  get status() {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  send<T>(data: T) {
    this.ws?.send(JSON.stringify(data));
  }

  close(...args: Parameters<NonNullable<typeof this.ws>["close"]>) {
    if (this.ws) {
      this.ws.close(...args);
    }
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
