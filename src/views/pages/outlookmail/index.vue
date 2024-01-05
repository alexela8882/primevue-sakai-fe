<script setup>
// imports
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useOutlookMailStore } from '@/stores/outlookmails/index'

// refs
// stores
const outlookMailStore = useOutlookMailStore()
const {
  getProfile,
  getMailFolders,
  getMailFolder,
  getMailFolderMessages
} = storeToRefs(outlookMailStore)
const { fetchProfile, fetchMailFolders } = outlookMailStore

import * as Msal from "msal"
// if using cdn version, 'Msal' will be available in the global scope

const token = ref()
const msgraphMe = ref()

const msalConfig = {
  auth: {
    clientId: '002454d9-50f5-4e5f-83ab-d5291500800a'
  }
}

const msalInstance = new Msal.UserAgentApplication(msalConfig)

msalInstance.handleRedirectCallback((error, response) => {
  // handle redirect response or error
})

const login = async () => {
  var loginRequest = {
    scopes: ["user.read", "mail.send"] // optional Array<string>
  }

  await msalInstance.loginPopup(loginRequest)
  .then(response => {
    // handle response
  })
  .catch(err => {
    // handle error
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
      console.log(response.accessToken)
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
          });
      }
    })
  } else {
    // user is not logged in, you will need to log them in to acquire a token
  }
}

// const getMsgraphProfile = () => {
//   var headers = new Headers()
//   var bearer = "Bearer " + token.value
//   headers.append("Authorization", bearer)
//   var options = {
//     method: "GET",
//     headers: headers
//   }
//   var baseEndpoint = "https://graph.microsoft.com/v1.0/"
//   var endpoint = "me"
//   var graphEndpoint = `${baseEndpoint}${endpoint}`

//   fetch(graphEndpoint, options)
//     .then(response => response.text())
//     .then((dataStr) => {
//       //do something with response
//       msgraphMe.value = JSON.parse(dataStr)
//       console.log(dataStr)
//     })
// }

onMounted(async () => {
  await getToken()
  if (!token.value) await login()

  fetchProfile(token.value)
  fetchMailFolders(token.value)
})

</script>

<template>
  <div>
    Outlook mail

    <div class="grid">
      <div class="col">
        <h3>getProfile</h3>
        <div>{{ getProfile }}</div>
      </div>
      
      <div class="col">
        <h3>Mail Folders</h3>
        <div>
          <ul v-for="folder in getMailFolders">
            <li>{{ folder.displayName }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- <button @click="getMsgraphProfile()">Get MsGraph</button> -->
  </div>
</template>

<style scoped>

</style>