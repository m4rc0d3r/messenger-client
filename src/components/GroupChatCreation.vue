<template>
  <div>
    <form ref="form" @submit.prevent class="form">
      <div class="fields-to-fill">
        <label for="name">Name</label>
        <input v-model="name" type="text" id="name" required />
      </div>
      <BaseButton @click="create">Create</BaseButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "./BaseButton.vue";

const emit = defineEmits({
  create(name: string) {
    return true;
  },
});

const name = ref("");
const form = ref<HTMLFormElement>();

function create() {
  console.log("hi");
  if (form.value?.checkValidity()) {
    console.log("hi2");
    emit("create", name.value);
  }
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
}

.form > * {
  margin-top: 12px;
}

.form > *:first-child {
  margin-top: 0;
}

.fields-to-fill {
  display: grid;
  grid-template-columns: auto 1fr;
  row-gap: 12px;
  column-gap: 12px;
}
</style>
