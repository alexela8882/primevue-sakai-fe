<script setup>
// imports
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// components
import RdBreadCrumbs from '../../RdBreadCrumbs.vue'
const DynamicDataTable = defineAsyncComponent(() => import('../../modules/DynamicDataTable/dynamicdatatablemain.vue'))
// loaders
import DataTableLoader from '../../modules/DynamicDataTable/Loaders/DataTableLoader.vue'
// stores
import { useModuleStore } from '../../../stores/modules'
import { useModuleDetailStore } from '../../../stores/modules/detail'

// refs
const route = useRoute()
const router = useRouter()
const localItemLoading = ref(true)
const localBaseModule = ref()
const localModule = ref('test')
const localItemPanels = ref()
const localRelatedList = ref()
const localRelatedLists = ref()
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
const pullRelatedList = async (payload) => {
  console.log(document.getElementById(`rl-panel-${payload._id}`))
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
  console.log(newVal)
  if (newVal) localRelatedLists.value = newVal
})

onMounted(async() => {
  // fetches
  await fetchBaseModule(route.params.id)
  await fetchModule(route.params.name)
  await fetchItem(route.params)
  // await fetchItemRelatedLists(route.params)

  // pre-assignments
  localItemLoading.value = itemLoading.value
  localBaseModule.value = getBaseModule.value
  localModule.value = getModule.value
  localItemPanels.value = getItemPanels.value
  localRelatedLists.value = getRelatedLists.value

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
      <div class="bg-white p-5 mb-5 border-round-xl flex">
        <div v-for="(field, fx) in localModule.fields" :key="fx">
          <div :class="`${localModule.fields.length === fx + 1 && 'mr-8'}`">
            <div v-if="field.title" class="flex flex-column gap-2 text-xl mr-4">
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
          <div v-if="field.header" class="flex flex-column gap-2 text-xl mx-4">
            <div>{{ field.label }}</div>
            <div class="font-bold">{{ getItemValueByName(field.name) ? getItemValueByName(field.name) : null }}</div>
          </div>
        </div>
      </div>

      <div class="p-5 pt-4 bg-white border-round-xl">
        <TabView>
          <TabPanel header="Details">
            <div>
              <div class="flex flex-column gap-3">
                <div v-for="(panel, px) in localItemPanels" :key="px" class="flex flex-column gap-4">
                  <div v-for="(section, sx) in panel.sections" :key="sx" class="pt-4">
                    <Panel class="detail-page-panel">
                      <template #header>
                        <div class="flex align-items-center justify-content-between w-full">
                          <div class="text-2xl font-bold">{{ section.sectionLabel }}</div>
                          <div v-if="getRelatedListsByCname(panel.panelName)">
                            <div class="material-icons cursor-pointer">playlist_add</div>
                          </div>
                        </div>
                      </template>
                        <div class="flex flex-column gap-4 mt-4">
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
                    </Panel>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel v-if="localBaseModule && localBaseModule.name === 'accounts'" header="Sales">
            <div>
              Sales tab
            </div>
          </TabPanel>
          <TabPanel v-if="localBaseModule && localBaseModule.name === 'accounts'" header="Services">
            <div>
              Services tab
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>
</template>

<style>

.detail-page-panel .p-panel-header {
  background-color: var(--primary-color) !important;
  color: white !important;
}

</style>