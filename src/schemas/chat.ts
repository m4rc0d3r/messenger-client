import type { TMessage } from "./message";
import type { TUser } from "./user";

export type ChatType = "dialogue" | "polylogue";
export const ChatType = {
  dialogue: "dialogue",
  polylogue: "polylogue",
} as const;

export type TChat = {
  id: number;
  type: ChatType;
  name: string;
  link: string;
  messages: TMessage[];
  users: TUser[];
};
export type TChatFromServer = Pick<TChat, "id" | "type" | "name" | "link"> & {
  participants: TUser[];
};

export type TCreateChat = {
  type: TChat["type"];
  interlocutorId?: TUser["id"];
  name?: TChat["name"];
};
export type TCreateChatToServer = TCreateChat;

export type AddUserToChat = {
  chatId: TChat["id"];
  userId: TUser["id"];
};
export type AddUserToChatToServer = AddUserToChat;
