<script setup>
// imports
import { storeToRefs } from 'pinia'
import { onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
// stores
import { useModuleStore } from '@/stores/modules/index'
// components
import DynamicDataTable from '../../components/modules/DynamicDataTable.vue'

// refs
const viewFilter = ref([])
const selectedViewFilter = ref()
const selectedFields = ref()
const selectedSearchKeyIds = ref()
const route = useRoute()
// stores
const moduleStore = useModuleStore()
const {
  moduleLoading,
  collectionLoading,
  getBaseModule,
  getModule,
  getCollection,
  getViewFilters,
  getDefaultViewFilter,
  getViewFilterIds,
  getViewFilter,
  getSearchKeyFieldIds } = storeToRefs(moduleStore)
const { fetchModule, fetchBaseModule, fetchCollection } = moduleStore

watch(selectedViewFilter, (newVal, oldVal) => {
  console.log(oldVal)
  console.log(newVal)

  if (newVal) viewFilter.value = getViewFilter.value(newVal)

  console.log(viewFilter.value)
})

onMounted(async () => {
  // await fetchCollection(route.name.split('.')[0], 1)
  await fetchBaseModule(route.params.id)
  await fetchModule(getBaseModule.value.name)

  // pre-assignments
  viewFilter.value = getDefaultViewFilter.value
  selectedViewFilter.value = viewFilter.value._id
  selectedFields.value = getViewFilterIds.value
  selectedSearchKeyIds.value = getSearchKeyFieldIds.value
})

</script>

<template>
  <div>
    <div class="mt-3">
      <div
        v-if="moduleLoading"
        class="flex align-items-center justify-content-center"
        style="height: 60vh !important;">
        <ProgressSpinner />
      </div>
      <div v-else>
        <h4 class="text-primary-700">{{ getBaseModule.label }}</h4>

        <!-- view filters -->
        <div class="mt-2 mb-4">
          <div class="md:flex justify-content-between">
            <div>
              <Dropdown
                v-model="selectedViewFilter"
                :options="getViewFilters"
                optionLabel="filterName"
                optionValue="_id"
                placeholder="Select View Filters"
                class="border-round-lg w-full md:w-12rem mr-2"
                inputClass="text-sm" />
              <MultiSelect
                v-model="selectedSearchKeyIds"
                :options="getBaseModule.fields"
                track-by="_id"
                filter
                :showToggleAll="false"
                optionLabel="label"
                optionValue="_id"
                placeholder="Select Fields"
                class="border-round-lg w-full md:w-12rem text-sm" />
            </div>
            <div class="md:flex align-items-center">
              <div class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  type="text"
                  class="text-sm border-round-lg mr-2"
                  placeholder="Search The List..." />
              </div>
              <div class="p-inputgroup flex-1">
                <Button
                  aria-label="Submit"
                  class="material-icon border-round-lg text-sm mr-2">
                  <template #icon>
                    <div class="material-icons">view_kanban</div>
                  </template>
                </Button>
                <Button
                  icon="pi pi-cog"
                  aria-label="Submit"
                  class="text-sm border-round-lg mr-2" />
                <Button
                  icon="pi pi-filter"
                  aria-label="Submit"
                  class="text-sm border-round-lg mr-2" />
                <Button class="text-sm border-round-lg mr-2" icon="pi pi-plus" :label="`New ${getBaseModule.label}`" />
              </div>
            </div>
          </div>
        </div>

        <!-- datatable -->
        <DynamicDataTable
          :moduleName="getBaseModule.name"
          :moduleLabel="getBaseModule.label"
          :fields="viewFilter.fields"
          :data="getCollection.data"
          :pagination="getCollection.meta && getCollection.meta.pagination"
          :collectionLoading="collectionLoading" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

<style>
/* .p-multiselect .p-multiselect-label,
.p-multiselect .p-multiselect-trigger {
  padding: 5px 5px 5px 15px !important;
} */
</style>