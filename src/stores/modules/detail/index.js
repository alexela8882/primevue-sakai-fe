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
  const { getBaseModule, getModule, getModuleWithPermissions } = storeToRefs(moduleStore)
  const { _fetchModule } = moduleStore

  // states
  const item = ref({})
  const _relatedLists = ref([])
  const relatedLists = ref([])

  // getters
  const getItem = computed(() => item.value)
  const _getItemPanels = computed(() => {
    return (payload) => {
      return getItemPanels.value(payload)
    }
  })
  const getItemPanels = computed(() => {
    return (payload) => {
      let panels = null

      if (payload) panels = payload
      else panels = getModule.value.panels

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
          if (section.label) {
            let secObj = Object.assign({}, {
              sectionLabel: section.label,
              row: section.row,
              field_ids: section.field_ids,
              additional_fields: []
            })
            reconstructedPanels[px].sections.push(secObj)
          }
          else {
            const lastSection = reconstructedPanels[px].sections.slice(-1).pop()
            if (lastSection) {
              let additionalField = Object.assign({}, { ids: section.field_ids })
              lastSection.additional_fields.push(additionalField)
            }
          }
        })
      })

      // console.log(panels)
      return reconstructedPanels
    }
  })
  const getItemValueByName = computed(() => {
    return (payload) => {
      // console.log(payload)
      // console.log(item.value.data[payload])
      return item.value.data[payload]
    }
  })
  const _getRelatedList = computed(() => {
    return (payload) => {
      _relatedLists.value.find(list => list._id === payload)
    }
  })
  const _getRelatedLists = computed(() => _relatedLists.value)
  const _getRelatedOrderedLists = computed(() => {
    const sorted = _relatedLists.value.sort((a, b) => a.panelOrder - b.panelOrder)
    return sorted
  })
  const _getRelatedListsByCname = computed(() => {
    return (payload) => {
      console.log(payload)
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
    // const uri = `${jsonDbUrl.value}/${payload.name}-item?_id=${payload.pageid}`
    const uri = `/modules/${payload.name}/${payload.pageid}`

    const res = await axios(uri, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      // item.value = (res.data && res.data.length > 0) ? res.data[0] : res.data
      item.value = res.data
    }
    itemLoading.value = false
  }
  const fetchItemRelatedList = async (payload) => {
    const jsonUri = `${jsonDbUrl.value}/${payload.moduleName}-related?cname=${payload.panelName}`
    const beUri = `/getShowRelatedList?module-name=${payload.moduleName}&base=${payload.base}&panel=${payload.panelId}`
    const res = await axios(jsonUri, {
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

    _relatedLists.value = [] // reset
    const moduleName = payload.moduleName
    const base = payload.base
    let relatedLists = payload.relatedLists

    const jsonUri = `${jsonDbUrl.value}/${payload.name}-related`

    relatedLists.map(list => _relatedLists.value.push(list))

    _relatedLists.value.map(async list => {
      const beUri = `/getShowRelatedList?module-name=${moduleName}&base=${base}&panel=${list._id}`
      const res = await axios(beUri, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).catch((err) => {
        console.log(err)
      })

      if (res && res.status === 200) {
        let data = res.data

        // re-assign
        Object.assign(list, {
          ...list,
          cname: data.cname,
          label: data.label,
          entityName: data.entityName,
          link: data.link,
          panelOrder: data.panelOrder,
          mutable: data.mutable,
          paginated: data.paginated,
          buttons: data.buttons,
          fields: data.fields,
          collection: data.collection
        })
      } else {
        Object.assign(list, {
          ...list,
          cname: null,
          label: null,
          entityName: null,
          link: null,
          panelOrder: null,
          mutable: null,
          paginated: null,
          buttons: [],
          fields: [],
          collection: [],
          permissions: []
        })
      }
    })

    relatedListLoading.value = false
  }
  const paginateRelatedList = async (payload) => {
    console.log(payload)

    const beUri = `/getShowRelatedList?module-name=${payload.moduleName}&base=${payload.base}&panel=${payload.panel}&page=${payload.page}&limit=${payload.limit}`
    const res = await axios(beUri, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }).catch((err) => {
      console.log(err)
    })

    if (res && res.status === 200) {
      console.log(res.data)
      // update matched related list
      _relatedLists.value.map(list => {
        if (list._id === payload.panel) {
          console.log('matched')
          Object.assign(list, res.data)
        } else console.log('not matched')
      })
    }

    console.log(_relatedLists.value)
  }

  return {
    _relatedLists,
    itemLoading,
    relatedListLoading,
    item,
    getItem,
    _getRelatedList,
    _getRelatedLists,
    _getRelatedOrderedLists,
    _getRelatedListsByCname,
    getRelatedLists,
    getRelatedOrderedLists,
    getRelatedListsByCname,
    _getItemPanels,
    getItemPanels,
    getItemValueByName,
    fetchItem,
    fetchItemRelatedList,
    fetchItemRelatedLists,
    paginateRelatedList
  }
})