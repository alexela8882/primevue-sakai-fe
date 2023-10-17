<script setup>
// -----------
// imports
// -----------
import { defineProps, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useModuleStore } from '../../stores/modules/index'

// refs
const moduleStore = useModuleStore()
const { getCollection } = storeToRefs(moduleStore)
const { fetchCollection } = moduleStore
const props = defineProps({
  moduleName: String,
  moduleLabel: String,
  data: Array,
  pagination: Object,
  rows: Number,
  pages: Number,
  fields: Array,
  collectionLoading: Boolean
})
const cm = ref()
const selectedData = ref()
const selectedContextData = ref()
const menuModel = ref([
  {label: 'View', icon: 'pi pi-fw pi-search', command: () => viewProduct(selectedProduct)},
  {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => deleteProduct(selectedProduct)}
])

// actions
const paginate = async (event) => {
  console.log(event.page + 1)

  // re-fetch collection
  await fetchCollection(props.moduleName, event.page + 1)
}
const onRowContextMenu = (event) => {
  cm.value.show(event.originalEvent)
}

onMounted(async () => {
  
})

</script>

<template>
  <DataTable
    v-model:selection="selectedData"
    v-model:contextMenuSelection="selectedContextData"
    @rowContextmenu="onRowContextMenu"
    :value="data"
    :loading="collectionLoading"
    stripedRows
    stateStorage="local"
    :stateKey="`dt-state-${moduleLabel}`"
    resizableColumns
    columnResizeMode="fit"
    sortMode="multiple"
    removableSort
    tableClass="border-circle">
    <Column
      headerClass="bg-esco-blue1-light-active text-color-secondary"
      selectionMode="multiple"></Column>
    <!-- <Column
      v-for="col of fields"
      :key="col._id"
      :field="col.name"
      :header="col.label"></Column> -->
    <Column
      v-for="col of fields"
      :key="col._id"
      :field="col.name"
      :header="col.label"
      sortable
      sorticon="check"
      style="min-width: 200px !important;"
      bodyClass="text-color-secondary"
      headerClass="bg-esco-blue1-light-active text-color-secondary">
      <template #body="slotProps">
        <span v-if="slotProps.data[col.name]">
          <span v-if="col.relation">
            <span
              v-for="(diplayFieldName, dfn) in col.relation.displayFieldName"
              :key="dfn">
              <span v-if="col.rules.ss_pop_up" class="mr-1">{{ slotProps.data[col.name][diplayFieldName] }}</span>
            </span>
          </span>
          <span v-else>{{ slotProps.data[col.name] }}</span>
        </span>
      </template>
    </Column>
    <template #footer>
      <Paginator
        @page="paginate"
        :rows="pagination && pagination.per_page"
        :totalRecords="pagination && pagination.total"
        :rowsPerPageOptions="[5, 10, 15, 20, 25, 30]"></Paginator>
    </template>
  </DataTable>
  <ContextMenu ref="cm" :model="menuModel" />
</template>

<style scoped>
</style>