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
  modulesLoading,
  getMenu,
  sidebarMenu,
  getModules
} = storeToRefs(baseStore)
const { fetchMenu, fetchModules } = baseStore

const items = ref([
  {
    label: 'File',
    icon: 'pi pi-fw pi-file',
    items: [
      {
        label: 'New',
        icon: 'pi pi-fw pi-plus',
        items: [
          {
            label: 'Bookmark',
            icon: 'pi pi-fw pi-bookmark'
          },
          {
            label: 'Video',
            icon: 'pi pi-fw pi-video'
          }
        ]
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-trash'
      },
      {
        separator: true
      },
      {
        label: 'Export',
        icon: 'pi pi-fw pi-external-link'
      }
    ]
  }
]);

// fetches
fetchMenu()
fetchModules()

</script>

<template>
  <div>
    <h4>Sidebar Menu</h4>
    <PanelMenu :model="sidebarMenu" />
    <!-- <div class="mb-6">
      <h4>Menu</h4>
      <div v-if="menuLoading">
        <div class="">
          <ul class="m-0 p-0 list-none">
            <li class="mb-3">
              <div class="flex">
                <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                <div class="align-self-center" style="flex: 1">
                  <Skeleton width="100%" class="mb-2"></Skeleton>
                  <Skeleton width="75%"></Skeleton>
                </div>
              </div>
            </li>
            <li class="mb-3">
              <div class="flex">
                <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                <div class="align-self-center" style="flex: 1">
                  <Skeleton width="100%" class="mb-2"></Skeleton>
                  <Skeleton width="75%"></Skeleton>
                </div>
              </div>
            </li>
            <li class="mb-3">
              <div class="flex">
                <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                <div class="align-self-center" style="flex: 1">
                  <Skeleton width="100%" class="mb-2"></Skeleton>
                  <Skeleton width="75%"></Skeleton>
                </div>
              </div>
            </li>
            <li>
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
        <ul class="layout-menu text-center">
          <template v-for="(folder, fl) in getMenu.top.folders" :key="fl">
            <li>
              <div class="material-icons">{{ folder.icon }}</div>
              <div class="capitalize">{{ folder.name }}</div>
            </li>
          </template>
        </ul>
      </div>
    </div> -->

    <div>
      <h4>Menu</h4>
      <div v-if="menuLoading">Loading menu...</div>
      <div v-else>
        <pre>{{ getMenu }}</pre>
      </div>
    </div>

    <div>
      <h4>Modules</h4>
      <div v-if="modulesLoading">Loading modules...</div>
      <div v-else>
        <pre>{{ getModules }}</pre>
      </div>
    </div>
  </div>
</template>