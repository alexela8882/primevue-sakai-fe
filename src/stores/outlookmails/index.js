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
  const getProfile = computed(() => profile.value)
  const getMailFolders = computed(() => mailFolders.value)
  const getMailFolder = computed(() => mailFolder.value)
  const getMailFolderMessages = computed(() => mailFolderMessages.value)
  const fetchMsGraph = computed(() => {
    return (payload) => {
      const _method = payload.method
      const _endpoint = payload.endpoint
      const _token = payload.token

      var headers = new Headers()
      var bearer = "Bearer " + _token
      headers.append("Authorization", bearer)
      var options = {
        method: _method,
        headers: headers
      }
      var baseEndpoint = "https://graph.microsoft.com/v1.0/"
      var graphEndpoint = `${baseEndpoint}${_endpoint}`
    
      const response = fetch(graphEndpoint, options)
        .then(response => response.text())
        .then((dataStr) => {
          //do something with response
          return JSON.parse(dataStr)
        })

      return response
    }
  })

  // actions
  const fetchProfile = async (_token) => {
    profileLoading.value = true

    const payload = {
      method: "GET",
      endpoint: "me",
      token: _token
    }

    const response = await fetchMsGraph.value(payload)
    console.log(response)
    profile.value = response

    profileLoading.value = false
  }
  const fetchMailFolders = async (_token) => {
    mailFolderLoading.value = true
    // const res = await axios(`msgraph/mail-folders`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'ngrok-skip-browser-warning': 'true'
    //   }
    // })

    // if (res.status === 200) {
    //   // baseModule.value = (res.data && res.data.length > 0) ? res.data[0] : res.data
    //   console.log(res.data)
    // }

    const payload = {
      method: "GET",
      endpoint: "me/mailFolders",
      token: _token
    }

    const response = await fetchMsGraph.value(payload)
    mailFolders.value = response.value

    mailFolderLoading.value = false
  }

  return {
    profileLoading,
    mailFoldersLoading,
    mailFolderLoading,
    mailFolderMessagesLoading,
    getProfile,
    getMailFolders,
    getMailFolder,
    getMailFolderMessages,
    fetchProfile,
    fetchMailFolders
  }
})