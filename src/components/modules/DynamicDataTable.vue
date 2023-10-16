<script setup>
// -----------
// imports
// -----------
import { defineProps, onMounted, ref } from 'vue'

// refs
const props = defineProps({
  name: String,
  data: Array,
  pagination: Object,
  rows: Number,
  pages: Number,
  fields: Array,
  collectionLoading: Boolean
})
const selectedData = ref([])

</script>

<template>
  <DataTable
    v-model:selection="selectedData"
    :value="data"
    :loading="collectionLoading"
    paginator
    stripedRows
    stateStorage="local"
    :stateKey="`dt-state-${name}`"
    resizableColumns
    columnResizeMode="fit"
    sortMode="multiple"
    removableSort
    :rows="pagination && pagination.per_page"
    :rowsPerPageOptions="[5, 10, 25, 50]"
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
      style="min-width: 200px !important;"
      bodyClass="text-color-secondary"
      headerClass="bg-esco-blue1-light-active text-color-secondary">
      <template #body="slotProps">
        <span v-if="slotProps.data[col.name]">
          <span v-if="col.relation">
            <span
              v-for="(diplayFieldName, dfn) in col.relation.displayFieldName"
              :key="dfn">
              <span class="mr-1">{{ slotProps.data[col.name][diplayFieldName] }}</span>
            </span>
          </span>
          <span v-else>{{ slotProps.data[col.name] }}</span>
        </span>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
</style>