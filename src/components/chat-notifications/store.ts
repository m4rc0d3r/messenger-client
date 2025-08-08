import { defineStore } from "pinia";
import { ref } from "vue";
import { type ChatNotification } from "./chat-notification";

const NOTICE_PERIOD = 5000;

const useChatNotificationsStore = defineStore("chat-notifications", () => {
  const notifications = ref<ChatNotification[]>([]);

  function add(notification: Omit<ChatNotification, "id">) {
    const id = Date.now();

    notifications.value.push({
      id,
      ...notification,
    } as ChatNotification);

    setTimeout(() => {
      remove(id);
    }, NOTICE_PERIOD);

    return id;
  }

  function remove(id_: ChatNotification["id"]) {
    const index = notifications.value.findIndex(({ id }) => id === id_);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  }

  return {
    notifications,
    add,
    remove,
  };
});

export { useChatNotificationsStore };
