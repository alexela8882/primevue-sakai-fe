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
      class="px-1 align-self-end"
      v-for="(tab, tx) in getTabs.filter(t => t.style == 'window')" :key="tx">
      <div style="width: 45vw;">
        <Panel
          toggleable
          :collapsed="!tab.expanded"
          class="floating-window h-full">
          <template #togglericon>
            <div>
              <span class="pi pi-minus"></span>
            </div>
          </template>
          <template #header>
            <div class="flex align-items-center gap-2 text-xl font-bold">
              <div v-if="tab.type === 'module-form'" class="material-icons">{{ tab.base_module.icon }}</div>
              <div>{{ tab.label.charAt(0).toUpperCase() + tab.label.slice(1) }}</div>
              <div v-if="tab.type === 'module-form'">(New)</div>
            </div>
          </template>
          <div
            style="height: 65vh !important;"
            class="m-0 p-0 floating-window-content overflow-y-scroll overflow-x-hidden">
            <div v-if="tab.type === 'component'">
              <component :is="tab.component"></component>
            </div>
            <div v-else-if="tab.type === 'module-form'">
              <GeneralForm :name="tab.name" :module="tab.module" />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  </div>
</template>

<style>
</style>