import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { ChatService } from "@/services/chat-service";
import { type TChat } from "@/schemas/chat";
import { MessageService } from "@/services/message-service";
import type { TMessage } from "@/schemas/message";

export const useChatStore = defineStore("chat", () => {
  const _chats = ref<TChat[]>([]);

  const chats = computed(() => _chats);

  async function getChatsOfUser() {
    const result = await ChatService.getChatsOfUser();
    const result2 = await MessageService.getMessages();
    if (result instanceof Error) {
      return result;
    } else if (result2 instanceof Error) {
      return result2;
    } else {
      _chats.value = result.map((chat) => {
        return {
          id: chat.id_chat,
          name: chat.name_chat,
          type: chat.rk_type_chat,
          link: chat.link,
          messages: result2
            .filter((message) => message.rk_chat === chat.id_chat)
            .map((message) => {
              return {
                id: message.id_message,
                text: message.text_message,
                date: new Date(message.data_time),
                senderId: message.rk_user,
                chatId: message.rk_chat,
              };
            }),
        };
      });

      return _chats;
    }
  }

  function addMessageToChat(chatId: TChat["id"], message: TMessage) {
    const chat = _chats.value.find((chat) => chat.id === chatId);
    if (chat) {
      chat.messages.push(message);
    }
  }

  return { chats, getChatsOfUser, addMessageToChat };
});
