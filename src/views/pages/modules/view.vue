<script setup>
// imports
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
// stores
import { useModuleStore } from '@/stores/modules/index'

// refs
const route = useRoute()
const moduleStore = useModuleStore()
const { moduleLoading, getModule } = storeToRefs(moduleStore)
const { fetchModule } = moduleStore

watch(route, () => {
  fetchModule(route.params.id)
})

onMounted(() => {
  fetchModule(route.params.id)
})

</script>

<template>
  <div>
    <h4>Module</h4>
    <div>
      <div v-if="moduleLoading">
        Loading module...
      </div>
      <pre v-else>
        {{ getModule }}
      </pre>
    </div>
  </div>
</template>

<style scoped>

</style>