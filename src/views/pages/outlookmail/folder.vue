<script setup>
// imports
import * as Msal from "msal"
import { watch, onMounted, ref, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
// stores
import { useOutlookMailStore } from '@/stores/outlookmails/index'
// components
import SimpleLoader2 from '@/components/loading/Simple2.vue'
const MailboxMessage = defineAsyncComponent(() =>
  import('@/components/outlookmails/mailboxMessage.vue')
)

// refs
const searchFolder = ref()
const folderMessages = ref()
const selectedMessage = ref()
const token = ref()
const route = useRoute()
// stores
const outlookMailStore = useOutlookMailStore()
const {
  mailFolderLoading,
  getMailFolder,
  getMailFolderMessages
} = storeToRefs(outlookMailStore)
const { fetchMailFolder, fetchMailFolderMessages } = outlookMailStore

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
    getToken() // important
  })
  .catch(err => {
    // handle error
  })
}
const selectMessage = (payload) => {
  console.log(payload)
  selectedMessage.value = payload
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
          });
      }
    })
  } else {
    // user is not logged in, you will need to log them in to acquire a token
  }
}
const initializeMsGraphAuth = async () => {
  await fetchMailFolder(token.value, route.params.id)
  await fetchMailFolderMessages(token.value, getMailFolder.value)

  // select first on the list
  getMailFolderMessages.value.map((mfm, ix) => {
    if (ix === 0) selectedMessage.value = mfm
  })

  // assign
  folderMessages.value = getMailFolderMessages.value
}

// lifecycles
watch(() => searchFolder.value, (newVal, oldVal) => {
  if (newVal) {
    console.log(newVal)
    let filtered = getMailFolderMessages.value.filter(fm => {
      if (
        fm.subject.toLowerCase().indexOf(newVal) > -1 ||
        fm.from.emailAddress.name.toLowerCase().indexOf(newVal) > -1 ||
        fm.from.emailAddress.address.toLowerCase().indexOf(newVal) > -1
      ) return fm
    })
    folderMessages.value = filtered
  } else folderMessages.value = getMailFolderMessages.value
})

onMounted(async () => {
  await getToken()
  if (!token.value) await login()

  initializeMsGraphAuth()
})

</script>

<template>
  <BlockUI :blocked="mailFolderLoading">
    <Splitter class="mb-5">
      <SplitterPanel class="flex" :size="5">
        <div>
          <div class="flex flex-column gap-3 m-3">
            <div class="flex align-items-center justify-content-between">
              <div class="flex align-items-center gap-1">
                <div class="text-2xl text-primary font-bold">Mailbox</div>
                <div class="font-bold">({{ getMailFolder.displayName }})</div>
              </div>
              <div>
                <i @click="getToken()" class="cursor-pointer pi pi-refresh"></i>
              </div>
            </div>
            <div>
              <div>
                <span class="p-input-icon-left w-full">
                  <i class="pi pi-search" />
                  <InputText v-model="searchFolder" placeholder="Search" class="w-full" />
                </span>
              </div>
            </div>
          </div>

          <div
            v-if="folderMessages && folderMessages.length > 0"
            v-for="(message, mx) in folderMessages"
            :key="mx"
            @click="selectMessage(message)"
            class="p-4 cursor-pointer border-1 border-300 border-x-none white-space-nowrap overflow-hidden text-overflow-ellipsis"
            :class="`${mx !== 0 && 'border-top-none'} ${message.id === selectedMessage.id && 'bg-primary-100'}`">
            <div class="flex align-items-start justify-content-between gap-6">
              <div class="flex flex-column gap-1">
                <div class="font-bold">{{ message.from.emailAddress.name }}</div>
                <div>{{ message.subject }}</div>
              </div>
              <div class="flex flex-column gap-2">
                <div class="text-xs text-700">{{ message.receivedDateTime }}</div>
                <div><Tag value="Sample Tag"></Tag></div>
              </div>
            </div>
          </div>
          <div v-else class="p-4 white-space-nowrap overflow-hidden text-overflow-ellipsis">
            No messages found
          </div>
        </div>
      </SplitterPanel>
      <SplitterPanel class="flex" :size="75" >
        <MailboxMessage :token="token" :message="selectedMessage" />
      </SplitterPanel>
    </Splitter>
  </BlockUI>
</template>

<style scoped>

</style>