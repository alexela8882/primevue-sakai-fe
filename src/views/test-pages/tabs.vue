<script setup>
// imports
import { ref, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useTabStore } from '@/stores/tabs/index'
// components
const BaseTab = defineAsyncComponent(() =>
  import('@/components/tabs/Base.vue')
)

// refs
// stores
const tabStore = useTabStore()
const { toggleTabs } = tabStore

const tabs = ref([
  {
    name: 'lead-tab',
    label: 'Leads',
    module: 'leads',
    display: 'table',
    visible: true
  }, {
    name: 'inquiry-tab',
    label: 'Inquiries',
    module: 'inquiries',
    display: 'table',
    visible: false
  }, {
    name: 'campaign-tab',
    label: 'Campaigns',
    module: 'campaigns',
    display: 'table',
    visible: false
  }
])
</script>

<template>
  <div>
    <div v-for="(tab, tx) in tabs" :key="tx">
      <a @click="toggleTabs(tab)" href="javascript:void(0);">{{ tab.label }}</a>
    </div>

    <BaseTab :tabs="tabs" />
  </div>
</template>

<style scoped>

</style>