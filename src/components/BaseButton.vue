<template>
  <button class="button">
    <slot></slot>
  </button>
</template>

<script setup lang="ts"></script>

<style scoped>
/* .button {
  font-size: 100%;
  color: white;
  background-color: #369bb4;
  border-radius: 8px;
}

.button:hover {
  background-color: aqua;
} */

.button {
  background-image: linear-gradient(#42a1ec, #0070c9);
  border: 1px solid aqua;
  border-radius: 4px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  direction: ltr;
  display: block;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: -0.022em;
  line-height: 1.47059;
  min-width: 30px;
  overflow: visible;
  padding: 4px 15px;
  text-align: center;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
}

.button:disabled {
  cursor: default;
  opacity: 0.3;
}

.button:hover {
  background-image: linear-gradient(#51a9ee, #147bcd);
  border: 3px solid #0077cc;
  text-decoration: none;
}

.button:active {
  background-image: linear-gradient(#3d94d9, #0067b9);
  border-color: #006dbc;
  outline: none;
}

.button:focus {
  box-shadow: rgba(131, 192, 253, 0.5) 0 0 0 3px;
  outline: none;
}
</style>
