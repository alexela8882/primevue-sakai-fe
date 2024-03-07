<script setup>
// imports
import { ref, defineProps, defineAsyncComponent } from 'vue'
// components
const RelatedListPanelData = defineAsyncComponent(() => import('@/components/modules/Page/Tabs/RelatedListPanelData.vue'))

// defines
const props = defineProps({
  relatedList: Object
})

</script>

<template>
  <Panel class="detail-page-panel">
    <template #header>
      <div class="flex align-items-center justify-content-between w-full">
        <div class="text-2xl font-bold">{{ relatedList.label }}</div>
        <div v-if="relatedList.collection" class="material-icons cursor-pointer">playlist_add</div>
      </div>
    </template>
    <div class="flex flex-column gap-4 mt-4">
      <div v-if="relatedList.collection">
        <RelatedListPanelData :relatedList="relatedList" />
      </div>
      <div v-else>
        <div
          class="flex align-items-center justify-content-center"
          style="height: 100px !important;">
          <ProgressSpinner
            style="width: 50px; height: 50px"
            strokeWidth="8"
            fill="var(--surface-ground)"
            animationDuration=".5s"
            aria-label="Custom ProgressSpinner" />
        </div>
      </div>
    </div>
  </Panel>
</template>

<style scoped>

</style>