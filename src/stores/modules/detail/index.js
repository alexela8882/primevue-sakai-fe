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
  const itemLoading = ref(false)
  // stores
  const baseStore = useBaseStore()
  const moduleStore = useModuleStore()
  const { jsonDbUrl } = storeToRefs(baseStore)
  const { getBaseModule, getModule } = storeToRefs(moduleStore)

  // states
  const item = ref({})

  // getters
  const getItem = computed(() => item.value)
  const getItemPanels = computed(() => {
    const panels = getModule.value.panels
    return panels
  })
  const getItemByName = computed(() => {
    return (payload) => {
      return item.value[payload]
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

  return {
    itemLoading,
    item,
    getItem,
    getItemPanels,
    getItemByName,
    fetchItem
  }
})