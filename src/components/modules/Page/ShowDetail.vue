<script setup>
// imports
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// components
import RdBreadCrumbs from '../../RdBreadCrumbs.vue'
const DynamicDataTable = defineAsyncComponent(() => import('../../modules/DynamicDataTable/dynamicdatatablemain.vue'))
const SalesTab = defineAsyncComponent(() => import('../../modules/Page/Tabs/SalesTab.vue'))
const ServicesTab = defineAsyncComponent(() => import('../../modules/Page/Tabs/ServicesTab.vue'))
const RelatedListPanel = defineAsyncComponent(() => import('../../modules/Page/Tabs/RelatedListPanel.vue'))
// loaders
import DataTableLoader from '../../modules/DynamicDataTable/Loaders/DataTableLoader.vue'
import SimpleLoader from '../../loading/Simple2.vue'
// stores
import { useModuleStore } from '../../../stores/modules'
import { useModuleDetailStore } from '../../../stores/modules/detail'

// refs
const tabIndex = ref(0)
const route = useRoute()
const router = useRouter()
const localItemLoading = ref(true)
const localBaseModule = ref()
const localModule = ref()
const localItemPanels = ref()
const localRelatedList = ref()
const localRelatedLists = ref()
const atIndexRelatedLists = ref()
const atShowRelatedLists = ref()
// stores
const moduleStore = useModuleStore()
const moduleDetailStore = useModuleDetailStore()
const { fetchModule, fetchBaseModule } = moduleStore
const { getModule, getBaseModule, getFieldDetailsById } = storeToRefs(moduleStore)
const {
    itemLoading,
    relatedListLoading,
    getItem,
    getRelatedLists,
    _getRelatedOrderedLists,
    getRelatedListsByCname,
    getItemPanels,
    getItemValueByName } = storeToRefs(moduleDetailStore)
const { fetchItem, fetchItemRelatedList, fetchItemRelatedLists } = moduleDetailStore
// presets
const bcrumbs = ref([
  {
    label: `${route.params.name}`,
    to: `/modules/${route.params.name}/${route.params.id}`
  }, {
    label: `${route.params.name} details`,
    to: null
  }
])

// actions
const tabChanged = (e) => {
  tabIndex.value = e.index
}
const pullRelatedList = async (payload) => {
  // console.log(document.getElementById(`rl-panel-${payload._id}`))
  const params = {
    moduleName: route.params.name,
    panelName: payload.panelName
  }
  await fetchItemRelatedList(params)
}
const isElVisible = (el) => {
  if (el) {
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }
}
const checkElVisibility = () => {
  // console.log(document.getElementById('rl-panel-5cfa27c4a6ebc787575ff2a2'))
  getItemPanels.value.map(panel => {
    const yourElement = document.getElementById(`rl-panel-${panel._id}`)
    // console.log(yourElement)
    if (isElVisible(yourElement)) {
      // Element is visible, do something
      console.log(`Element with ${panel._id} id is visible`)
      pullRelatedList(panel)
    }
  })
}

// lifecycles
watch(getRelatedLists, (newVal, oldVal) => {
  // console.log(newVal)
  if (newVal) localRelatedLists.value = newVal
})

onMounted(async() => {
  // fetches
  await fetchBaseModule(route.params.id)
  await fetchModule(route.params.name)
  await fetchItem(route.params)
  await fetchItem(route.params)
  await fetchItemRelatedLists(route.params)

  // pre-assignments
  localItemLoading.value = itemLoading.value
  localBaseModule.value = getBaseModule.value
  localModule.value = getModule.value
  localItemPanels.value = getItemPanels.value
  localRelatedLists.value = getRelatedLists.value
  atIndexRelatedLists.value = getItemPanels.value.filter(ip => ip.controllerMethod.includes('@index'))
  atShowRelatedLists.value = _getRelatedOrderedLists.value.filter(rol => (rol.entityName === 'Contact' || rol.entityName === 'Unit'))

  // other logics
  // Attach the scroll event listener to the window or container
  window.addEventListener('scroll', checkElVisibility)

  // Optionally, you can also call the function on initial load in case the element is already visible.
  checkElVisibility()
})

</script>

