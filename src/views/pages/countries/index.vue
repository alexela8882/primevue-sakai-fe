<script setup>
// --------
// imports
// --------
import { useLayout } from '@/layout/composables/layout'

// --------
// refs
// --------
const { isDarkTheme } = useLayout()

</script>

<template>
  <div class="mb-5 mt-5">
    <div class="flex justify-content-between">
      <div class="flex flex-column">
        <span class="text-xl font-bold" :class="`${isDarkTheme ? 'text-surface-50' : 'text-blue-800'}`">Country</span>
      </div>

      <div>
        <Button class="border-round-lg py-2 px-4 bg-blue-200" size="small">Add reports</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>