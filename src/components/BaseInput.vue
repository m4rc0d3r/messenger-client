<template>
  <input
    ref="input"
    class="input"
    :value="modelValue"
    @input="e => {
        emit('update:modelValue', (e.target as HTMLInputElement).value)
    }"
  />
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const inputRef = useTemplateRef("input");

defineExpose({
  inputRef,
});
</script>

<style scoped>
.input {
  border: 1px solid var(--primary);
  border-radius: var(--radius-sm);
  font-family: "Roboto", sans-serif;
}

.input:focus-visible {
  outline: calc(var(--step) / 2) solid var(--primary);
}
</style>
