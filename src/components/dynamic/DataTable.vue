<script setup>
// imports
import { ref, onBeforeUpdate, watch } from 'vue'
// primevue
import { FilterMatchMode } from 'primevue/api'

// props
const props = defineProps({
  localLoading: Boolean,
  data: Object,
})

// refs
const fields = ref([])
const selectedFields = ref([])
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

onBeforeUpdate(() => {
  fields.value = props.data.fields
})

watch(() => props.data.fields, (current, previous) => {
  current.map(f => {
    if (f.default) selectedFields.value.push(f)

    let fieldName = f.related ? f.field+'.name' : f.field
    filters.value[fieldName] = Object.assign({}, {
      'value': null,
      'matchMode': FilterMatchMode.CONTAINS
    })
  })
})

</script>

<template>
  <div class="flex flex-column gap-3">
    <!-- <pre>{{ data.table }}</pre> -->
    <div class="flex justify-content-between">
      <div class="flex gap-3">
        <Button @click="$emit('add-item')">
          <font-awesome-icon icon="fa-solid fa-plus" />
          &nbsp;Add
        </Button>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText class="w-full md:w-24rem" v-model="filters['global'].value" placeholder="Keyword search" />
        </span>
      </div>
      <div>
        <span class="p-float-label">
          <MultiSelect
            v-model="selectedFields"
            :options="fields"
            optionDisabled
            optionLabel="field"
            size="small"
            showClear
            class="w-full md:w-14rem" />
          <label>Selected fields</label>
        </span>
      </div>
    </div>

    <div>
      <Card>
        <template #content>
          <DataTable
            v-model:filters="filters"
            :value="data.table"
            dataKey="_id"
            :loading="localLoading"
            filterDisplay="row"
            :globalFilterFields="['name', 'email', 'branch.name', 'middle_name', 'first_name', 'last_name', 'full_name']"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem">
            <template #empty> No items found.</template>
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column
              v-for="field in selectedFields"
              sortable
              :header="field.label"
              :field="field.related ? field.field + '.name' : field.field"
              :filterField="field.related ? field.field + '.name' : field.field">
              <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" :placeholder="`Search by ${field.field}`" />
              </template>
              <template #body="slotProps">
                <div>{{ typeof slotProps.data[field.field] === 'object' ? slotProps.data[field.field].name : slotProps.data[field.field] }}</div>
              </template>
            </Column>
            <Column :exportable="false" style="min-width:10rem">
              <template #body="slotProps">
                <span class="p-buttonset">
                  <Button icon="pi pi-eye" size="small" severity="primary" />
                  <Button icon="pi pi-pencil" size="small" severity="secondary" @click="$emit('edit-item', slotProps.data)" />
                  <Button icon="pi pi-trash" size="small" severity="danger" @click="$emit('delete-item', slotProps.data)" />
                </span>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>

</style>