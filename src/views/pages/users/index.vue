<script setup>
// --------
// imports
// --------
import { useLayout } from '@/layout/composables/layout'
import { ref, onMounted, onBeforeMount } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

// -----------
// stores
// -----------
const userStore = useUserStore()
const { users, getUsers } = storeToRefs(userStore)
const { setUsers } = userStore

// --------
// refs
// --------
const { isDarkTheme } = useLayout()
const selectedCountry = ref(null)
const countries = ref([
  { name: 'Philippines'},
  { name: 'Singapore'},
  { name: 'Indonesia'},
])
const selectedUsers = ref()
const products = ref([
  {
    country_name: "Philippines",
    region: "Africa",
    electrical_outlet: "Type D",
    plug_code: "D",
    power_supply_1: "ZESA",
    power_supply_2: "ZESA",
  }, {
    country_name: "Singapore",
    region: "Africa",
    electrical_outlet: "Type D",
    plug_code: "D",
    power_supply_1: "ZESA",
    power_supply_2: "ZESA",
  }, {
    country_name: "Indonesia",
    region: "Africa",
    electrical_outlet: "Type D",
    plug_code: "D",
    power_supply_1: "ZESA",
    power_supply_2: "ZESA",
  }
])

onMounted(async () => {
  await axios.get('/users').then((response) => {
    setUsers(response.data)
  })

  console.log(getUsers)
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
          <Button class="reddot-button-primary flex border-round-lg py-2 px-4" size="small">
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
  </div>
</template>

<style scoped>


/* .p-dropdown {
  background-color: var(--blue-200);
  color: var(--surface-800);
} */

</style>