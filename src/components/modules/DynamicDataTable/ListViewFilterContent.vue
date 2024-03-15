<script setup>
// imports
import { computed, onMounted, ref, watch, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useFormDataStore } from '@/stores/forms'
import { useModuleStore } from '@/stores/modules'
// components
const LookupField = defineAsyncComponent(() => import('@/components/modules/Form/LookupField.vue'))

// defines
const props = defineProps({
  baseModule: Object,
  module: Object
})
const emit = defineEmits(['apply-filters'])

// refs
const applyFiltersLoading = ref(false)
const localSaveLoading = ref(false)
const localPickListLoading = ref(false)
const filterByOwnerOverlay = ref(false)
const filterByOwnerOverlay2 = ref(false)
const selectedViewFilter = ref(props.module.viewFilters.find(filter => filter.isDefault))
const filterByOwner = ref({
  queryType: null,
  mode: 'edit',
  queryType: selectedViewFilter.value.queryType,
  filters: selectedViewFilter.value.filters,
  data: { mode: 'new', uuid: null, field: null, operator: null, value: null, isNull: false },
  default: { uuid: null, field: null, operator: null, value: null, isNull: false }
})
// stores
const moduleStore = useModuleStore()
const formDataStore = useFormDataStore()
const { _getFieldDetailsById } = storeToRefs(moduleStore)
const { addViewFilter } = moduleStore
const { getPicklist } = storeToRefs(formDataStore)
const { fetchPicklist } = formDataStore

// actions
const addFilterByOwner = () => {
  filterByOwner.value.data = Object.assign({}, filterByOwner.value.default)
  filterByOwner.value.data.mode = 'new'
  filterByOwnerOverlay.value = false
  filterByOwnerOverlay2.value = true
}
const editFilterByOwner = (filter, fx) => {
  let filterField = _getFieldDetailsById.value({ fields: props.module.fields, _id: filter.field_id })
  let filterOperator = _getFieldDetailsById.value({ fields: getPicklist.value && getPicklist.value.filter_operators.values, _id: filter.operator_id })

  Object.assign(filterByOwner.value.data, {
    uuid: filter.uuid,
    field: filterField,
    operator: filterOperator,
    value: filter.values,
    isNull: filter.isNull
  })

  filterByOwner.value.data.mode = 'edit'
  filterByOwnerOverlay.value = false
  filterByOwnerOverlay2.value = true
}
const saveFilterByOwner = async () => {
  localSaveLoading.value = true

  let reconstructedValues = Object.assign({}, {
    uuid: filterByOwner.value.data.uuid,
    field_id: filterByOwner.value.data.field._id,
    operator_id: filterByOwner.value.data.operator._id,
    values: filterByOwner.value.data.value,
    isNull: filterByOwner.value.data.isNull
  })

  const payload = Object.assign({}, {
    mode: filterByOwner.value.mode,
    baseModule: props.baseModule,
    viewFilter: props.module.viewFilters.find(filter => filter.isDefault)._id,
    type: 'filters',
    data: {
      mode: filterByOwner.value.data.mode,
      queryType: filterByOwner.value.queryType,
      filters: reconstructedValues
    }
  })

  const res = await addViewFilter(payload) // store save/update
  if (res && res.status === 200) {
    if (payload.data.mode === 'new') insertFilter(res.data)
    else updateFilter(res.data.filters[0])
  }
}
const insertFilter = (payload) => {
  if (filterByOwner.value.filters instanceof Array) {
    filterByOwner.value.filters.push(payload)
  } else {
    filterByOwner.value.filters = [] // fix for nulled or empty string filters
    filterByOwner.value.filters.push(payload)
  }

  filterByOwnerOverlay2.value = !filterByOwnerOverlay2.value
  localSaveLoading.value = false
}
const updateFilter = (payload) => {
  filterByOwner.value.filters.map(filter => {
    if (filter.uuid === payload.uuid) Object.assign(filter, payload)
  })

  localSaveLoading.value = false
}
const filterByOwnerOverlayAction = () => {
  filterByOwnerOverlay.value = true
  filterByOwnerOverlay2.value = false
}
const _fetchPickList = async (payload) => {
  await fetchPicklist(payload)
}
const fieldChange = (e) => {
  // reset data value
  filterByOwner.value.data.value = null
}
const applyFilters = async () => {
  applyFiltersLoading.value = true

  const payload = Object.assign({}, {
    mode: filterByOwner.value.mode,
    baseModule: props.baseModule,
    viewFilter: props.module.viewFilters.find(filter => filter.isDefault)._id,
    type: 'filters',
    data: {
      queryType: filterByOwner.value.queryType
    }
  })
  const res = await addViewFilter(payload) // store save/update
  
  if (res && res.status === 200) {
    emit('apply-filters', selectedViewFilter.value)
  }

  applyFiltersLoading.value = false
}

