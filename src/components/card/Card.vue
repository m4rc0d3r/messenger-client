<template>
  <div data-slot="card" class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  display: flex;
  padding-top: 1.5rem 0;
  flex-direction: column;
  gap: calc(var(--step) * 6);
  border-radius: 0.75rem;
  border-width: 1px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  color: var(--card-foreground);
  background-color: var(--card);
}
</style>
