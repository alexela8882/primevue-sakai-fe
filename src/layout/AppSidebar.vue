<script setup>
// imports
import { defineAsyncComponent } from 'vue'

// refs
// components
const AppMenu = defineAsyncComponent(() => 
  import('./AppMenu.vue')
)
</script>

<template>
  <Suspense>
    <AppMenu />
  </Suspense>
</template>

<style scoped></style>
