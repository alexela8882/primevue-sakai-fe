<script setup>
// imports
import * as Msal from "msal"
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { useRouter } from "vue-router"
import { storeToRefs } from 'pinia'
// components
const Mailbox = defineAsyncComponent(() =>
  import('@/components/outlookmails/Mailbox.vue')
)
// stores
import { useOutlookMailStore } from '@/stores/outlookmails/index'

// refs
const router = useRouter()
const token = ref()
const selectedFolder = ref()
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
    clientId: 'ff1c1cc7-8341-4587-bbf7-f92982b6ec29' // alexela8882
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
    scopes: ["user.read", "mail.read", "mail.send"] // optional Array<string>
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
      scopes: ["user.read", "mail.read", "mail.send"]
    }
    await msalInstance.acquireTokenSilent(tokenRequest)
    .then(response => {
      // get access token from response
      token.value = response.accessToken
      console.log(response.accessToken)
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

  // console.log(getMailFolders.value)

  getMailFolders.value.map(mf => {
    if (mf.displayName === 'Sent Items') router.push(`/outlook-mail/folder/${mf.id}`)
  })
}

onMounted(async () => {
  await getToken()
  if (!token.value) await login()

  initializeMsGraphAuth()
})

</script>

<template>
  <div class="flex justify-content-center" style="height: 60vh !important;">
    <div class="flex flex-column align-items-center justify-content-center text-center mt-n6">
      <div v-if="!msgraphErrorMessage">
        <ProgressSpinner />
        <div>{{ msgraphLogicMessage }}</div>
        <div>Please wait...</div>
      </div>
      <div v-else>
        <div>{{ msgraphErrorMessage }}</div>
        <div><Button link >Refresh page to retry</Button></div>
      </div>
    </div>
  </div>
  <!-- <div>
    <div class="mb-5"><h1>Mailbox</h1></div>
    <div class="flex gap-6">
      <div style="position: relative !important;">
        <div v-if="!mailFoldersLoading" class="white-space-nowrap" style="position: sticky !important; top: 100px !important;">
          <div>
            <div
              v-for="(folder, fx) in getMailFolders"
              :key="fx"
              class="my-3 cursor-pointer"
              @click="router.push(`/outlook-mail/folder/${folder.id}`)">
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
  </div> -->
</template>

<style scoped>

</style>