<script setup>
// imports
import { storeToRefs } from 'pinia'
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// components
import RdBreadCrumbs from '../../../../components/RdBreadCrumbs.vue'
const DynamicDataTable = defineAsyncComponent(() => import('../../../../components/modules/DynamicDataTable/dynamicdatatablemain.vue'))
// loaders
import DataTableLoader from '../../../../components/modules/DynamicDataTable/Loaders/DataTableLoader.vue'
// stores
import { useModuleStore } from '../../../../stores/modules'
import { useModuleDetailStore } from '../../../../stores/modules/detail'

// refs
const route = useRoute()
const router = useRouter()
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
const { fetchItem, fetchItemRelatedList } = moduleDetailStore
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

onMounted(async() => {
  // fetches
  await fetchBaseModule(route.params.id)
  await fetchModule(route.params.name)
  await fetchItem(route.params)
  await fetchItemRelatedList(route.params)

  console.log(getItem.value)
})

</script>

<template>
  <div>
    <!-- <pre>{{ getRelatedLists }}</pre> -->
    <RdBreadCrumbs :bcrumbs="bcrumbs" />

    <div
      v-if="itemLoading"
      class="flex align-items-center justify-content-center"
      style="height: 60vh !important;">
      <ProgressSpinner />
    </div>
    <div v-else>
      <div class="bg-white p-5 mb-5 border-round-xl flex">
        <!-- <pre>{{ getModule.fields }}</pre> -->
        <div v-for="(field, fx) in getModule.fields" :key="fx">
          <div :class="`${getModule.fields.length === fx + 1 && 'mr-8'}`">
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

        <div v-for="(field, fx) in getModule.fields" :key="fx">
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
                <div v-for="(panel, px) in getItemPanels" :key="px" class="flex flex-column gap-4">
                  <Panel :header="panel.entityName" class="detail-page-panel">
                    <template #header>
                      <div class="flex align-items-center justify-content-between w-full">
                        <div class="text-2xl font-bold">{{ panel.entityName }}</div>
                        <div v-if="getRelatedListsByCname(panel.panelName)">
                          <div class="material-icons cursor-pointer">playlist_add</div>
                        </div>
                      </div>
                    </template>
                    <div v-for="(section, sx) in panel.sections" :key="sx" class="pt-4">
                      <div class="flex flex-column gap-4">
                        <div class="text-lg text-primary font-bold">{{ section.sectionLabel }}</div>
                        <div v-if="getRelatedListsByCname(panel.panelName)">
                          <!-- <pre>{{ panel._id }}</pre>
                          <pre>{{ getRelatedListsByCname(panel.panelName) }}</pre> -->
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
                  </Panel>
                </div>
              </div>
              <!-- <div class="col flex flex-column gap-3">
                <div class="text-2xl">Item</div>
                <div>{{ getItem }}</div>
              </div> -->
            </div>
          </TabPanel>
          <TabPanel v-if="getBaseModule.name === 'accounts'" header="Sales">
            <div>
              Sales tab
            </div>
          </TabPanel>
          <TabPanel v-if="getBaseModule.name === 'accounts'" header="Services">
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