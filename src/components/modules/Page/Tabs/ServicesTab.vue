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
const servicesRelatedLists = ref()
// stores
const moduleDetailStore = useModuleDetailStore()
const { relatedListLoading, _getRelatedOrderedLists } = storeToRefs(moduleDetailStore)
const { fetchItemRelatedLists } = moduleDetailStore

// lifecycles
onMounted(async () => {
  // fetches
  if (_getRelatedOrderedLists.value.length <= 0) await fetchItemRelatedLists(route.params)

  // pre-assignments
  servicesRelatedLists.value = _getRelatedOrderedLists.value.filter(orl => {
    if (
      orl.entityName === 'DefectReport' ||
      orl.entityName === 'ServiceJob' ||
      orl.entityName === 'ServiceSchedule' ||
      orl.entityName === 'BreakdownLog' ||
      orl.entityName === 'ServiceReport'
    ) return orl
  })
})
</script>

<template>
  <RelatedListPanel :fromTab="true" :relatedLists="servicesRelatedLists" />
</template>

<style scoped>

</style>