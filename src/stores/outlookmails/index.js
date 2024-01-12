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
  const mailFolderMessagesMessageLoading = ref(false)
  const folderMessageReplyLoading = ref(false)
  const toast = useToast()
  // stores
  const baseStore = useBaseStore()
  const { jsonDbUrl } = storeToRefs(baseStore)

  // states
  const profile = ref()
  const mailFolders = ref([])
  const mailFolder = ref({})
  const mailFolderMessages = ref([])
  const mailFolderMessagesMessage = ref({})
  const skipValue = ref(0)
  const previousLink = ref(null)

  // getters
  const getSkipValue = computed(() => skipValue.value)
  const getPreviousLink = computed(() => previousLink.value)
  const getProfile = computed(() => profile.value)
  const getMailFolders = computed(() => mailFolders.value)
  const getMailFolder = computed(() => mailFolder.value)
  const getMailFolderMessages = computed(() => mailFolderMessages.value)
  const getMailFolderMessagesMessage = computed(() => mailFolderMessagesMessage.value)
  const fetchMsGraph = computed(() => {
    return (payload) => {
      const _method = payload.method
      const _endpoint = payload.endpoint
      const _token = payload.token
      const _body = payload.body

      var headers = new Headers()
      var bearer = "Bearer " + _token
      headers.append("Authorization", bearer)
      headers.append("Content-Type", 'application/json')
      var options = {
        method: _method,
        headers: headers,
        body: _body
      }
      var baseEndpoint = "https://graph.microsoft.com/v1.0/"
      var graphEndpoint = `${baseEndpoint}${_endpoint}`

      console.log(graphEndpoint)
      console.log(_body)
    
      let response = null
      if (!_body) {
        response = fetch(graphEndpoint, options)
          .then(response => response.text())
          .then((dataStr) => {
            //do something with response
            return JSON.parse(dataStr)
          })
      } else {
        response = fetch(graphEndpoint, options)
      }

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
    mailFoldersLoading.value = true

    const payload = {
      method: "GET",
      endpoint: "me/mailFolders",
      token: _token
    }

    const response = await fetchMsGraph.value(payload)
    mailFolders.value = response.value

    mailFoldersLoading.value = false
  }
  const fetchMailFolder = async (_token, id) => {
    mailFolderLoading.value = true

    const payload = {
      method: "GET",
      endpoint: `me/mailFolders/${id}`,
      token: _token
    }

    const response = await fetchMsGraph.value(payload)

    if (response) {
      mailFolder.value = response
      mailFolderLoading.value = false
    }
  }
  const fetchMailFolderMessages = async (_token, folder) => {
    mailFolderMessagesLoading.value = true

    const payload = {
      method: "GET",
      endpoint: `me/mailFolders/${folder.id}/messages`,
      token: _token
    }

    const response = await fetchMsGraph.value(payload)

    if (response.value) {
      console.log(response)
      mailFolderMessages.value = response
      mailFolderMessagesLoading.value = false

      // reset skip value
      skipValue.value = 0
    }
  }
  const fetchMailFolderMessagesMessage = async (id) => {
    mailFolderMessagesMessageLoading.value = true

    const message = mailFolderMessages.value.find(mfm => mfm.id === id)
    mailFolderMessagesMessage.value = message

    mailFolderMessagesMessageLoading.value = false
  }
  const replyToMailFolderMessagesMessage = async (_token, mail, body) => {
    folderMessageReplyLoading.value = true

    const reply = {
      message: {
        toRecipients: mail.toRecipients
      },
      comment: body // reply message
    }

    const payload = {
      method: "POST",
      endpoint: `me/mailFolders/${mail.parentFolderId}/messages/${mail.id}/reply`,
      token: _token,
      body: JSON.stringify(reply)
    }

    const response = await fetchMsGraph.value(payload)
    if (response.status === 202) {
      toast.add({ severity: 'success', summary: 'Success', detail: "Reply sent!", life: 3000 })
      folderMessageReplyLoading.value = false
    }
  }
  const folderMailMessagesNavigate = async (_token, link) => {
    mailFolderLoading.value = true

    var headers = new Headers()
    var bearer = "Bearer " + _token
    headers.append("Authorization", bearer)
    headers.append("Content-Type", 'application/json')
    var options = {
      method: 'GET',
      headers: headers
    }

    let response = null
    response = await fetch(link, options)
                    .then(response => response.text())
                    .then((dataStr) => {
                      //do something with response
                      return JSON.parse(dataStr)
                    })

    mailFolderMessages.value = response

    if (response) {
      // keep previous link
      previousLink.value = link

      // track skip params
      let splittedLink = link.split("24")
      let skipParam = splittedLink.find(item => item.toLowerCase().indexOf('skip=') > -1)
      let skipVal = skipParam.split("=")[1]

      skipValue.value = skipVal

      // mail folder messages
      mailFolderMessages.value = response
      mailFolderLoading.value = false
    }
  }

  return {
    profileLoading,
    mailFoldersLoading,
    mailFolderLoading,
    mailFolderMessagesLoading,
    mailFolderMessagesMessageLoading,
    folderMessageReplyLoading,
    getSkipValue,
    getPreviousLink,
    getProfile,
    getMailFolders,
    getMailFolder,
    getMailFolderMessages,
    getMailFolderMessagesMessage,
    fetchProfile,
    fetchMailFolder,
    fetchMailFolders,
    fetchMailFolderMessages,
    fetchMailFolderMessagesMessage,
    replyToMailFolderMessagesMessage,
    folderMailMessagesNavigate
  }
})