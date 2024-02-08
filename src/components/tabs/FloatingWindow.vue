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
  <div class="z-1 fixed bottom-0 right-0 mx-3 p-2 flex justify-content-end">
    <div
      class="p-2 align-self-end"
      v-for="(tab, tx) in getTabs.filter(t => t.style == 'window')" :key="tx">
      <div style="width: 300px;">
        <Panel
          :header="tab.label"
          toggleable
          :collapsed="!tab.expanded"
          class="floating-window h-full">
          <div
            style="height: 300px !important;"
            class="m-0 floating-window-content overflow-scroll">
            <component :is="tab.component"></component>
          </div>
        </Panel>
      </div>
    </div>
  </div>
</template>

<style>
</style>