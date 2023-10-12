<script setup>
// ------------
// imports
// ------------
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useBaseStore } from '@/stores/base'
// components
import DataViewModules from '../../../components/modules/DataViewModules.vue'

// -----------
// refs
// -----------
// stores
const baseStore = useBaseStore()
const {
  modulesLoading,
  getModules
} = storeToRefs(baseStore)
const { fetchModules } = baseStore

onMounted(() => {
  fetchModules()
})

</script>

<template>
  <div>
    <DataViewModules
      :data="getModules"
      :loading="modulesLoading"
      :paginator="false"
      :rows="10" />
  </div>
</template>