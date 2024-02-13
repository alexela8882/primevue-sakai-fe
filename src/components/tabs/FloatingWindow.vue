<script setup>
// imports
import { ref, watch, onMounted, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useTabStore } from '@/stores/tabs/index'
// components
const GeneralForm = defineAsyncComponent(() => import('@/components/modules/Form/GeneralForm.vue'))
const DynamicDataTable = defineAsyncComponent(() => import('@/components/modules/DynamicDataTable/DynamicDataTableMain.vue'))
// loaders
import DataTableLoader from '@/components/modules/DynamicDataTable/Loaders/DataTableLoader.vue'

// refs
// stores
const tabStore = useTabStore()
const { getTabs } = storeToRefs(tabStore)

// actions

// lifecycles
onMounted(async () => {
})

</script>

<template>
  <div class="z-3 fixed bottom-0 right-0 mx-3 p-2 flex justify-content-end align-items-center">
    <div v-if="getTabs.length > 0" class="relative align-self-end mr-2">
      <div>
        <Dropdown
          :options="getTabs.filter(t => t.style == 'window')"
          optionLabel="label"
          checkmark :highlightOnSelect="false" />
        <!-- <SplitButton
          :model="getTabs.filter(t => t.style == 'window')"
          menuButtonIcon="pi pi-ellipsis-h"
          raised
          text>
            <span class="flex align-items-center font-bold">
            </span>
        </SplitButton> -->
      </div>
    </div>
    <div
      class="px-1 align-self-end"
      v-for="(tab, tx) in getTabs.filter(t => t.style == 'window').slice(0,2)" :key="tx">
      <div style="width: 35vw;">
        <Panel
          toggleable
          :collapsed="!tab.expanded"
          class="floating-window h-full shadow-4">
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
          <template #icons>
            <button class="p-panel-header-icon p-link mr-2">
              <span class="pi pi-times"></span>
            </button>
          </template>
          <div
            style="height: 65vh !important;"
            class="m-0 p-0 floating-window-content overflow-y-scroll overflow-x-hidden">
            <div v-if="tab.type === 'component'">
              <component :is="tab.component"></component>
            </div>
            <div v-else-if="tab.type === 'module-form'">
              <GeneralForm :key="tab.name" :name="tab.name" :module="tab.module" />
            </div>
            <div v-else-if="tab.type == 'module'">
              <Suspense v-if="tab.base_module">
                <DynamicDataTable
                  :key="tab.base_module._id"
                  mode="view"
                  :moduleId="tab.base_module._id"
                  :moduleEntityName="tab.base_module.mainEntity"
                  :moduleName="tab.base_module.name"
                  :moduleLabel="tab.base_module.label"
                  :fields="tab.module.viewFilterWithFields.fields"
                  :data="tab.module.collection.data"
                  :pagination="tab.module.collection.meta && tab.module.collection.meta.pagination">
                </DynamicDataTable>
                <template #fallback>
                  <DataTableLoader />
                </template>
              </Suspense>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  </div>
</template>

<style>
.floating-window .p-panel-header {
  border-bottom: 1px solid var(--surface-300);
}
</style>