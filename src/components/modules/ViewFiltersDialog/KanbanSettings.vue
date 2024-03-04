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
const {
  values,
  errors,
  defineComponentBinds,
  isSubmitting,
  setFieldValue,
  handleSubmit
} = useForm({
  validationSchema: yup.object({
    group_by: yup.string().label('Group By').required()
  })
})
const summarize_by = defineComponentBinds('summarize_by')
const group_by = defineComponentBinds('group_by')
// stores
const moduleStore = useModuleStore()
const {
  viewFiltersDialogLoading,
  viewFiltersDialog,
  viewFilterData,
  perPageItems,
  getBaseModule,
  getDefaultViewFilter,
  __getViewFilter,
  _getViewFilters,
  getViewFilters,
  getReconstructedViewFilter
} = storeToRefs(moduleStore)
const { addViewFilter } = moduleStore
// defines
const props = defineProps({
  mode: String,
  module: Object,
  selectedViewFilter: String,
  saveTrigger: Number
})

// actions
const saveKanbanSettings = handleSubmit(values => {
  // alert(JSON.stringify(values, null, 2))
  viewFiltersDialog.value = false

  const payload = Object.assign({}, {
    baseModule: props.baseModule,
    viewFilter: props.selectedViewFilter,
    type: 'table',
    data: values
  })
  addViewFilter(payload) // dummy store save
})
const kanbanSettingsAutoFill = (viewFilter) => {
  console.log(viewFilter)
  setFieldValue('summarize_by', viewFilter.summarize_by)
  setFieldValue('group_by', viewFilter.group_by)
}

// lifecycles
onMounted(() => {
  viewFiltersDialogLoading.value = false
  localSelectedViewFilter.value = props.selectedViewFilter
  console.log(localSelectedViewFilter.value)
})

watch(localSelectedViewFilter, (newVal, oldVal) => {
  const viewFilter = __getViewFilter.value(newVal, props.module)
  kanbanSettingsAutoFill(getReconstructedViewFilter.value(viewFilter))
})

watch(() => props.saveTrigger, (newVal, oldVal) => {
  saveKanbanSettings()
})
</script>

<template>
  <div class="flex flex-column gap-4">
    <div class="flex flex-column gap-4 mx-auto mt-6">
      <div>
        <span class="p-float-label">
          <Dropdown
            v-bind="summarize_by"
            :options="module.fields"
            optionLabel="label"
            optionValue="name"
            filter
            class="w-full md:w-22rem mr-2"
            :class="`${errors.summarize_by ? 'p-invalid' : 'border-primary'}`" />
          <label>Summarize By</label>
        </span>
        <div class="p-error text-sm my-2">{{ errors.summarize_by || '&nbsp;' }}</div>
      </div>
      <div>
        <span class="p-float-label">
          <Dropdown
            v-bind="group_by"
            :options="module.fields"
            optionLabel="label"
            optionValue="_id"
            filter
            class="w-full md:w-22rem mr-2"
            :class="`${errors.group_by ? 'p-invalid' : 'border-primary'}`" />
          <label>Group By *</label>
        </span>
        <div class="p-error text-sm my-2">{{ errors.group_by || '&nbsp;' }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>