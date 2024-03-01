<script setup>
// imports
import { storeToRefs } from 'pinia'
import { onMounted, watch, ref, computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useConfirm } from "primevue/useconfirm"
// stores
import { useModuleStore } from '@/stores/modules/index'
import { useTabStore } from '@/stores/tabs/index'
import { useFormDataStore } from '@/stores/forms'
// components
const ViewFiltersDialog = defineAsyncComponent(() => import('@/components/modules/ViewFiltersDialog/ViewFiltersDialogMain.vue'))
const listViewFilterContent = defineAsyncComponent(() => import('@/components/modules/DynamicDataTable/ListViewFilterContent.vue'))
const DynamicDataTable = defineAsyncComponent(() => import('@/components/modules/DynamicDataTable/DynamicDataTableMain.vue'))
const DynamicKanban = defineAsyncComponent(() => import('@/components/modules/DynamicKanban.vue'))
// loaders
import ListViewLoader from '@/components/modules/DynamicDataTable/Loaders/ListViewLoader.vue'
import DataTableLoader from '@/components/modules/DynamicDataTable/Loaders/DataTableLoader.vue'
import KanbanLoader from '@/components/modules/DynamicDataTable/Loaders/KanbanLoader.vue'

// refs
const datatableLoading = ref(false)
const localLoading = ref(false)
const localModule = ref()
const viewFiltersDialogMode = ref('new')
const listViewFilterBar = ref(false)
const viewFiltersDialogComponentKey = ref(0)
const route = useRoute()
const viewFilter = ref({})
const selectedViewFilter = ref()
const selectedFields = ref()
const selectedSearchKeyIds = ref()
// stores
const moduleStore = useModuleStore()
const tabStore = useTabStore()
const formDataStore = useFormDataStore()
const confirm = useConfirm()
const {
  listViewFilterOverlay,
  viewFiltersDialogLoading,
  viewFiltersDialogSwitch,
  viewFiltersDialog,
  moduleLoading,
  collectionLoading,
  getModule,
  getModules,
  getBaseModule,
  getCollection,
  _getViewFilters,
  getViewFilters,
  _getDefaultViewFilter,
  getDefaultViewFilter,
  _getViewFilterIds,
  __getViewFilter,
  getViewFilter,
  _getSearchKeyFieldIds } = storeToRefs(moduleStore)
const { _fetchModule, fetchModule, fetchModules, fetchBaseModule } = moduleStore
const { getTabs } = storeToRefs(tabStore)
const { addTab,toggleWindows, maximizeTab } = tabStore
const { setFormReset } = formDataStore
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
      viewFiltersDialogMode.value = 'edit-table'
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
      viewFiltersDialogMode.value = 'edit-kanban'
      viewFiltersDialogComponentKey.value += 1
      viewFiltersDialogLoading.value = true
      viewFiltersDialogSwitch.value = true
      viewFiltersDialog.value = true
    }
  }
])
const tblSettingsBtn = ref([
  {
    label: 'Table view',
    icon: 'table_chart',
    command: (event) => {
      console.log(event)
      viewFilter.value.currentDisplay = 'table'
    }
  }, {
    label: 'Kanban view',
    icon: 'view_kanban',
    disabled: true,
    command: (event) => {
      console.log(event)
      viewFilter.value.currentDisplay = 'kanban'
    }
  }, {
    label: 'Split view',
    icon: 'vertical_split',
    disabled: true,
    command: (event) => {
      console.log(event)
    }
  }
])

// actions
const paginate = async (payload) => {
  datatableLoading.value = true

  let page = 1
  if (!payload.jump) {
    page = payload.event.page + 1
  } else page = localModule.meta && localModule.meta.pagination

  // re-fetch module & collection
  localModule.value = await _fetchModule(getBaseModule.value.name, page > 1 ? page : null, payload.per_page)
  datatableLoading.value = false
}
const limitPage = async (e) => {
  // re-fetch module & collection
  const limit = e.value
  const args = {
    event: e, 
    jump: true,
    per_page: limit
  }
  await paginate(args)
}
const createNewForm = async (module) => {
  let obj = Object.assign({}, {
    type: 'module-form',
    style: 'window',
    name: `${module.name}-window-create-form`,
    label: `${module.label} Form`,
    _module: module.name,
    expanded: false,

    opened: false,
    mode: 'modal',
    opened_order: null
  })
  const index = getTabs.value.findIndex((tab, fx) => tab.name === obj.name)
  if (index == -1) {
    await addTab(obj, true)
  } else confirmAddTab(module, index)
}

const confirmAddTab = (module,index) => {
  confirm.require({
      group: 'templating',
      header: 'Unsaved '+module.mainEntity+' Alert',
      message: module.mainEntity,
      icon: 'pi pi-exclamation-triangle',
      rejectClass: 'p-button-outlined',
      rejectLabel: 'Continue',
      acceptLabel: 'Create New '+module.mainEntity,
      accept: () => {
          let index = getTabs.value.findIndex(form => form.name === `${module.name}-window-create-form`)
          setFormReset(`${module.name}-window-create-form`)
          toggleWindows(getTabs.value[index])
      },
      reject: () => {
        let index = getTabs.value.findIndex(form => form.name === `${module.name}-window-create-form`)
        toggleWindows(getTabs.value[index])
      }
  });
};
// lifescycles
onMounted(async () => {
  localLoading.value = true
  datatableLoading.value = true
  // await fetchCollection(route.name.split('.')[0], 1)
  await fetchBaseModule(route.params.id)
  const fetchedModule = await _fetchModule(getBaseModule.value.name)

  localModule.value = fetchedModule

  // console.log(getBaseModule.value)
  // console.log(localModule.value)
  // console.log(getCollection.value)

  // pre-assignments
  viewFilter.value = computed(() => _getDefaultViewFilter.value(localModule.value))
  selectedViewFilter.value = viewFilter.value && viewFilter.value.value._id
  selectedFields.value = computed(() => _getViewFilterIds.value(localModule.value))
  selectedSearchKeyIds.value = _getSearchKeyFieldIds.value(localModule.value)

  localLoading.value = false
  datatableLoading.value = false
})

