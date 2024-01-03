import { defineStore } from 'pinia'
import { useToast } from "primevue/usetoast"
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'

export const useGeneralStore = defineStore('general', () => {

  // refs
  const router = useRouter()
  const toast = useToast()

  // states
  const popUpModalOpen = ref()
  const formModalOpen = ref()
  const formModalTrigger = ref()
  const popUpModalTrigger = ref()
  const toastOpen = ref()

  const popUpModalData = ref({})
  const formModalData = ref({})
  const pageData = ref({})
  const toastData = ref({})
  const toastTimer = ref()
  const searchInput = ref()
  const searchItems = ref()
  const backendUrl = ref('https://dfbe-2001-4452-2be-4000-f1f-af8a-47e1-f3eb.ngrok-free.app')

  // getters
  const getTheme = computed(() => theme.value)
  const getNewPrimevueTheme = computed(() => newPrimevueTheme.value)
  const getPreviousPrimevueTheme = computed(() => previousPrimevueTheme.value)

  // actions
  const popUpModalDataFill = (payload) => { popUpModalData.value = Object.assign({}, payload) }
  const formModalDataFill = (payload) => { formModalData.value = Object.assign({}, payload) }
  const pageDataFill = (payload) => { pageData.value = Object.assign({}, payload) }
  const toastDataFill = (payload) => { toastData.value = Object.assign({}, payload) }
  
  const throwError = (error) => {
    clearTimeout(toastTimer.value)

    toast.add({ severity: 'error', summary: 'Error', detail: 'Sorry, you are not authorized to access this page.', life: 3000 })

    var host = window.location.host
    var subdomain = host.split('.')[0]
    console.log(subdomain)

    // go to previous url or go home
    if (subdomain === 'frontend') window.history.back()
    else router.push('/')
  }

  return {
    searchInput,
    searchItems,
    getTheme,
    getPreviousPrimevueTheme,
    getNewPrimevueTheme,
    backendUrl,
    popUpModalOpen,
    popUpModalData,
    formModalOpen,
    formModalTrigger,
    popUpModalTrigger,
    formModalData,
    pageData,
    toastOpen,
    toastData,
    toastTimer,
    popUpModalDataFill,
    formModalDataFill,
    pageDataFill,
    toastDataFill,
    throwError
  }
})
