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
  const { _fetchModule, fetchBaseModuleByField, _fetchBaseModuleByField } = moduleStore

  // states
  const tabs = ref([])

  // getters
  const getTabs = computed(() => tabs.value)

  // actions
  const generateTab = async (payload) => {
    const baseModule = await _fetchBaseModuleByField({ field: 'name', value: payload.module })
    const moduleData = await _fetchModule(payload.module)
    const viewFilter = moduleData.viewFilters.find(vf => vf.isDefault === true)
    const viewFilterWithFields = _getViewFilter.value({ module: moduleData, id: viewFilter._id })
    let obj = Object.assign({}, {
      ...payload,
      base_module: baseModule,
      module: Object.assign({}, {
        collection: moduleData.collection,
        fields: moduleData.fields,
        panels: moduleData.panels,
        viewFilterWithFields: viewFilterWithFields
      })
    })

    return obj
  }
  const generateTabs = async (payload) => {
    tabs.value = [] // refresh
    tabsLoading.value = true

    payload.map(async p => {
      if (p.type === 'module' && p.visible) {
        const tab = generateTab(p)
        tabs.value.push(tab)
      } else if (p.type === 'form') {
        const tab = generateTab(p)
        tabs.value.push(tab)
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
  const addTab = async (payload) => {
    const index = tabs.value.findIndex(tab => tab.name === payload.name)
    if (index) {
      const tab = await generateTab(payload)
      tabs.value.push(tab)
    }

    console.log(tabs.value)
  }

  return {
    tabsLoading,
    getTabs,
    generateTabs,
    toggleTabs,
    addTab
  }
})