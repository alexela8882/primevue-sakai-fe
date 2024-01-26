// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// import fs from 'fs'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
// stores
import { useBaseStore } from '@/stores/base'

export const useModuleStore = defineStore('moduleStore', () => {
  // refs
  const convertMailboxDialog = ref(false)
  const convertMailboxLoading = ref(false)
  const moduleLoading = ref(false)
  const collectionLoading = ref(false)
  const listViewFilterOverlay = ref(false)
  const viewFiltersDialogLoading = ref(false)
  const viewFiltersDialogSwitch = ref(false)
  const viewFiltersDialog = ref(false)
  const toast = useToast()
  // stores
  const baseStore = useBaseStore()
  const { jsonDbUrl } = storeToRefs(baseStore)
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
  const viewFilterData = ref({
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
  const getEntity = computed(() => {
    return (payload) => {
      const entity = modules.value.find(module => module.mainEntity === payload)
      let obj = Object.assign({}, {
        name: entity.name,
        label: entity.label,
        mainEntity: entity.mainEntity
      })
      return obj
    }
  })
  const getEntityByName = computed(() => {
    return (payload) => {
      return modules.value.find(module => module.name === payload)
    }
  })
  const getDefaultViewFilter = computed(() => {
    const moduleFields = module.value && module.value.fields
    const viewFilters = module.value && module.value.viewFilters
    const viewFilter = viewFilters && viewFilters.find(viewFilter => viewFilter.isDefault)

    return getReconstructedViewFilter.value(viewFilter)

    // const filteredFields = moduleFields && moduleFields.filter(field => viewFilter.fields.includes(field._id))

    // const finalViewFilter = Object.assign({}, {
    //   _id: viewFilter && viewFilter._id,
    //   filterLogic: viewFilter && viewFilter.filterLogic,
    //   filterName: viewFilter && viewFilter.filterName,
    //   filters: viewFilter && viewFilter.filters,
    //   isDefault: viewFilter && viewFilter.isDefault,
    //   moduleName: viewFilter && viewFilter.moduleName,
    //   query_id: viewFilter && viewFilter.query_id,
    //   sortField: viewFilter && viewFilter.sortField,
    //   sortOrder: viewFilter && viewFilter.sortOrder,
    //   fields: filteredFields
    // })

    // return finalViewFilter
  })
  const getViewFilter = computed(() => {
    return (payload) => {
      const moduleFields = module.value && module.value.fields
      const viewFilters = module.value && module.value.viewFilters
      const viewFilter = viewFilters && viewFilters.find(viewFilter => viewFilter._id === payload)

      return getReconstructedViewFilter.value(viewFilter)

      // const filteredFields = moduleFields && moduleFields.filter(field => viewFilter.fields.includes(field._id))

      // const finalViewFilter = Object.assign({}, {
      //   _id: viewFilter && viewFilter._id,
      //   filterLogic: viewFilter && viewFilter.filterLogic,
      //   filterName: viewFilter && viewFilter.filterName,
      //   filters: viewFilter && viewFilter.filters,
      //   isDefault: viewFilter && viewFilter.isDefault,
      //   moduleName: viewFilter && viewFilter.moduleName,
      //   query_id: viewFilter && viewFilter.query_id,
      //   sortField: viewFilter && viewFilter.sortField,
      //   sortOrder: viewFilter && viewFilter.sortOrder,
      //   fields: filteredFields
      // })

      // return finalViewFilter
    }
  })
  
  const getReconstructedViewFilter = computed(() => {
    return (payload) => {
      const moduleFields = module.value && module.value.fields
      const viewFilter = payload

      const filteredFields = moduleFields && moduleFields.filter(field => viewFilter.fields.includes(field._id))

      const finalViewFilter = Object.assign({}, {
        _id: viewFilter && viewFilter._id,
        filterLogic: viewFilter && viewFilter.filterLogic,
        filterName: viewFilter && viewFilter.filterName,
        filters: viewFilter && viewFilter.filters,
        isDefault: viewFilter && viewFilter.isDefault,
        currentDisplay: viewFilter && viewFilter.currentDisplay,
        summarize_by: viewFilter && viewFilter.summarize_by,
        group_by: viewFilter && viewFilter.group_by,
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
  const getKanbanData = computed(() => {
    return (payload) => {
      const collectionData = module.value && module.value.collection.data
      const viewFilter = module.value && module.value.viewFilters.find(vFilter => vFilter._id === payload)
      const groupByField = module.value && module.value.fields.find(f => f._id === viewFilter.group_by)

      const groupByColumns = collectionData.map((cdata, idx) => cdata[groupByField.name])
      const uniqueGroupByColumns = [...new Set(groupByColumns)]
      const finalData = uniqueGroupByColumns.map(col => {
        let obj = Object.assign({}, {
          _id: viewFilter.group_by,
          name: groupByField.name,
          label: col,
          data: [],
          fields: []
        })

        const _data = collectionData.filter(cdatax => {
          if (cdatax[groupByField.name] === col) return cdatax
        })

        obj.data = _data

        return obj
      })

      return finalData
    }
  })
  const getFieldDetails = computed(() => {
    return (payload) => { // supply `name` column from `fields` collection
      const fields = module.value && module.value.fields
      const field = fields.find(fx => fx.name === payload)
      return field
    }
  })
  const getFieldDetailsById = computed(() => {
    return (payload) => { // supply `name` column from `fields` collection
      const fields = getModule.value.fields
      const field = fields && fields.find(fx => fx._id === payload)
      return field
    }
  })
  const getFieldDetailsByUname = computed(() => {
    return (payload) => { // supply `name` column from `fields` collection
      const fields = getModule.value.fields
      const field = fields && fields.find(fx => fx.uniqueName === payload)
      return field
    }
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

    try {
      const res = await axios(`${jsonDbUrl.value}/${uri}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
  
      if (res.status === 200) {
        let fetchedModule = (res.data && res.data.length > 0) ? res.data[0] : res.data
        module.value = fetchedModule // insert module
        collection.value = fetchedModule.collection // insert collection
        collectionLoading.value = false
      }
    } catch (error) {
      console.log(error.response)
      module.value = {}
      collection.value = []

      collectionLoading.value = false
    }
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

  // specific actions for inquiry module
  const convertMailboxToInquiry = async (payload) => {
    convertMailboxLoading.value = true

    const uri = 'inquiries'
    const getRes = await axios(`${jsonDbUrl.value}/${uri}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    let updatedJson = getRes.data.collection.data.push(payload)
    updatedJson = JSON.stringify(getRes.data)

    try {
      const res = await axios(`${jsonDbUrl.value}/${uri}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: updatedJson
      })

      if (res && res.status === 200) {
        // toast
        toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: 'Convert successful',
          life: 3000
        })

        convertMailboxLoading.value = true
        convertMailboxDialog.value = false

        return res
      }
    } catch (error) {
      console.log(error)

      convertMailboxLoading.value = true
      convertMailboxDialog.value = false
    }
  }
  const insertModuleFromMailbox = async (payload) => {
    convertMailboxLoading.value = true

    const uri = payload.module.name
    const getRes = await axios(`${jsonDbUrl.value}/${uri}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    let updatedJson = getRes.data.collection.data.push(payload.data)
    updatedJson = JSON.stringify(getRes.data)

    try {
      const res = await axios(`${jsonDbUrl.value}/${uri}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        data: updatedJson
      })

      if (res && res.status === 200) {
        // toast
        toast.add({
          severity: 'success',
          summary: 'Success Message',
          detail: `New ${payload.module.label} successfully added`,
          life: 3000
        })

        convertMailboxLoading.value = true
        convertMailboxDialog.value = false

        return res
      }
    } catch (error) {
      console.log(error)

      // toast
      toast.add({
        severity: 'danger',
        summary: 'Error',
        detail: error,
        life: 3000
      })

      convertMailboxLoading.value = true
      convertMailboxDialog.value = false
    }
  }

  return {
    perPageItems,
    viewFilterData,
    getReconstructedViewFilter,
    listViewFilterOverlay,
    convertMailboxLoading,
    viewFiltersDialogLoading,
    viewFiltersDialogSwitch,
    viewFiltersDialog,
    convertMailboxDialog,
    moduleLoading,
    collectionLoading,
    modulesLoading,
    getBaseModule,
    getModule,
    getModules,
    getCollection,
    getViewFilters,
    getEntity,
    getEntityByName,
    getDefaultViewFilter,
    getViewFilter,
    getViewFilterIds,
    getSearchKeyFieldIds,
    getKanbanData,
    getFieldDetails,
    getFieldDetailsById,
    getFieldDetailsByUname,
    fetchModule,
    fetchBaseModule,
    fetchModules,
    addViewFilter,

    // specific functions for inquiry module
    convertMailboxToInquiry,
    insertModuleFromMailbox
  }
})