<script setup>
// imports
import { ref, shallowRef, defineAsyncComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useTabStore } from '@/stores/tabs/index'
// components
const BaseTab = defineAsyncComponent(() =>
  import('@/components/tabs/Base.vue')
)
const FloatingWindow = defineAsyncComponent(() =>
  import('@/components/tabs/FloatingWindow.vue')
)
// loaders
import DataTableLoader from '@/components/modules/DynamicDataTable/Loaders/DataTableLoader.vue'
import ListViewLoader from '@/components/modules/DynamicDataTable/Loaders/ListViewLoader.vue'

// refs
// stores
const tabStore = useTabStore()
const { getTabs, tabsLoading } = storeToRefs(tabStore)
const { toggleTabs, addTab } = tabStore

const tabs = ref([
  {
    type: 'module',
    style: 'tab',
    name: 'lead-tab',
    label: 'Leads',
    _module: 'leads',
    display: 'table',
    visible: true
  }, {
    type: 'module',
    style: 'tab',
    name: 'inquiry-tab',
    label: 'Inquiries',
    _module: 'inquiries',
    display: 'table',
    visible: false
  }, {
    type: 'module-form',
    style: 'tab',
    name: 'leads',
    label: 'New Lead',
    _module: 'leads',
    visible: false
  }, {
    type: 'module',
    style: 'tab',
    name: 'campaign-tab',
    label: 'Campaigns',
    _module: 'campaigns',
    display: 'table',
    visible: false
  }, {
    type: 'component',
    style: 'window',
    name: 'form1-window',
    label: 'Form 1',
    component: shallowRef(DataTableLoader),
    expanded: false,
    opened: false
  }, {
    type: 'component',
    style: 'window',
    name: 'form1-window',
    label: 'form 2',
    component: shallowRef(ListViewLoader),
    expanded: false,
    opened: false
  }, {
    type: 'module',
    style: 'window',
    name: 'lead-window',
    label: 'Leads',
    _module: 'leads',
    display: 'table',
    visible: true
  },
])

onMounted(async () => {
  tabs.value.map(async t => {
    await addTab(t)
  })
})
</script>

<template>
  <div>
    <div class="flex mb-2">
      <div
        v-for="(tab, tx) in getTabs.filter(t => t.style == 'tab')"
        :key="tx"
        class="p-2 px-3 border-round-top"
        :class="`${tab.visible && 'surface-200 text-green-300'}`">
        <a @click="toggleTabs(tab)" href="javascript:void(0);" class="text-800">{{ tab.label }}</a>
      </div>
    </div>

    <Suspense v-if="!tabsLoading">
      <BaseTab />
      <template #fallback>
        <div
          class="flex align-items-center justify-content-center"
          style="height: 60vh !important;">
          <ProgressSpinner />
        </div>
      </template>
    </Suspense>

    <FloatingWindow />
  </div>
</template>

<style scoped>

</style>