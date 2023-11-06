<script setup>
// import
import { storeToRefs } from 'pinia'
import { onMounted, watch, ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
// stores
import { useModuleStore } from '@/stores/modules/index'

// refs
const localSelectedViewFilter = ref(null)
// stores
const moduleStore = useModuleStore()
const {
  viewFiltersDialogLoading,
  viewFiltersDialog,
  viewFilterData,
  perPageItems,
  getBaseModule,
  getDefaultViewFilter,
  getViewFilters,
  getReconstructedViewFilter
} = storeToRefs(moduleStore)
const { addViewFilter } = moduleStore
// defines
const props = defineProps({
  mode: String,
  selectedViewFilter: String,
  saveTrigger: Number
})

// lifecycles
onMounted(() => {
  viewFiltersDialogLoading.value = false
  console.log(getViewFilters.value)
  localSelectedViewFilter.value = props.selectedViewFilter
})
</script>

<template>
  <div>
    KANBAN SETTINGS
  </div>
</template>

<style scoped>

</style>