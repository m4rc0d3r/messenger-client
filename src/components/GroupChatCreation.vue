<template>
  <Card class="card-footer">
    <CardHeader>
      <CardTitle>Create a group chat</CardTitle>
      <CardDescription
        >Create a chat to communicate with several people at the same
        time.</CardDescription
      >
    </CardHeader>
    <CardContent>
      <form ref="form" @submit.prevent class="form">
        <div class="form-fields">
          <label for="name">Name</label>
          <BaseInput v-model="name" type="text" id="name" required />
        </div>
      </form>
    </CardContent>
    <CardFooter class="card-footer">
      <BaseButton @click="create">Create</BaseButton>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { ref } from "vue";
import BaseButton from "./BaseButton.vue";
import BaseInput from "./BaseInput.vue";

const emit = defineEmits<{
  create: [name: string];
}>();

const name = ref("");
const form = ref<HTMLFormElement>();

function create() {
  if (form.value?.checkValidity()) {
    emit("create", name.value);
  }
}
</script>

<style scoped>
.card {
  padding: calc(var(--step) * 2);
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(var(--step) * 3);
  border-radius: var(--radius-lg);
  background-color: white;
  gap: calc(var(--step) * 3);
}

.form-fields {
  display: grid;
  grid-template-columns: auto 1fr;
  row-gap: calc(var(--step) * 3);
  column-gap: calc(var(--step) * 2);
}

.card-footer {
  justify-content: end;
}
</style>
