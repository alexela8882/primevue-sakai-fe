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
const selectedFields = ref([])
const branches = ref([])
const fields = ref([])
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
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
      name: 'first_name',
      type: 'text',
      value: null
    }, {
      label: 'Last name',
      name: 'last_name',
      type: 'text',
      value: null
    }, {
      label: 'Middle name',
      name: 'middle_name',
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
      name: 'first_name',
      type: 'text',
      value: user.first_name
    }, {
      label: 'Last name',
      name: 'last_name',
      type: 'text',
      value: user.last_name
    }, {
      label: 'Middle name',
      name: 'middle_name',
      type: 'text',
      value: user.middle_name
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
    setUsers(response.data.table)
    fields.value = response.data.fields

    fields.value.map(f => {
      if (f.default) selectedFields.value.push(f)

      let fieldName = f.related ? f.field+'.name' : f.field
      filters.value[fieldName] = Object.assign({}, {
        'value': null,
        'matchMode': FilterMatchMode.CONTAINS
      })

      console.log(filters.value)
    })
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
          <!-- <Button @click="addUser" class="reddot-button-primary flex border-round-lg py-2 px-4" size="small">
            <font-awesome-icon icon="fa-solid fa-plus" size="xs" />
            &nbsp;Add user
          </Button> -->
        </div>
      </div>
    </div>

    <div class="flex justify-content-between">
      <div class="flex gap-3">
        <Button @click="addUser">
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
                <!-- <div>{{ field.related ? field.field + '.name' : field.field }}</div> -->
              </template>
            </Column>
            <Column :exportable="false" style="min-width:10rem">
              <template #body="slotProps">
                <span class="p-buttonset">
                  <Button icon="pi pi-eye" size="small" severity="primary" />
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