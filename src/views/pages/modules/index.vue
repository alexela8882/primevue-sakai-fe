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
  modulesLoading,
  getModules
} = storeToRefs(baseStore)
const { fetchModules } = baseStore

// fetches
fetchModules()

</script>

<template>
  <div>
    <h4>Modules</h4>
    <div v-if="modulesLoading">Loading modules...</div>
    <div v-else>
      <ol>
        <li v-for="(module, mod) in getModules" :key="mod">
          <a
            href="javascript: void(0);"
            @click="$router.push(`/modules/${module._id}`)">{{ module.label }}</a>
        </li>
      </ol>
    </div>
  </div>
</template>