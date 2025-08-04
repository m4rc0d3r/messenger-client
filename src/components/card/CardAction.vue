<template>
  <div data-slot="card-action" class="card-action">
    <slot />
  </div>
</template>

<style scoped>
.card-action {
  grid-column-start: 2;
  grid-row: span 2 / span 2;
  grid-row-start: 1;
  justify-self: end;
  align-self: flex-start;
}
</style>
