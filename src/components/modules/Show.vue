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
const moduleStore = useModuleStore()
const {
  moduleLoading,
  collectionLoading,
  getModule,
  getCollection,
  getViewFilters,
  getDefaultViewFilter,
  getViewFilterIds,
  getViewFilter,
  getSearchKeyFieldIds } = storeToRefs(moduleStore)
const { fetchModule, fetchCollection } = moduleStore

watch(selectedViewFilter, (newVal, oldVal) => {
  console.log(oldVal)
  console.log(newVal)

  if (newVal) viewFilter.value = getViewFilter.value(newVal)

  console.log(viewFilter.value)
})

onMounted(async () => {
  await fetchModule(route.params.id)
  await fetchCollection(getModule.value.name, 1)

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
      <div v-if="moduleLoading" class="flex align-items-center justify-content-center h-screen">
        <ProgressSpinner />
      </div>
      <div v-else>
        <h4 class="text-esco-blue">{{ getModule.label }}</h4>

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
                class="w-full md:w-12rem mr-2"
                :inputStyle="{
                  padding: '5px 15px !important'
                }"
                inputClass="text-sm" />
              <MultiSelect
                v-model="selectedSearchKeyIds"
                :options="getModule.fields"
                filter
                :showToggleAll="false"
                optionLabel="label"
                optionValue="_id"
                placeholder="Select Fields"
                class="w-full md:w-12rem text-sm pa-0" />
            </div>
            <div class="md:flex align-items-center">
              <div class="p-input-icon-left mr-2">
                <i class="pi pi-search" />
                <InputText
                  type="text"
                  class="text-sm"
                  placeholder="Search The List..." />
              </div>
              <Button
                aria-label="Submit"
                class="custom-btn2 bg-esco-blue1-normal text-sm mr-2">
                <template #icon>
                  <div class="material-icons" style="padding: .5px !important;">calendar_view_month</div>
                </template>
              </Button>
              <Button
                icon="pi pi-cog"
                aria-label="Submit"
                class="custom-btn bg-esco-blue1-normal text-sm mr-2" />
              <Button
                icon="pi pi-filter"
                aria-label="Submit"
                class="custom-btn bg-esco-blue1-normal text-sm mr-2" />
              <Button class="custom-btn bg-esco-blue1-normal text-sm" icon="pi pi-plus" :label="`New ${getModule.label}`" />
            </div>
          </div>
        </div>

        <!-- datatable -->
        <DynamicDataTable
          :moduleName="getModule.name"
          :moduleLabel="getModule.label"
          :fields="viewFilter.fields"
          :data="getCollection.data"
          :pagination="getCollection.meta && getCollection.meta.pagination"
          :collectionLoading="collectionLoading" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.p-dropdown {
  border: 1px solid #0091d0 !important;
  border-radius: 10px !important;
}

.p-inputtext {
  border: 1px solid #0091d0 !important;
  border-radius: 10px !important;
  padding: 5px 15px 5px 35px !important;
}
.p-multiselect {
  border: 1px solid #0091d0 !important;
  border-radius: 10px !important;
}

.custom-btn {
  padding: 6px 15px 6px 15px !important;
}

.custom-btn2 {
  padding: 1px 0px !important;
}
</style>

<style>
.p-multiselect .p-multiselect-label,
.p-multiselect .p-multiselect-trigger {
  padding: 5px 5px 5px 15px !important;
}
</style>