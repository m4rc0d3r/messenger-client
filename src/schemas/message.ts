import { z } from "zod";
import { zUser } from "./user";

export const zMessage = z.object({
  id: z.number(),
  text: z.string().nonempty(),
  date: z.date(),
  senderId: zUser.shape.id,
  chatId: z.number(),
});
export type TMessage = z.infer<typeof zMessage>;

export type TMessageFromServer = Omit<TMessage, "date" | "senderId"> & {
  createdAt: Date;
  authorId: number;
};

export type TMessageToSend = Pick<TMessage, "text" | "chatId">;
export type TMessageToSendToServer = TMessageToSend;

export type TMessageToEdit = Pick<TMessage, "id" | "text" | "chatId">;
export type TMessageToEditToServer = TMessageToEdit;

export type TMessageToDelete = Pick<TMessage, "id" | "chatId">;
export type TMessageToDeleteToServer = TMessageToDelete;

export type TMessageToForward = Pick<TMessage, "id" | "chatId">;
export type TMessageToForwardToServer = Pick<TMessageToForward, "chatId"> & {
  messageId: TMessage["id"];
};
