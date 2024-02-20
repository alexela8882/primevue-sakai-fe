<script setup>
// imports
import { defineProps, defineAsyncComponent } from 'vue'
// components
const Form = defineAsyncComponent(() => import('@/components/modules/Form/Form.vue'))
const DynamicDataTable = defineAsyncComponent(() => import('@/components/modules/DynamicDataTable/DynamicDataTableMain.vue'))
const DynamicForm = defineAsyncComponent(() => import('@/components/dynamic/DynamicForm.vue'))
// loaders
import DataTableLoader from '@/components/modules/DynamicDataTable/Loaders/DataTableLoader.vue'

// defines
const props = defineProps({
  tab: Object
})
</script>

<template>
  <div class="h-full">
    <div v-if="tab.type === 'component'" class="p-2">
      <component :is="tab.component"></component>
    </div>
    <div v-if="tab.type === 'static-form'" class="p-3 h-full">
      <DynamicForm :key="tab.name" :form="tab.form" />
    </div>
    <div v-else-if="tab.type === 'module-form'" class="p-3">
      <Form :key="tab.name" :config="tab" />
    </div>
    <div v-else-if="tab.type == 'module'" class="p-2">
      <Suspense v-if="tab.base_module">
        <DynamicDataTable
          :key="tab.base_module._id"
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
</template>

<style scoped>

</style>