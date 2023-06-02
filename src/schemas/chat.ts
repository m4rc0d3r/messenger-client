import type { TMessage } from "./message";
import type { TUser, TUserFromServer } from "./user";

export type TChatFromServer = {
  id_chat: number;
  name_chat: string;
  rk_type_chat: number;
  link: string;
};

export type TChat = {
  id: number;
  name: string;
  type: ChatType;
  link: string;
  messages: TMessage[];
};

export enum ChatType {
  DIALOGUE = 1,
  POLYLOGUE,
}

export type TCreateChat = {
  type: TChat["type"];
  interlocutorId?: TUser["id"];
  name?: TChat["name"];
};

export type TCreateChatToServer = Pick<TChatFromServer, "rk_type_chat"> & {
  id_user?: TUserFromServer["id_user"];
  name_chat?: TChatFromServer["name_chat"];
};

export type AddUserToChat = {
  chatId: TChat["id"];
  userId: TUser["id"];
};

export type AddUserToChatToServer = {
  id_chat: TChatFromServer["id_chat"];
  id_user: TUserFromServer["id_user"];
};
