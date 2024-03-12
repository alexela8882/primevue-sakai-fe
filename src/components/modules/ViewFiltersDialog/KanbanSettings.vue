<script setup>
// import
import { storeToRefs } from 'pinia'
import { onMounted, watch, ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
// stores
import { useModuleStore } from '@/stores/modules/index'

// refs
const availableFields = ref()
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
    group_by: yup.string().label('Group By').required(),
    title_ids: yup.array().label('Titles').required()
  })
})
const title_ids = defineComponentBinds('title_ids')
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
  baseModule: Object,
  module: Object,
  selectedViewFilter: String,
  saveTrigger: Number
})
const emit = defineEmits(['save-viewfilter'])

// actions
const saveKanbanSettings = handleSubmit(async values => {
  // alert(JSON.stringify(values, null, 2))
  viewFiltersDialogLoading.value = true

  const payload = Object.assign({}, {
    baseModule: props.baseModule,
    viewFilter: props.selectedViewFilter,
    type: 'kanban',
    data: values
  })
  const res = await addViewFilter(payload) // store save
  emit('save-viewfilter', res.viewFilter)

  viewFiltersDialogLoading.value = false
  viewFiltersDialog.value = false
})
const kanbanSettingsAutoFill = (viewFilter) => {
  let title_ids = []
  if (viewFilter.title_ids && viewFilter.title_ids.length > 0) {
    // check if title ids are present in view filter
    title_ids = viewFilter.title_ids
  } else { // else get default from field.title
    title_ids = availableFields.value.filter(field => field.title).map(field => field._id)
  }

  setFieldValue('title_ids', title_ids)
  setFieldValue('summarize_by', viewFilter.summarize_by)
  setFieldValue('group_by', viewFilter.group_by)
}

// lifecycles
onMounted(() => {
  viewFiltersDialogLoading.value = false
  localSelectedViewFilter.value = props.selectedViewFilter
  // console.log(localSelectedViewFilter.value)

  const viewFilter = __getViewFilter.value(props.selectedViewFilter, props.module)
  availableFields.value = viewFilter.fields
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
          <MultiSelect
            v-bind="title_ids"
            :options="availableFields"
            optionLabel="label"
            optionValue="_id"
            filter
            mutiple
            class="w-full md:w-22rem mr-2"
            :class="`${errors.title_ids ? 'p-invalid' : 'border-primary'}`" />
          <label>Titles</label>
        </span>
        <div class="p-error text-sm my-2">{{ errors.title_ids || '&nbsp;' }}</div>
      </div>
      <div>
        <span class="p-float-label">
          <Dropdown
            v-bind="summarize_by"
            :options="availableFields"
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
            :options="availableFields"
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