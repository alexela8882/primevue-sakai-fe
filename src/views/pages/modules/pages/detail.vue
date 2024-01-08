<script setup>
// imports
import { defineAsyncComponent } from 'vue'

// refs
// components
const ShowDetail = defineAsyncComponent(() =>
  import('../../../../components/modules/Page/ShowDetail.vue')
)
</script>

<template>
  <Suspense>
    <ShowDetail />
  </Suspense>
</template>

<style scoped>

</style>