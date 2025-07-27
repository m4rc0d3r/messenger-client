<template>
  <input
    class="input"
    :value="modelValue"
    @input="e => {
        emit('update:modelValue', (e.target as HTMLInputElement).value)
    }"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<style scoped>
.input {
  border: 1px solid aqua;
  border-radius: 4px;
  box-sizing: border-box;
}
.input:focus {
  border: 3px solid #369bb4;
  outline: none;
}
</style>
