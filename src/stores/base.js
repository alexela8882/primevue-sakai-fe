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
  const menu2 = ref([])
  const menuLoading = ref(false)
  const modules = ref([])
  const modulesLoading = ref(false)

  // getters
  const getMenu = computed(() => menu.value)
  const sidebarMenu = computed(() => {
    const item = menu.value && menu.value
    const folders = item.top && item.top.folders
    let testNewFolders = []
    const newFolders = folders && folders.map(folder => {
      let obj = Object.assign({}, {
        label: folder.label,
        name: folder.name,
        icon: folder.icon,
        order: folder.order,
        folders: folder.folders,
        items: []
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
            folders: folder2.folders,
            items: []
          })

          const filteredModule2 = modules.value.filter(module => folder2.modules.includes(module._id))
          if (filteredModule2.length > 0) obj2.items = filteredModule2

          obj.items.push(obj2)
        })
      }
      testNewFolders.push(obj)
      return obj
    })

    let menuModules = []
    // re-structure modules into menu
    modules.value.map(module => {
      let newModule = Object.assign({}, {
        _id: module._id,
        label: module.label,
        name: module.name,
        icon: module.icon,
        order: module.order,
        folders: module.folders,
        items: [{
          _id: module._id,
          label: module.label,
          name: module.name,
          icon: module.icon,
          route: module.route,
          color: module.color
        }]
      })
      menuModules.push(newModule)
    })

    let childItemIds = []
    testNewFolders.map((testNewFolder) => {
      testNewFolder.items.map(item => {
        const id = item._id !== undefined && item._id
        if (id) childItemIds.push(id)
      })
    })

    // filter out matching ids from menuModules
    const filteredModule = menuModules.filter(item => !childItemIds.includes(item._id))

    // merge menu & filtered modules
    Array.prototype.push.apply(testNewFolders, filteredModule)

    // sort by order
    let finalMenus = testNewFolders.sort((a, b) => a.order - b.order)

    return finalMenus
  })
  const sidebarMenu2 = computed(() => {
    let childItemNames = []
    let menus = []
    menu2.value.map((men) => {
      men.modules && men.modules.map(item => {
        const name = item.name !== undefined && item.name
        if (name) childItemNames.push(name)
      })

      menus.push(men)
    })

    // filter out matching names from modules
    const filteredModule = modules.value.filter(module => !childItemNames.includes(module.name))

    // merge menu & filtered modules
    Array.prototype.push.apply(menus, filteredModule)

    // sort by order
    let sortedMenus = menus.sort((a, b) => a.order - b.order)

    // unique items
    const uniqueMenus = sortedMenus.filter((item, index, self) =>
      self.findIndex(obj => obj.name === item.name) === index
    )

    return uniqueMenus
  })
  const getModules = computed(() => modules.value)

  // actions
  const fetchMenu = async () => {
    menuLoading.value = true
    const res = await axios(`${jsonDbUrl.value}/folders`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      menu.value = res.data
      menu2.value = res.data
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
    sidebarMenu2,
    getModules,
    menuLoading,
    modulesLoading,
    fetchMenu,
    fetchModules
  }
})
