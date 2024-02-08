<script setup>
// imports
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useTabStore } from '@/stores/tabs/index'
// components
const DynamicDataTable = defineAsyncComponent(() => import('@/components/modules/DynamicDataTable/DynamicDataTableMain.vue'))
// loaders
import DataTableLoader from '@/components/modules/DynamicDataTable/Loaders/DataTableLoader.vue'

// refs
const tabStore = useTabStore()
const { getTabs } = storeToRefs(tabStore)

</script>

<template>
  <div>
    <div v-for="(tab, tx) in getTabs" :key="tx">
      <div v-if="tab.visible">
        <div v-if="tab.type == 'module'">
          <Suspense v-if="tab.base_module">
            <DynamicDataTable
              mode="view"
              :moduleId="tab.base_module._id"
              :moduleEntityName="tab.base_module.mainEntity"
              :moduleName="tab.base_module.name"
              :moduleLabel="tab.base_module.label"
              :fields="tab.module.viewFilterWithFields.fields"
              :data="tab.module.collection.data"
              :pagination="tab.module.collection.meta && tab.module.collection.meta.pagination">
            </DynamicDataTable>
            <template #fallback>
              <DataTableLoader />
            </template>
          </Suspense>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>