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
const menu = ref()
const selectedTab = ref()
const windowTabs = ref([])
// stores
const tabStore = useTabStore()
const { xTabsLoading, getTabs } = storeToRefs(tabStore)
const { removeTab, toggleWindows } = tabStore

// actions
const removeTabAction = async (tab) => {
  await removeTab(tab)
}

// lifecycles
onMounted(async () => {
  windowTabs.value = getTabs.value.filter(t => t.style == 'window')
})
watch(() => selectedTab.value, async (newVal, oldVal) => {
  await toggleWindows(newVal)
})
watch(getTabs.value, (newVal, oldVal) => {
  windowTabs.value = newVal.filter(t => t.style == 'window')
})

</script>

<template>
  <div class="z-3 fixed bottom-0 right-0 mx-3 p-2 flex justify-content-end align-items-center">
    <div v-if="windowTabs.length > 0" class="align-self-end mr-2">
      <div>
        <Dropdown
          v-model="selectedTab"
          :options="windowTabs"
          optionLabel="label"
          checkmark :highlightOnSelect="false" />
      </div>
    </div>
    <div
      class="px-1 align-self-end"
      v-for="(tab, tx) in windowTabs.slice(0,2)" :key="tx">
      <BlockUI :blocked="xTabsLoading">
        <div style="width: 35vw;">
          <Panel
            toggleable
            :collapsed="!tab.expanded"
            class="floating-window h-full shadow-4">
            <template #icons>
              <div class="flex align-items-center gap-2 ml-2">
                <Button text rounded>
                  <template #icon>
                    <div class="material-icons" style="font-size: 12px;">open_in_full</div>
                  </template>
                </Button>
                <Button @click="removeTabAction(tab)" text rounded>
                  <template #icon>
                    <div class="material-icons" style="font-size: 12px;">close</div>
                  </template>
                </Button>
              </div>
            </template>
            <template #togglericon>
              <Button text rounded>
                <template #icon>
                  <div class="material-icons" style="font-size: 12px;">minimize</div>
                </template>
              </Button>
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
              <div v-if="tab.type === 'component'" class="p-2">
                <component :is="tab.component"></component>
              </div>
              <div v-else-if="tab.type === 'module-form'" class="p-2">
                <GeneralForm :key="tab.name" :name="tab.name" :module="tab.module" />
              </div>
              <div v-else-if="tab.type == 'module'" class="p-2">
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
      </BlockUI>
    </div>
  </div>
</template>

<style>
.floating-window .p-panel-header {
  border-bottom: 1px solid var(--surface-300);
}
.floating-window .p-panel-icons {
  display: flex;
  flex-direction: row-reverse;
}
.floating-window .p-panel-content {
  padding: 0 !important;
}
</style>