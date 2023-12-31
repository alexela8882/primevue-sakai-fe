<script setup>
// imports
import { ref, watch } from 'vue'
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
const selectedItems = ref([])
const globalFilterFields = ref([])
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

watch(() => props.data.fields, (current, previous) => {
  // populate fields
  fields.value = current

  current.map(f => {
    // set default selected fields
    if (f.default) selectedFields.value.push(f)

    // generate dynamic field name
    let fieldName = f.related ? f.field+'.name' : f.field

    // generate filter fields
    filters.value[fieldName] = Object.assign({}, {
      'value': null,
      'matchMode': FilterMatchMode.CONTAINS
    })

    // push field names into global filter fields
    globalFilterFields.value.push(fieldName)
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
            v-model:selection="selectedItems"
            :value="data.table"
            dataKey="_id"
            :loading="localLoading"
            filterDisplay="row"
            :globalFilterFields="globalFilterFields"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem">
            <template #empty> No items found.</template>
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column
              v-for="(field, fd) in selectedFields"
              :key="fd"
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

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}

</style>