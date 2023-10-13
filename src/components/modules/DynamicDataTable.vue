<script setup>
// -----------
// imports
// -----------
import { defineProps, onMounted } from 'vue'

// refs
const props = defineProps({
  data: Array,
  paginator: Boolean,
  rows: Number,
  pages: Number,
  fields: Array
})

</script>

<template>
  <DataTable :value="data" tableStyle="min-width: 50rem">
    <Column v-for="col of fields" :key="col._id" :field="col.name" :header="col.label"></Column>
  </DataTable>
</template>

<style scoped>

</style>