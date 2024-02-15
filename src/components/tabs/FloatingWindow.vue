<script setup>
// imports
import { ref, watch, onMounted, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useTabStore } from '@/stores/tabs/index'
// components
const FloatingWindowContent = defineAsyncComponent(() => import('@/components/tabs/FloatingWindowContent.vue'))

// refs
const menu = ref()
const selectedTab = ref()
const windowTabs = ref([])
const openedWindowTabs = ref([])
// stores
const tabStore = useTabStore()
const {
  tabDialog,
  xTabsLoading,
  getTabs,
  getWinTabs,
  getOpenedWinTabs } = storeToRefs(tabStore)
const {
  removeTab,
  toggleWindows,
  sortTabs,
  maximizeTab,
  minimizeTab } = tabStore

// actions
const removeTabAction = async (tab) => {
  await removeTab(tab)
}

// bug fix for PrimeVue Panel component
const watchPanelCollapse = (event) => {
  console.log(event)
}
const updatePanelCollapse = (event, tab) => {
  console.log(event.value)
  tab.expanded = !event.value
}
const maximizeTabAction = async (tab) => {
  await maximizeTab(tab)
}

// lifecycles
onMounted(async () => {
  // windowTabs.value = getTabs.value.filter(t => t.style == 'window')
  // openedWindowTabs.value = windowTabs.value.filter(wt => wt.opened)
})
watch(() => selectedTab.value, async (newVal, oldVal) => {
  await toggleWindows(newVal)
})
watch(getTabs.value, (newVal, oldVal) => {
  windowTabs.value = newVal.filter(t => t.style == 'window')
  let sortedOpenWinTabs = windowTabs.value.filter(wt => wt.opened).sort((a, b) => {
    return a.opened_order - b.opened_order
  })
  openedWindowTabs.value = sortedOpenWinTabs
})

</script>

<template>
  <div class="z-3 fixed bottom-0 right-0 mx-3 p-2 flex justify-content-end align-items-center">
    <div v-if="getWinTabs.length > 2" class="align-self-end mr-2">
      <div>
        <Dropdown
          v-model="selectedTab"
          :options="getWinTabs"
          optionLabel="label"
          checkmark :highlightOnSelect="false" />
      </div>
    </div>
    <div
      class="px-1 align-self-end"
      v-for="(tab, tx) in openedWindowTabs" :key="tx">
      <BlockUI :blocked="xTabsLoading">
        <div style="width: 35vw;">
          <Panel
            toggleable
            @update:collapsed="watchPanelCollapse($event)"
            @toggle="updatePanelCollapse($event, tab)"
            :collapsed="!tab.expanded"
            class="floating-window h-full shadow-4">
            <template #icons>
              <div class="flex align-items-center gap-2 ml-2">
                <Button @click="maximizeTabAction(tab)" text rounded>
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
                  <div @click="minimizeTab(tab)" class="material-icons" style="font-size: 12px;">minimize</div>
                </template>
              </Button>
            </template>
            <template #header>
              <Teleport :to="`${tab.maximized ? '.global-dialog-header' : '.hidden-div'}`">
                <div class="flex align-items-center gap-2 text-xl font-bold">
                  <div v-if="tab.type === 'module-form'" class="material-icons">{{ tab.base_module.icon }}</div>
                  <div>{{ tab.label.charAt(0).toUpperCase() + tab.label.slice(1) }}</div>
                  <div v-if="tab.type === 'module-form'">(New)</div>
                </div>
              </Teleport>
              <div class="flex align-items-center gap-2 text-xl font-bold">
                <div v-if="tab.type === 'module-form'" class="material-icons">{{ tab.base_module.icon }}</div>
                <div>{{ tab.label.charAt(0).toUpperCase() + tab.label.slice(1) }}</div>
                <div v-if="tab.type === 'module-form'">(New)</div>
              </div>
            </template>
            <div
              style="height: 65vh !important;"
              class="m-0 p-0 floating-window-content overflow-y-scroll overflow-x-hidden">
              <Teleport :disabled="!tab.maximized" :to="`${tab.maximized ? '.fw-dialog-content' : '.hidden-div'}`">
                <FloatingWindowContent :key="tx" :tab="tab" />
              </Teleport>
            </div>
          </Panel>
        </div>
      </BlockUI>
    </div>
  </div>
</template>

<style>
.floating-window .p-panel-header,
.floating-window-dialog .p-dialog-header {
  border-bottom: 1px solid var(--surface-300);
}
.floating-window .p-panel-icons {
  display: flex;
  flex-direction: row-reverse;
}
.floating-window .p-panel-content,
.floating-window-dialog .p-dialog-content {
  padding: 0 !important;
  overflow-x: hidden;
}
</style>