<script setup>
// --------
// imports
// --------
import { useLayout } from '@/layout/composables/layout'
import { ref, onMounted, onBeforeMount } from 'vue'
import RdBreadCrumbs from '../../../components/RdBreadCrumbs.vue'

// --------
// refs
// --------
const { isDarkTheme } = useLayout()
const bcrumbs = ref([])
const camp_info_1 = ref([
  { label: 'Campaign name', value: 'Thai medical exhibition' },
  { label: 'Parent campaign', value: 'Website - Thailand RFQ Form' },
  { label: 'Country', value: 'Thailand' },
  { label: 'Venue', value: 'Bumrungad hospital' },
  { label: 'Exhibition frequency', value: '1 week' },
  { label: 'No of registrant', value: '598' },
  { label: 'Number of attendees', value: '475' },
])

const camp_info_2 = ref([
  { label: 'Campaign status', value: 'active' },
  { label: 'Booth size (sqm)', value: '24' },
  { label: 'Currency', value: 'Scientific' },
  { label: 'Campaign owner', value: 'Scientific' },
  { label: 'Status', value: '1' },
  { label: 'Type', value: 'Scientific' },
  { label: 'Description', value: 'Closing meeting' },
])

bcrumbs.value = [
  { label: 'Campaign', to: '/campaigns', icon: 'pi pi-home' },
  { label: 'Thai medical exhibition', to: null },
]

// ----------------------
// computed properties
// ----------------------


</script>

<template>
  <div>
    <div class="flex justify-content-between align-items-center">
      <div>
        <RdBreadCrumbs :bcrumbs="bcrumbs" />
      </div>

      <div class="flex gap-2">
        <Button class="reddot-button-secondary flex border-round-lg py-2 px-4" size="small">
          Edit
          <font-awesome-icon icon="fa-solid fa-pen" size="xs" class="ml-3" />
        </Button>

        <Button class="reddot-button-danger flex border-round-lg py-2 px-4" size="small">
          Delete
          <font-awesome-icon icon="fa-solid fa-trash" size="xs" class="ml-3" />
        </Button>
      </div>
    </div>

    <div class="flex flex-column gap-4">
      <div class="flex gap-2">
        <Button
          class="reddot-button-primary flex border-round-lg py-2 px-4"
          size="small">Campaign Information
        </Button>
        <Button
          class="reddot-button-primary flex border-round-lg py-2 px-4"
          size="small">Planning
        </Button>
        <Button
          class="reddot-button-primary flex border-round-lg py-2 px-4"
          size="small">Campaign Statistics
        </Button>
      </div>

      <div>
        <div class="bg-white border-round">
          <div class="font-bold text-cyan-800 bg-cyan-200 py-3 px-5 border-round-top-md">
            Campaign Information
          </div>
          <div class="p-5 pb-0">
            <div class="grid">
              <div class="col-12 md:col-6">
                <div v-for="(ci, i) in camp_info_1" :class="`${i + 1 !== camp_info_1.length && 'mb-4'}`">
                  <div class="grid font-bold text-cyan-600">
                    <div class="col-6 capitalize">
                      {{ ci.label }}
                    </div>
                    <div class="col-6 capitalize text-cyan-800">
                      {{ ci.value }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 md:col-6">
                <div v-for="(ci, i) in camp_info_2" :class="`${i + 1 !== camp_info_2.length && 'mb-4'}`">
                  <div class="grid font-bold text-cyan-600">
                    <div class="col-6 capitalize">
                      {{ ci.label }}
                    </div>
                    <div class="col-6 capitalize text-cyan-800">
                      {{ ci.value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-cyan-200 py-3 px-5">Planning</div>
          <div class="p-5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>

          <div class="bg-cyan-200 py-3 px-5">Campaign Statistics</div>
          <div class="p-5">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.p-panel .p-panel-header {
  border: transparent !important;
  background-color: var(--cyan-100);
}
.p-panel .p-panel-content {
  border: transparent !important;
}

</style>