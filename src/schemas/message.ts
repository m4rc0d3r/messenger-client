import { z } from "zod";
import { zUser } from "./user";

export const zMessageOriginType = z.enum(["original", "forwarded"]);
export const MessageOriginType = zMessageOriginType.enum;
export type MessageOriginType = z.infer<typeof zMessageOriginType>;

export const zBaseMessage = z.object({
  id: z.number().int(),
  date: z.date(),
  senderId: zUser.shape.id,
  chatId: z.number(),
});
export type BaseMessage = z.infer<typeof zBaseMessage>;

export const MESSAGE_DISCRIMINATOR = "originType";

export const zOriginalMessage = zBaseMessage.extend({
  [MESSAGE_DISCRIMINATOR]: z.literal(MessageOriginType.original),
  text: z.string().trim().nonempty(),
});
export type OriginalMessage = z.infer<typeof zOriginalMessage>;

export const zForwardedMessage = zBaseMessage.extend({
  [MESSAGE_DISCRIMINATOR]: z.literal(MessageOriginType.forwarded),
  messageId: zBaseMessage.shape.id,
});
export type ForwardedMessage = z.infer<typeof zForwardedMessage>;

export const zMessage = z.discriminatedUnion(MESSAGE_DISCRIMINATOR, [
  zOriginalMessage,
  zForwardedMessage,
]);
export type TMessage = z.infer<typeof zMessage>;

export type TOriginalMessageFromServer = {
  data: Omit<
    Extract<TMessage, Pick<OriginalMessage, "originType">>,
    "date" | "senderId"
  > & {
    createdAt: Date;
    authorId: number;
  };
};
export type TMessageFromServer = {
  data:
    | TOriginalMessageFromServer["data"]
    | (Omit<
        Extract<TMessage, Pick<ForwardedMessage, "originType">>,
        "date" | "senderId"
      > & {
        createdAt: Date;
        authorId: number;
      });
};

export type TMessageToSend = Pick<OriginalMessage, "text" | "chatId">;
export type TMessageToSendToServer = TMessageToSend;

export type TMessageToEdit = Pick<OriginalMessage, "id" | "text" | "chatId">;
export type TMessageToEditToServer = TMessageToEdit;

export type TMessageToDelete = Pick<TMessage, "id" | "originType">;
export type TMessageToDeleteToServer = TMessageToDelete;

export type TMessageToForward = Pick<TMessage, "id" | "chatId" | "originType">;
export type TMessageToForwardToServer = {
  data: TMessageToForward;
};
