import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { ChatService } from "@/services/chat-service";
import {
  type AddUserToChat,
  type AddUserToChatToServer,
  type TChat,
  type TCreateChat,
  type TCreateChatToServer,
} from "@/schemas/chat";
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
          users: chat.users.map((user) => {
            return {
              id: user.id_user,
              email: user.email,
              nickname: user.nickname,
            };
          }),
        };
      });

      return _chats;
    }
  }

  async function createChat(chat: TCreateChat) {
    const chatToServer = {
      rk_type_chat: chat.type,
      id_user: chat.interlocutorId,
      name_chat: chat.name,
    } as TCreateChatToServer;

    const result = await ChatService.createChat(chatToServer);
    if (result instanceof Error) {
      return result;
    } else {
      return _chats.value[_chats.value.length - 1];
    }
  }

  async function addUserToChat(userToChat: AddUserToChat) {
    const userToChatToServer = {
      id_chat: userToChat.chatId,
      id_user: userToChat.userId,
    } as AddUserToChatToServer;

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
            id: message.id_message,
            text: message.text_message,
            date: new Date(message.data_time),
            senderId: message.rk_user,
            chatId: message.rk_chat,
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
        // messageToEdit.senderId = messageToEdit.senderId
        //   ? messageToEdit.senderId
        //   : chat.messages[index].senderId;
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
  };
});
