<template>
  <div data-slot="card-header" class="card-header">
    <slot />
  </div>
</template>

<style scoped>
.card-header {
  display: grid;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  grid-auto-rows: min;
  gap: 0.375rem;
  align-items: flex-start;
}
</style>
