<script setup>
// -----------
// imports
// -----------
import { defineProps, onMounted } from 'vue'

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

</script>

<template>
  <DataTable
    :value="data"
    :loading="collectionLoading"
    paginator
    stateStorage="local"
    :stateKey="`dt-state-${name}`"
    resizableColumns
    columnResizeMode="fit"
    :rows="pagination && pagination.per_page"
    :rowsPerPageOptions="[5, 10, 25, 50]"
    tableClass="border-circle">
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