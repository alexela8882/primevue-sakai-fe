<script setup>
// imports
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
// stores
import { useModuleStore } from '@/stores/modules/index'
// components
import DynamicDataTable from '../../../components/modules/DynamicDataTable.vue'

// refs
const route = useRoute()
const moduleStore = useModuleStore()
const { moduleLoading, getModule } = storeToRefs(moduleStore)
const { fetchModule } = moduleStore

watch(route, () => {
  fetchModule(route.params.id)
})

onMounted(() => {
  fetchModule(route.params.id)
})

</script>

<template>
  <div>
    <div>
      <div v-if="moduleLoading" class="flex align-items-center justify-content-center h-screen">
        <ProgressSpinner />
      </div>
      <div v-else>
        <h4>{{ getModule.label }}</h4>
        <DynamicDataTable :fields="getModule.fields" />
        <pre>{{ getModule }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>