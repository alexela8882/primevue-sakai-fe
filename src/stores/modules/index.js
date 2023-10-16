// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { storeToRefs } from 'pinia'
// stores
import { useBaseStore } from '@/stores/base'

export const useModuleStore = defineStore('moduleStore', () => {

  // refs
  // stores
  const baseStore = useBaseStore()
  const { jsonDbUrl } = storeToRefs(baseStore)
  const moduleLoading = ref(false)
  const collectionLoading = ref(false)

  // states
  const modules = ref([])
  const modulesLoading = ref(false)
  const module = ref({})
  const collection = ref({})

  // getters
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
  const fetchModule = async (id) => {
    moduleLoading.value = true
    const res = await axios(`${jsonDbUrl.value}/modules?_id=${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      module.value = (res.data && res.data.length > 0) ? res.data[0] : res.data
      console.log(module.value)
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
      // console.log(res.data)
    }
    modulesLoading.value = false
  }
  const fetchCollection = async () => {
    collectionLoading.value = true
    const res = await axios(`${jsonDbUrl.value}/collection-leads`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      collection.value = (res.data && res.data.length > 0) ? res.data[0] : res.data
      console.log(collection.value)
    }
    collectionLoading.value = false
  }

  return {
    moduleLoading,
    collectionLoading,
    modulesLoading,
    getModule,
    getModules,
    getCollection,
    getViewFilters,
    getDefaultViewFilter,
    getViewFilter,
    getViewFilterIds,
    getSearchKeyFieldIds,
    fetchModule,
    fetchModules,
    fetchCollection
  }
})