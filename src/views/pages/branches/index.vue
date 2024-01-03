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
// components
import DataTable from '../../../components/dynamic/DataTable.vue'

// -----------
// stores
// -----------
// branch store
const branchStore = useBranchStore()
const { branches, getBranches } = storeToRefs(branchStore)
const { setBranches } = branchStore
// general store
const generalStore = useGeneralStore()
const { popUpModalOpen, formModalOpen, formModalTrigger, popUpModalTrigger } = storeToRefs(generalStore)
const { popUpModalDataFill, formModalDataFill } = generalStore

// --------
// refs
// --------
const localLoading = ref(false)
const { isDarkTheme } = useLayout()
const countries = ref([])
const data = ref({})

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
  formModalTrigger.value = true
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
  formModalTrigger.value = true
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
  popUpModalTrigger.value = true

  console.log(popUpModalOpen.value)
}

onMounted(async () => {
  localLoading.value = true
  // fetch branches
  await axios.get('/branches').then((response) => {
    setBranches(response.data.table)
    data.value = response.data
    localLoading.value = false

    console.log(response.data)
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
          <!-- <Button @click="addBranch" class="reddot-button-primary flex border-round-lg py-2 px-4" size="small">
            <font-awesome-icon icon="fa-solid fa-plus" size="xs" />
            &nbsp;Add branch
          </Button> -->
        </div>
      </div>
    </div>

    <DataTable
      @add-item="addBranch"
      @edit-item="editBranch"
      @delete-item="deleteBranch"
      :localLoading="localLoading"
      :data="data" />
  </div>
</template>

<style scoped>


/* .p-dropdown {
  background-color: var(--blue-200);
  color: var(--surface-800);
} */

</style>