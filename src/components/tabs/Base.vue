<script setup>
// imports
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useTabStore } from '@/stores/tabs/index'
// components
const DynamicDataTable = defineAsyncComponent(() => import('@/components/modules/DynamicDataTable/DynamicDataTableMain.vue'))

// defines
const props = defineProps({
  tabs: Array
})

// refs
const tabStore = useTabStore()
const { getTabs } = storeToRefs(tabStore)
const { generateTabs } = tabStore

onMounted(async () => {
  generateTabs(props.tabs)
})

</script>

<template>
  <div>
    <div v-for="(tab, tx) in getTabs" :key="tx">
      <div v-if="tab.visible">
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
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>