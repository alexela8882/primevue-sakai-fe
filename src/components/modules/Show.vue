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
const route = useRoute()
const moduleStore = useModuleStore()
const {
  moduleLoading,
  collectionLoading,
  getModule,
  getCollection,
  getViewFilters,
  getDefaultViewFilter,
  getViewFilter } = storeToRefs(moduleStore)
const { fetchModule, fetchCollection } = moduleStore

watch(selectedViewFilter, (newVal, oldVal) => {
  console.log(oldVal)
  console.log(newVal)

  if (newVal) viewFilter.value = getViewFilter.value(newVal)

  console.log(viewFilter.value)
})

onMounted(async () => {
  await fetchModule(route.params.id)
  await fetchCollection()

  // pre-assignments
  viewFilter.value = getDefaultViewFilter.value
  selectedViewFilter.value = viewFilter.value._id
})

</script>

<template>
  <div>
    <div class="mt-5">
      <div v-if="moduleLoading" class="flex align-items-center justify-content-center h-screen">
        <ProgressSpinner />
      </div>
      <div v-else>
        <h4 class="text-esco-blue">{{ getModule.label }}</h4>

        <!-- view filters -->
        <div class="my-2">
          <Dropdown
            v-model="selectedViewFilter"
            :options="getViewFilters"
            optionLabel="filterName"
            optionValue="_id"
            placeholder="Select view filters"
            class="w-full md:w-12rem"
            inputStyle="padding: 5px 15px !important;"
            inputClass="text-sm" />
        </div>

        <!-- datatable -->
        <DynamicDataTable
          :name="getModule.label"
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
</style>