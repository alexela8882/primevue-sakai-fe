<script setup>
// imports
import { ref, defineProps, defineAsyncComponent, onMounted } from 'vue'
// components
const RelatedListPanelData = defineAsyncComponent(() => import('@/components/modules/Page/Tabs/RelatedListPanelData.vue'))

// defines
const props = defineProps({
  relatedList: Object
})

// refs
const menu = ref()
const hasData = ref(false)

// actions
const items = ref([
  {
    label: 'Refresh',
    icon: 'pi pi-refresh'
  },
  {
    label: 'Search',
    icon: 'pi pi-search'
  },
  {
    separator: true
  },
  {
    label: 'Delete',
    icon: 'pi pi-times'
  }
])

const toggle = (event) => {
  menu.value.toggle(event)
}

onMounted(() => {
  hasData.value = props.relatedList.collection && props.relatedList.collection.data.length <= 0
})

</script>

<template>
  <Panel class="detail-page-panel" :toggleable="!hasData">
    <template #icons>
      <button
        v-if="!hasData"
        class="p-panel-header-icon p-link mr-2 text-50"
        @click="toggle">
        <span class="pi pi-cog"></span>
      </button>
      <Menu ref="menu" id="config_menu" :model="items" popup />
    </template>
    <template #header>
      <div class="text-2xl font-bold">{{ relatedList.label }}</div>
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

<style>
.detail-page-panel.p-panel .p-panel-header .p-panel-header-icon {
  color: var(--text-50) !important;
}

</style>