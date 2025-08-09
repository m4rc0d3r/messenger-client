import {
  MESSAGE_DISCRIMINATOR,
  MessageOriginType,
  type OriginalMessage,
  type TMessage,
} from "@/schemas/message";
import { MessageService } from "@/services/message-service";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useMessageStore = defineStore("message", () => {
  const _messages = ref<OriginalMessage[]>([]);

  const messages = computed(() => _messages);

  async function getMessageById(messageId: TMessage["id"]) {
    const messageFromCache = _messages.value.find(({ id }) => id === messageId);
    if (messageFromCache) return messageFromCache;

    const result = await MessageService.getMessageById(messageId);
    if (result instanceof Error) {
      return result;
    } else {
      const { id, authorId, chatId, createdAt, ...result2 } = result;
      const message = {
        id,
        date: new Date(createdAt),
        senderId: authorId,
        chatId,
        ...(result2[MESSAGE_DISCRIMINATOR] === MessageOriginType.original
          ? result2
          : result2),
      };
      _messages.value.push(message);

      return message;
    }
  }

  return {
    messages,
    getMessageById,
  };
});