watch(selectedViewFilter, (newVal, oldVal) => {
  if (newVal) viewFilter.value = __getViewFilter.value(newVal, localModule.value)
})

watch(selectedFields, (newVal, oldVal) => {
  if (newVal) selectedFields.value = newVal.value
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
                :options="_getViewFilters(localModule)"
                :disabled="datatableLoading"
                optionLabel="filterName"
                optionValue="_id"
                placeholder="Select View Filters"
                class="border-round-xl border-primary w-full md:w-12rem mr-2 mb-2 md:mb-0"/>
              <MultiSelect
                v-model="selectedSearchKeyIds"
                :options="localModule && localModule.fields"
                :disabled="datatableLoading"
                filter
                :showToggleAll="false"
                optionLabel="label"
                optionValue="_id"
                dataKey="_id"
                placeholder="Select Fields"
                class="border-round-left-xl border-primary w-full md:w-12rem mb-2 md:mb-0" />
              <div class="p-input-icon-right w-full ml-1 md:w-auto">
                <i class="pi pi-search" />
                <InputText
                  type="text"
                  :disabled="datatableLoading"
                  class="border-round-right-xl border-primary w-full mb-2 md:mb-0"
                  placeholder="Search The List..." />
              </div>
            </div>
            <div class="md:flex align-items-center">
              <div class="p-inputgroup flex-1 mb-2 md:mb-0">
                <Button
                  @click="tblMenu2.toggle($event)"
                  :disabled="datatableLoading"
                  type="button"
                  aria-haspopup="true"
                  aria-controls="tbl_overlay_menu2"
                  class="material-icon border-round-md mr-2">
                  <template #icon>
                    <div class="material-icons">{{ viewFilter.currentDisplay === 'table' ? 'table_chart' : 'view_kanban' }}</div>
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
                  :disabled="datatableLoading"
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
                  :disabled="listViewFilterBar || datatableLoading"
                  icon="pi pi-filter"
                  aria-label="Submit"
                  class="list-view-filter-btn border-round-md mr-2" />
                <Button
                  class="border-round-md mr-2"
                  :disabled="datatableLoading"
                  icon="pi pi-plus"
                  @click="createNewForm(getBaseModule)"
                  :label="`New ${getBaseModule.label}`" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="localLoading"
        class="flex align-items-center justify-content-center"
        style="height: 60vh !important;">
        <ProgressSpinner />
      </div>
      <div v-else>
        <!-- DATATABLE -->
        <Suspense v-if="viewFilter.currentDisplay === null || viewFilter.currentDisplay === 'table'">
          <DynamicDataTable
            :key="getBaseModule._id"
            mode="edit"
            :moduleId="getBaseModule._id"
            :moduleEntityName="getBaseModule.mainEntity"
            :moduleName="getBaseModule.name"
            :moduleLabel="getBaseModule.label"
            :fields="viewFilter.fields"
            :data="localModule.data"
            :pagination="localModule.meta && localModule.meta.pagination"
            :collectionLoading="datatableLoading"
            :sidebar="listViewFilterBar"
            @toggle-sidebar="listViewFilterBar = !listViewFilterBar"
            @paginate="paginate"
            @limit-page="limitPage">
            <template #list-view-filter>
              <Suspense>
                <listViewFilterContent :baseModule="getBaseModule" :module="localModule" />
                <template #fallback>
                  <ListViewLoader />
                </template>
              </Suspense>
            </template>
          </DynamicDataTable>
          <template #fallback>
            <DataTableLoader />
          </template>
        </Suspense>

        <!-- KANBAN -->
        <Suspense v-else-if="viewFilter.currentDisplay === 'kanban'">
          <pre>This feature will be added soon</pre>
          <!-- <DynamicKanban
            :viewFilterId="viewFilter._id"
            :groupBy="viewFilter.group_by"
            :summarizeBy="viewFilter.summarize_by"
            :moduleName="getBaseModule.name"
            :moduleLabel="getBaseModule.label"
            :fields="viewFilter.fields"
            :data="localModule.data"
            :collectionLoading="localLoading"
            :sidebar="listViewFilterBar"
            @toggle-sidebar="listViewFilterBar = !listViewFilterBar">
            <template #list-view-filter>
              <Suspense>
                <listViewFilterContent :baseModule="getBaseModule" :module="localModule" />
                <template #fallback>
                  <ListViewLoader />
                </template>
              </Suspense>
            </template>
          </DynamicKanban> -->
          <template #fallback>
            <KanbanLoader />
          </template>
        </Suspense>
      </div>
    </div>
  </div>

  <!-- VIEW FILTER -->
  <ViewFiltersDialog
    :key="viewFiltersDialogComponentKey"
    v-if="viewFiltersDialogSwitch"
    :mode="viewFiltersDialogMode"
    :selectedViewFilter="selectedViewFilter"
    :module="localModule" />
</template>

<style>
</style>