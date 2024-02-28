<script setup>
// imports
import { ref, onMounted, defineProps, defineAsyncComponent } from 'vue'
// components
const Form = defineAsyncComponent(() => import('@/components/modules/Form/Form.vue'))
const GeneralForm = defineAsyncComponent(() => import('@/components/modules/Form/GeneralForm.vue'))
const DynamicDataTable = defineAsyncComponent(() => import('@/components/modules/DynamicDataTable/DynamicDataTableMain.vue'))
const DynamicForm = defineAsyncComponent(() => import('@/components/dynamic/DynamicForm.vue'))
// loaders
import DataTableLoader from '@/components/modules/DynamicDataTable/Loaders/DataTableLoader.vue'
// stores
import { useModuleStore } from '@/stores/modules/index'

// defines
const props = defineProps({
  tab: Object
})

// refs
const localModule = ref()
// stores
const moduleStore = useModuleStore()
const { _fetchModule } = moduleStore

// actions
const paginate = async (payload) => {
  let page = 1
  if (!payload.jump) {
    page = payload.event.page + 1
  } else page = props.tab.module.collection && props.tab.module.collection.pagination

  // re-fetch module & collection
  localModule.value = await _fetchModule(props.tab.base_module.name, page > 1 ? page : null, payload.per_page)
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

onMounted(async () => {
  localModule.value = await props.tab.module.collection
  console.log(localModule.value)
})
</script>

<template>
  <div class="h-full">
    <div v-if="tab.type === 'component'" class="p-2">
      <component :is="tab.component"></component>
    </div>
    <div v-if="tab.type === 'static-form'" class="py-5 h-full">
      <DynamicForm :key="tab.name" :form="tab.form" />
    </div>
    <div v-else-if="tab.type === 'module-form'" class="p-3">
      <Form :key="tab.name" :config="tab" />
      <!-- <GeneralForm
        :key="tab.name"
        :tabStyle="tab.style"
        :name="tab.name"
        :module="tab.module" /> -->
    </div>
    <div v-else-if="tab.type == 'module'" class="p-2">
      <Suspense v-if="tab.base_module">
        <!-- <pre>{{ localModule.data }}</pre> -->
        <DynamicDataTable
          :key="tab.base_module._id"
          mode="view"
          :moduleId="tab.base_module._id"
          :moduleEntityName="tab.base_module.mainEntity"
          :moduleName="tab.base_module.name"
          :moduleLabel="tab.base_module.label"
          :fields="tab.module.viewFilterWithFields.fields"
          :data="localModule && localModule.data"
          :pagination="localModule && (localModule.meta && localModule.meta.pagination)"
          @paginate="paginate"
          @limit-page="limitPage">
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