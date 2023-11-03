<script setup>
// -----------
// imports
// -----------
import draggable from 'vuedraggable'
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
const kanbanData = ref([])
const moduleStore = useModuleStore()
const { getCollection, getKanbanData } = storeToRefs(moduleStore)
const { fetchModule, fetchBaseModule, fetchCollection } = moduleStore

// actions
const log = (evt) => {
  window.console.log(evt)
}

onMounted(() => {
  kanbanData.value = getKanbanData.value(props.viewFilterId)
})

</script>

<template>
  <div class="grid grid-nogutter">
    <div
      v-for="(field, fx) in kanbanData"
      :key="fx"
      class="col">
      <div
        style="position: sticky; top: 70px; z-index: 99;"
        class="bg-white py-4 px-4 text-primary font-bold text-xl shadow-1">{{ field.label }}</div>
      <draggable
        :list="field.data"
        :group="viewFilterId"
        @change="log"
        itemKey="_id"
        class="cursor-move h-full">
        <template #item="{ element, index }">
          <div class="p-4 m-4 border-1 border-primary-300 border-round-xl bg-white shadow-2">
            <!-- Loop through the first 4 key-value pairs in the object -->
            <div v-for="(value, key) in Object.entries(element).slice(0, 4)" :key="key" class="my-2">
              <strong>{{ value[0] }}:</strong> {{ value[1] }}
            </div>
            <div class="flex justify-content-end">
              <Button class="bg-green" label="Manage" severity="success" />
            </div>
          </div>
        </template>
      </draggable>
      <!-- <div
        class="p-4 m-4 border-1 border-primary-300 border-round-xl bg-white shadow-2"
        v-for="(data, dx) in field.data"
        :key="dx">
        <div v-for="(value, key) in Object.entries(data).slice(0, 4)" :key="key" class="my-2">
          <strong>{{ value[0] }}:</strong> {{ value[1] }}
        </div>

        <div class="flex justify-content-end">
          <Button class="bg-green" label="Manage" severity="success" />
        </div>
      </div> -->
    </div>
  </div>
</template>

<style scoped>

</style>