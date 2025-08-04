<template>
  <div class="find-user-block">
    <BaseInput
      :model-value="userDataToFind"
      @update:model-value="
        (value) => {
          emit('update:userDataToFind', value);
        }
      "
      type="text"
      class="find-user-block__input"
    />
    <div class="find-user-block__found-users-wrapper">
      <ul
        v-if="foundUsers && foundUsers.length > 0"
        class="find-user-block__found-users"
      >
        <UserCard
          v-for="user in foundUsers"
          :key="user.id"
          :user="user"
          class="user-card"
          @click="emit('click-on-user', user)"
        />
      </ul>
      <div
        v-else-if="foundUsers && foundUsers.length === 0"
        class="no-users-found-wrapper"
      >
        <p class="no-users-found">No users found.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from "@/components/BaseInput.vue";
import UserCard from "@/components/UserCard.vue";
import type { TUser } from "@/schemas/user";

defineProps<{
  userDataToFind: string;
  foundUsers: TUser[] | null;
}>();

const emit = defineEmits<{
  "click-on-user": [user: TUser];
  "update:userDataToFind": [value: string];
}>();
</script>

<style scoped>
.find-user-block {
  display: flex;
  flex-direction: column;
}

.find-user-block__input {
  width: 100%;
}

.find-user-block__found-users-wrapper {
  position: relative;
}

.find-user-block__found-users {
  width: 100%;
  position: absolute;
  top: var(--step);
  overflow: auto;
  max-height: 200px;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  background: linear-gradient(to right, #d4d9b7, #66997d);
}

.no-users-found-wrapper {
  background: linear-gradient(to right, #d4d9b7, #66997d);
  border-radius: var(--radius-lg);
  width: 100%;
  position: absolute;
  top: var(--step);
  height: calc(var(--step) * 20);
  display: flex;
}

.no-users-found {
  margin: auto;
}

.user-card {
  padding: var(--step) calc(var(--step) * 2);
}

.user-card:hover {
  background-color: aqua;
  cursor: pointer;
}
</style>
