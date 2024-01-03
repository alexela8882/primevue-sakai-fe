// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
// stores
import { useBaseStore } from '@/stores/base'
import { useModuleStore } from '@/stores/modules'

export const useModuleDetailStore = defineStore('moduleDetailStore', () => {
  // refs
  const toast = useToast()
  const itemLoading = ref(true)
  const relatedListLoading = ref(true)
  // stores
  const baseStore = useBaseStore()
  const moduleStore = useModuleStore()
  const { jsonDbUrl } = storeToRefs(baseStore)
  const { getBaseModule, getModule } = storeToRefs(moduleStore)

  // states
  const item = ref({})
  const _relatedLists = ref([])
  const relatedLists = ref([])

  // getters
  const getItem = computed(() => item.value)
  const getItemPanels = computed(() => {
    const panels = getModule.value.panels

    // re-construct panels
    const reconstructedPanels = panels.map((panel, px) => {
      let panelObj = Object.assign({}, {
        _id: panel._id,
        controllerMethod: panel.controllerMethod,
        entityName: panel.entityName,
        highlight: panel.highlight,
        label: panel.label,
        mutable: panel.mutable,
        panelName: panel.panelName,
        sections: [],
        tabKey: panel.tabKey
      })

      return panelObj
    })

    // re-construct sections
    panels.map((panel, px) => {
      panel.sections.filter((section, sx) => {
        if (section.sectionLabel) {
          let secObj = Object.assign({}, {
            sectionLabel: section.sectionLabel,
            row: section.row,
            field_ids: section.field_ids,
            additional_fields: []
          })
          reconstructedPanels[px].sections.push(secObj)
        }
        else {
          const lastSection = reconstructedPanels[px].sections.slice(-1).pop()
          let additionalField = Object.assign({}, { ids: section.field_ids })
          lastSection.additional_fields.push(additionalField)
        }
      })
    })

    // console.log(panels)
    console.log(reconstructedPanels)
    return reconstructedPanels
  })
  const getItemValueByName = computed(() => {
    return (payload) => {
      return item.value[payload]
    }
  })
  const _getRelatedLists = computed(() => _relatedLists.value)
  const _getRelatedOrderedLists = computed(() => {
    const sorted = _relatedLists.value.sort((a, b) => a.panelOrder - b.panelOrder)
    return sorted
  })
  const _getRelatedListsByCname = computed(() => {
    return (payload) => {
      const relatedList = _getRelatedLists.value.find(rl => rl.cname === payload)
      return relatedList
    }
  })
  const getRelatedLists = computed(() => relatedLists.value)
  const getRelatedOrderedLists = computed(() => {
    const sorted = relatedLists.value.sort((a, b) => a.panelOrder - b.panelOrder)
    return sorted
  })
  const getRelatedListsByCname = computed(() => {
    return (payload) => {
      const relatedList = getRelatedLists.value.find(rl => rl.cname === payload)
      return relatedList
    }
  })

  // actions
  const fetchItem = async (payload) => {
    itemLoading.value = true

    const res = await axios(`${jsonDbUrl.value}/${payload.name}-item?_id=${payload.pageid}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      item.value = (res.data && res.data.length > 0) ? res.data[0] : res.data
    }
    itemLoading.value = false
  }
  const fetchItemRelatedList = async (payload) => {
    const res = await axios(`${jsonDbUrl.value}/${payload.moduleName}-related?cname=${payload.panelName}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).catch((err) => {
      console.log(err)
    })

    if (res && res.status === 200) {
      if (res.data) relatedLists.value.push(res.data[0])
    } else relatedLists.value = [] // reset
  }
  const fetchItemRelatedLists = async (payload) => {
    relatedListLoading.value = true

    const res = await axios(`${jsonDbUrl.value}/${payload.name}-related`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).catch((err) => {
      console.log(err)
    })

    if (res && res.status === 200) {
      _relatedLists.value = res.data
    } else {
      console.log('err')
      _relatedLists.value = [] // reset
    }
    console.log(_relatedLists.value)
    relatedListLoading.value = false
  }

  return {
    itemLoading,
    relatedListLoading,
    item,
    getItem,
    _getRelatedLists,
    _getRelatedOrderedLists,
    _getRelatedListsByCname,
    getRelatedLists,
    getRelatedOrderedLists,
    getRelatedListsByCname,
    getItemPanels,
    getItemValueByName,
    fetchItem,
    fetchItemRelatedList,
    fetchItemRelatedLists
  }
})