<template>
  <button class="button">
    <slot></slot>
  </button>
</template>

<script setup lang="ts"></script>

<style scoped>
.button {
  font-size: 100%;
  color: white;
  background-color: #369bb4;
  border-radius: 8px;
}

.button:hover {
  background-color: aqua;
}
</style>
