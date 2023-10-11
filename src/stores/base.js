import { defineStore } from 'pinia'
import { useToast } from "primevue/usetoast"
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useBaseStore = defineStore('baseStore', () => {

  // refs
  const router = useRouter()
  const toast = useToast()

  // states
  const jsonDbUrl = ref('http://localhost:3000')
  const backendUrl = ref('http://localhost:8000')
  const menu = ref({})
  const menuLoading = ref(false)
  const modules = ref([])
  const modulesLoading = ref(false)

  // getters
  const getMenu = computed(() => menu.value)
  const getModules = computed(() => modules.value)

  // actions
  const fetchMenu = async () => {
    menuLoading.value = true
    const res = await axios(`${jsonDbUrl.value}/menu`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      menu.value = res.data
      console.log(res.data)
    }
    menuLoading.value = false
  }

  const fetchModules = async () => {
    modulesLoading.value = true
    const res = await axios(`${jsonDbUrl.value}/modules`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      modules.value = res.data
      console.log(res.data)
    }
    modulesLoading.value = false
  }

  return {
    jsonDbUrl,
    backendUrl,
    getMenu,
    getModules,
    menuLoading,
    modulesLoading,
    fetchMenu,
    fetchModules
  }
})
