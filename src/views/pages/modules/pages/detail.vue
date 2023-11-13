<script setup>
// imports
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RdBreadCrumbs from '../../../../components/RdBreadCrumbs.vue'
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
const { getModule, getFieldDetailsById } = storeToRefs(moduleStore)
const { itemLoading, getItem, getItemPanels, getItemByName } = storeToRefs(moduleDetailStore)
const { fetchItem } = moduleDetailStore
// presets
const bcrumbs = ref([
  {
    label: `${route.params.name}`,
    to: `/modules/${route.params.name}/${route.params.id}`
  }, {
    label: `${route.params.name} detail`,
    to: null
  }
])

onMounted(async() => {
  // fetches
  await fetchBaseModule(route.params.id)
  await fetchModule(route.params.name)
  await fetchItem(route.params)
})

</script>

<template>
  <div>
    <RdBreadCrumbs :bcrumbs="bcrumbs" />

    <div
      v-if="itemLoading"
      class="flex align-items-center justify-content-center"
      style="height: 60vh !important;">
      <ProgressSpinner />
    </div>
    <div v-else>
      <div class="bg-white p-5 mb-5 border-round-xl">
        <!-- <pre>{{ getModule.fields }}</pre> -->
      </div>

      <div class="grid">
        <div class="col flex flex-column gap-3">
          <div v-for="(panel, px) in getItemPanels" :key="px" class="flex flex-column gap-4">
            <Panel :header="panel.entityName" class="detail-page-panel">
              <template #header>
                <div class="flex align-items-center justify-content-between w-full">
                  <div class="text-2xl font-bold">{{ panel.entityName }}</div>
                  <div v-if="panel.mutable">
                    <div class="material-icons cursor-pointer">playlist_add</div>
                  </div>
                </div>
              </template>
              <div v-for="(section, sx) in panel.sections" :key="sx" class="pt-4">
                <div class="flex flex-column gap-4">
                  <div class="text-lg text-primary font-bold">{{ section.sectionLabel }}</div>
                  <div class="grid">
                    <div
                      v-for="(field, fx) in section.field_ids"
                      :key="fx"
                      class="col flex flex-column gap-4">
                      <div v-for="(id, idx) in field">
                        <div v-if="getFieldDetailsById(id)" class="flex align-items-start gap-4 border-bottom-1 border-200">
                          <div class="white-space-nowrap">{{ getFieldDetailsById(id).label }}</div>
                          <div v-if="getFieldDetailsById(id).relation" class="flex gap-2">
                            <div v-for="(displayField, dfx) in getFieldDetailsById(id).relation.displayFieldName" :key="dfx" class="font-bold">
                              <div v-if="getItemByName(getFieldDetailsById(id).name)">
                                <div v-if="typeof getItemByName(getFieldDetailsById(id).name) === 'object' &&
                                            !Array.isArray(getItemByName(getFieldDetailsById(id).name)) &&
                                            getItemByName(getFieldDetailsById(id).name) !== null">
                                  {{ getItemByName(getFieldDetailsById(id).name)[displayField] }}
                                </div>
                                <div v-else-if="Array.isArray(getItemByName(getFieldDetailsById(id).name))">
                                  <Tag
                                    v-for="(relationArr, rax) in getItemByName(getFieldDetailsById(id).name)"
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
                            <div v-if="Array.isArray(getItemByName(getFieldDetailsById(id).name))">
                              <Tag
                                v-for="(item, itx) in getItemByName(getFieldDetailsById(id).name)"
                                :key="itx"
                                rounded
                                :value="item"
                                class="white-space-nowrap px-3 m-1 cursor-pointer my-1" severity="info"></Tag>
                            </div>
                            <div v-else>
                              {{ getItemByName(getFieldDetailsById(id).name) ? getItemByName(getFieldDetailsById(id).name) : '' }}
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
    </div>
  </div>
</template>

<style>

.detail-page-panel .p-panel-header {
  background-color: var(--primary-color) !important;
  color: white !important;
}

</style>