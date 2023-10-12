<script setup>
// imports
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useBaseStore } from '@/stores/base'

// refs
// stores
const baseStore = useBaseStore()
const {
  menuLoading,
  getMenu,
  sidebarMenu
} = storeToRefs(baseStore)
const { fetchMenu, fetchModules } = baseStore

// fetches
fetchMenu()
fetchModules()
</script>

<template>
  <div>
    <div v-if="menuLoading">
      <div class="">
        <ul class="m-0 p-0 list-none">
          <li v-for="(skel, sk) in 5" :key="sk" class="my-3">
            <div class="flex">
              <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
              <div class="align-self-center" style="flex: 1">
                <Skeleton width="100%" class="mb-2"></Skeleton>
                <Skeleton width="75%"></Skeleton>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <el-menu
        class="custom-menu"
        :collapse="true"
        background-color="transparent">
        <el-sub-menu v-for="(menu, mn) in sidebarMenu" :index="`${mn}`" :key="mn">
          <template #title>
            <div class="material-icons text-white">{{ menu.icon }}</div>
            <span>{{ menu.label }}</span>
          </template>
          <el-menu-item
            v-if="menu.items.length > 0"
            v-for="(submenu, sm) in menu.items"
            @click="$router.push(`/modules/${submenu._id}`)"
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
  margin: 0 auto;
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
</style>
