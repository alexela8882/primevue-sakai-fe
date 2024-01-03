// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
// stores
import { useBaseStore } from '@/stores/base'

export const useOutlookMailStore = defineStore('outlookMailStore', () => {

  // refs
  const profileLoading = ref(false)
  const mailFoldersLoading = ref(false)
  const mailFolderLoading = ref(false)
  const mailFolderMessagesLoading = ref(false)
  const toast = useToast()
  // stores
  const baseStore = useBaseStore()
  const { jsonDbUrl } = storeToRefs(baseStore)

  // states
  const profile = ref()
  const mailFolders = ref([])
  const mailFolder = ref({})
  const mailFolderMessages = ref([])

  // getters
  const getMailFolders = computed(() => mailFolders.value)
  const getMailFolder = computed(() => mailFolder.value)
  const getMailFolderMessages = computed(() => mailFolderMessages.value)

  // actions
  const fetchProfile = async () => {
    profileLoading.value = true
    const res = await axios(`msgraph`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    })

    if (res.status === 200) {
      // baseModule.value = (res.data && res.data.length > 0) ? res.data[0] : res.data
      console.log(res.data)
    }
    profileLoading.value = false
  }
  const fetchMailFolders = async () => {
    mailFolderLoading.value = true
    const res = await axios(`msgraph/mail-folders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    })

    if (res.status === 200) {
      // baseModule.value = (res.data && res.data.length > 0) ? res.data[0] : res.data
      console.log(res.data)
    }
    mailFolderLoading.value = false
  }

  return {
    profileLoading,
    mailFoldersLoading,
    mailFolderLoading,
    mailFolderMessagesLoading,
    getMailFolders,
    getMailFolder,
    getMailFolderMessages,
    fetchProfile,
    fetchMailFolders
  }
})