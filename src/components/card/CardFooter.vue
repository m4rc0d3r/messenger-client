<template>
  <div data-slot="card-footer" class="card-footer">
    <slot />
  </div>
</template>

<style scoped>
.card-footer {
  display: flex;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  align-items: center;
}
</style>
