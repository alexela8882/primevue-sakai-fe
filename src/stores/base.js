// imports
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
  const sidebarMenu = computed(() => {
    const item = menu.value && menu.value
    const folders = item.top && item.top.folders
    const newFolders = folders && folders.map(folder => {
      let obj = Object.assign({}, {
        label: folder.label,
        name: folder.name,
        icon: folder.icon,
        order: folder.order,
        folders: folder.folders
      })

      // get & insert modules
      if (modules.value) {
        const filteredModule = modules.value.filter(module => folder.modules.includes(module._id))
        if (filteredModule.length > 0) obj.items = filteredModule

        // include nested items in folders array
        folder.folders.map(folder2 => {
          let obj2 = Object.assign({}, {
            label: folder2.label,
            name: folder2.name,
            icon: folder2.icon,
            order: folder2.order,
            folders: folder2.folders
          })

          const filteredModule2 = modules.value.filter(module => folder2.modules.includes(module._id))
          if (filteredModule2.length > 0) obj2.items = filteredModule2

          obj.items.push(obj2)
        })
      }
      return obj
    })
    return newFolders
  })
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
      // console.log(res.data)
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
      // console.log(res.data)
    }
    modulesLoading.value = false
  }

  return {
    jsonDbUrl,
    backendUrl,
    getMenu,
    sidebarMenu,
    getModules,
    menuLoading,
    modulesLoading,
    fetchMenu,
    fetchModules
  }
})
