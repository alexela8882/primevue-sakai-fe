<script setup>
// imports
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useTabStore } from '@/stores/tabs/index'
// components
const GeneralForm = defineAsyncComponent(() => import('@/components/modules/Form/GeneralForm.vue'))

// refs
// stores
const tabStore = useTabStore()
const { getTabs } = storeToRefs(tabStore)

// actions

onMounted(async () => {
})

</script>

<template>
  <div class="z-3 fixed bottom-0 right-0 mx-3 p-2 flex justify-content-end">
    <div
      class="p-2 align-self-end"
      v-for="(tab, tx) in getTabs.filter(t => t.style == 'window')" :key="tx">
      <div style="width: 500px;">
        <Panel
          toggleable
          :collapsed="!tab.expanded"
          class="floating-window h-full">
          <template #header>
            <div class="text-2xl font-bold">{{ tab.label.charAt(0).toUpperCase() + tab.label.slice(1) }}</div>
          </template>
          <div
            style="height: 65vh !important;"
            class="m-0 floating-window-content overflow-scroll">
            <div v-if="tab.type === 'component'">
              <component :is="tab.component"></component>
            </div>
            <div v-else-if="tab.type === 'form'">
              <GeneralForm :name="tab.name" :module="tab.module" />
            </div>
          </div>
          <template #footer>
            <div :class="`${tab.name}-floating-window-panel-footer`"></div>
          </template>
        </Panel>
      </div>
    </div>
  </div>
</template>

<style>
</style>