import { z } from "zod";
import { zMessage } from "./message";
import { zUser, type TUser } from "./user";

export const zChatType = z.enum(["dialogue", "polylogue"]);
export const ChatType = zChatType.Enum;
export type ChatType = z.infer<typeof zChatType>;

export const zChat = z.object({
  id: z.number(),
  type: zChatType,
  name: z.string().nonempty(),
  link: z.string().nonempty(),
  authorId: zUser.shape.id,
  messages: z.array(zMessage),
  users: z.array(zUser),
});
export type TChat = z.infer<typeof zChat>;

export type TChatFromServer = Pick<
  TChat,
  "id" | "type" | "name" | "link" | "authorId"
> & {
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

export type TDeleteChat = Pick<TChat, "id">;
export type TDeleteChatToServer = TCreateChat;
