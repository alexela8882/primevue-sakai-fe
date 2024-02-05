// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
// stores
import { useBaseStore } from '@/stores/base'
import { useModuleStore } from '@/stores/modules'

export const useTabStore = defineStore('tabStore', () => {

  // refs
  const tabsLoading = ref(false)
  // stores
  const baseStore = useBaseStore()
  const moduleStore = useModuleStore()
  const { jsonDbUrl } = storeToRefs(baseStore)
  const {
    listViewFilterOverlay,
    viewFiltersDialogLoading,
    viewFiltersDialogSwitch,
    viewFiltersDialog,
    moduleLoading,
    collectionLoading,
    getModule,
    getBaseModule,
    getCollection,
    getViewFilters,
    getDefaultViewFilter,
    _getViewFilterIds,
    getViewFilterIds,
    _getViewFilter,
    getViewFilter,
    getSearchKeyFieldIds
  } = storeToRefs(moduleStore)
  const { _fetchModule, fetchBaseModuleByField } = moduleStore

  // states
  const tabs = ref([])

  // getters
  const getTabs = computed(() => tabs.value)

  // actions
  const generateTabs = async (payload) => {
    payload.map(async p => {
      const baseModule = await fetchBaseModuleByField({ field: 'name', value: p.module })
      const moduleData = await _fetchModule(p.module)
      const viewFilter = moduleData.viewFilters.find(vf => vf.isDefault === true)
      const viewFilterWithFields = _getViewFilter.value({ module: moduleData, id: viewFilter._id })
      console.log(moduleData.viewFilters)
      let obj = Object.assign({}, {
        name: p.name,
        module: p.module,
        display: p.display,
        visible: p.visible,
        base_module: baseModule,
        module: Object.assign({}, {
          collection: moduleData.collection,
          fields: moduleData.fields,
          panels: moduleData.panels,
          viewFilterWithFields: viewFilterWithFields
        })
      })
      tabs.value.push(obj)
    })
  }
  const toggleTabs = async (payload) => {
    tabs.value.map(tab => {
      if (tab.name == payload.name) tab.visible = true
      else tab.visible = false
    })
  }

  return {
    tabsLoading,
    getTabs,
    generateTabs,
    toggleTabs
  }
})