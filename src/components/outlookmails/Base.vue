<script setup>
// imports
import * as Msal from "msal"
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { useRouter } from "vue-router"
import { storeToRefs } from 'pinia'
// components
// stores
import { useOutlookMailStore } from '@/stores/outlookmails/index'

// refs
const router = useRouter()
const token = ref()
const msgraphLogicMessage = ref()
const msgraphErrorMessage = ref()
// stores
const outlookMailStore = useOutlookMailStore()
const {
  getMailFolders,
  mailFoldersLoading
} = storeToRefs(outlookMailStore)
const { fetchProfile, fetchMailFolders } = outlookMailStore

// MSAL SETUP
const msalConfig = {
  auth: {
    clientId: '002454d9-50f5-4e5f-83ab-d5291500800a' // alexela8882
    // clientId: 'error' // for error testing
  }
}
const msalInstance = new Msal.UserAgentApplication(msalConfig)
msalInstance.handleRedirectCallback((error, response) => {
  // handle redirect response or error
})

// actions
const login = async () => {
  msgraphLogicMessage.value = "Trying to sign you in"

  var loginRequest = {
    scopes: ["user.read", "mail.send"] // optional Array<string>
  }

  await msalInstance.loginPopup(loginRequest)
  .then(response => {
    getToken() // important
  })
  .catch(err => {
    // handle error
    console.log(err)
    msgraphErrorMessage.value = err
  })
}

const getToken = async () => {
  if (msalInstance.getAccount()) {
    var tokenRequest = {
      scopes: ["user.read", "mail.send"]
    }
    await msalInstance.acquireTokenSilent(tokenRequest)
    .then(response => {
      // get access token from response
      token.value = response.accessToken
      initializeMsGraphAuth()
    })
    .catch(err => {
      // could also check if err instance of InteractionRequiredAuthError if you can import the class.
      if (err.name === "InteractionRequiredAuthError") {
        return msalInstance.acquireTokenPopup(tokenRequest)
          .then(response => {
            // get access token from response
            token.value = response.accessToken
          })
          .catch(err => {
            // handle error
            console.log(err)
          });
      }

      console.log(err)
    })
  } else {
    // user is not logged in, you will need to log them in to acquire a token
  }
}

const initializeMsGraphAuth = async () => {
  msgraphLogicMessage.value = "Redirecting to your inbox"

  await fetchProfile(token.value)
  await fetchMailFolders(token.value)
}

onMounted(async () => {
  await getToken()
  if (!token.value) await login()

  initializeMsGraphAuth()
})

</script>

<template>
  <div></div>
</template>

<style scoped>

</style>