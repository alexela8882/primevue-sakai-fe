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
  const tabDialog = ref(false)
  const tabsLoading = ref(false)
  const xTabsLoading = ref(false)
  // stores
  const baseStore = useBaseStore()
  const moduleStore = useModuleStore()
  const { jsonDbUrl } = storeToRefs(baseStore)
  const {  _getViewFilter, getModuleByName } = storeToRefs(moduleStore)
  const { _fetchModule, fetchBaseModuleByField, _fetchBaseModuleByField } = moduleStore

  // states
  const tabs = ref([])

  // getters
  const getTabs = computed(() => tabs.value)
  const getMaximizedTab = computed(() => tabs.value.find(tab => tab.maximized))
  const getWinTabs = computed(() => tabs.value.filter(tab => tab.style === 'window'))
  const getOpenedWinTabs = computed(() => getWinTabs.value.filter(tab => tab.opened))
  const sortTabs = computed(() => {
    return (payload) => {
      const sorted = payload.tabs.filter(p => p.opened).sort((a, b) => {
        return a[payload.sortKey] - b[payload.sortKey]
      })
      return sorted
    }
  })

  // actions
  const resetTabs = async () => {
    return tabs.value = []
  }
  const maximizeTab = async (payload) => {
    console.log(payload)
    tabs.value.map(tab => {
      if (tab.name === payload.name) tab.maximized = true
      else tab.maximized = false

      tab.expanded = false
    })

    console.log(tabs.value)

    // open global dialog
    tabDialog.value = true
  }
  const minimizeTab = async () => {
    tabs.value.map(tab => {
      if (tab.maximized) {
        tab.maximized = false
        tab.expanded = true
      }
    })

    // close global dialog
    tabDialog.value = false
  }
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
          collection: moduleData,
          fields: moduleData.fields,
          panels: moduleData.panels,
          viewFilterWithFields: viewFilterWithFields
        })
      })

      console.log(obj)
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
  const toggleWindows = async (itemToToggle) => {
    console.log(itemToToggle)
    xTabsLoading.value = true

    // If the selected item is not opened
    if (!itemToToggle.opened) {
      // const index = tabs.value.findIndex(tab => tab.label === payload.label)
      // if (index !== -1) {
      //   tabs.value.unshift(tabs.value.splice(index, 1)[0])
      // }

      const secondItem = tabs.value.find(item => item.opened && item.opened_order === 2)
      if (secondItem) {
        secondItem.opened = false
        secondItem.opened_order = null
      }

      const firstItem = tabs.value.find(item => item.opened && item.opened_order === 1)
      if (firstItem) {
        firstItem.opened_order = 2
        firstItem.expanded = false
      }

      const newItem = tabs.value.find(item => item.name === itemToToggle.name)
      newItem.opened = true
      if (newItem.mode !== 'modal') newItem.expanded = true
      newItem.opened_order = 1
      console.log(newItem)

      console.log(tabs.value)

      xTabsLoading.value = false
    } else if(!itemToToggle.expanded){
      itemToToggle.expanded = true
      xTabsLoading.value = false
    }else xTabsLoading.value = false
  }
  const addTab = async (payload, window = false) => {
    xTabsLoading.value = true

    const index = tabs.value.findIndex(tab => tab.name === payload.name)
    if (index === -1) {
      let tab = null
      if(payload.type=='module-form'){
        tab = payload
        tab['base_module'] = getModuleByName.value(tab._module)
      }        
      else
        tab = await generateTab(payload)

      tabs.value.unshift(tab)

      // toggle windows
      if (window) await toggleWindows(payload)

      // tab mode
      if (payload.mode === 'modal') await maximizeTab(payload) 
    }

    xTabsLoading.value = false
  }
  const removeTab = async (payload) => {
    xTabsLoading.value = true

    setTimeout(() => {
      const index = tabs.value.findIndex(tab => tab.name === payload.name)
      tabs.value.splice(index, 1)

      // set only 1 item to order 1
      if (getWinTabs.value.length == 1) {
        getWinTabs.value.map(tab => tab.opened_order = 1)
      } else {
        console.log(getWinTabs.value)
        // re-order last opened item
        const lastOpenedItem = getWinTabs.value.find(tab => tab.opened_order === 1)
        if (lastOpenedItem) {
          lastOpenedItem.opened = true
          lastOpenedItem.opened_order = 2
        }

        // open last item
        const lastClosedItem = getWinTabs.value.find(tab => !tab.opened)
        if(lastClosedItem){
          lastClosedItem.opened = true
          lastClosedItem.opened_order = 1
        }
        
      }

      xTabsLoading.value = false
    }, 50)
  }

  return {
    tabDialog,
    xTabsLoading,
    tabsLoading,
    getTabs,
    getMaximizedTab,
    getWinTabs,
    getOpenedWinTabs,
    sortTabs,
    generateTabs,
    toggleTabs,
    toggleWindows,
    addTab,
    removeTab,
    resetTabs,
    maximizeTab,
    minimizeTab
  }
})