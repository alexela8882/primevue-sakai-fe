<script setup>
// imports
import { storeToRefs } from 'pinia'
import { onMounted, watch, ref, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
// stores
import { useModuleStore } from '@/stores/modules/index'
// components
import DynamicDataTable from '../modules/DynamicDataTable.vue'
const ViewFiltersDialog = defineAsyncComponent(() => import('../modules/ViewFiltersDialog.vue'))

// refs
const filterByOwner = ref({ name: null, filters: [{ field: null, operator: null, value: null }] })
const filterByOwnerOverlay = ref(false)
const filterByOwnerOverlay2 = ref(false)
const viewFiltersDialogComponentKey = ref(0)
const route = useRoute()
const viewFilter = ref([])
const selectedViewFilter = ref()
const selectedFields = ref()
const selectedSearchKeyIds = ref()
// stores
const moduleStore = useModuleStore()
const {
  listViewFilterOverlay,
  viewFiltersDialogLoading,
  viewFiltersDialogSwitch,
  viewFiltersDialog,
  moduleLoading,
  collectionLoading,
  getBaseModule,
  getCollection,
  getViewFilters,
  getDefaultViewFilter,
  getViewFilterIds,
  getViewFilter,
  getSearchKeyFieldIds } = storeToRefs(moduleStore)
const { fetchModule, fetchBaseModule } = moduleStore
// presets
const tblMenu = ref(false)
const tblSettings = ref([
  {
    label: 'New',
    icon: 'add',
    command: (event) => {
      console.log(event)
      viewFiltersDialogComponentKey.value += 1
      viewFiltersDialogLoading.value = true
      viewFiltersDialogSwitch.value = true
      viewFiltersDialog.value = true
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

// actions

// lifescycles
watch(selectedViewFilter, (newVal, oldVal) => {
  if (newVal) viewFilter.value = getViewFilter.value(newVal)
})

onMounted(async () => {
  // await fetchCollection(route.name.split('.')[0], 1)
  await fetchBaseModule(route.params.id)
  await fetchModule(getBaseModule.value.name)

  // pre-assignments
  filterByOwner.value.name = `All ${getBaseModule.value.name}`
  viewFilter.value = getDefaultViewFilter.value
  selectedViewFilter.value = viewFilter.value._id
  selectedFields.value = getViewFilterIds.value
  selectedSearchKeyIds.value = getSearchKeyFieldIds.value
})

</script>

<template>
  <div class="mt-3">
    <div
      v-if="moduleLoading"
      class="flex align-items-center justify-content-center"
      style="height: 60vh !important;">
      <ProgressSpinner />
    </div>
    <div v-else>
      <h4 class="text-primary-700">{{ getBaseModule.label }}</h4>

      <div>
        <div v-if="collectionLoading" class="my-4">
          <div class="flex flex-column md:flex-row justify-content-between mt-3 gap-2">
            <div class="flex align-items-center gap-2">
              <Skeleton width="10rem" height="2.5rem"></Skeleton>
              <Skeleton width="10rem" height="2.5rem"></Skeleton>
            </div>
            <div class="flex align-items-center gap-2">
              <Skeleton width="10rem" height="2.5rem"></Skeleton>
              <Skeleton width="3rem" height="2.5rem"></Skeleton>
              <Skeleton width="3rem" height="2.5rem"></Skeleton>
              <Skeleton width="3rem" height="2.5rem"></Skeleton>
              <Skeleton width="8rem" height="2.5rem"></Skeleton>
            </div>
          </div>
        </div>

        <div v-else class="mt-2 mb-4">
          <div class="md:flex justify-content-between">
            <div>
              <Dropdown
                v-model="selectedViewFilter"
                :options="getViewFilters"
                optionLabel="filterName"
                optionValue="_id"
                placeholder="Select View Filters"
                class="border-round-xl border-primary w-full md:w-12rem mr-2 mb-2 md:mb-0"/>
              <MultiSelect
                v-model="selectedSearchKeyIds"
                :options="getBaseModule.fields"
                track-by="_id"
                filter
                :showToggleAll="false"
                optionLabel="label"
                optionValue="_id"
                placeholder="Select Fields"
                class="border-round-xl border-primary w-full md:w-12rem mb-2 md:mb-0" />
            </div>
            <div class="md:flex align-items-center">
              <div class="p-input-icon-left mr-2 w-full md:w-auto">
                <i class="pi pi-search" />
                <InputText
                  type="text"
                  class="border-round-xl border-primary w-full mb-2 md:mb-0"
                  placeholder="Search The List..." />
              </div>
              <div class="p-inputgroup flex-1 mb-2 md:mb-0">
                <Button
                  aria-label="Submit"
                  class="material-icon border-round-md mr-2">
                  <template #icon>
                    <div class="material-icons">view_kanban</div>
                  </template>
                </Button>
                <Button
                  @click="tblMenu.toggle($event)"
                  :loading="viewFiltersDialogLoading"
                  type="button"
                  icon="pi pi-cog"
                  aria-haspopup="true"
                  aria-controls="tbl_overlay_menu"
                  class="border-round-md mr-2" />
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
                <Button
                  @click="listViewFilterOverlay.toggle($event)"
                  icon="pi pi-filter"
                  aria-label="Submit"
                  class="border-round-md mr-2" />
                <Button class="border-round-md mr-2" icon="pi pi-plus" :label="`New ${getBaseModule.label}`" />
              </div>
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

  <ViewFiltersDialog :key="viewFiltersDialogComponentKey" v-if="viewFiltersDialogSwitch" />

  <OverlayPanel ref="listViewFilterOverlay" class="lvf-overlay-panel">
    <div style="width: 30vw;">
      <div class="p-3">
        <div class="text-3xl text-color-secondary">Filters</div>
      </div>
      <divider class="py-0 my-0" />
      <div class="flex flex-column gap-4 p-3 text-600 cursor-pointer">
        <div
          @click="filterByOwnerOverlay.toggle($event)"
          class="flex flex-column gap-2 p-3 border-1 border-400 hover:border-600 hover:surface-100 border-round-md">
          <div>Filter by Owner</div>
          <div class="text-lg text-800">{{ filterByOwner.name }}</div>
        </div>

        <div
          v-if="filterByOwner.filters.length >= 1"
          v-for="(filter, fx) in filterByOwner.filters"
          :key="fx"
          class="flex flex-column gap-2 p-3 border-1 border-400 hover:border-600 hover:surface-100 border-round-md">
          <div>{{ filter.field }}</div>
          <div class="text-lg text-800">{{ filter.operator }} {{ filter.value }}</div>
        </div>

        <div class="flex justify-content-between">
          <a @click="filterByOwnerOverlay2.toggle($event)" href="javascript:void(0);">add filter</a>
          <a href="javascript:void(0);">remove all</a>
        </div>
      </div>
    </div>

    <OverlayPanel ref="filterByOwnerOverlay" class="lvf-overlay-panel">
      <div style="width: 30vw;">
        <div class="flex flex-column p-3 text-600 gap-3">
          <div class="text-xl text-color-secondary">Filter by Owner</div>
          <div class="flex flex-column gap-3">
            <div class="flex align-items-center">
              <RadioButton v-model="filterByOwner.name" :inputId="`All ${getBaseModule.name}`" :value="`All ${getBaseModule.name}`" />
              <label :for="`All ${getBaseModule.name}`" class="ml-2">All {{ getBaseModule.name }}</label>
            </div>
            <div class="flex align-items-center">
              <RadioButton v-model="filterByOwner.name" :inputId="`My ${getBaseModule.name}`" :value="`My ${getBaseModule.name}`" />
              <label :for="`My ${getBaseModule.name}`" class="ml-2">My {{ getBaseModule.name }}</label>
            </div>
            <div class="flex align-items-center">
              <RadioButton v-model="filterByOwner.name" :inputId="`My team's ${getBaseModule.name}`" :value="`My team's ${getBaseModule.name}`" />
              <label :for="`My team's ${getBaseModule.name}`" class="ml-2">My team's {{ getBaseModule.name }}</label>
            </div>
          </div>
        </div>
      </div>
    </OverlayPanel>

    <OverlayPanel ref="filterByOwnerOverlay2" class="lvf-overlay-panel">
      <div style="width: 30vw;">
        <div class="flex flex-column p-3 text-600 gap-3">
          <div class="text-xl text-color-secondary">Filter by Owner</div>
          <div class="flex flex-column gap-3">
            <Dropdown
              v-model="filterByOwner.filters[0].field"
              :options="getBaseModule.fields"
              optionLabel="label"
              optionValue="_id"
              placeholder="Select a field"
              class="w-full" />
          </div>
        </div>
      </div>
    </OverlayPanel>
  </OverlayPanel>

  <!-- <Sidebar v-model:visible="listViewFilterOverlay" position="right">
    <h2>Sidebar</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <template #header>
      <div class="flex">
        <button class="p-sidebar-icon p-link mr-2">
          <span class="pi pi-print" />
        </button>
        <button class="p-sidebar-icon p-link mr-2">
          <span class="pi pi-search" />
        </button>
      </div>
    </template>
  </Sidebar> -->
</template>

<style>
.lvf-overlay-panel.p-overlaypanel .p-overlaypanel-content {
  padding: 0 !important;
}
</style>