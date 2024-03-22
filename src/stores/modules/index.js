// imports
import { defineStore } from 'pinia'
import { ref, reactive, shallowRef, computed } from 'vue'
// import fs from 'fs'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
import _, { filter } from 'lodash'
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
  const { jsonDbUrl, getAuthUser } = storeToRefs(baseStore)
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
      pageSize: null,
      fields: [],
      moduleName: null,
      isDefault: false
    },
    default: {
      filterName: null,
      sortField: null,
      sortOrder: null,
      pageSize: null,
      fields: [],
      moduleName: null,
      isDefault: false
    }
  })

  // states
  const jsonModules = ref([])
  const modules = ref([])
  const modulesLoading = ref(false)
  const baseModule = ref({})
  const module = ref({})
  const linkedModuleData = ref(null)
  const collection = ref({})
  const entityFields = ref({})

  // getters
  const getBaseModule = computed(() => baseModule.value)
  const getModule = computed(() => module.value)
  const getModuleByName = computed(() => module => {
    return _.find(getModules.value,{'name':module})
  })
  const getModulesUserCanAccess = computed(() => {
    return _.reduce(modules.value, function(res,v,i){
      if(_.includes(_.get(getAuthUser.value,'permissions',[]),v.name+'.index')){
        res.push(v._id)
      }
      return res
    },[])
  })
  const getLinkedModuleData = computed(() => linkedModuleData.value)
  const getModules = computed(() => {
    return getModulesWithPermissions.value(modules.value)
  })
  const getModulesWithPermissions = computed(() => {
    return (modules) => {
      let modulesWithPermissions = modules.map(module => {
        const permissions = getAuthUser.value && getAuthUser.value.permissions
          .filter(str => str.startsWith(module.name + "."))
          .map(str => str.split('.')[1])
  
        let obj = Object.assign({}, {
          ...module,
          permissions: permissions
        })
        return obj
      })
      return modulesWithPermissions
    }
  })
  const getModuleWithPermissions = computed(() => {
    return (payload, field = null) => {
      console.log(payload)
      console.log(field)
      let result = null

      if (!field) result = getModules.value.find(module => module._id === payload._id)
      else {
        if (getModules.value.find(module => module._id === payload._id)) {
          result = getModules.value.find(module => module._id === payload._id)[field]
        } result = []
      }

      return result
    }
  })
  const getJsonModules = computed(() => jsonModules.value)
  const getCollection = computed(() => collection.value)
  const getCollectionById = computed(() => {
    return (id) => {
      const data = collection.value.data && collection.value.data.find(c => c._id == id)
      return data
    }
  })
  const _getViewFilters = computed(() => {
    return (payload) => {
      return getViewFilters.value(payload)
    }
  })
  const getViewFilters = computed(() => {
    return (payload) => {
      let _module = null

      if (payload) _module = payload
      else _module = module.value

      const viewFilters = _module.viewFilters
      return viewFilters
    }
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
  const _getDefaultViewFilter = computed(() => {
    return (payload) => {
      return getDefaultViewFilter.value(payload)
    }
  })
  const getDefaultViewFilter = computed(() => {
    return (payload) => {
      let _module = null

      if (payload) _module = payload
      else _module = module.value && module.value

      const moduleFields = _module.fields
      const viewFilters = _module.viewFilters
      const viewFilter = viewFilters && viewFilters.find(viewFilter => viewFilter.isDefault)

      console.log(viewFilter)

      return getReconstructedViewFilter.value(viewFilter, _module ? _module : null)
    }
  })
  const _getViewFilter = computed(() => {
    return (payload) => {
      const viewFilters = payload.module && payload.module.viewFilters
      const viewFilter = viewFilters && viewFilters.find(viewFilter => viewFilter._id === payload.id)

      const reconstructedViewFilter = getReconstructedViewFilter.value(viewFilter, payload.module)
      return reconstructedViewFilter
    }
  })
  const __getViewFilter = computed(() => { // re-constructed view filter
    return (id, _module) => {
      return getViewFilter.value(id, _module)
    }
  })
  const getViewFilter = computed(() => {
    return (payload, _module = null) => {
      let __module = null

      if (_module) __module = _module
      else __module = module.value

      const viewFilters = __module && __module.viewFilters
      const viewFilter = viewFilters && viewFilters.find(viewFilter => viewFilter._id == payload)

      return getReconstructedViewFilter.value(viewFilter, __module)
    }
  })
  const getReconstructedViewFilter = computed(() => {
    return (payload, _module) => {
      let moduleFields = null
      if (_module) moduleFields = _module.fields
      else moduleFields = module.value && module.value.fields
      const viewFilter = payload

      const filteredFields = moduleFields && moduleFields.filter(field => viewFilter && viewFilter.fields.includes(field._id))

      const finalViewFilter = Object.assign({}, {
        ...viewFilter,
        fields: filteredFields
      })

      return finalViewFilter
    }
  })
  const _getViewFilterIds = computed(() => {
    return (module) => {
      const fieldIds = []
      const viewFilters = module && module.viewFilters
      viewFilters && viewFilters.map(viewFilter => {
        viewFilter.fields.map(field => {
          fieldIds.push(field)
        })
      })
      return fieldIds
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
  const _getSearchFields = computed(() => {
    return (payload) => {
      return getSearchFields.value(payload)
    }
  })
  const getSearchFields = computed(() => {
    return (payload) => {
      let _module = null

      if (payload) _module = payload
      else _module = module.value

      let newFields = []
      // const defaultViewFilter = _module.viewFilters.find(filter => filter.isDefault)

      // if (defaultViewFilter && defaultViewFilter.search_fields.length > 0) {
      //   defaultViewFilter.search_fields.map(field => {
      //     let _field = _getFieldDetailsById.value({ fields: _module.fields, _id: field })
      //     newFields.push(_field)
      //   })
      // } else {
        
      // }

      _module.fields.map(field => {
        if (
          field.field_type.name !== 'date' &&
          field.field_type.name !== 'boolean' &&
          field.field_type.name !== 'time' &&
          field.field_type.name !== 'file' &&
          field.field_type.name !== 'image' &&
          field.field_type.name !== 'richTextbox' &&
          field.field_type.name !== 'password' &&
          field.field_type.name !== 'longText' &&
          field.field_type.name !== 'number' &&
          field.field_type.name !== 'currency' &&
          field.field_type.name !== 'list' &&
          field.field_type.name !== 'percentage'
        ) {
          newFields.push(field)
        }
      })

      return newFields
    }
  })
  const _getSearchKeyFields = computed(() => {
    return (payload) => {
      let fields = getSearchFields.value(payload)
      return fields.filter(field => field.searchKey).map(field => field)
    }
  })
  const _getSearchKeyFieldIds = computed(() => {
    return (payload) => {
      let fields = _getSearchKeyFields.value(payload)
      return fields.filter(field => field.searchKey).map(field => field._id)
    }
  })
  const _getKanbanData = computed(() => {
    return (payload) => {
      return getKanbanData(payload)
    }
  })
  const getKanbanData = computed(() => {
    return (payload) => {
      let module = null

      if (payload.module) module = payload.module
      else module = module.value

      const collectionData = module.data
      const viewFilter = module.viewFilters.find(vFilter => vFilter._id === payload._id)
      const groupByField = module.fields.find(f => f._id === viewFilter.group_by)

      console.log(module)
      console.log(groupByField)

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
  const _getFieldDetails = computed(() => {
    return (payload) => {
      const fields = payload.module.fields
      const field = fields.find(fx => fx.name === payload.field)
      return field
    }
  })
  const getFieldDetails = computed(() => {
    return (payload) => { // supply `name` column from `fields` collection
      const fields = module.value && module.value.fields
      const field = fields.find(fx => fx.name === payload)
      return field
    }
  })
  const _getFieldDetailsById = computed(() => {
    return (payload) => { // supply `name` column from `fields` collection
      const fields = payload.fields
      const field = fields && fields.find(fx => fx._id == payload._id)
      // console.log(fields)
      // console.log(payload)
      // console.log(field)
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
  const getEntityFields = computed(() => {
    return (entity) => { 
      let fields = []
      if(_.has(entityFields.value,entity))
        fields = entityFields.value[entity]
      return fields
    }
  })

  // actions
  const fetchModules = async () => {
    modulesLoading.value = true
    // console.log('fetchModules')

    // modules from BE api
    const res = await axios(`/modules`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      modules.value = res.data.data
    }

    // modules from db3.json
    // const jsonRes = await axios(`${jsonDbUrl.value}/modules`, {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' }
    // })

    // if (jsonRes.status === 200) {
    //   console.log(jsonRes)
    //   jsonModules.value = jsonRes.data
    // }

    modulesLoading.value = false
  }
  const fetchModuleFields = async (module) => {
    const res = await axios(`/getModuleFields?entity-name=${module}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      let index = _.findIndex(getModules.value,{'mainEntity':module})
      if(index > -1){
        getModules.value[index]['fields'] = res.data.data
      }else{
        entityFields.value[module] = res.data.data
      }
    }
  }
  const fetchModulePanels = async (module) => {
    const res = await axios(`/getModulePanels?module-name=${module}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      let index = _.findIndex(getModules.value,{'name':module})
      if(index > -1){
        // modules.value[index]['panels'] = res.data[0]['data']
        getModules.value[index]['panels'] = res.data.data
      }
    }
  }
  const fetchBaseModule = async (id) => {
    moduleLoading.value = true
    // console.log('fetchBaseModule')
    // const res = await axios(`${jsonDbUrl.value}/modules?_id=${id}`, {
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' }
    // })

    // if (res.status === 200) {
    //   baseModule.value = (res.data && res.data.length > 0) ? res.data[0] : res.data
    // }

    baseModule.value = getModules.value.find(module => module._id === id)

    moduleLoading.value = false
  }
  const _fetchBaseModuleByField = async (payload) => {
    return fetchBaseModuleByField(payload, true)
  }
  const fetchBaseModuleByField = async (payload, reuse) => {
    if (!reuse) moduleLoading.value = true
    const res = await axios(`/modules?${payload.field}=${payload.value}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      console.log(res)
      if (!reuse) {
        baseModule.value = res.data.data
        moduleLoading.value = false
      } else return res.data.data
    }
  }
  const fetchModule = async (payload) => {
    console.log(payload)
    if (!payload.reuse) collectionLoading.value = true
    // const uri = page ? `${moduleName}-page-${page}` : `${moduleName}`
    let baseUri = `/modules/${payload.moduleName}`
    let pageUri = payload.page ? `?page=${payload.page}` : '?page=1'
    let limitUri = payload.per_page ? `&pageSize=${payload.per_page}` : ''
    let viewFilterUri = payload.viewFilter ? `&viewfilter=${payload.viewFilter}` : ''
    let listOnlyUri = payload.listOnly ? `&listOnly` : ''
    let searchUri = payload.search ? `&search=${payload.search}` : ''
    let uri = `${baseUri}${pageUri}${limitUri}${viewFilterUri}${listOnlyUri}${searchUri}`

    // search fields
    let checkSearchFields = payload.searchFields && payload.searchFields.length > 0
    if (checkSearchFields) {
      payload.searchFields.map(field => {
        const value = Object.values(field)[0]
        uri += `&searchFields[]=${value}`
      })
    }

    try {
      // const res = await axios(`${jsonDbUrl.value}/${uri}`, {
      //   method: 'GET',
      //   headers: { 'Content-Type': 'application/json' }
      // })
      const res = await axios(`${uri}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
  
      if (res.status === 200) {
        // let fetchedModule = (res.data && res.data.length > 0) ? res.data[0] : res.data
        let fetchedModule = res.data

        module.value = fetchedModule // insert module
        collection.value = fetchedModule.data // insert collection
        collectionLoading.value = false

        let refetchedModule = null
        // fill modules with fields & panels
        getModules.value.map(m => {
          if (m.name === payload.moduleName) {
            let obj = Object.assign({}, {
              ...m,
              data: fetchedModule.data,
              meta: fetchedModule.meta,
              permissions: m.permissions,
              fields: checkSearchFields ? m.fields : fetchedModule.fields,
              panels: checkSearchFields ? m.panels : fetchedModule.panels,
              viewFilters: checkSearchFields ? m.viewFilters : fetchedModule.viewFilters
            })
            Object.assign(m, obj)
            refetchedModule = obj
          }
        })

        // to trigger change in getModules getter
        modules.value.map(module => {
          if (module._id === refetchedModule._id) Object.assign(module, refetchedModule)
        })

        return refetchedModule
      }
    } catch (error) {
      module.value = {}
      collection.value = []

      collectionLoading.value = false

      // toast
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error,
        life: 3000
      })
    }
  }
  const _fetchModule = async (payload) => {
    let fetchedModule = await fetchModule(payload)
    return fetchedModule
  }
  const fetchLinkedModuleData = async (payload) => {
    try {
      const res = await axios(`/${payload.module}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
  
      if (res.status === 200) {
        let fetchedModule = res.data.data
        // linkedModuleData.value = fetchedModule // insert module
        if (fetchedModule.collection) {
          const data = fetchedModule.collection.data.find(d => d[payload.link_field] == payload.link_id)
          linkedModuleData.value = data

          return data
        } else return null

        // linkedModuleCollection.value = fetchedModule.collection // insert collection
      }
    } catch (error) {
      console.log(error.response)
      linkedModuleData.value = null
      // collection.value = []
    }
  }
  const addViewFilter = async (payload) => {
    let data = payload.data
    let uriOptions = { uri: null, method: null }

    if (payload.mode === 'new') {
      uriOptions.uri = `/viewFilters`
      uriOptions.method = 'POST'
    } else {
      uriOptions.uri = `/viewFilters/${payload.viewFilter}`
      uriOptions.method = 'PATCH'
    }

    const finalObject = Object.assign({}, {
      ...data,
      updateType: payload.type,
      module_id: payload.baseModule._id,
      moduleName: payload.baseModule.name
    })

    // do backend codes here
    const res = await axios(uriOptions.uri, {
      method: uriOptions.method,
      headers: { 'Content-Type': 'application/json' },
      data: finalObject
    })

    if (res && res.status === 200) {
      // toast
      toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: res.data && res.data.message,
        life: 3000
      })
      return res.data
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error Message',
        detail: 'Error saving',
        life: 3000
      })
    }
  }
  const searchModule = async (payload) => {
    let _payload = Object.assign({}, {
      moduleName: payload.module,
      listOnly: true,
      viewFilter: payload.viewFilter,
      page: 1,
      limit: 25,
      search: payload.search,
      searchFields: payload.searchFields,
      reuse: true
    })

    // update view fiter search fields
    let uri = `/viewFilters/${payload.viewFilter}`
    const viewFiltersRes = await axios(uri, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      data: { _searchFields: payload.selectedSearchKeyIds }
    })

    console.log(viewFiltersRes)

    const fetchedModule = await _fetchModule(_payload)
    return fetchedModule
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
    getLinkedModuleData,
    getModules,
    getModulesWithPermissions,
    getModuleWithPermissions,
    getModulesUserCanAccess,
    getJsonModules,
    getCollection,
    getCollectionById,
    _getViewFilters,
    getViewFilters,
    getEntity,
    getEntityByName,
    _getDefaultViewFilter,
    getDefaultViewFilter,
    _getViewFilter,
    __getViewFilter,
    getViewFilter,
    _getViewFilterIds,
    getViewFilterIds,
    _getSearchFields,
    _getSearchKeyFields,
    _getSearchKeyFieldIds,
    getKanbanData,
    _getFieldDetails,
    getFieldDetails,
    _getFieldDetailsById,
    getFieldDetailsById,
    getFieldDetailsByUname,
    getModuleByName,
    getEntityFields,
    _fetchModule,
    fetchModule,
    fetchLinkedModuleData,
    fetchBaseModule,
    _fetchBaseModuleByField,
    fetchBaseModuleByField,
    fetchModules,
    addViewFilter,
    fetchModuleFields,
    fetchModulePanels,
    searchModule,

    // specific functions for inquiry module
    convertMailboxToInquiry,
    insertModuleFromMailbox
  }
})