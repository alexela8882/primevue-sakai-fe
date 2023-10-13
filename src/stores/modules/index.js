// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { storeToRefs } from 'pinia'
// stores
import { useBaseStore } from '@/stores/base'

export const useModuleStore = defineStore('moduleStore', () => {

  // refs
  // stores
  const baseStore = useBaseStore()
  const { jsonDbUrl } = storeToRefs(baseStore)
  const moduleLoading = ref(false)

  // states
  const modules = ref([])
  const modulesLoading = ref(false)
  const module = ref({})

  // getters
  const getModule = computed(() => module.value)
  const getModules = computed(() => modules.value)

  // actions
  const fetchModule = async (id) => {
    moduleLoading.value = true
    const res = await axios(`${jsonDbUrl.value}/modules?_id=${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      module.value = (res.data && res.data.length > 0) ? res.data[0] : res.data
      console.log(module.value)
    }
    moduleLoading.value = false
  }
  const fetchModules = async () => {
    modulesLoading.value = true
    const res = await axios(`${jsonDbUrl.value}/modules`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      modules.value = res.data
      // console.log(res.data)
    }
    modulesLoading.value = false
  }

  return {
    moduleLoading,
    modulesLoading,
    getModule,
    getModules,
    fetchModule,
    fetchModules
  }
})