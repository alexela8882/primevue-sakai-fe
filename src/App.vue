<script setup>
// imports
// components
import FormDialog from './components/dynamic/FormDialog.vue'
import PopUpDialog from './components/dynamic/PopUpDialog.vue'
</script>

<template>
  <router-view />
  <Toast class="z-index-900" />
  <FormDialog />
  <PopUpDialog />
</template>

<style>

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 20px;
  border: transparent;
}

</style>
