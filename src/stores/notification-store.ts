import { Notification } from "@/schemas/notification";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const errorLifetime = 5000;

export const useNotificationStore = defineStore("notification", () => {
  const _notifications = ref<Notification[]>([]);

  const notifications = computed(() => _notifications);

  function add(notification: Notification) {
    _notifications.value.push(notification);
    const errorId = notification.id;
    setTimeout(() => {
      const id = _notifications.value.findIndex(
        (notification) => notification.id === errorId,
      );
      if (id !== -1) {
        _notifications.value.splice(id, 1);
      }
    }, errorLifetime);
  }

  function remove(id: string) {
    _notifications.value.splice(
      _notifications.value.findIndex((notification) => notification.id === id),
      1,
    );
  }

  return { notifications, add, remove };
});
