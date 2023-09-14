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
// components
import FormDialog from '../../../components/dynamic/FormDialog.vue'

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
const { isDarkTheme } = useLayout()
const selectedUsers = ref()
const selectedCountry = ref(null)
const countries = ref([
  { name: 'Philippines'},
  { name: 'Singapore'},
  { name: 'Indonesia'},
])

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
      label: 'Name',
      name: 'name',
      type: 'text',
      value: null
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

onMounted(async () => {
  // fetch users
  await axios.get('/users').then((response) => { setUsers(response.data) })
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
          <InputText placeholder="Search" />
        </span>
      </div>
    </div>

    <div>
      <Card>
        <template #content>
          <DataTable
            v-model:selection="selectedUsers"
            :value="getUsers"
            dataKey="_id"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem">
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="email" header="Email"></Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <FormDialog />
  </div>
</template>

<style scoped>


/* .p-dropdown {
  background-color: var(--blue-200);
  color: var(--surface-800);
} */

</style>