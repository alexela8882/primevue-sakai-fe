<script setup>
// imports
import { onMounted, ref } from 'vue'

const props = defineProps({
  baseModule: Array
})

// refs
const filterByOwnerOverlay = ref(false)
const filterByOwnerOverlay2 = ref(false)
const filterByOwner = ref({
  name: null,
  filters: [],
  fields: { mode: 'new', field: null, operator: null, value: null },
  default: { field: null, operator: null, value: null }
})

// actions
const addFilterByOwner = (event) => {
  filterByOwner.value.fields = Object.assign({}, filterByOwner.value.default)
  filterByOwner.value.fields.mode = 'new'
  filterByOwnerOverlay2.value.toggle(event)
}
const editFilterByOwner = (event, filter, fx) => {
  filterByOwner.value.fields = Object.assign({}, filter)
  filterByOwner.value.fields.index = fx // dummy replacement for id
  filterByOwner.value.fields.mode = 'edit'
  filterByOwnerOverlay2.value.toggle(event)
}
const saveFilterByOwner = (event) => {
  filterByOwnerOverlay2.value.toggle(event)
  filterByOwner.value.filters.push(filterByOwner.value.fields)
}
const updateFilterByOwner = (event, filter) => {
  filterByOwnerOverlay2.value.toggle(event)
  filterByOwner.value.filters[filter.index] = Object.assign({}, filter)
}

// lifecycles
onMounted(() => {
  filterByOwner.value.name = `All ${props.baseModule.name}`
})

</script>

<template>
  <div>
    <div>
      <div class="p-3">
        <div class="text-3xl text-color-secondary">Filters</div>
      </div>
      <divider class="py-0 my-0" />
      <div class="flex flex-column gap-4 p-3 text-600 cursor-pointer">
        <div
          @click="filterByOwnerOverlay.toggle($event)"
          class="flex flex-column gap-2 p-3 border-1 border-400 hover:border-600 hover:surface-100 border-round-md">
          <div>Filter by Owner</div>
          <div class="text-lg text-800">{{ filterByOwner.name }}</div>
        </div>

        <div
          v-if="filterByOwner.filters.length >= 1"
          v-for="(filter, fx) in filterByOwner.filters"
          @click="editFilterByOwner($event, filter, fx)"
          :key="fx"
          class="flex flex-column gap-2 p-3 border-1 border-400 hover:border-600 bg-orange-100 hover:bg-orange-200 border-round-md">
          <div>{{ filter.field.label }}</div>
          <div class="text-lg text-800">{{ filter.operator.label }} "{{ filter.value }}"</div>
        </div>

        <div class="flex justify-content-between">
          <a @click="addFilterByOwner($event)" href="javascript:void(0);">add filter</a>
          <a @click="filterByOwner.filters = []" href="javascript:void(0);">remove all</a>
        </div>
      </div>
    </div>

    <OverlayPanel ref="filterByOwnerOverlay" class="lvf-overlay-panel">
      <div style="width: 30vw;">
        <div class="flex flex-column p-3 text-600 gap-3">
          <div class="text-xl text-color-secondary">Filter by Owner</div>
          <div class="flex flex-column gap-3">
            <div class="flex align-items-center">
              <RadioButton v-model="filterByOwner.name" :inputId="`All ${baseModule.name}`" :value="`All ${baseModule.name}`" />
              <label :for="`All ${baseModule.name}`" class="ml-2">All {{ baseModule.name }}</label>
            </div>
            <div class="flex align-items-center">
              <RadioButton v-model="filterByOwner.name" :inputId="`My ${baseModule.name}`" :value="`My ${baseModule.name}`" />
              <label :for="`My ${baseModule.name}`" class="ml-2">My {{ baseModule.name }}</label>
            </div>
            <div class="flex align-items-center">
              <RadioButton v-model="filterByOwner.name" :inputId="`My team's ${baseModule.name}`" :value="`My team's ${baseModule.name}`" />
              <label :for="`My team's ${baseModule.name}`" class="ml-2">My team's {{ baseModule.name }}</label>
            </div>
          </div>
        </div>
      </div>
    </OverlayPanel>

    <OverlayPanel ref="filterByOwnerOverlay2" class="lvf-overlay-panel" :dismissable="false">
      <div style="width: 30vw;">
        <div class="flex flex-column p-3 text-600 gap-3">
          <div class="text-xl text-color-secondary">Filter by Owner</div>
          <div class="flex flex-column gap-3">
            <Dropdown
              v-model="filterByOwner.fields.field"
              :options="baseModule.fields"
              optionLabel="label"
              placeholder="Select a field"
              class="w-full" />

            <Dropdown
              v-model="filterByOwner.fields.operator"
              :options="[
                { label: 'equals', value: '=' },
                { label: 'greater than', value: '>' },
                { label: 'less than', value: '<' },
                { label: 'contains', value: 'contains' },
                { label: 'not contains', value: 'not_contains' }]"
              optionLabel="label"
              placeholder="Select an operator"
              class="w-full" />

            <inputText v-model="filterByOwner.fields.value" />
          </div>
          <div class="flex justify-content-end gap-2">
            <Button @click="filterByOwnerOverlay2.toggle($event)" outlined label="Cancel" severity="secondary" size="large" />
            <Button
              v-if="filterByOwner.fields.mode === 'new'"
              @click="saveFilterByOwner"
              :disabled="!filterByOwner.fields.field || !filterByOwner.fields.operator || !filterByOwner.fields.value"
              outlined
              label="Done"
              size="large" />
            <Button
              v-else
              @click="updateFilterByOwner($event, filterByOwner.fields)"
              :disabled="!filterByOwner.fields.field || !filterByOwner.fields.operator || !filterByOwner.fields.value"
              outlined
              label="Update"
              size="large" />
          </div>
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<style>
.lvf-overlay-panel.p-overlaypanel .p-overlaypanel-content {
  padding: 0 !important;
}
</style>