<template>
  <div>
    <RdBreadCrumbs :bcrumbs="bcrumbs" />

    <div
      v-if="localItemLoading"
      class="flex align-items-center justify-content-center"
      style="height: 60vh !important;">
      <ProgressSpinner />
    </div>
    <div v-else>
      <div
        style="position: sticky !important; top: 72px; z-index: 2 !important;"
        class="bg-white px-5 py-3 mb-5 border-round-xl flex align-items-center justify-content-between shadow-2">
        <div class="flex">
          <div v-for="(field, fx) in localModule.fields" :key="fx">
            <div :class="`${localModule.fields.length === fx + 1 && 'mr-8'}`">
              <div v-if="field.title" class="flex flex-column text-xl mr-4">
                <div v-if="field.groupWith">
                  <div>{{ field.groupLabel }}</div>
                  <div class="flex">
                    <div v-for="(groupField, gfx) in field.groupWith" :key="gfx">
                      <div class="font-bold">{{ getItemValueByName(groupField) }}{{ field.fieldGlue === ' ' ? '&nbsp;' : field.fieldGlue }}</div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div>{{ field.label }}</div>
                  <div class="font-bold">{{ getItemValueByName(field.name) }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-for="(field, fx) in localModule.fields" :key="fx">
            <div v-if="field.header" class="flex flex-column text-xl mx-4">
              <div>{{ field.label }}</div>
              <div class="font-bold">{{ getItemValueByName(field.name) ? getItemValueByName(field.name) : null }}</div>
            </div>
          </div>
        </div>

        <div>
          <Button label="Edit" size="large" class="px-6 border-round-xl"></Button>
        </div>
      </div>

      <div class="grid">
        <div class="col-7">
          <div class="p-3 bg-white border-round-xl">
            <TabView @tab-change="tabChanged">
              <TabPanel header="Details">
                <div>
                  <div class="flex flex-column gap-3">
                    <div v-for="(panel, px) in atIndexRelatedLists" :key="px" class="flex flex-column gap-1 shadow-2 mt-4">
                      <div v-for="(section, sx) in panel.sections" :key="sx">
                        <div>
                          <div v-if="section.sectionLabel" class="flex align-items-center justify-content-between w-full bg-primary p-3 border-primary border-round-top-md mb-3">
                            <div class="text-2xl font-bold">{{ section.sectionLabel }}</div>
                            <div v-if="getRelatedListsByCname(panel.panelName)">
                              <div class="material-icons cursor-pointer">playlist_add</div>
                            </div>
                          </div>
                          <div class="flex flex-column px-3">
                            <div v-if="panel.controllerMethod.indexOf('@show') > -1">
                              <div v-if="getRelatedListsByCname(panel.panelName)">
                                <Suspense v-if="getRelatedListsByCname(panel.panelName)">
                                  <DynamicDataTable
                                    :moduleId="panel._id"
                                    :moduleName="getRelatedListsByCname(panel.panelName).link"
                                    :moduleLabel="getRelatedListsByCname(panel.panelName).label"
                                    :fields="getRelatedListsByCname(panel.panelName).fields.data"
                                    :data="getRelatedListsByCname(panel.panelName).collection.data"
                                    :pagination="getRelatedListsByCname(panel.panelName).collection.meta"
                                    :collectionLoading="false">
                                  </DynamicDataTable>
                                  <template #fallback>
                                    <DataTableLoader />
                                  </template>
                                </Suspense>
                              </div>
                              <div v-else :id="`rl-panel-${panel._id}`">
                                <div @click="pullRelatedList(panel)" class="flex align-items-center gap-2 cursor-pointer text-700">
                                  <i class="pi pi-eye"></i> View data
                                </div>
                              </div>
                            </div>
                            <div v-else class="grid">
                              <div
                                v-for="(field, fx) in section.field_ids"
                                :key="fx"
                                class="col flex flex-column gap-4">
                                <div v-for="(id, idx) in field">
                                  <div v-if="getFieldDetailsById(id)" class="flex align-items-start gap-4 border-bottom-1 border-200">
                                    <div class="white-space-nowrap">{{ getFieldDetailsById(id).label }}</div>
                                    <div v-if="getFieldDetailsById(id).relation" class="flex gap-2">
                                      <div v-for="(displayField, dfx) in getFieldDetailsById(id).relation.displayFieldName" :key="dfx" class="font-bold">
                                        <div v-if="getItemValueByName(getFieldDetailsById(id).name)">
                                          <div v-if="typeof getItemValueByName(getFieldDetailsById(id).name) === 'object' &&
                                                      !Array.isArray(getItemValueByName(getFieldDetailsById(id).name)) &&
                                                      getItemValueByName(getFieldDetailsById(id).name) !== null">
                                            {{ getItemValueByName(getFieldDetailsById(id).name)[displayField] }}
                                          </div>
                                          <div v-else-if="Array.isArray(getItemValueByName(getFieldDetailsById(id).name))">
                                            <Tag
                                              v-for="(relationArr, rax) in getItemValueByName(getFieldDetailsById(id).name)"
                                              :key="rax"
                                              rounded
                                              :value="relationArr[displayField]"
                                              class="white-space-nowrap px-3 m-1 cursor-pointer" severity="info"></Tag>
                                          </div>
                                        </div>
                                        <div v-else></div>
                                      </div>
                                    </div>
                                    <div v-else class="flex gap-4 font-bold">
                                      <div v-if="Array.isArray(getItemValueByName(getFieldDetailsById(id).name))">
                                        <Tag
                                          v-for="(item, itx) in getItemValueByName(getFieldDetailsById(id).name)"
                                          :key="itx"
                                          rounded
                                          :value="item"
                                          class="white-space-nowrap px-3 m-1 cursor-pointer my-1" severity="info"></Tag>
                                      </div>
                                      <div v-else>
                                        {{ getItemValueByName(getFieldDetailsById(id).name) ? getItemValueByName(getFieldDetailsById(id).name) : '' }}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <RelatedListPanel :relatedLists="atShowRelatedLists" />
                  </div>
                </div>
              </TabPanel>
              <TabPanel v-if="localBaseModule && localBaseModule.name === 'accounts'" header="Sales">
                <div>
                  <Suspense v-if="tabIndex === 1">
                    <SalesTab />
                    <template #fallback>
                      <SimpleLoader class="mt-4" />
                    </template>
                  </Suspense>
                </div>
              </TabPanel>
              <TabPanel v-if="localBaseModule && localBaseModule.name === 'accounts'" header="Services">
                <div>
                  <Suspense v-if="tabIndex === 2">
                    <ServicesTab />
                    <template #fallback>
                      <SimpleLoader class="mt-4" />
                    </template>
                  </Suspense>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
        <div class="col-5">
          <div
            style="position: sticky !important; top: 145px !important; height: 75vh !important;"
            class="flex flex-column gap-4 overflow-scroll">
            <div class="bg-white border-round-xl">
              <div class="p-3">
                <div class="flex align-items-center justify-content-between">
                  <div class="text-xl font-bold text-primary">Activity</div>
                  <div>
                    <div class="p-inputgroup">
                      <Dropdown
                        placeholder="Filters"
                        class="border-round-xl border-primary w-full md:w-12rem"/>
                      <Button label="add activity" class="ml-3 border-round-xl px-4"></Button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-column gap-1 mb-6">
                <Panel
                  v-for="(dummy, dmx) in ['October 2023', 'November 2023', 'December 2023']"
                  :key="dmx"
                  toggleable
                  collapsed
                  class="activity-panel">
                  <template #header>
                    <div class="text-sm text-900">{{ dummy }}</div>
                  </template>
                  <p class="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </Panel>
              </div>
            </div>

            <div class="bg-white border-round-xl">
              <div class="p-3">
                <div class="text-xl font-bold text-primary">Files</div>
                <div class="w-8 mx-auto flex flex-column gap-2">
                  <div class="text-lg font-bold">Upload files</div>
                  <div class="">only .jpg and .png files. 5 MB max file size.</div>
                  <div class="border-dashed h-10rem border-2 border-500 p-3 cursor-pointer text-center">
                    <div class="text-primary">Drag and drop files here or click to upload</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white border-round-xl">
              <div class="p-3 h-15rem">
                <div class="text-xl font-bold text-primary">Reminders</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

.detail-page-panel .p-panel-header {
  background-color: var(--primary-color) !important;
  color: white !important;
}
.activity-panel.p-panel {
  box-shadow: none;
  border-radius: none !important;
}
.activity-panel.p-panel.p-panel-toggleable .p-panel-header {
  background-color: var(--primary0-200);
}
.activity-panel.p-panel.p-panel-toggleable .p-panel-header .p-panel-icons button {
  color: var(--cyan-900);
}

</style>