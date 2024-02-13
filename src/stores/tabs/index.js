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
  const xTabsLoading = ref(false)
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
    if ((payload.type === 'module' && payload.visible) || payload.type === 'module-form') {
      const baseModule = await _fetchBaseModuleByField({ field: 'name', value: payload._module })
      const moduleData = await _fetchModule(payload._module)
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
    } else {
      return payload
    }
  }
  const generateTabs = async (payload) => {
    payload.map(async p => {
      const tab = await generateTab(p)
      tabs.value.push(tab)
    })
  }
  const toggleTabs = async (payload) => {
    xTabsLoading.value = true

    tabs.value.map(async tab => {
      if (tab.name === payload.name) {
        tab.visible = true

        const newTab = await generateTab(payload)
        Object.assign(tab, newTab)
      } else tab.visible = false
    })

    xTabsLoading.value = false
  }
  const toggleWindows = async (payload) => {
    xTabsLoading.value = true

    setTimeout(() => {
      const index = tabs.value.findIndex(tab => tab.label === payload.label)
      if (index !== -1) {
        tabs.value.unshift(tabs.value.splice(index, 1)[0])
      }

      xTabsLoading.value = false
    }, 100)
  }
  const addTab = async (payload) => {
    xTabsLoading.value = true

    const index = tabs.value.findIndex(tab => tab.name === payload.name)
    console.log(index)
    if (index === -1) {
      const tab = await generateTab(payload)
      tabs.value.unshift(tab)
    }

    xTabsLoading.value = false
  }
  const removeTab = async (payload) => {
    xTabsLoading.value = true

    setTimeout(() => {
      const index = tabs.value.findIndex(tab => tab.name === payload.name)
      tabs.value.splice(index, 1)

      xTabsLoading.value = false
    }, 100)
  }

  return {
    xTabsLoading,
    tabsLoading,
    getTabs,
    generateTabs,
    toggleTabs,
    toggleWindows,
    addTab,
    removeTab
  }
})