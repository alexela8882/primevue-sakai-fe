<script setup>
// import
import { storeToRefs } from 'pinia'
import { onMounted, watch, ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
// stores
import { useModuleStore } from '@/stores/modules/index'

// refs
const pickListTrigger = ref(false)
const pickListTblFields = ref(null)
const {
  values,
  errors,
  defineComponentBinds,
  isSubmitting,
  setFieldValue,
  handleSubmit
} = useForm({
  validationSchema: yup.object({
    filterName: yup.string().label('Filter name').required(),
    sortField: yup.string().label('Sort field').required(),
    sortOrder: yup.string().label('Sort order').required(),
    pageSize: yup.string().label('Items per page').required(),
    queryType: yup.string().label('Query Type').required(),
    pickList: yup.array().label('Pick list fields').min(2, 'Please add at least 2 field').required()
  })
})
const localSelectedViewFilter = ref(null)
const filterName = defineComponentBinds('filterName')
const sortField = defineComponentBinds('sortField')
const sortOrder = defineComponentBinds('sortOrder')
const pageSize = defineComponentBinds('pageSize')
const queryType = defineComponentBinds('queryType')
const pickList = defineComponentBinds('pickList')
// stores
const moduleStore = useModuleStore()
const {
  viewFiltersDialogLoading,
  viewFiltersDialog,
  viewFilterData,
  perPageItems,
  getBaseModule,
  _getDefaultViewFilter,
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
const saveTableSettings = handleSubmit(async values => {
  // alert(JSON.stringify(values, null, 2))
  viewFiltersDialogLoading.value = true

  const payload = Object.assign({}, {
    mode: props.mode,
    baseModule: props.baseModule,
    viewFilter: props.selectedViewFilter,
    type: 'table',
    data: values
  })
  const res = await addViewFilter(payload) // store save/update
  emit('save-viewfilter', res.viewFilter)

  viewFiltersDialogLoading.value = false
  viewFiltersDialog.value = false
})
const tblSettingsAutoFill = (viewFilter) => {
  console.log(viewFilter)
  setFieldValue('filterName', viewFilter.filterName)
  setFieldValue('sortField', viewFilter.sortField ? viewFilter.sortField : 'created_at')
  setFieldValue('sortOrder', viewFilter.sortOrder)
  setFieldValue('pageSize', viewFilter.pageSize ? viewFilter.pageSize : 15)
  setFieldValue('queryType', viewFilter.queryType ? viewFilter.queryType : 'all')
  const filteredFields = props.module.fields.filter(item => !viewFilter.fields.some(removeItem => removeItem._id === item._id))
  pickListTblFields.value = [filteredFields, viewFilter.fields]
  setFieldValue('pickList', viewFilter.fields.map(field => field._id))
}

// lifecycles
onMounted(() => {
  viewFiltersDialogLoading.value = false
  localSelectedViewFilter.value = props.selectedViewFilter

  if (props.mode === 'new') {
    pickListTblFields.value = [props.module.fields, []]
    setFieldValue('queryType', 'all')
    setFieldValue('pageSize', 15)
    setFieldValue('sortOrder', 'ASC')
    setFieldValue('sortField', 'created_at')
  } else if (props.mode === 'edit-table') tblSettingsAutoFill(_getDefaultViewFilter.value(props.module))
})

watch(pickListTblFields, (newVal, oldVal) => {
  // update new view filters
  viewFilterData.value.data.fields = newVal[1].map(nv => nv._id)

  // bind values programmatically
  if (pickListTrigger.value) setFieldValue('pickList', newVal[1].map(nv => nv._id))
})

watch(localSelectedViewFilter, (newVal, oldVal) => {
  if (props.mode === 'edit-table') {
    const viewFilter = __getViewFilter.value(newVal, props.module)
    tblSettingsAutoFill(viewFilter)
  }
})

watch(() => props.saveTrigger, (newVal, oldVal) => {
  saveTableSettings()
})
</script>

<template>
  <form class="flex flex-column gap-4">
    <div class="mt-4 flex justify-content-between">
      <div>
        <span class="p-float-label">
          <InputText
            v-bind="filterName"
            :class="`${errors.filterName ? 'p-invalid' : 'border-primary'}`"
            style="min-width: 50vh;" />
          <label>Filter name *</label>
        </span>
        <div class="p-error text-sm my-2">{{ errors.filterName || '&nbsp;' }}</div>
      </div>
      <div>
        <span class="p-float-label">
          <Dropdown
            v-bind="queryType"
            :class="`${errors.queryType ? 'p-invalid' : 'border-primary'}`"
            :options="[{ label: 'All', value: 'all' }, { label: 'Owned', value: 'owned' }]"
            optionLabel="label"
            optionValue="value"
            class="w-full md:w-16rem mr-2" />
          <label>Query type</label>
        </span>
        <div class="p-error text-sm my-2">{{ errors.queryType || '&nbsp;' }}</div>
      </div>
    </div>
    <div class="flex align-items-center justify-content-between">
      <div class="flex align-items-center gap-2">
        <div>
          <span class="p-float-label">
            <Dropdown
              v-bind="sortField"
              :options="module.fields"
              optionLabel="label"
              optionValue="name"
              dataKey="_id"
              filter
              class="w-full md:w-12rem mr-2"
              :class="`${errors.sortField ? 'p-invalid' : 'border-primary'}`" />
            <label>Sort field *</label>
          </span>
          <div class="p-error text-sm my-2">{{ errors.sortField || '&nbsp;' }}</div>
        </div>
        <div>
          <span class="p-float-label">
            <Dropdown
              v-bind="sortOrder"
              :options="[{ label: 'Ascending', value: 'ASC' }, { label: 'Descending', value: 'DESC' }]"
              optionLabel="label"
              optionValue="value"
              class="w-full md:w-12rem mr-2"
              :class="`${errors.sortOrder ? 'p-invalid' : 'border-primary'}`" />
            <label>Sort order *</label>
          </span>
          <div class="p-error text-sm my-2">{{ errors.sortOrder || '&nbsp;' }}</div>
        </div>
      </div>
      <div>
        <span class="p-float-label">
          <Dropdown
            v-bind="pageSize"
            :options="perPageItems"
            optionLabel="label"
            optionValue="value"
            class="w-full md:w-12rem mr-2"
            :class="`${errors.pageSize ? 'p-invalid' : 'border-primary'}`" />
          <label>Items per page *</label>
        </span>
        <div class="p-error text-sm my-2">{{ errors.pageSize || '&nbsp;' }}</div>
      </div>
    </div>
    <div
      class="border-1 border-round-md p-4"
      :class="`${errors.pickList ? 'border-red-600' : 'border-primary'}`">
      <div class="text-sm mb-4" :class="{ 'p-error': errors.pickList }">
        {{ errors.pickList || 'View filter fields' }}
      </div>
      <PickList
        v-model="pickListTblFields"
        @selection-change="pickListTrigger = true"
        responsive
        listStyle="height:342px"
        dataKey="_id">
        <template #sourceheader> Available Fields </template>
        <template #targetheader> Visible Fields </template>
        <template #item="slotProps">
          <div class="flex flex-wrap p-2 align-items-center gap-3">
            <div class="flex-1 flex flex-column gap-2">
              <span class="font-bold">{{ slotProps.item.label }}</span>
            </div>
          </div>
        </template>
      </PickList>
    </div>
  </form>
</template>

<style lang="scss" scoped>

</style>