<template>
  <Teleport to="body">
    <div
      ref="modal-window-wrapper"
      class="modal-window-wrapper"
      tabindex="0"
      @click="close"
      @keydown.esc="close"
    >
      <div @click="(ev) => ev.stopPropagation()" class="modal-window">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue";

const emit = defineEmits({
  close() {
    return true;
  },
});

const modalWindowWrapper = useTemplateRef("modal-window-wrapper");

onMounted(() => {
  modalWindowWrapper.value?.focus();
});

function close() {
  emit("close");
}
</script>

<style scoped>
.modal-window-wrapper {
  background-color: #00000077;
  position: fixed;
  inset: 0;
  display: flex;
  overflow: auto;
  padding: calc(var(--step) * 8);
}

.modal-window {
  background-color: transparent;
  margin: auto;
}
</style>
