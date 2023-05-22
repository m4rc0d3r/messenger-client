import { WEB_SOCKET_SERVER_URL } from "@/env";
import type { TMessage } from "@/schemas/message";
import { Notification, NotificationStatus } from "@/schemas/notification";
import {
  WebSocketDataType,
  type IWebSocketDataDTO,
  type ISendTokenDTO,
  type ISendMessageDTO,
} from "@/schemas/websocket-data";
import { useNotificationStore } from "@/stores/notification-store";

class WebSocketConnection extends EventTarget {
  ws!: WebSocket;

  constructor() {
    super();
    this.connect();
  }

  connect() {
    if (this.ws) {
      this.close();
    }

    this.ws = new WebSocket(WEB_SOCKET_SERVER_URL);

    this.ws.onopen = () => {
      console.log("WebSocket connection established");
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
    return this.ws.readyState;
  }

  send(...args: Parameters<typeof this.ws.send>) {
    this.ws.send(...args);
  }

  close(...args: Parameters<typeof this.ws.close>) {
    this.ws.close(...args);
  }
}

export const webSocketConnection = new WebSocketConnection();
