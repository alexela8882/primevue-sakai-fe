<script setup>
// imports
import { storeToRefs } from 'pinia'
import { watch, onMounted, ref, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModuleDetailStore } from '@/stores/modules/detail'
// components
const DynamicDataTable = defineAsyncComponent(() => import('@/components/modules/DynamicDataTable/dynamicdatatablemain.vue'))
// loaders
import DataTableLoader from '@/components/modules/DynamicDataTable/Loaders/DataTableLoader.vue'

// refs
const localLoading = ref(false)
const route = useRoute()
const router = useRouter()
// stores
const moduleDetailStore = useModuleDetailStore()
const { _getRelatedList, _getRelatedLists, _getRelatedListsByCname } = storeToRefs(moduleDetailStore)
const { paginateRelatedList } = moduleDetailStore

// defines
const props = defineProps({
  fromTab: { type: Boolean, required: false, default: false },
  relatedList: Object
})

// refs
// pre-assiggments
const panelName = ref(_getRelatedListsByCname.value(props.relatedList.cname))
const moduleName = ref(_getRelatedListsByCname.value(props.relatedList.cname).link)
const moduleLabel = ref(_getRelatedListsByCname.value(props.relatedList.cname).label)
const fields = ref(_getRelatedListsByCname.value(props.relatedList.cname).fields)
const data = ref(_getRelatedListsByCname.value(props.relatedList.cname).collection.data)
const pagination = ref(_getRelatedListsByCname.value(props.relatedList.cname).collection.meta.pagination)

// actions
const paginate = async (payload) => {
  localLoading.value = true

  let page = 1
  if (!payload.jump) {
    page = payload.event.page + 1
  } else page = pagination.value

  // re-fetch module & collection
  await paginateRelatedList({
    moduleName: route.params.name,
    base: route.params.pageid,
    panel: props.relatedList._id,
    page: page,
    limit: payload.per_page
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

watch(() => _getRelatedLists.value, (newVal, oldVal) => {
  let updatedRelatedList = newVal.find(list => list._id === props.relatedList._id)

  // update related list
  panelName.value = _getRelatedListsByCname.value(updatedRelatedList.cname)
  moduleName.value = _getRelatedListsByCname.value(updatedRelatedList.cname).link
  moduleLabel.value = _getRelatedListsByCname.value(updatedRelatedList.cname).label
  fields.value = _getRelatedListsByCname.value(updatedRelatedList.cname).fields
  data.value = _getRelatedListsByCname.value(updatedRelatedList.cname).collection.data
  pagination.value = _getRelatedListsByCname.value(updatedRelatedList.cname).collection.meta.pagination
}, {
  deep: true // deep watch nested array
})
</script>

<template>
  <Suspense v-if="panelName">
    <div>
      <div v-if="data.length > 0">
        <DynamicDataTable
          mode="view"
          :moduleId="relatedList._id"
          :moduleEntityName="relatedList.entityName"
          :moduleName="moduleName"
          :moduleLabel="moduleLabel"
          :fields="fields"
          :data="data"
          :pagination="pagination"
          :collectionLoading="localLoading"
          @paginate="paginate"
          @limit-page="limitPage">
        </DynamicDataTable>
      </div>
      <div v-else class="mb-2 text-600">No records found</div>
    </div>
    <template #fallback>
      <DataTableLoader />
    </template>
  </Suspense>
</template>

<style scoped>

</style>