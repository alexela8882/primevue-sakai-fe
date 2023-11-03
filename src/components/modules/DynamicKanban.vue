<script setup>
// -----------
// imports
// -----------
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
// stores
import { useModuleStore } from '../../stores/modules/index'

// defines
const props = defineProps({
  viewFilterId: String,
  moduleName: String,
  moduleLabel: String,
  data: Array,
  fields: Array,
  groupBy: String,
  summarizeBy: String,
  collectionLoading: Boolean
})

// refs
const moduleStore = useModuleStore()
const { getCollection, getKanbanData } = storeToRefs(moduleStore)
const { fetchModule, fetchBaseModule, fetchCollection } = moduleStore



</script>

<template>
  <div class="grid grid-nogutter">
    <div
      v-for="(field, fx) in getKanbanData(viewFilterId)"
      :key="fx"
      class="col">
      <div class="bg-white py-4 px-4 text-primary font-bold text-xl">{{ field.label }}</div>
      <div
        class="p-4 m-4 border-2 border-primary-300 border-round-xl bg-white"
        v-for="(data, dx) in field.data"
        :key="dx">
        <!-- Loop through the first 4 key-value pairs in the object -->
        <div v-for="(value, key) in Object.entries(data).slice(0, 4)" :key="key" class="my-2">
          <strong>{{ value[0] }}:</strong> {{ value[1] }}
        </div>

        <div class="flex justify-content-end">
          <Button class="bg-green" label="Manage" severity="success" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>