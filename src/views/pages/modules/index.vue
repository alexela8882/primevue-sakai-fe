<script setup>
// imports
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
  getModules
} = storeToRefs(baseStore)
const { fetchMenu, fetchModules } = baseStore

// fetches
fetchMenu()
fetchModules()

</script>

<template>
  <div>
    <div class="mb-6">
      <h4>Menu</h4>
      <div v-if="menuLoading">Loading menu...</div>
      <div v-else>
        <pre>{{ getMenu }}</pre>
      </div>
    </div>

    <div>
      <h4>Modules</h4>
      <div v-if="modulesLoading">Loading modules...</div>
      <div v-else>
        <pre>{{ getModules }}</pre>
      </div>
    </div>
  </div>
</template>