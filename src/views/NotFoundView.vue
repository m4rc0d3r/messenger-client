<template>
  <div class="wrapper">
    <div class="content">
      <p class="text">Such page does not exist</p>
      <RouterLink to="/" class="link"> Go to the main page </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
.wrapper {
  display: flex;
  height: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: auto;
}

.text {
  font-size: 24px;
  font-weight: bold;
}

.text,
.link {
  text-align: center;
}
</style>
