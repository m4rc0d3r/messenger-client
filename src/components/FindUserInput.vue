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
      <ul class="find-user-block__found-users">
        <UserCard
          v-for="user in foundUsers"
          :key="user.id"
          :user="user"
          @click="emit('click-on-user', user)"
        />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from "@/components/BaseInput.vue";
import UserCard from "@/components/UserCard.vue";
import type { TUser } from "@/schemas/user";

defineProps<{
  userDataToFind: string;
  foundUsers: TUser[];
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
  overflow: auto;
  max-height: 200px;
  background: linear-gradient(to right, #d4d9b7, #66997d);
}

.find-user-block__found-users > * {
  margin-top: 4px;
}

.find-user-block__found-users > *:first-child {
  margin-top: 0;
}
</style>
