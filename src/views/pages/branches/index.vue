<script setup>
// --------
// imports
// --------
import { useLayout } from '@/layout/composables/layout'
import { ref, onMounted, onBeforeMount } from 'vue'
import axios from 'axios'
import { storeToRefs } from 'pinia'
// stores
import { useBranchStore } from '@/stores/branch'
import { useGeneralStore } from '@/stores/general'
/// primevue
import { FilterMatchMode } from 'primevue/api'

// -----------
// stores
// -----------
// branch store
const branchStore = useBranchStore()
const { branches, getBranches } = storeToRefs(branchStore)
const { setBranches } = branchStore
// general store
const generalStore = useGeneralStore()
const { popUpModalOpen, formModalOpen, pageData } = storeToRefs(generalStore)
const { popUpModalDataFill, formModalDataFill, pageDataFill, throwError } = generalStore

// --------
// refs
// --------
const localLoading = ref(false)
const { isDarkTheme } = useLayout()
const selectedBranches = ref()
const selectedCountry = ref(null)
const countries = ref([])
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  address: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'country.name': { value: null, matchMode: FilterMatchMode.CONTAINS }
})

// -----------
// actions
// -----------
const addBranch = () => {
  let branchObj = {
    store: {
      name: 'branchStore',
      action: 'addBranch'
    },
    api: { uri: `branches/store`,  method: 'POST'},
    fields: [{
      label: 'Name',
      name: 'name',
      type: 'text',
      value: null
    }, {
      label: 'Address',
      name: 'address',
      type: 'text',
      value: null
    }, {
      label: 'Country',
      name: 'country_id',
      type: 'select',
      value: null,
      items: countries.value
    }]
  }

  let obj = {
    title: `Add Branch`,
    type: 'primary',
    data: Object.assign({}, branchObj)
  }

  formModalDataFill(obj)
  formModalOpen.value = true
}

const editBranch = (branch) => {
  let branchObj = {
    store: { name: 'branchStore', action: 'updateBranch' },
    api: { uri: `branches/${branch._id}/update`,  method: 'PUT'},
    fields: [{
      label: 'Name',
      name: 'name',
      type: 'text',
      value: branch.name
    }, {
      label: 'Address',
      name: 'address',
      type: 'text',
      value: branch.address
    }, {
      label: 'Country',
      name: 'country_id',
      type: 'select',
      value: branch.country_id,
      items: countries.value
    }]
  }

  let obj = {
    title: `Edit "${branch.name}" Branch`,
    type: 'primary',
    data: Object.assign({}, branchObj)
  }

  formModalDataFill(obj)
  formModalOpen.value = true
}

const deleteBranch = (branch) => {
  console.log(branch)
  let branchObj = {
    store: { name: 'branchStore', action: 'deleteBranch' },
    api: { uri: `branches/${branch._id}/delete`,  method: 'DELETE'},
  }

  const obj = {
    title: `Are you sure you want to delete branch: "${branch.name}"?`,
    type: 'danger',
    data: Object.assign({}, branchObj)
  }

  popUpModalDataFill(obj)
  popUpModalOpen.value = true

  console.log(popUpModalOpen.value)
}

onMounted(async () => {
  localLoading.value = true
  // fetch branches
  await axios.get('/branches').then((response) => {
    setBranches(response.data)
    localLoading.value = false
  })

  // fetch countries
  await axios.get('/countries').then((response) => {
    countries.value = response.data
    localLoading.value = false
  })
})

</script>

<template>
  <div class="flex flex-column gap-3 mb-5 mt-5">
    <div>
      <div class="flex justify-content-between">
        <div class="flex flex-column">
          <span class="capitalize text-xl font-bold" :class="`${isDarkTheme ? 'text-surface-50' : 'text-blue-800'}`">Manage branch</span>
        </div>

        <div>
          <Button @click="addBranch" class="reddot-button-primary flex border-round-lg py-2 px-4" size="small">
            <font-awesome-icon icon="fa-solid fa-plus" size="xs" />
            &nbsp;Add branch
          </Button>
        </div>
      </div>
    </div>

    <div class="flex justify-content-between">
      <div class="flex gap-3">
        <Dropdown
          v-model="selectedCountry"
          :options="countries"
          optionLabel="name"
          placeholder="All countries"
          size="small"
          showClear
          class="w-full md:w-14rem" />
        <Dropdown
          optionLabel="name"
          placeholder="Select fields"
          size="small"
          showClear
          class="w-full md:w-14rem" />
      </div>
      <div>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="filters['global'].value" placeholder="Keyword search" />
        </span>
      </div>
    </div>

    <div>
      <Card>
        <template #content>
          <DataTable
            v-model:filters="filters"
            v-model:selection="selectedBranches"
            :value="getBranches"
            dataKey="_id"
            :loading="localLoading"
            filterDisplay="row"
            :globalFilterFields="['name', 'address', 'country.name']"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem">
            <template #empty> No branches found.</template>
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="name" header="Name" sortable filterField="name" style="width: 30%">
              <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
              </template>
              <template #body="slotProps">
                <a class="">
                  <div>{{ slotProps.data.name }}</div>
                </a>
              </template>
            </Column>
            <Column field="address" header="Address" sortable filterField="address" style="width: 30%">
              <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by address" />
              </template>
            </Column>
            <Column field="country.name" header="Country" sortable filterField="country.name" style="width: 30%">
              <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by country" />
              </template>
              <template #body="slotProps">
                <a class="">
                  <div>{{ slotProps.data.country.name }}</div>
                </a>
              </template>
            </Column>
            <Column :exportable="false" style="min-width:10rem">
              <template #body="slotProps">
                <span class="p-buttonset">
                  <Button icon="pi pi-pencil" size="small" severity="secondary" @click="editBranch(slotProps.data)" />
                  <Button icon="pi pi-trash" size="small" severity="danger" @click="deleteBranch(slotProps.data)" />
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


/* .p-dropdown {
  background-color: var(--blue-200);
  color: var(--surface-800);
} */

</style>