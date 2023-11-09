<script setup>
// --------------
// imports
// --------------
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToast } from "primevue/usetoast"
import axios from 'axios'
// stores & composables
import { useBaseStore } from '../stores/base'
import { useLayout } from '@/layout/composables/layout'

// -----------
// refs
// -----------
// stores & composables
const baseStore = useBaseStore()
const { layoutConfig, onMenuToggle } = useLayout()
const authUser = ref()
const toast = useToast()
const outsideClickListener = ref(null)
const topbarMenuActive = ref(false)
const router = useRouter()
const isAuthenticated = localStorage.getItem('isAuthenticated')
const menu = ref()
const { configBar } = storeToRefs(baseStore)
const items = ref([
  {
    label: 'Themes',
      icon: 'pi pi-palette',
      command: () => {
        configBar.value = true
      }
    }, {
      label: 'Modules',
      icon: 'pi pi-book',
      command: () => {
        router.push('/modules')
      }
    }, {
      separator: true
    }, {
      label: 'Sign Out',
      icon: 'pi pi-sign-out',
      command: () => {
        logout()
      }
    }
])

// -------------
// methods
// -------------
const toggle = (event) => {
  menu.value.toggle(event)
}
onMounted(async () => {
  bindOutsideClickListener()

  // get auth user
  await axios.get(`users/${localStorage.getItem('auth_id')}/get`).then((response) => {
    authUser.value = response.data
    console.log(authUser.value)
  })
})

onBeforeUnmount(() => {
  unbindOutsideClickListener()
});

const logoUrl = computed(() => {
  return `layout/${layoutConfig.darkTheme.value ? 'reddot-logo' : 'reddot-logo'}.png`
});

const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value
};
const onSettingsClick = () => {
  topbarMenuActive.value = false
  router.push('/documentation')
};
const topbarMenuClasses = computed(() => {
  return {
    'layout-topbar-menu-mobile-active': topbarMenuActive.value
  }
})

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false
      }
    };
    document.addEventListener('click', outsideClickListener.value)
  }
}
const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener)
    outsideClickListener.value = null
  }
}
const isOutsideClicked = (event) => {
  if (!topbarMenuActive.value) return

  const sidebarEl = document.querySelector('.layout-topbar-menu')
  const topbarEl = document.querySelector('.layout-topbar-menu-button')

  return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target))
}

const logout = () => {
  // localStorage.clear()
  localStorage.removeItem("token")
  localStorage.removeItem("auth_id")
  localStorage.removeItem("isAuthenticated")

  router.push({name: 'login'})
  toast.add({ severity: 'success', summary: 'Success', detail: 'Logged out successfully', life: 3000 })
}
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-menu-button" style="width: 100px;"></div>
    <router-link to="/" class="layout-topbar-logo">
      <div>
        <img :src="logoUrl" width="110" alt="logo" />
      </div>
      <!-- <div class="flex flex-column" style="font-size: 15px">
        <div>
          <span class="text-red-600 font-bold">RED</span>
          <span>dot</span>
        </div>
        <div class="text-sm font-semibold">CRM</div>
      </div> -->
    </router-link>
    
    <!-- <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
      <i class="pi pi-bars"></i>
    </button> -->

    <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <span class="flex align-items-center layout-search p-input-icon-left ml-3">
        <i class="pi pi-search" />
        <InputText placeholder="Quick search..." size="large" />
      </span>
      <!-- <div class="flex align-items-center">
        <span>Hello!&nbsp;</span>
        <span class="capitalize font-bold">{{ authUser && authUser.name }}</span>
      </div> -->
      <!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-calendar"></i>
        <span>Calendar</span>
      </button>
      <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-user"></i>
        <span>Profile</span>
      </button> -->
      <button @click="onSettingsClick()" class="p-link layout-topbar-button">
        <i class="pi pi-bell"></i>
        <span>Bell</span>
      </button>
      <!-- <Button icon="pi pi-bell" rounded aria-label="Filter" /> -->
      <div class="justify-content-center">
        <button v-if="isAuthenticated" @click="toggle" class="p-link layout-topbar-button">
          <i class="pi pi-bars" style="font-size: 1rem;"></i>
          <span>Menu</span>
        </button>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
      </div>
      <!-- <button v-if="isAuthenticated" @click="logout()" class="p-link layout-topbar-button">
        <i class="pi pi-bars" size="small"></i>
        <span>SignOut</span>
      </button> -->
    </div>
  </div>
</template>

<style scoped>

.layout-topbar a:focus {
  box-shadow: none !important;
}
.p-inputtext {
  border: 1px solid lightgray !important;
  border-radius: 10px !important;
  padding: 7px 15px 7px 35px !important;
}
</style>
