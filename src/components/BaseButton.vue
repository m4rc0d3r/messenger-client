<template>
  <button ref="button" class="button">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";

const buttonRef = useTemplateRef("button");

defineExpose({
  buttonRef,
});
</script>

<style scoped>
.button {
  display: inline-flex;
  gap: calc(var(--step) * 2);
  justify-content: center;
  align-items: center;
  border-radius: var(--radius-sm);
  outline-style: none;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-family: "Roboto", sans-serif;
  font-weight: bold;
  white-space: nowrap;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  border: none;
  padding: calc(var(--step) * 2) calc(var(--step) * 4);

  color: var(--primary-foreground);
  background-color: var(--primary);
}

.button:hover {
  background-color: color-mix(in oklab, var(--primary) 75%, transparent);
}

.button:focus-visible {
  outline: 0.25rem solid black;
}
</style>
