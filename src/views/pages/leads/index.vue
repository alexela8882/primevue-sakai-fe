<script setup>
// --------
// imports
// --------
import { useLayout } from '@/layout/composables/layout'
import { ref, onMounted, onBeforeMount } from 'vue'

// --------
// refs
// --------
const { isDarkTheme } = useLayout()
const leads = ref([
  {
    company: "Unibersidad de La frontera",
    name: "Luis Jacob",
    country: "United Arab Emirates",
    status: "Open",
    sources: "Website",
    lead_owner: "Christia Lagamson",
    created_date: "03/12/2023",
  }, {
    company: "Unibersidad de La frontera",
    name: "Luis Jacob",
    country: "United Arab Emirates",
    status: "Open",
    sources: "Website",
    lead_owner: "Christia Lagamson",
    created_date: "03/12/2023",
  }, {
    company: "Unibersidad de La frontera",
    name: "Luis Jacob",
    country: "United Arab Emirates",
    status: "Open",
    sources: "Website",
    lead_owner: "Christia Lagamson",
    created_date: "03/12/2023",
  }, {
    company: "Unibersidad de La frontera",
    name: "Luis Jacob",
    country: "United Arab Emirates",
    status: "Open",
    sources: "Website",
    lead_owner: "Christia Lagamson",
    created_date: "03/12/2023",
  }, {
    company: "Unibersidad de La frontera",
    name: "Luis Jacob",
    country: "United Arab Emirates",
    status: "Open",
    sources: "Website",
    lead_owner: "Christia Lagamson",
    created_date: "03/12/2023",
  }
])

</script>

<template>
  <div class="flex flex-column gap-3 mb-5 mt-5">
    <div>
      <div class="flex justify-content-between">
        <div class="flex flex-column">
          <span class="text-xl font-bold" :class="`${isDarkTheme ? 'text-surface-50' : 'text-blue-800'}`">Leads</span>
        </div>

        <div>
          <Button class="reddot-primary border-round-3xl py-2 px-4 text-surface-50" size="small">Add new Lead</Button>
        </div>
      </div>
    </div>

    <div class="flex justify-content-between">
      <div>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText placeholder="Search" class="w-full md:w-16rem" />
        </span>
      </div>

      <div class="flex gap-2">
        <Dropdown
          optionLabel="name"
          placeholder="My Team Leads"
          size="small"
          showClear
          class="w-full md:w-16rem" />

        <Dropdown
          optionLabel="name"
          placeholder="Filter"
          size="small"
          showClear
          class="w-full md:w-12rem" />
      </div>
    </div>

    <div>
      <Card>
        <template #content>
          <DataTable
            :value="leads"
            dataKey="country_name"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem">
            <Column field="company" header="Company"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="country" header="Country"></Column>
            <Column field="status" header="Status"></Column>
            <Column field="sources" header="Sources"></Column>
            <Column field="lead_owner" header="Lead Owner"></Column>
            <Column field="created_date" header="Created Date"></Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>

</style>