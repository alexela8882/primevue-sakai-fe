<script setup>
// imports
import { storeToRefs } from 'pinia'
import { onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
// stores
import { useModuleStore } from '@/stores/modules/index'
// components
import DynamicDataTable from '../../components/modules/DynamicDataTable.vue'

// refs
const route = useRoute()
const toast = useToast()
const pickListTblFields = ref(null)
const tblSettingsDialog = ref(false)
const viewFilter = ref([])
const selectedViewFilter = ref()
const selectedFields = ref()
const selectedSearchKeyIds = ref()
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
// presets
const tblMenu = ref(false)
const tblSettings = ref([
  {
    label: 'New',
    icon: 'add',
    command: (event) => {
      console.log(event)
      tblSettingsDialog.value = true
    }
  }, {
    label: 'Edit table settings',
    icon: 'table_chart',
    command: (event) => {
      console.log(event)
    }
  }, {
    label: 'Edit kanban settings',
    icon: 'view_kanban',
    command: (event) => {
      console.log(event)
    }
  }
])
const newViewFilter = ref({
  error: false,
  data: {
    filterName: null,
    sortField: null,
    sortOrder: null,
    perPage: null,
    fields: [],
    moduleName: route.params.name,
    isDefault: false
  },
  default: {
    filterName: null,
    sortField: null,
    sortOrder: null,
    perPage: null,
    fields: [],
    moduleName: route.params.name,
    isDefault: false
  }
})
const perPageItems = ref([
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '20', value: 20 },
  { label: '25', value: 25 },
  { label: '30', value: 30 },
  { label: '35', value: 35 },
  { label: '40', value: 40 },
  { label: '45', value: 45 },
  { label: '50', value: 50 }
])

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
    tblSettingsDialog.value = false

    // reset to default
    newViewFilter.value.error = false
    newViewFilter.value.data = Object.assign({}, newViewFilter.value.default)
    pickListTblFields.value = [getBaseModule.value.fields, []]

    // toast
    toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: 'New view filters successfully added',
      life: 3000
    })
  } else newViewFilter.value.error = true
  console.log(newViewFilter.value)
}

// lifescycles
watch(selectedViewFilter, (newVal, oldVal) => {
  console.log(oldVal)
  console.log(newVal)

  if (newVal) viewFilter.value = getViewFilter.value(newVal)

  console.log(viewFilter.value)
})

watch(pickListTblFields, (newVal, oldVal) => {
  console.log(oldVal)
  console.log(newVal)

  console.log(newVal[1].map(nv => nv._id))

  // update new view filters
  newViewFilter.value.data.fields = newVal[1].map(nv => nv._id)
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
  pickListTblFields.value = [getBaseModule.value.fields, []]
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
                class="border-round-xl border-primary w-full md:w-12rem mr-2"/>
              <MultiSelect
                v-model="selectedSearchKeyIds"
                :options="getBaseModule.fields"
                track-by="_id"
                filter
                :showToggleAll="false"
                optionLabel="label"
                optionValue="_id"
                placeholder="Select Fields"
                class="border-round-xl border-primary w-full md:w-12rem" />
            </div>
            <div class="md:flex align-items-center">
              <div class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  type="text"
                  class="border-round-xl border-primary mr-2"
                  placeholder="Search The List..." />
              </div>
              <div class="p-inputgroup flex-1">
                <Button
                  aria-label="Submit"
                  class="material-icon border-round-md mr-2">
                  <template #icon>
                    <div class="material-icons">view_kanban</div>
                  </template>
                </Button>
                <div class="mr-2">
                  <Button
                    @click="tblMenu.toggle($event)"
                    type="button"
                    icon="pi pi-cog"
                    aria-haspopup="true"
                    aria-controls="tbl_overlay_menu" />
                  <Menu
                    ref="tblMenu"
                    id="tbl_overlay_menu"
                    class="mt-2"
                    :model="tblSettings"
                    :popup="true">
                    <template #start>
                      <div class="text-color-secondary p-2">LIST VIEW CONTROLS</div>
                    </template>
                    <template #item="{ item, label, props }">
                      <div class="flex align-items-center text-color-secondary p-2 cursor-pointer">
                        <div class="material-icons mr-2">{{ item.icon }}</div>
                        <div>{{ item.label }}</div>
                      </div>
                    </template>
                  </Menu>
                </div>
                <Button
                  icon="pi pi-filter"
                  aria-label="Submit"
                  class="border-round-md mr-2" />
                <Button class="border-round-md mr-2" icon="pi pi-plus" :label="`New ${getBaseModule.label}`" />
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

    <Dialog v-model:visible="tblSettingsDialog" modal :style="{ width: '70vw' }">
      <template #header>
        <div class="flex align-items-center text-2xl">
          <div class="material-icons mr-2">table_chart</div>
          <div>Table Settings</div>
        </div>
      </template>
      <div class="flex flex-column gap-2 my-2">
        <InlineMessage
          v-if="newViewFilter.error"
          severity="error">
          Please fill all the required fields
        </InlineMessage>
        <span class="p-float-label my-3">
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
              optionLabel="name"
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
          <PickList v-model="pickListTblFields" listStyle="height:342px" dataKey="_id" breakpoint="400px">
            <template #sourceheader> Available </template>
            <template #targetheader> Selected </template>
            <template #item="slotProps">
              <div class="flex flex-wrap p-2 align-items-center gap-3">
                <div class="flex-1 flex flex-column gap-2">
                  <span class="font-bold">{{ slotProps.item.name }}</span>
                </div>
              </div>
            </template>
          </PickList>
        </div>
      </div>
      <template #footer>
        <div class="flex align-items-center justify-content-end my-2">
          <Button
            @click="tblSettingsDialog = false"
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