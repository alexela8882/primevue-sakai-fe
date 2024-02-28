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
import { useTabStore } from '@/stores/tabs/index'
import { useModuleStore } from '@/stores/modules/index'

// defines
const props = defineProps({
  tab: Object
})

// refs
const localLoading = ref(false)
const localModule = ref()
// stores
const tabStore = useTabStore()
const moduleStore = useModuleStore()
const { updateTabByField } = tabStore
const { _fetchModule } = moduleStore

// actions
const paginate = async (payload) => {
  localLoading.value = true

  let page = 1
  if (!payload.jump) {
    page = payload.event.page + 1
  } else page = props.tab.module.collection && props.tab.module.collection.pagination

  // re-fetch module & collection
  // localModule.value = await _fetchModule(props.tab.base_module.name, page > 1 ? page : null, payload.per_page)
  await updateTabByField({
    tab: props.tab.name,
    field: 'module',
    data: {
      module: props.tab.base_module.name,
      page: page,
      per_page: payload.per_page
    }
  })
  localLoading.value = false
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
  localLoading.value = true

  localModule.value = await props.tab.module.collection
  console.log(props.tab.module.collection)

  localLoading.value = false
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
    <div v-else-if="tab.type === 'module-form'" class="py-5 h-full">
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
          :data="tab.module.collection && tab.module.collection.data"
          :collectionLoading="localLoading"
          :pagination="tab.module.collection && (tab.module.collection.meta && tab.module.collection.meta.pagination)"
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