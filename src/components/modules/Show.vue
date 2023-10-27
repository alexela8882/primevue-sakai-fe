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
const listViewFilterContent = defineAsyncComponent(() => import('../modules/listViewFilterContent.vue'))

// refs
const viewFiltersDialogMode = ref('new')
const listViewFilterBar = ref(false)
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
const tblMenu2 = ref(false)
const tblSettings = ref([
  {
    label: 'New',
    icon: 'add',
    command: (event) => {
      console.log(event)
      viewFiltersDialogMode.value = 'new'
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
      viewFiltersDialogMode.value = 'edit'
      viewFiltersDialogComponentKey.value += 1
      viewFiltersDialogLoading.value = true
      viewFiltersDialogSwitch.value = true
      viewFiltersDialog.value = true
    }
  }, {
    label: 'Edit kanban settings',
    icon: 'view_kanban',
    command: (event) => {
      console.log(event)
    }
  }
])
const tblSettingsBtn = ref([
  {
    label: 'Table view',
    icon: 'table_chart',
    command: (event) => {
      console.log(event)
    }
  }, {
    label: 'Kanban view',
    icon: 'view_kanban',
    command: (event) => {
      console.log(event)
    }
  }, {
    label: 'Split view',
    icon: 'vertical_split',
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
                  @click="tblMenu2.toggle($event)"
                  type="button"
                  aria-haspopup="true"
                  aria-controls="tbl_overlay_menu2"
                  class="material-icon border-round-md mr-2">
                  <template #icon>
                    <div class="material-icons">
                      {{ viewFilter.currentDisplay === 'table' ? 'table_chart' : 'view_kanban' }}
                    </div>
                  </template>
                </Button>
                  <Menu
                    ref="tblMenu2"
                    id="tbl_overlay_menu2"
                    class="mt-2"
                    :model="tblSettingsBtn"
                    :popup="true">
                    <template #start>
                      <div class="text-color-secondary p-2">VIEW SETTINGS</div>
                    </template>
                    <template #item="{ item, label, props }">
                      <div class="flex align-items-center text-color-secondary p-2 cursor-pointer">
                        <div class="material-icons mr-2">{{ item.icon }}</div>
                        <div>{{ item.label }}</div>
                      </div>
                    </template>
                  </Menu>
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
                  @click="listViewFilterBar = true"
                  :disabled="listViewFilterBar"
                  icon="pi pi-filter"
                  aria-label="Submit"
                  class="list-view-filter-btn border-round-md mr-2" />
                <Button class="border-round-md mr-2" icon="pi pi-plus" :label="`New ${getBaseModule.label}`" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- DATATABLE -->
      <DynamicDataTable
        :moduleName="getBaseModule.name"
        :moduleLabel="getBaseModule.label"
        :fields="viewFilter.fields"
        :data="getCollection.data"
        :pagination="getCollection.meta && getCollection.meta.pagination"
        :collectionLoading="collectionLoading"
        :sidebar="listViewFilterBar"
        @toggle-sidebar="listViewFilterBar = !listViewFilterBar">
        <template #list-view-filter>
          <Suspense>
            <listViewFilterContent :baseModule="getBaseModule" />

            <template #fallback>
              <div class="p-4">
                <div class="flex flex-column gap-6">
                  <div v-for="(skel, skx) in 2" :key="skx">
                    <Skeleton class="mb-2" borderRadius="16px"></Skeleton>
                    <Skeleton width="10rem" class="mb-2" borderRadius="16px"></Skeleton>
                    <Skeleton width="5rem" borderRadius="16px" class="mb-2"></Skeleton>
                    <Skeleton height="2rem" class="mb-2" borderRadius="16px"></Skeleton>
                    <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
                  </div>
                </div>
              </div>
            </template>
          </Suspense>
        </template>
      </DynamicDataTable>
    </div>
  </div>

  <!-- VIEW FILTER -->
  <ViewFiltersDialog
    :key="viewFiltersDialogComponentKey"
    v-if="viewFiltersDialogSwitch"
    :mode="viewFiltersDialogMode"
    :selectedViewFilter="selectedViewFilter" />
</template>

<style>
</style>