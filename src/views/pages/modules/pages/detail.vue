<script setup>
// imports
import { defineAsyncComponent } from 'vue'
// components
import ShowDetail from '../../../../components/modules/Page/ShowDetail.vue'

// refs
// components
// const ShowDetail = defineAsyncComponent(() =>
//   import('../../../../components/modules/Page/ShowDetail.vue')
// )
// const ShowDetail = defineAsyncComponent({
//   loader: () => import('@/components/modules/Page/ShowDetail.vue'),
//   // A component to use while the async component is loading
//   // loadingComponent: LoadingComponent,
//   // Delay before showing the loading component. Default: 200ms.
//   delay: 200,

//   // A component to use if the load fails
//   // errorComponent: ErrorComponent,
//   // The error component will be displayed if a timeout is
//   // provided and exceeded. Default: Infinity.
//   timeout: 3000
// })
</script>

<template>
  <div>
    <ShowDetail />
  </div>
</template>

<style scoped>

</style>