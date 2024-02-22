<script setup>
// imports
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useModuleStore } from '@/stores/modules/index'
import { useMenuStore } from '@/stores/menu'

// refs
// stores
const moduleStore = useModuleStore()
const menuStore = useMenuStore()
const {
  isCollapse,
  menuLoading,
  getMenu,
  sidebarMenu,
  sidebarMenu2
} = storeToRefs(menuStore)
const { fetchModules } = moduleStore
const { getModules } = storeToRefs(moduleStore)
const { fetchMenu, fetchMenu2 } = menuStore

onMounted(async () => {
  await fetchMenu()
  // fetchMenu2()
  await fetchModules()
})
</script>

<template>
  <div>
    <div v-if="menuLoading">
      <div>
        <ul class="m-0 p-0 list-none">
          <li v-for="(skel, sk) in 6" :key="sk" class="my-3">
            <div class="flex justify-content-center">
              <Skeleton shape="circle" size="4rem"></Skeleton>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <div @click="isCollapse = !isCollapse" class="cursor-pointer my-3 w-100 flex justify-content-center">
        <div class="material-icons text-white">menu</div>
      </div>
      <!-- <el-menu
        class="custom-menu"
        :collapse="isCollapse"
        background-color="transparent">
        <el-sub-menu v-for="(menu, mn) in sidebarMenu2" :index="`${mn}`" :key="mn">
          <template #title>
            <div class="material-icons text-white">{{ menu.icon }}</div>
            <div v-if="!isCollapse" class="ml-3 text-white">{{ menu.label }}</div>
          </template>
          <el-menu-item
            v-if="menu.modules && menu.modules.length > 0"
            v-for="(submodule, sm) in menu.modules"
            @click="$router.push(`/${submodule.name}/${submodule._id}`)"
            :key="`${mn}${sm}`"
            :index="`${mn}${sm}`">{{ submodule.label }}</el-menu-item>
          <el-menu-item
            v-else
            @click="$router.push(`/${menu.name}/${menu._id}`)"
            :index="`${mn}`">{{ menu.label }}</el-menu-item>
          <el-sub-menu
            v-if="menu.folders && menu.folders.length > 0"
            v-for="(subfolder, sm) in menu.folders"
            :key="`${mn}${sm}`"
            :index="`${mn}${sm}`">
            <template #title>{{ subfolder.label }}</template>
            <el-menu-item
              v-for="(foldermodule, fm) in subfolder.modules"
              :key="`${mn}${sm}${fm}`"
              :index="`${mn}${sm}${fm}`"
              @click="$router.push(`/${foldermodule.name}/${foldermodule._id}`)">
              {{ foldermodule.label }}
            </el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
      </el-menu> -->
      <el-menu
        class="custom-menu"
        :collapse="isCollapse"
        background-color="transparent">
        <el-sub-menu v-for="(menu, mn) in sidebarMenu" :index="`${mn}`" :key="mn" >
          <template #title>
            <div
              @click="menu.items.length === 1 && $router.push(`/modules/${menu.name}/${menu._id}`)"
              class="material-icons text-white">
              {{ menu.icon }}</div>
            <div v-if="!isCollapse" class="ml-3 text-white">{{ menu.label }}</div>
          </template>
          <el-menu-item
            v-if="menu.items.length > 0"
            v-for="(submenu, sm) in menu.items"
            @click="$router.push(`/modules/${submenu.name}/${submenu._id}`)"
            :key="sm"
            :index="`${mn}${sm}`">{{ submenu.label }}</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </div>
</template>

<style scoped>
.custom-menu {
  border: transparent !important;
  margin: 0 auto !important;
}

.custom-menu .material-icons {
  opacity: .5 !important;
  transition: opacity .2s;
}

.custom-menu .el-sub-menu:hover .material-icons {
  opacity: 1 !important;
  transition: opacity .2s;
}

.custom-menu .el-sub-menu.is-active .material-icons {
  opacity: 1 !important;
}

.custom-menu:not(.el-menu--collapse) {
  width: 250px;
}

.custom-menu .el-menu.el-menu--inline .el-menu-item{
  color: white !important;
  padding-left: 4rem !important;
  font-size: 12px !important;
}

/* .el-sub-menu__title {

} */

</style>
