<script setup>
// imports
import { ref } from 'vue'
import AppMenuItem from './AppMenuItem.vue'
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

const reddotMenus = ref([
  {
    label: '',
    items: [
      { label: 'Dashboard', icon: 'fa-solid fa-gauge-high', to: '/' },
      { label: 'Country', icon: 'fa-solid fa-earth-asia', to: '/countries' },
      { label: 'Campaign', icon: 'fa-solid fa-bullhorn', square: true, to: '/campaigns' },
      { label: 'Leads', icon: 'fa-solid fa-chart-simple', square: true, to: '/leads' },
      { label: 'Account', icon: 'fa-solid fa-building', square: true, to: '/uikit/invalidstate' },
      { label: 'Opportunity', icon: 'fa-solid fa-magnifying-glass-dollar', square: true, to: '/uikit/button' },
      { label: 'Quotation', icon: 'fa-solid fa-file', square: true, to: '/uikit/table' },
      { label: 'Reports', icon: 'fa-solid fa-file-signature', square: true, to: '/uikit/list' },
      { label: 'Product', icon: 'fa-solid fa-box-open', square: true, to: '/uikit/tree' },
      { label: 'Pricelist', icon: 'fa-solid fa-tags', square: true, to: '/uikit/panel' },
      { label: 'Work Order', icon: 'fa-solid fa-file-lines', square: true, to: '/uikit/overlay' },
      { label: 'Service', icon: 'fa-solid fa-screwdriver-wrench', square: true, to: '/uikit/media' },
    ]
  }
])

const model = ref([
  {
    label: 'Home',
    items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
  },
  {
    label: 'UI Components',
    items: [
      { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
      { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
      { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
      { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
      { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
      { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
      { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
      { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
      { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
      { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
      { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
      { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
      { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
      { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
      { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
      { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
    ]
  },
  {
    label: 'Prime Blocks',
    items: [
      { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: 'NEW' },
      { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: 'https://www.primefaces.org/primeblocks-vue', target: '_blank' }
    ]
  },
  {
    label: 'Utilities',
    items: [
      { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
      { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: 'https://www.primefaces.org/primeflex/', target: '_blank' }
    ]
  },
  {
    label: 'Pages',
    icon: 'pi pi-fw pi-briefcase',
    to: '/pages',
    items: [
      {
        label: 'Landing',
        icon: 'pi pi-fw pi-globe',
        to: '/landing'
      },
      {
        label: 'Auth',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Login',
            icon: 'pi pi-fw pi-sign-in',
            to: '/auth/login'
          },
          {
            label: 'Error',
            icon: 'pi pi-fw pi-times-circle',
            to: '/auth/error'
          },
          {
            label: 'Access Denied',
            icon: 'pi pi-fw pi-lock',
            to: '/auth/access'
          }
        ]
      },
      {
        label: 'Crud',
        icon: 'pi pi-fw pi-pencil',
        to: '/pages/crud'
      },
      {
        label: 'Timeline',
        icon: 'pi pi-fw pi-calendar',
        to: '/pages/timeline'
      },
      {
        label: 'Not Found',
        icon: 'pi pi-fw pi-exclamation-circle',
        to: '/pages/notfound'
      },
      {
        label: 'Empty',
        icon: 'pi pi-fw pi-circle-off',
        to: '/pages/empty'
      }
    ]
  },
  {
    label: 'Hierarchy',
    items: [
      {
        label: 'Submenu 1',
        icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: 'Submenu 1.1',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
            ]
          },
          {
            label: 'Submenu 1.2',
            icon: 'pi pi-fw pi-bookmark',
            items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
          }
        ]
      },
      {
        label: 'Submenu 2',
        icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: 'Submenu 2.1',
            icon: 'pi pi-fw pi-bookmark',
            items: [
              { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
              { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
            ]
          },
          {
            label: 'Submenu 2.2',
            icon: 'pi pi-fw pi-bookmark',
            items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
          }
        ]
      }
    ]
  },
  {
    label: 'Get Started',
    items: [
      {
        label: 'Documentation',
        icon: 'pi pi-fw pi-question',
        to: '/documentation'
      },
      {
        label: 'View Source',
        icon: 'pi pi-fw pi-search',
        url: 'https://github.com/primefaces/sakai-vue',
        target: '_blank'
      },
      {
        label: 'Nuxt Version',
        url: 'https://github.com/primefaces/sakai-nuxt',
        icon: 'pi pi-fw pi-star'
      }
    ]
  }
]);
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
      <PanelMenu :model="sidebarMenu" />
      <!-- <ul class="layout-menu text-center">
        <template v-for="(folder, fl) in getMenu.top.folders" :key="fl">
          <li class="py-2 text-white my-2 cursor-pointer">
            <div
              class="custom-menu material-icons border-circle p-2"
              style="font-size: 2rem;">
              <div class="item">{{ folder.icon }}</div>
            </div>
          </li>
        </template>
      </ul> -->
    </div>
  </div>
  <!-- <ul class="layout-menu text-center">
    <template v-for="(item, i) in reddotMenus" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
    <li>
      <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
        <img src="/layout/images/banner-primeblocks.png" alt="Prime Blocks" class="w-full mt-3" />
      </a>
    </li>
  </ul> -->
</template>

<style scoped>
.custom-menu .item {
  opacity: .5;
  transition: opacity .2s;
}
.custom-menu:hover .item {
  opacity: 1;
  transition: opacity .2s;
}
</style>
