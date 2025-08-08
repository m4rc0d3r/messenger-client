<template>
  <Teleport to="body">
    <div @click="emit('close')" class="modal-window-wrapper">
      <div @click="(ev) => ev.stopPropagation()" class="modal-window">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const emit = defineEmits({
  close() {
    return true;
  },
});
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