// lifecycles
onMounted(async () => {
  if (Object.keys(getPicklist.value).length === 0) {
    localPickListLoading.value = true
    _fetchPickList('filter_operators')
    localPickListLoading.value = false
  }

  // fetch picklist from filters
  if (
    filterByOwner.value.filters instanceof Array &&
    filterByOwner.value.filters.length > 0
  ) {
    filterByOwner.value.filters.map(filter => {
      const field = _getFieldDetailsById.value({ fields: props.module.fields, _id: filter.field_id })
      _fetchPickList(field.listName)
    })
  }
})

watch(() => filterByOwner.value, (newVal, oldVal) => {
  // console.log(filterByOwner.value)
  // console.log(newVal)
  // reset if has value

  if (newVal.data.field && newVal.data.field.field_type.name === 'picklist') {
    _fetchPickList(newVal.data.field.listName) // fetch
  }
}, {
  deep: true
})

</script>

<template>
  <Card style="overflow: hidden" class="">
    <template #title>Filters</template>
    <template #content>
      <!-- <pre>{{ filterByOwner.filters }}</pre> -->
      <div>
        <div class="relative flex flex-column gap-4 text-600">
          <div
            @click="filterByOwnerOverlayAction"
            class="flex flex-column gap-2 p-3 border-1 border-400 hover:border-600 hover:surface-100 border-round-md cursor-pointer">
            <div>Filter by</div>
            <div class="text-lg text-800">{{ filterByOwner.queryType }}</div>
          </div>

          <div
            v-if="filterByOwner.filters instanceof Array && filterByOwner.filters.length >= 1"
            v-for="(filter, fx) in filterByOwner.filters"
            @click="editFilterByOwner(filter, fx)"
            :key="fx"
            class="flex flex-column gap-2 p-3 border-1 border-400 hover:border-600 bg-orange-100 hover:bg-orange-200 border-round-md cursor-pointer">
            <div>
              {{ _getFieldDetailsById({
                  fields: module.fields,
                  _id: filter.field_id
                }).label
              }}</div>
            <div class="text-lg text-800">
              <div v-if="getPicklist.filter_operators" class="font-italic">
                {{ getPicklist.filter_operators.values.find(op => op._id === filter.operator_id).label }}
              </div>
              <div class="flex flex-wrap mt-2 text-xs white-space-nowrap">
                <div v-if="filter.isNull">
                  Null
                </div>
                <div v-else>
                  <div v-if="
                    _getFieldDetailsById({ fields: module.fields, _id: filter.field_id }).field_type.name === 'text' ||
                    _getFieldDetailsById({ fields: module.fields, _id: filter.field_id }).field_type.name === 'boolean' ||
                    _getFieldDetailsById({ fields: module.fields, _id: filter.field_id }).field_type.name === 'date'
                  ">
                    {{ filter.values }}
                  </div>
                  <div
                    v-else-if="
                      _getFieldDetailsById({ fields: module.fields, _id: filter.field_id }).field_type.name === 'picklist' ||
                      _getFieldDetailsById({ fields: module.fields, _id: filter.field_id }).field_type.name === 'lookupModel'
                    "
                    v-for="(val, vx) in filter.values"
                    :key="vx"
                    severity="secondary"
                  >
                    <div>
                      {{
                        _getFieldDetailsById({
                          fields: getPicklist[_getFieldDetailsById({ fields: module.fields, _id: filter.field_id }).listName] && getPicklist[_getFieldDetailsById({ fields: module.fields, _id: filter.field_id }).listName].values,
                          _id: val
                        }) &&
                        _getFieldDetailsById({
                          fields: getPicklist[_getFieldDetailsById({ fields: module.fields, _id: filter.field_id }).listName] && getPicklist[_getFieldDetailsById({ fields: module.fields, _id: filter.field_id }).listName].values,
                          _id: val
                        }).value
                      }},&nbsp;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-content-between">
            <a @click="addFilterByOwner()" href="javascript:void(0);">add filter</a>
            <!-- <a @click="filterByOwner.filters = []" href="javascript:void(0);">remove all</a> -->
          </div>
        </div>
      </div>

      <Teleport :to="`${filterByOwnerOverlay ? '.ddt-div-1' : '.hidden-div'}`">
        <div class="filter-by-owner flex flex-column p-3 text-600 gap-3">
          <div class="text-xl text-color-secondary">Filter by</div>
          <div class="flex flex-column gap-3">
            <div class="flex align-items-center">
              <RadioButton v-model="filterByOwner.queryType" :inputId="`All ${baseModule.name}`" value="all" />
              <label :for="`All ${baseModule.name}`" class="ml-2">All {{ baseModule.name }}</label>
            </div>
            <div class="flex align-items-center">
              <RadioButton v-model="filterByOwner.queryType" :inputId="`My ${baseModule.name}`" value="owned" />
              <label :for="`My ${baseModule.name}`" class="ml-2">My {{ baseModule.name }}</label>
            </div>
            <div class="flex align-items-center justify-content-end">
              <Button @click="filterByOwnerOverlay = false" label="DONE" outlined size="large"></Button>
            </div>
          </div>
        </div>
      </Teleport>

      <Teleport :to="`${filterByOwnerOverlay2 ? '.ddt-div-1' : '.hidden-div'}`">
        <div class="filter-by-owner flex flex-column p-3 text-600 gap-3">
          <div class="text-xl font-bold text-color-secondary">
            {{ filterByOwner.data.mode == 'new' ? 'Add filter' : 'Edit filter' }}
          </div>
          <div class="flex flex-column gap-3">
            <Dropdown
              v-model="filterByOwner.data.field"
              @change="fieldChange($event)"
              :options="module.fields"
              optionLabel="label"
              placeholder="Select a field"
              class="w-full"
              filter />

            <Dropdown
              v-model="filterByOwner.data.operator"
              :options="getPicklist.filter_operators && getPicklist.filter_operators.values"
              optionLabel="label"
              placeholder="Select an operator"
              class="w-full" />

            <div v-if="filterByOwner.data.field && filterByOwner.data.field.field_type.name === 'boolean'">
              <Checkbox
                v-model="filterByOwner.data.value"
                binary
                variant="filled"
                inputId="isBool"
                :disabled="filterByOwner.data.isNull" />
              <label for="isBool" class="ml-2">
                {{ filterByOwner.data.value instanceof Array ? filterByOwner.data.value[0] : filterByOwner.data.value }}
              </label>
            </div>

            <Calendar
              v-else-if="filterByOwner.data.field && filterByOwner.data.field.field_type.name === 'date'"
              v-model="filterByOwner.data.value"
              :disabled="filterByOwner.data.isNull" />

            <div v-if="filterByOwner.data.field && filterByOwner.data.field.field_type.name === 'lookupModel'">
              <LookupField
                v-model="filterByOwner.data.value"
                :field="filterByOwner.data.field"
                keyName=""
                :formField="false"
                :inline="true"
                :module="module.name"
                optionValue="_id"
                :entity="filterByOwner.data.field.entity.name" />
            </div>

            <MultiSelect
              v-else-if="filterByOwner.data.field && filterByOwner.data.field.field_type.name === 'picklist'"
              v-model="filterByOwner.data.value"
              :options="getPicklist[filterByOwner.data.field.listName] && getPicklist[filterByOwner.data.field.listName].values"
              optionLabel="value"
              optionValue="_id"
              placeholder="Select"
              :maxSelectedLabels="3"
              :disabled="filterByOwner.data.isNull"
              class="w-full" />

            <inputText
              v-else-if="filterByOwner.data.field && filterByOwner.data.field.field_type.name === 'text'"
              v-model="filterByOwner.data.value" :disabled="filterByOwner.data.isNull" />

            <div>
              <Checkbox
                v-model="filterByOwner.data.isNull"
                binary
                variant="filled"
                inputId="isNull" />
              <label for="isNull" class="ml-2">
                Is Null
              </label>
            </div>
          </div>
          <div class="flex justify-content-end gap-2">
            <!-- {{ filterByOwner.data && filterByOwner.data.operator }} -->
            <Button
              @click="filterByOwnerOverlay2 = false"
              :disabled="localSaveLoading"
              outlined
              label="Cancel"
              severity="secondary"
              size="small" />
            <Button
              v-if="filterByOwner.data.mode === 'new'"
              @click="saveFilterByOwner()"
              :disabled="!filterByOwner.data.field || !filterByOwner.data.operator || localSaveLoading"
              :loading="localSaveLoading"
              outlined
              label="Done"
              size="small" />
            <Button
              v-else
              @click="saveFilterByOwner()"
              :disabled="!filterByOwner.data.field || !filterByOwner.data.operator || localSaveLoading"
              :loading="localSaveLoading"
              outlined
              label="Update"
              size="small" />
          </div>
        </div>
      </Teleport>
    </template>
    <template #footer>
      <div class="sticky top-0">
        <Button
          @click="applyFilters()"
          :loading="applyFiltersLoading"
          label="Apply filter"
          size="small" />
      </div>
    </template>
  </Card>
</template>

<style>
</style>