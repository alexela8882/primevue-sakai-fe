// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
// stores
import { useBaseStore } from '@/stores/base'
import { useModuleStore } from '@/stores/modules'

export const useModuleDynamicTableStore = defineStore('moduleDynamicTableStore', () => {
  // refs
  // stores
  const baseStore = useBaseStore()
  const moduleStore = useModuleStore()
  const { jsonDbUrl } = storeToRefs(baseStore)
  const { getBaseModule, getModule } = storeToRefs(moduleStore)

  // states
  const dropdownLoading = ref(false)
  const dropdownLists = ref([])

  // getters
  const getDropdownLists = computed(() => dropdownLists.value)
  const getDropdown = computed(() => {
    return (payload) => {
      const dropdown = dropdownLists.value.find(dpl => dpl.module === payload)
      return dropdown ? dropdown.content : null
    }
  })

  // actions
  const fetchDropdownLists = async (payload) => {
    dropdownLoading.value = true
    const res = await axios(`${jsonDbUrl.value}/${payload}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      if (res.data) {
        const ifExists = dropdownLists.value.find(dpl => dpl.module === payload)
        if (!ifExists) {
          let obj = Object.assign({}, {
            module: payload,
            content: res.data
          })
          dropdownLists.value.push(obj)
        }
      }
    }
    dropdownLoading.value = false
  }

  return {
    getDropdownLists,
    getDropdown,
    fetchDropdownLists
  }
})