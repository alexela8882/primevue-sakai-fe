<script setup>
// imports
import * as Msal from "msal"
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
// components
const Mailbox = defineAsyncComponent(() =>
  import('@/components/outlookmails/mailbox.vue')
)
// stores
import { useOutlookMailStore } from '@/stores/outlookmails/index'

// refs
const token = ref()
const selectedFolder = ref()
// stores
const outlookMailStore = useOutlookMailStore()
const {
  getProfile,
  getMailFolders,
  mailFoldersLoading,
  getMailFolder,
  getMailFolderMessages
} = storeToRefs(outlookMailStore)
const { fetchProfile, fetchMailFolders } = outlookMailStore

// MSAL SETUP
const msalConfig = {
  auth: {
    clientId: '002454d9-50f5-4e5f-83ab-d5291500800a' // alexela8882
  }
}
const msalInstance = new Msal.UserAgentApplication(msalConfig)
msalInstance.handleRedirectCallback((error, response) => {
  // handle redirect response or error
})

// actions
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

onMounted(async () => {
  await getToken()
  if (!token.value) await login()

  fetchProfile(token.value)
  fetchMailFolders(token.value)
})

</script>

<template>
  <div>
    <div class="mb-5"><h1>Mailbox</h1></div>
    <div class="flex gap-6">
      <div style="position: relative !important;">
        <div v-if="!mailFoldersLoading" class="white-space-nowrap" style="position: sticky !important; top: 100px !important;">
          <div>
            <div
              v-for="(folder, fx) in getMailFolders"
              :key="fx"
              class="my-3 cursor-pointer"
              @click="selectedFolder = folder">
              {{ folder.displayName }}
            </div>
          </div>
        </div>
        <div v-else>
          <Skeleton class="mb-2"></Skeleton>
          <Skeleton width="10rem" class="mb-2"></Skeleton>
          <Skeleton width="5rem" class="mb-2"></Skeleton>
          <Skeleton height="2rem" class="mb-2"></Skeleton>
          <Skeleton width="10rem" height="4rem"></Skeleton>
        </div>
      </div>

      <div class="w-full">
        <Suspense>
          <Mailbox :token="token" :folder="selectedFolder" />
        </Suspense>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>