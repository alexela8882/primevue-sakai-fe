// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
// stores
import { useBaseStore } from '@/stores/base'

export const useModuleStore = defineStore('moduleStore', () => {

  // refs
  const viewFiltersDialogLoading = ref(false)
  const viewFiltersDialogSwitch = ref(false)
  const viewFiltersDialog = ref(false)
  const toast = useToast()
  // stores
  const baseStore = useBaseStore()
  const { jsonDbUrl } = storeToRefs(baseStore)
  const moduleLoading = ref(false)
  const collectionLoading = ref(false)
  // presets
  const perPageItems = ref([
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
    { label: '25', value: 25 },
    { label: '30', value: 30 },
    { label: '35', value: 35 },
    { label: '40', value: 40 },
    { label: '45', value: 45 },
    { label: '50', value: 50 }
  ])
  const newViewFilter = ref({
    error: false,
    data: {
      filterName: null,
      sortField: null,
      sortOrder: null,
      perPage: null,
      fields: [],
      moduleName: null,
      isDefault: false
    },
    default: {
      filterName: null,
      sortField: null,
      sortOrder: null,
      perPage: null,
      fields: [],
      moduleName: null,
      isDefault: false
    }
  })

  // states
  const modules = ref([])
  const modulesLoading = ref(false)
  const baseModule = ref({})
  const module = ref({})
  const collection = ref({})

  // getters
  const getBaseModule = computed(() => baseModule.value)
  const getModule = computed(() => module.value)
  const getModules = computed(() => modules.value)
  const getCollection = computed(() => collection.value)
  const getViewFilters = computed(() => {
    const viewFilters = module.value.viewFilters
    return viewFilters
  })
  const getDefaultViewFilter = computed(() => {
    const moduleFields = module.value && module.value.fields
    const viewFilters = module.value && module.value.viewFilters
    const viewFilter = viewFilters && viewFilters.find(viewFilter => viewFilter.isDefault)

    const filteredFields = moduleFields && moduleFields.filter(field => viewFilter.fields.includes(field._id))

    const finalViewFilter = Object.assign({}, {
      _id: viewFilter && viewFilter._id,
      filterLogic: viewFilter && viewFilter.filterLogic,
      filterName: viewFilter && viewFilter.filterName,
      filters: viewFilter && viewFilter.filters,
      isDefault: viewFilter && viewFilter.isDefault,
      moduleName: viewFilter && viewFilter.moduleName,
      query_id: viewFilter && viewFilter.query_id,
      sortField: viewFilter && viewFilter.sortField,
      sortOrder: viewFilter && viewFilter.sortOrder,
      fields: filteredFields
    })

    return finalViewFilter
  })
  const getViewFilter = computed(() => {
    return (payload) => {
      const moduleFields = module.value && module.value.fields
      const viewFilters = module.value && module.value.viewFilters
      const viewFilter = viewFilters && viewFilters.find(viewFilter => viewFilter._id === payload)

      const filteredFields = moduleFields && moduleFields.filter(field => viewFilter.fields.includes(field._id))

      const finalViewFilter = Object.assign({}, {
        _id: viewFilter && viewFilter._id,
        filterLogic: viewFilter && viewFilter.filterLogic,
        filterName: viewFilter && viewFilter.filterName,
        filters: viewFilter && viewFilter.filters,
        isDefault: viewFilter && viewFilter.isDefault,
        moduleName: viewFilter && viewFilter.moduleName,
        query_id: viewFilter && viewFilter.query_id,
        sortField: viewFilter && viewFilter.sortField,
        sortOrder: viewFilter && viewFilter.sortOrder,
        fields: filteredFields
      })

      return finalViewFilter
    }
  })
  const getViewFilterIds = computed(() => {
    const fieldIds = []
    const viewFilters = module.value && module.value.viewFilters
    viewFilters && viewFilters.map(viewFilter => {
      viewFilter.fields.map(field => {
        fieldIds.push(field)
      })
    })
    return fieldIds
  })
  const getSearchKeyFieldIds = computed(() => {
    const fieldIds = []
    const fields = module.value && module.value.fields
    fields && fields.map(field => {
      if (field.searchKey) fieldIds.push(field._id)
    })
    return fieldIds
  })

  // actions
  const fetchBaseModule = async (id) => {
    moduleLoading.value = true
    const res = await axios(`${jsonDbUrl.value}/modules?_id=${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      baseModule.value = (res.data && res.data.length > 0) ? res.data[0] : res.data
    }
    moduleLoading.value = false
  }
  const fetchModules = async () => {
    modulesLoading.value = true
    const res = await axios(`${jsonDbUrl.value}/modules`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      modules.value = res.data
    }
    modulesLoading.value = false
  }
  const fetchModule = async (moduleName, page) => {
    collectionLoading.value = true
    const uri = page ? `${moduleName}-page-${page}` : `${moduleName}`
    const res = await axios(`${jsonDbUrl.value}/${uri}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      let fetchedModule = (res.data && res.data.length > 0) ? res.data[0] : res.data
      module.value = fetchedModule // insert module
      collection.value = fetchedModule.collection // insert collection
    }
    collectionLoading.value = false
  }
  const addViewFilter = async (payload) => {
    console.log(JSON.stringify(payload))

    // do backend codes here

    // toast
    toast.add({
      severity: 'success',
      summary: 'Success Message',
      detail: 'New view filters successfully added',
      life: 3000
    })
  }

  return {
    perPageItems,
    newViewFilter,
    viewFiltersDialogLoading,
    viewFiltersDialogSwitch,
    viewFiltersDialog,
    moduleLoading,
    collectionLoading,
    modulesLoading,
    getBaseModule,
    getModule,
    getModules,
    getCollection,
    getViewFilters,
    getDefaultViewFilter,
    getViewFilter,
    getViewFilterIds,
    getSearchKeyFieldIds,
    fetchModule,
    fetchBaseModule,
    fetchModules,
    addViewFilter
  }
})