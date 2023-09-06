<script setup>
// --------------
// imports
// --------------
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useLayout } from '@/layout/composables/layout'
import { useRouter } from 'vue-router'
import { useToast } from "primevue/usetoast"

// -----------
// refs
// -----------
const toast = useToast()
const { layoutConfig, onMenuToggle } = useLayout()
const outsideClickListener = ref(null)
const topbarMenuActive = ref(false)
const router = useRouter()
const isAuthenticated = localStorage.getItem('isAuthenticated')

// -------------
// methods
// -------------
onMounted(() => {
  bindOutsideClickListener()
});

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
        <div style="font-size: 12px;">CRM</div>
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
      <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-calendar"></i>
        <span>Calendar</span>
      </button>
      <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-user"></i>
        <span>Profile</span>
      </button>
      <button @click="onSettingsClick()" class="p-link layout-topbar-button">
        <i class="pi pi-cog"></i>
        <span>Settings</span>
      </button>
      <button v-if="isAuthenticated" @click="logout()" class="p-link layout-topbar-button">
        <i class="pi pi-sign-out"></i>
        <span>SignOut</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
