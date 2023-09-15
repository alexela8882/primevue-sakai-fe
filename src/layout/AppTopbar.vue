<script setup>
// --------------
// imports
// --------------
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useLayout } from '@/layout/composables/layout'
import { useRouter } from 'vue-router'
import { useToast } from "primevue/usetoast"
import axios from 'axios'

// -----------
// refs
// -----------
const authUser = ref()
const toast = useToast()
const { layoutConfig, onMenuToggle } = useLayout()
const outsideClickListener = ref(null)
const topbarMenuActive = ref(false)
const router = useRouter()
const isAuthenticated = localStorage.getItem('isAuthenticated')
const menu = ref()
const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Manage Users',
        icon: 'pi pi-user',
        command: () => {
          router.push('/users')
        }
      },
      {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        command: () => {
          logout()
        }
      }
    ]
  }
]);

// -------------
// methods
// -------------
const toggle = (event) => {
  menu.value.toggle(event)
}
onMounted(async () => {
  bindOutsideClickListener()

  // get auth user
  console.log(localStorage.getItem('auth_id'))

  await axios.get(`users/${localStorage.getItem('auth_id')}/get`).then((response) => {
    authUser.value = response.data
    console.log(authUser.value)
  })
})

onBeforeUnmount(() => {
  unbindOutsideClickListener()
});

const logoUrl = computed(() => {
  return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`
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
  localStorage.clear()

  router.push({name: 'login'})
  toast.add({ severity: 'success', summary: 'Success', detail: 'Logged out successfully', life: 3000 })
}
</script>

<template>
  <div class="layout-topbar">
    <router-link to="/" class="layout-topbar-logo">
      <div class="flex flex-column" style="font-size: 15px">
        <!-- <img :src="logoUrl" alt="logo" /> -->
        <div>
          <span class="text-red-600 font-bold">RED</span>
          <span>dot</span>
        </div>
        <div class="text-sm font-semibold">CRM</div>
      </div>
    </router-link>
    
    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
      <i class="pi pi-bars"></i>
    </button>

    <span class="layout-search p-input-icon-left ml-3">
      <i class="pi pi-search" />
      <InputText class="surface-100" v-model="value1" placeholder="Search" size="small" />
    </span>

    <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <div class="flex align-items-center">
        <span>Hello!&nbsp;</span>
        <span class="capitalize font-bold">{{ authUser && authUser.name }}</span>
      </div>
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

</style>
