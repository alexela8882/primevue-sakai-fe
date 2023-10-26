<script setup>
// imports
import { onMounted, ref } from 'vue'

const props = defineProps({
  baseModule: Object
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
const addFilterByOwner = () => {
  filterByOwner.value.fields = Object.assign({}, filterByOwner.value.default)
  filterByOwner.value.fields.mode = 'new'
  filterByOwnerOverlay.value = false
  filterByOwnerOverlay2.value = true
}
const editFilterByOwner = (filter, fx) => {
  filterByOwner.value.fields = Object.assign({}, filter)
  filterByOwner.value.fields.index = fx // dummy replacement for id
  filterByOwner.value.fields.mode = 'edit'
  filterByOwnerOverlay.value = false
  filterByOwnerOverlay2.value = true
}
const saveFilterByOwner = () => {
  filterByOwnerOverlay.value = true
  filterByOwnerOverlay2.value = !filterByOwnerOverlay2.value
  filterByOwner.value.filters.push(filterByOwner.value.fields)
}
const updateFilterByOwner = (filter) => {
  filterByOwnerOverlay.value = true
  filterByOwnerOverlay2.value = !filterByOwnerOverlay2.value
  filterByOwner.value.filters[filter.index] = Object.assign({}, filter)
}
const filterByOwnerOverlayAction = () => {
  filterByOwnerOverlay.value = true
  filterByOwnerOverlay2.value = false
}

// lifecycles
onMounted(() => {
  filterByOwner.value.name = `All ${props.baseModule.name}`
  filterByOwnerOverlayAction()
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
          @click="filterByOwnerOverlayAction"
          class="flex flex-column gap-2 p-3 border-1 border-400 hover:border-600 hover:surface-100 border-round-md">
          <div>Filter by Owner</div>
          <div class="text-lg text-800">{{ filterByOwner.name }}</div>
        </div>

        <div
          v-if="filterByOwner.filters.length >= 1"
          v-for="(filter, fx) in filterByOwner.filters"
          @click="editFilterByOwner(filter, fx)"
          :key="fx"
          class="flex flex-column gap-2 p-3 border-1 border-400 hover:border-600 bg-orange-100 hover:bg-orange-200 border-round-md">
          <div>{{ filter.field.label }}</div>
          <div class="text-lg text-800">{{ filter.operator.label }} "{{ filter.value }}"</div>
        </div>

        <div class="flex justify-content-between">
          <a @click="addFilterByOwner" href="javascript:void(0);">add filter</a>
          <a @click="filterByOwner.filters = []" href="javascript:void(0);">remove all</a>
        </div>
      </div>
    </div>

    <Teleport :to="`${filterByOwnerOverlay ? '.ddt-div-1' : '.hidden-div'}`">
      <div class="filter-by-owner flex flex-column p-3 text-600 gap-3">
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
    </Teleport>

    <Teleport :to="`${filterByOwnerOverlay2 ? '.ddt-div-1' : '.hidden-div'}`">
      <div class="filter-by-owner flex flex-column p-3 text-600 gap-3">
        <div class="text-xl text-color-secondary">
          {{ filterByOwner.fields.mode == 'new' ? 'Add filter' : 'Edit filter' }}
        </div>
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
          <Button @click="filterByOwnerOverlayAction" outlined label="Cancel" severity="secondary" size="large" />
          <Button
            v-if="filterByOwner.fields.mode === 'new'"
            @click="saveFilterByOwner"
            :disabled="!filterByOwner.fields.field || !filterByOwner.fields.operator || !filterByOwner.fields.value"
            outlined
            label="Done"
            size="large" />
          <Button
            v-else
            @click="updateFilterByOwner(filterByOwner.fields)"
            :disabled="!filterByOwner.fields.field || !filterByOwner.fields.operator || !filterByOwner.fields.value"
            outlined
            label="Update"
            size="large" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style>
</style>