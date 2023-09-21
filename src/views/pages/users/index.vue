<script setup>
// --------
// imports
// --------
import { useLayout } from '@/layout/composables/layout'
import { ref, onMounted, onBeforeMount } from 'vue'
import axios from 'axios'
import { storeToRefs } from 'pinia'
// stores
import { useUserStore } from '@/stores/user'
import { useGeneralStore } from '@/stores/general'
/// primevue
import { FilterMatchMode } from 'primevue/api'

// -----------
// stores
// -----------
// user store
const userStore = useUserStore()
const { users, getUsers } = storeToRefs(userStore)
const { setUsers } = userStore
// general store
const generalStore = useGeneralStore()
const { popUpModalOpen, formModalOpen, pageData } = storeToRefs(generalStore)
const { popUpModalDataFill, formModalDataFill, pageDataFill, throwError } = generalStore

// --------
// refs
// --------
const localLoading = ref(false)
const { isDarkTheme } = useLayout()
const selectedUsers = ref()
const selectedCountry = ref(null)
const branches = ref([])
const countries = ref([
  { name: 'Philippines'},
  { name: 'Singapore'},
  { name: 'Indonesia'},
])
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'branch.name': { value: null, matchMode: FilterMatchMode.CONTAINS }
})

// -----------
// actions
// -----------
const addUser = () => {
  let userObj = {
    store: {
      name: 'userStore',
      action: 'addUser'
    },
    api: { uri: `users/store`,  method: 'POST'},
    fields: [{
      label: 'First name',
      name: 'firstName',
      type: 'text',
      value: null
    }, {
      label: 'Last name',
      name: 'lastName',
      type: 'text',
      value: null
    }, {
      label: 'Middle name',
      name: 'middleName',
      type: 'text',
      value: null
    }, {
      label: 'Branch',
      name: 'branch_id',
      type: 'select',
      value: null,
      items: branches.value
    }, {
      label: 'Email',
      name: 'email',
      type: 'email',
      value: null
    }, {
      label: 'Password',
      name: 'password',
      type: 'password',
      value: null
    }]
  }

  let obj = {
    title: `Add User`,
    type: 'primary',
    data: Object.assign({}, userObj)
  }

  formModalDataFill(obj)
  formModalOpen.value = true
}

const editUser = (user) => {
  let userObj = {
    store: { name: 'userStore', action: 'updateUser' },
    api: { uri: `users/${user._id}/update`,  method: 'PUT'},
    fields: [{
      label: 'First name',
      name: 'firstName',
      type: 'text',
      value: user.firstName
    }, {
      label: 'Last name',
      name: 'lastName',
      type: 'text',
      value: user.lastName
    }, {
      label: 'Middle name',
      name: 'middleName',
      type: 'text',
      value: user.middleName
    }, {
      label: 'Branch',
      name: 'branch_id',
      type: 'select',
      value: user.branch_id,
      items: branches.value
    }, {
      name: 'email',
      type: 'email',
      value: user.email
    }, {
      name: 'password',
      type: 'password',
      value: null,
      instruction: 'Leave this blank to keep unchanged'
    }]
  }

  let obj = {
    title: `Edit "${user.name}" User`,
    type: 'primary',
    data: Object.assign({}, userObj)
  }

  formModalDataFill(obj)
  formModalOpen.value = true
}

const deleteUser = (user) => {
  console.log(user)
  let userObj = {
    store: { name: 'userStore', action: 'deleteUser' },
    api: { uri: `users/${user._id}/delete`,  method: 'DELETE'},
  }

  const obj = {
    title: `Are you sure you want to delete user: "${user.name}"?`,
    type: 'danger',
    data: Object.assign({}, userObj)
  }

  popUpModalDataFill(obj)
  popUpModalOpen.value = true

  console.log(popUpModalOpen.value)
}

onMounted(async () => {
  localLoading.value = true
  // fetch users
  await axios.get('/users').then((response) => {
    setUsers(response.data)
    localLoading.value = false
  })

  // fetch branches
  await axios.get('/branches').then((response) => {
    branches.value = response.data
    localLoading.value = false
  })
})

</script>

<template>
  <div class="flex flex-column gap-3 mb-5 mt-5">
    <div>
      <div class="flex justify-content-between">
        <div class="flex flex-column">
          <span class="capitalize text-xl font-bold" :class="`${isDarkTheme ? 'text-surface-50' : 'text-blue-800'}`">Manage user</span>
        </div>

        <div>
          <Button @click="addUser" class="reddot-button-primary flex border-round-lg py-2 px-4" size="small">
            <font-awesome-icon icon="fa-solid fa-plus" size="xs" />
            &nbsp;Add user
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
            v-model:selection="selectedUsers"
            :value="getUsers"
            dataKey="_id"
            :loading="localLoading"
            filterDisplay="row"
            :globalFilterFields="['name', 'email', 'branch.name']"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem">
            <template #empty> No users found.</template>
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
            <Column field="email" header="Email" sortable filterField="email" style="width: 30%">
              <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by email" />
              </template>
            </Column>
            <Column field="branch.name" header="Branch" sortable filterField="branch.name" style="width: 30%">
              <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by email" />
              </template>
              <template #body="slotProps">
                <div>{{ slotProps.data.branch.name }}</div>
              </template>
            </Column>
            <Column :exportable="false" style="min-width:10rem">
              <template #body="slotProps">
                <span class="p-buttonset">
                  <Button icon="pi pi-pencil" size="small" severity="secondary" @click="editUser(slotProps.data)" />
                  <Button icon="pi pi-trash" size="small" severity="danger" @click="deleteUser(slotProps.data)" />
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