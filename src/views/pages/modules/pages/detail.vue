<script setup>
// imports
import { defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
// components
const ShowDetail = defineAsyncComponent(() =>
  import('@/components/modules/Page/ShowDetail.vue')
)

const ShowInquiryDetail = defineAsyncComponent(() =>
  import('@/components/modules/Page/ShowInquiryDetail.vue')
)

// refs
const route = useRoute()
</script>

<template>
  <Suspense v-if="route.params.name !== 'inquiries'">
    <ShowDetail />
  </Suspense>

  <Suspense v-else>
    <ShowInquiryDetail />
  </Suspense>
</template>

<style scoped>

</style>