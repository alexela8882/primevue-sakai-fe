<script setup>
// import
import { storeToRefs } from 'pinia'
import { onMounted, watch, ref, defineAsyncComponent } from 'vue'
// stores
import { useModuleStore } from '@/stores/modules/index'
// components
import TableSettings from './TableSettings.vue'
import KanbanSettings from './KanbanSettings.vue'

// refs
const saveTableSettings = ref(0)
const saveKanbanSettings = ref(0)
const saveLoading = ref(false)
// stores
const moduleStore = useModuleStore()
const {
  viewFiltersDialog,
  getBaseModule,
  getViewFilters,
} = storeToRefs(moduleStore)
// defines
const props = defineProps({
  mode: String,
  selectedViewFilter: String,
  module: Object
})

// actions
const saveViewFilterData = () => {
  if (props.mode === 'new' || props.mode === 'edit-table') saveTableSettings.value++
  else if (props.mode === 'edit-kanban') saveKanbanSettings.value++
}

// lifecycles
onMounted(() => {
})

</script>

<template>
  <Dialog
    v-model:visible="viewFiltersDialog"
    modal
    maximizable
    :style="{ width: '70vw' }"
    class="view-filter-dialog">
    <template #header>
      <div class="flex align-items-center text-2xl">
        <div class="material-icons mr-2">{{ mode === 'edit-table' ? 'table_chart' : 'view_kanban' }}</div>
        <div>{{ (mode === 'edit-table' || mode === 'new') ? 'Table' : 'Kanban' }} Settings &mdash; {{ getBaseModule.label }}</div>
      </div>
    </template>
    <TableSettings
      v-if="mode === 'new' || mode === 'edit-table'"
      :mode="mode"
      :module="module"
      :selectedViewFilter="selectedViewFilter"
      :saveTrigger="saveTableSettings"
      @save-loading="saveLoad(payload)" />

    <KanbanSettings
      v-if="mode === 'edit-kanban'"
      :mode="mode"
      :module="module"
      :selectedViewFilter="selectedViewFilter"
      :saveTrigger="saveKanbanSettings"
      @save-loading="saveLoad(payload)" />
    <template #footer>
      <div class="flex align-items-center justify-content-end my-2">
        <Button
          @click="viewFiltersDialog = false"
          outlined
          :disabled="saveLoading"
          label="Cancel"
          class="border-round-3xl py-2 px-4 border-color-primary"
          size="small" />
        <Button
          @click="saveViewFilterData"
          :loading="saveLoading"
          label="Save"
          class="reddot-primary border-round-3xl py-2 px-4 text-surface-50" />
      </div>
    </template>
  </Dialog>
</template>

<style>
.view-filter-dialog .p-dialog-header {
  background-color: var(--primary-color);
  color: var(--surface-a);
}
.view-filter-dialog.p-dialog .p-dialog-header .p-dialog-header-icon {
  color: var(--surface-a);
}
</style>