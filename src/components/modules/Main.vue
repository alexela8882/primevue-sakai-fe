<script setup>
// ------------
// imports
// ------------
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useModuleStore } from '@/stores/modules/index'
// components
// import DataViewModules from '../../../components/modules/DataViewModules.vue'

// -----------
// refs
// -----------
// stores
const moduleStore = useModuleStore()
const { modulesLoading, getModules } = storeToRefs(moduleStore)
const { fetchModules } = moduleStore
// components
const DataViewModules = defineAsyncComponent({
  loader: () => import('../../components/modules/DataViewModules.vue'),
  // A component to use while the async component is loading
  // loadingComponent: LoadingComponent,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,

  // A component to use if the load fails
  // errorComponent: ErrorComponent,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000
})

onMounted(() => {
  fetchModules()
})

</script>

<template>
  <div>
    <Suspense>
      <DataViewModules
        :data="getModules"
        :loading="modulesLoading"
        :paginator="false"
        :rows="10" />
    </Suspense>
  </div>
</template>