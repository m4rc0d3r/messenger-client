import {
  type AddUserToChat,
  type AddUserToChatToServer,
  type TChat,
  type TCreateChat,
  type TCreateChatToServer,
} from "@/schemas/chat";
import type { TMessage } from "@/schemas/message";
import { ChatService } from "@/services/chat-service";
import { MessageService } from "@/services/message-service";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

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
          ...chat,
          messages: result2
            .filter((message) => message.chatId === chat.id)
            .map((message) => {
              return {
                ...message,
                date: new Date(message.createdAt),
                senderId: message.authorId,
              };
            }),
          users: chat.participants,
        };
      });

      return _chats;
    }
  }

  async function createChat(chat: TCreateChat) {
    const chatToServer = chat satisfies TCreateChatToServer;

    const result = await ChatService.createChat(chatToServer);
    if (result instanceof Error) {
      return result;
    } else {
      return _chats.value[_chats.value.length - 1];
    }
  }

  async function addUserToChat(userToChat: AddUserToChat) {
    const userToChatToServer = userToChat satisfies AddUserToChatToServer;

    const result = await ChatService.addUserToChat(userToChatToServer);
    if (result instanceof Error) {
      return result;
    } else {
      return true;
    }
  }

  async function getAllMessagesFromChat(chatId: TChat["id"]) {
    const result = await ChatService.getAllMessagesFromChat(chatId);
    if (result instanceof Error) {
      return result;
    } else {
      const chat = _chats.value.find((chat) => chat.id === chatId);
      if (chat) {
        chat.messages = result.map((message) => {
          return {
            ...message,
            date: new Date(message.createdAt),
            senderId: message.authorId,
          };
        });
      }
      return true;
    }
  }

  async function editMessage(messageToEdit: TMessage) {
    const result = await MessageService.editMessage({
      id: messageToEdit.id,
      text: messageToEdit.text,
      chatId: messageToEdit.chatId,
    });
    if (result instanceof Error) {
      return result;
    } else {
      return true;
    }
  }

  async function deleteMessage(messageToDelete: TMessage) {
    const result = await MessageService.deleteMessage({
      id: messageToDelete.id,
      chatId: messageToDelete.chatId,
    });
    if (result instanceof Error) {
      return result;
    }
  }

  async function forwardMessage(messageToForward: TMessage, chat: TChat) {
    const result = await MessageService.forwardMessage(messageToForward, chat);
    if (result instanceof Error) {
      return result;
    }
  }

  function addMessageToChat(chatId: TChat["id"], message: TMessage) {
    const chat = _chats.value.find((chat) => chat.id === chatId);
    if (chat) {
      chat.messages.push(message);
    }
  }

  function editMessageInChat(messageToEdit: TMessage) {
    const chat = _chats.value.find((chat) => chat.id === messageToEdit.chatId);
    if (chat) {
      const index = chat.messages.findIndex(
        (message) => message.id === messageToEdit.id,
      );
      if (index > -1) {
        chat.messages.splice(index, 1, messageToEdit);
      }
    }
  }

  function deleteMessageFromChat(messageToDelete: TMessage) {
    const chat = _chats.value.find(
      (chat) => chat.id === messageToDelete.chatId,
    );
    if (chat) {
      const index = chat.messages.findIndex(
        (message) => message.id === messageToDelete.id,
      );
      if (index > -1) {
        chat.messages.splice(index, 1);
      }
    }
    return true;
  }

  return {
    chats,
    getChatsOfUser,
    addMessageToChat,
    createChat,
    addUserToChat,
    getAllMessagesFromChat,
    editMessage,
    deleteMessage,
    editMessageInChat,
    deleteMessageFromChat,
    forwardMessage,
  };
});
