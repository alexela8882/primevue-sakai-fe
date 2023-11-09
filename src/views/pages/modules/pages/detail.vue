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
const { getFieldDetailsById } = storeToRefs(moduleStore)
const { getItem, getItemPanels, getItemByName } = storeToRefs(moduleDetailStore)
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
                <div class="text-lg">{{ section.sectionLabel }}</div>
                <div class="grid">
                  <div v-for="(field, fx) in section.field_ids" :key="fx" class="col">
                    <div v-for="(id, idx) in field">
                      <div v-if="getFieldDetailsById(id)">
                        <!-- <div v-if="getFieldDetailsById(id).relation">
                          <div v-for="(displayField, dfx) in getFieldDetailsById(id).relation.displayFieldName" :key="dfx">
                            {{ displayField }}
                          </div>
                        </div> -->
                        <div class="flex gap-4">
                          <div>{{ getFieldDetailsById(id).label }}</div>
                          <div class="font-bold">{{ getItemByName(getFieldDetailsById(id).name) ? getItemByName(getFieldDetailsById(id).name) : 'None' }}</div>
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
</template>

<style>

.detail-page-panel .p-panel-header {
  background-color: var(--primary-color) !important;
  color: white !important;
}

</style>