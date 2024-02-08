<script setup>
// imports
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useTabStore } from '@/stores/tabs/index'

// refs
const tabStore = useTabStore()
const { getTabs } = storeToRefs(tabStore)

</script>

<template>
  <div class="z-1 fixed bottom-0 right-0 m-5 p-2 flex justify-content-end">
    <div
      class="p-2 align-self-end"
      v-for="(tab, tx) in getTabs.filter(t => t.style == 'window')" :key="tx">
      <div style="width: 300px;">
        <Panel
          :header="tab.label"
          toggleable
          :collapsed="!tab.expanded"
          class="floating-window h-full">
          <p class="m-0">
            <component :is="tab.component"></component>
          </p>
        </Panel>
      </div>
    </div>
  </div>
</template>

<style>
.floating-window .p-panel-content {
  min-height: 300px;
}
</style>