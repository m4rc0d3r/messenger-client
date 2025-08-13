import { zChat } from "@/schemas/chat";
import { zMessage } from "@/schemas/message";
import { zUser } from "@/schemas/user";
import { z } from "zod";

export const zChatNotificationType = z.enum([
  "NEW_MESSAGE",
  "NEW_CHAT",
  "NEW_CHAT_MEMBER",
]);
export const ChatNotificationType = zChatNotificationType.Enum;
export type ChatNotificationType = z.infer<typeof zChatNotificationType>;

export const zBaseChatNotification = z.object({
  id: z.number(),
  selectedChatId: zChat.shape.id.optional(),
});

export const DISCRIMINATOR = "type";

export const zChatNotification = z.discriminatedUnion(DISCRIMINATOR, [
  zBaseChatNotification.extend({
    [DISCRIMINATOR]: z.literal(ChatNotificationType.NEW_CHAT),
    payload: zChat,
  }),
  zBaseChatNotification.extend({
    [DISCRIMINATOR]: z.literal(ChatNotificationType.NEW_CHAT_MEMBER),
    payload: z.object({
      user: zUser,
      chat: zChat.pick({
        id: true,
      }),
    }),
  }),
  zBaseChatNotification.extend({
    [DISCRIMINATOR]: z.literal(ChatNotificationType.NEW_MESSAGE),
    payload: zMessage,
  }),
]);
export type ChatNotification = z.infer<typeof zChatNotification>;
