<script setup>
// imports
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useBaseStore } from '@/stores/base'

// refs
// stores
const baseStore = useBaseStore()
const {
  menuLoading,
  modulesLoading,
  getMenu,
  sidebarMenu,
  getModules
} = storeToRefs(baseStore)
const { fetchMenu, fetchModules } = baseStore

// fetches
fetchMenu()
fetchModules()

</script>

<template>
  <div>
    <div>
      <h4>Modules</h4>
      <div v-if="modulesLoading">Loading modules...</div>
      <div v-else>
        <pre>{{ getModules }}</pre>
      </div>
    </div>
  </div>
</template>