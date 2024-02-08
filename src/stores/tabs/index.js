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
  const {  _getViewFilter } = storeToRefs(moduleStore)
  const { _fetchModule, fetchBaseModuleByField } = moduleStore

  // states
  const tabs = ref([])

  // getters
  const getTabs = computed(() => tabs.value)

  // actions
  const generateTabs = async (payload) => {
    tabs.value = [] // refresh
    tabsLoading.value = true

    payload.map(async p => {
      if (p.visible) {
        const baseModule = await fetchBaseModuleByField({ field: 'name', value: p.module })
        const moduleData = await _fetchModule(p.module)
        const viewFilter = moduleData.viewFilters.find(vf => vf.isDefault === true)
        const viewFilterWithFields = _getViewFilter.value({ module: moduleData, id: viewFilter._id })
        // console.log(moduleData.viewFilters)
        let obj = Object.assign({}, {
          ...p,
          base_module: baseModule,
          module: Object.assign({}, {
            collection: moduleData.collection,
            fields: moduleData.fields,
            panels: moduleData.panels,
            viewFilterWithFields: viewFilterWithFields
          })
        })
        tabs.value.push(obj)
      } else tabs.value.push(p)
    })

    tabsLoading.value = false
  }
  const toggleTabs = async (payload) => {
    tabsLoading.value = true

    tabs.value.map(async tab => {
      if (tab.name == payload.name) {
        tab.visible = true

        const baseModule = await fetchBaseModuleByField({ field: 'name', value: payload.module })
        const moduleData = await _fetchModule(payload.module)
        const viewFilter = moduleData.viewFilters.find(vf => vf.isDefault === true)
        const viewFilterWithFields = _getViewFilter.value({ module: moduleData, id: viewFilter._id })
        // console.log(moduleData.viewFilters)
        let newTab = Object.assign({}, {
          ...payload,
          base_module: baseModule,
          module: Object.assign({}, {
            collection: moduleData.collection,
            fields: moduleData.fields,
            panels: moduleData.panels,
            viewFilterWithFields: viewFilterWithFields
          })
        })
        Object.assign(tab, newTab)
      } else tab.visible = false
    })

    tabsLoading.value = false
  }

  return {
    tabsLoading,
    getTabs,
    generateTabs,
    toggleTabs
  }
})