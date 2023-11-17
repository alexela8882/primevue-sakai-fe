<script setup>
// imports
import { storeToRefs } from 'pinia'
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModuleDetailStore } from '../../../../stores/modules/detail'
// components
const DynamicDataTable = defineAsyncComponent(() => import('../../DynamicDataTable/dynamicdatatablemain.vue'))
// loaders
import DataTableLoader from '../../DynamicDataTable/Loaders/DataTableLoader.vue'

// refs
const route = useRoute()
const router = useRouter()
// stores
const moduleDetailStore = useModuleDetailStore()
const { _getRelatedListsByCname } = storeToRefs(moduleDetailStore)

// defines
const props = defineProps({
  fromTab: { type: Boolean, required: false, default: false },
  relatedLists: Array
})
</script>

<template>
  <div>
    <div v-if="relatedLists && relatedLists.length > 0">
      <div v-for="(panel, px) in relatedLists" :key="px" class="flex flex-column gap-4 mt-4">
        <Panel class="detail-page-panel">
          <template #header>
            <div class="flex align-items-center justify-content-between w-full">
              <div class="text-2xl font-bold">{{ panel.label }}</div>
              <div class="material-icons cursor-pointer">playlist_add</div>
            </div>
          </template>
          <div class="flex flex-column gap-4 mt-4">
            <div v-if="_getRelatedListsByCname(panel.cname)">
              <Suspense v-if="_getRelatedListsByCname(panel.cname)">
                <DynamicDataTable
                  mode="view"
                  :moduleId="panel._id"
                  :moduleName="_getRelatedListsByCname(panel.cname).link"
                  :moduleLabel="_getRelatedListsByCname(panel.cname).label"
                  :fields="_getRelatedListsByCname(panel.cname).fields.data"
                  :data="_getRelatedListsByCname(panel.cname).collection.data"
                  :pagination="_getRelatedListsByCname(panel.cname).collection.meta"
                  :collectionLoading="false">
                </DynamicDataTable>
                <template #fallback>
                  <DataTableLoader />
                </template>
              </Suspense>
            </div>
          </div>
        </Panel>
      </div>
    </div>
    <div v-else>
      <div v-if="fromTab" class="mt-4 text-700">No data</div>
    </div>
  </div>
</template>

<style scoped>

</style>