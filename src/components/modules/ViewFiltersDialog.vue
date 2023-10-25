<script setup>
// import
import { storeToRefs } from 'pinia'
import { onMounted, watch, ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
// stores
import { useModuleStore } from '@/stores/modules/index'

// refs
const pickListTblFields = ref(null)
const {
  values,
  errors,
  defineComponentBinds,
  setFieldValue,
  handleSubmit
} = useForm({
  validationSchema: yup.object({
    filterName: yup.string().label('Filter name').required(),
    sortField: yup.string().label('Sort field').required(),
    sortOrder: yup.string().label('Sort order').required(),
    perPage: yup.string().label('Items per page').required(),
    pickList: yup.array().label('Pick list fields').min(1, 'Please add at least 1 field').required()
  })
})
const filterName = defineComponentBinds('filterName')
const sortField = defineComponentBinds('sortField')
const sortOrder = defineComponentBinds('sortOrder')
const perPage = defineComponentBinds('perPage')
const pickList = defineComponentBinds('pickList')
// stores
const moduleStore = useModuleStore()
const {
  viewFiltersDialogLoading,
  viewFiltersDialog,
  newViewFilter,
  perPageItems,
  getBaseModule
} = storeToRefs(moduleStore)
const { addViewFilter } = moduleStore

// actions
const saveNewViewFilter = handleSubmit(values => {
  // alert(JSON.stringify(values, null, 2))
  console.log(values)
  viewFiltersDialog.value = false
  addViewFilter(values)
})

// lifecycles
watch(pickListTblFields, (newVal, oldVal) => {
  // update new view filters
  newViewFilter.value.data.fields = newVal[1].map(nv => nv._id)
  setFieldValue('pickList', newVal[1].map(nv => nv._id))
})

onMounted(() => {
  pickListTblFields.value = [getBaseModule.value.fields, []]
  viewFiltersDialogLoading.value = false
})

</script>

<template>
  <Dialog
    v-model:visible="viewFiltersDialog"
    modal
    maximizable
    :style="{ width: '70vw' }"
    class="view-filter-dialog">
    <template #header>
      <div class="flex align-items-center text-2xl">
        <div class="material-icons mr-2">table_chart</div>
        <div>Table Settings &mdash; {{ getBaseModule.label }}</div>
      </div>
    </template>
    <form @submit.prevent="saveNewViewFilter" class="flex flex-column gap-4">
      <!-- <pre>{{ values }}</pre>
      <pre>{{ errors }}</pre> -->
      <div>
        <InlineMessage
          v-if="newViewFilter.error"
          severity="error"
          class="mt-3">
          Please fill all the required fields
        </InlineMessage>
      </div>
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
      <div class="flex align-items-center justify-content-between">
        <div class="flex align-items-center gap-2">
          <div>
            <span class="p-float-label">
              <Dropdown
                v-bind="sortField"
                :options="getBaseModule.fields"
                optionLabel="label"
                optionValue="_id"
                placeholder="Select Field *"
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
                :options="[{ label: 'Ascending', value: 'asc' }, { label: 'Descending', value: 'desc' }]"
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
              v-bind="perPage"
              :options="perPageItems"
              optionLabel="label"
              optionValue="value"
              class="w-full md:w-12rem mr-2"
              :class="`${errors.perPage ? 'p-invalid' : 'border-primary'}`" />
            <label>Items per page *</label>
          </span>
          <div class="p-error text-sm my-2">{{ errors.perPage || '&nbsp;' }}</div>
        </div>
      </div>
      <div :class="`${errors.pickList && 'border-1 border-round-md border-red-600 p-4'}`">
        <PickList
          v-model="pickListTblFields"
          responsive
          listStyle="height:342px"
          dataKey="_id">
          <template #sourceheader> Available </template>
          <template #targetheader> Selected </template>
          <template #item="slotProps">
            <div class="flex flex-wrap p-2 align-items-center gap-3">
              <div class="flex-1 flex flex-column gap-2">
                <span class="font-bold">{{ slotProps.item.label }}</span>
              </div>
            </div>
          </template>
        </PickList>
      </div>
      <div class="p-error text-sm">{{ errors.pickList || '&nbsp;' }}</div>
    </form>
    <template #footer>
      <div class="flex align-items-center justify-content-end my-2">
        <Button
          @click="viewFiltersDialog = false"
          outlined
          label="Cancel"
          class="border-round-3xl py-2 px-4 border-color-primary"
          size="small" />
        <Button @click="saveNewViewFilter" class="reddot-primary border-round-3xl py-2 px-4 text-surface-50">Save</Button>
      </div>
    </template>
  </Dialog>
</template>

<style>
.view-filter-dialog .p-dialog-header {
  background-color: var(--primary-color);
  color: var(--surface-a);
}
.view-filter-dialog.p-dialog .p-dialog-header .p-dialog-header-icon {
  color: var(--surface-a);
}
</style>