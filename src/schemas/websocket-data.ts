import type { TMessage, TMessageFromServer } from "./message";

export enum WebSocketDataType {
  SendMessage = "SendMessage",
  EditMessage = "EditMessage",
  DeleteMessage = "DeleteMessage",
  CreateChat = "CreateChat",
  EditChat = "EditChat",
  DeleteChat = "DeleteChat",
  Token = "Token",
}

export interface IWebSocketDataDTO<T> {
  type: WebSocketDataType;
  data: T;
}

export interface ISendTokenDTO extends IWebSocketDataDTO<string> {
  type: WebSocketDataType.Token;
}
export interface ISendMessageDTO extends IWebSocketDataDTO<TMessageFromServer> {
  type: WebSocketDataType.SendMessage;
}
