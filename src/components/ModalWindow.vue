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
  top: 0%;
  right: 0%;
  bottom: 0%;
  left: 0%;
}

.modal-window {
  background-color: white;
  max-width: 80%;
  max-height: 80%;
  margin: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
