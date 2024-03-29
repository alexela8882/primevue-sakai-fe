// imports
import { storeToRefs, defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
// stores
import { useBaseStore } from '@/stores/base'
import { useModuleStore } from '@/stores/modules/index'

export const useMenuStore = defineStore('menuStore', () => {

  // refs
  // stores
  const baseStore = useBaseStore()
  const moduleStore = useModuleStore()
  const { jsonDbUrl } = storeToRefs(baseStore)
  const { getModules, getJsonModules, getModulesUserCanAccess } = storeToRefs(moduleStore)

  // states
  const isCollapse = ref(true)
  const menu = ref({})
  const menu2 = ref([])
  const menuLoading = ref(false)

  // getters
  const getNewSidebarMenu = computed(() => {
    let menuData = menu.value && menu.value.data
    const folders = menuData && menuData.folders
    const modules = menuData && menuData.modules

    // console.log(folders)
    // console.log(modules)

    let mergedMenu = []
    // merge
    if (folders && modules) {
      mergedMenu = [...folders, ...modules]
    }
    // sort
    mergedMenu.sort((a, b) => a.order - b.order)

    // console.log(mergedMenu)

    return mergedMenu
  })
  const getMenu = computed(() => menu.value)
  const sidebarMenu = computed(() => {
    const userAccessModules = getModulesUserCanAccess.value
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

      const finalModules = getModules.value.filter(module => userAccessModules.includes(module._id))

      // get & insert modules
      if (finalModules) {
        const filteredModule = finalModules.filter(module => folder.modules.includes(module._id))
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

          const filteredModule2 = finalModules.filter(module => folder2.modules.includes(module._id))
          if (filteredModule2.length > 0) obj2.items = filteredModule2

          obj.items.push(obj2)
        })
      }
      testNewFolders.push(obj)
      return obj
    })

    let menuModules = []
    // re-structure modules into menu
    getModules.value.map(module => {
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
    const filteredModule = getModules.value.filter(module => !childItemNames.includes(module.name))

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

  // actions
  const fetchMenu = async () => {
    menuLoading.value = true

    const jsonUri = `${jsonDbUrl.value}/menu`
    const beUri = '/modules/menu'
    const res = await axios(beUri, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      menu.value = res.data
      console.log(res.data)
    }
    menuLoading.value = false
  }

  const fetchMenu2 = async () => {
    menuLoading.value = true
    const res = await axios(`${jsonDbUrl.value}/folders`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      menu2.value = res.data
      // console.log(res.data)
    }
    menuLoading.value = false
  }

  return {
    isCollapse,
    getMenu,
    getNewSidebarMenu,
    sidebarMenu,
    sidebarMenu2,
    menuLoading,
    fetchMenu,
    fetchMenu2
  }
})
