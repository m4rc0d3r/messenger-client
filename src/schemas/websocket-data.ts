import type { TChatFromServer } from "./chat";
import type { TMessageFromServer } from "./message";
import type { TAddedToChatUserFromServer } from "./user";

export enum WebSocketDataType {
  SendMessage = "SendMessage",
  EditMessage = "EditMessage",
  DeleteMessage = "DeleteMessage",
  CreateChat = "CreateChat",
  EditChat = "EditChat",
  DeleteChat = "DeleteChat",
  Token = "Token",
  AddUserToChat = "AddUserToChat",
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

export interface ICreateChatDTO extends IWebSocketDataDTO<TChatFromServer> {
  type: WebSocketDataType.CreateChat;
}

export interface IAddUserToChatDTO
  extends IWebSocketDataDTO<TAddedToChatUserFromServer> {
  type: WebSocketDataType.AddUserToChat;
}

export interface IEditMessageDTO extends IWebSocketDataDTO<TMessageFromServer> {
  type: WebSocketDataType.EditMessage;
}

export interface IDeleteMessageDTO
  extends IWebSocketDataDTO<TMessageFromServer> {
  type: WebSocketDataType.DeleteMessage;
}
