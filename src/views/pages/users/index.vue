<script setup>
// --------
// imports
// --------
import { useLayout } from '@/layout/composables/layout'
import { ref, onMounted, defineAsyncComponent } from 'vue'
import axios from 'axios'
import { storeToRefs } from 'pinia'
// stores
import { useUserStore } from '@/stores/user'
import { useGeneralStore } from '@/stores/general'
// primevue
import { FilterMatchMode } from 'primevue/api'
// components
import DataTable from '../../../components/dynamic/DataTable.vue'

// dynamic components
// const DataTable = defineAsyncComponent(() =>
//   import('../../../components/dynamic/DataTable.vue')
// )

// -----------
// stores
// -----------
// user store
const userStore = useUserStore()
const { getUsers } = storeToRefs(userStore)
const { setUsers } = userStore
// general store
const generalStore = useGeneralStore()
const { popUpModalOpen, formModalOpen, formModalTrigger, popUpModalTrigger } = storeToRefs(generalStore)
const { popUpModalDataFill, formModalDataFill } = generalStore

// --------
// refs
// --------
const localLoading = ref(false)
const { isDarkTheme } = useLayout()
const data = ref({})
const branches = ref([])

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
  formModalTrigger.value = true
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
  formModalTrigger.value = true
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
  popUpModalTrigger.value = true
}

onMounted(async () => {
  localLoading.value = true
  // fetch users
  await axios.get('/users').then((response) => {
    setUsers(response.data.table)
    data.value = response.data
  })

  // fetch branches
  await axios.get('/branches').then((response) => {
    branches.value = response.data.table
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

    <DataTable
      @add-item="addUser"
      @edit-item="editUser"
      @delete-item="deleteUser"
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