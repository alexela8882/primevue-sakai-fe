<script setup>
// imports
import { storeToRefs } from 'pinia'
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModuleDetailStore } from '../../../../stores/modules/detail'
// components
const RelatedListPanel = defineAsyncComponent(() => import('../../Page/Tabs/RelatedListPanel.vue'))

// refs
const route = useRoute()
const router = useRouter()
const salesRelatedLists = ref()
// stores
const moduleDetailStore = useModuleDetailStore()
const {
    relatedListLoading,
    _getRelatedListsByCname,
    _getRelatedOrderedLists } = storeToRefs(moduleDetailStore)
const { fetchItemRelatedLists } = moduleDetailStore

// lifecycles
onMounted(async () => {
  // fetches
  if (_getRelatedOrderedLists.value.length <= 0) await fetchItemRelatedLists(route.params)

  // pre-assignments
  salesRelatedLists.value = _getRelatedOrderedLists.value.filter(orl => (orl.entityName === 'SalesOpportunity' || orl.entityName === 'SalesOpportunity'))
})
</script>

<template>
  <RelatedListPanel :fromTab="true" :relatedLists="salesRelatedLists" />
</template>

<style scoped>

</style>