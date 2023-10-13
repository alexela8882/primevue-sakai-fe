// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { storeToRefs } from 'pinia'
// stores
import { useBaseStore } from '@/stores/base'

export const useModuleStore = defineStore('moduleStore', () => {

  // refs
  const baseStore = useBaseStore()
  const { jsonDbUrl } = storeToRefs(baseStore)
  const moduleLoading = ref(false)
  
  // states
  const module = ref({})

  // getters
  const getModule = computed(() => module.value)

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

  return {
    moduleLoading,
    module,
    getModule,
    fetchModule
  }
})