<script setup>
// import
import { storeToRefs } from 'pinia'
import { onMounted, watch, ref } from 'vue'
// stores
import { useModuleStore } from '@/stores/modules/index'

// refs
const pickListTblFields = ref(null)
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
const saveNewViewFilter = () => {
  newViewFilter.value.error = false // reset validation
  if (
    newViewFilter.value.data.filterName &&
    newViewFilter.value.data.sortField &&
    newViewFilter.value.data.sortOrder &&
    newViewFilter.value.data.perPage &&
    newViewFilter.value.data.fields.length >= 1
  ) {
    viewFiltersDialog.value = false

    // insert to backend
    addViewFilter(newViewFilter.value.data)

    // reset to default
    newViewFilter.value.error = false
    newViewFilter.value.data = Object.assign({}, newViewFilter.value.default)
    pickListTblFields.value = [getBaseModule.value.fields, []]
  } else newViewFilter.value.error = true
}

// lifecycles
watch(pickListTblFields, (newVal, oldVal) => {
  // update new view filters
  newViewFilter.value.data.fields = newVal[1].map(nv => nv._id)
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
    <div class="flex flex-column gap-4">
      <div>
        <InlineMessage
          v-if="newViewFilter.error"
          severity="error"
          class="mt-3">
          Please fill all the required fields
        </InlineMessage>
      </div>
      <span class="p-float-label">
        <InputText
          v-model="newViewFilter.data.filterName"
          class="border-primary"
          style="min-width: 50vh;" />
        <label>Filter name *</label>
      </span>
      <div class="flex align-items-center justify-content-between">
        <div class="flex align-items-center gap-2">
          <div>Order by</div>
          <Dropdown
            v-model="newViewFilter.data.sortField"
            :options="getBaseModule.fields"
            optionLabel="label"
            optionValue="_id"
            placeholder="Select Field *"
            class="border-primary w-full md:w-12rem mr-2"/>
          <Dropdown
            v-model="newViewFilter.data.sortOrder"
            :options="[{ label: 'Ascending', value: 'asc' }, { label: 'Descending', value: 'desc' }]"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Order *"
            class="border-primary w-full md:w-12rem mr-2"/>
        </div>
        <div class="flex align-items-center gap-2">
          <div>Items per page</div>
          <Dropdown
            v-model="newViewFilter.data.perPage"
            :options="perPageItems"
            optionLabel="label"
            optionValue="value"
            placeholder="Per Page *"
            class="border-primary w-full md:w-12rem mr-2"/>
        </div>
      </div>
      <div>
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
    </div>
    <template #footer>
      <div class="flex align-items-center justify-content-end my-2">
        <Button
          @click="viewFiltersDialog = false"
          outlined
          label="Cancel"
          class="border-round-3xl py-2 px-4 border-color-primary"
          size="small" />
        <Button
          @click="saveNewViewFilter"
          class="reddot-primary border-round-3xl py-2 px-4 text-surface-50">Save</Button>
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