<script setup>
// imports
import * as Msal from "msal"
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
// stores
import { useOutlookMailStore } from '@/stores/outlookmails/index'
// components
const MailboxMessage = defineAsyncComponent(() =>
  import('@/components/outlookmails/mailboxMessage.vue')
)

// refs
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

  await fetchMailFolder(token.value, route.params.id)
  await fetchMailFolderMessages(token.value, getMailFolder.value)

  // select first on the list
  getMailFolderMessages.value.map((mfm, ix) => {
    if (ix === 0) selectedMessage.value = mfm
  })
})

</script>

<template>
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
              <i class="cursor-pointer pi pi-refresh"></i>
            </div>
          </div>
          <div>
            <div>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-search" />
                <InputText v-model="value1" placeholder="Search" class="w-full" />
              </span>
            </div>
          </div>
        </div>

        <div
          v-if="selectedMessage"
          v-for="(message, mx) in getMailFolderMessages"
          :key="mx"
          @click="selectMessage(message)"
          class="p-4 cursor-pointer border-1 border-300 border-x-none white-space-nowrap overflow-hidden text-overflow-ellipsis"
          :class="`${mx !== 0 && 'border-top-none'} ${message.id === selectedMessage.id && 'bg-primary-100'}`">
          {{ message.subject }}
        </div>
      </div>
    </SplitterPanel>
    <SplitterPanel class="flex" :size="75">
      <MailboxMessage :token="token" :message="selectedMessage" />
    </SplitterPanel>
  </Splitter>
</template>

<style scoped>

</style>