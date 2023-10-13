<script setup>
// imports
import { defineAsyncComponent } from 'vue'

// refs
// components
const ShowModule = defineAsyncComponent(() =>
  import('../../../components/modules/Show.vue')
)
</script>

<template>
  <Suspense>
    <ShowModule />
  </Suspense>
</template>

<style scoped>

</style>