<script setup>
// imports
import * as Msal from "msal"
import { computed, watch, onMounted, ref, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
// stores
import { useModuleStore } from '@/stores/modules'
import { useOutlookMailStore } from '@/stores/outlookmails/index'
// components
import SimpleLoader2 from '@/components/loading/Simple2.vue'
const MailboxMessage = defineAsyncComponent(() =>
  import('@/components/outlookmails/mailboxMessage.vue')
)

// refs
const inquiryRequiredFields = ref([])
const msgraphLogicMessage = ref()
const msgraphErrorMessage = ref()
const searchFolder = ref()
const folderMessages = ref()
const selectedMessage = ref()
const token = ref()
const route = useRoute()
const router = useRouter()
const inquiryModuleInfo = ref()
const inquiryModule = ref()
// stores
const moduleStore = useModuleStore()
const outlookMailStore = useOutlookMailStore()
const { getBaseModule } = storeToRefs(moduleStore)
const {
  mailFolderLoading,
  getSkipValue,
  getPreviousLink,
  getMailFolder,
  getMailFolderMessages
} = storeToRefs(outlookMailStore)
const {
  fetchMailFolder,
  fetchMailFolderMessages,
  folderMailMessagesNavigate,
  fetchConversationMessages } = outlookMailStore
const { _fetchBaseModuleByField } = moduleStore

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

// computed properties
const itemPage = computed(() => Number(getSkipValue.value) + 1)
const currentPage = computed(() => {
  const curPage = Number(getSkipValue.value) + 10
  if (curPage > getMailFolder.value.totalItemCount) {
    return getMailFolder.value.totalItemCount
  } else return curPage
})

// actions
const login = async () => {
  msgraphLogicMessage.value = "Trying to sign you in"

  var loginRequest = {
    scopes: ["user.read", "mail.read", "mail.send"] // optional Array<string>
  }

  await msalInstance.loginPopup(loginRequest)
  .then(response => {
    // handle response
    getToken() // important
  })
  .catch(err => {
    // handle error
    msgraphErrorMessage.value = err
  })
}
const selectMessage = async (payload) => {
  console.log(payload)
  // await fetchConversationMessages(payload, token.value)
  selectedMessage.value = payload
}
const getToken = async () => {
  msgraphLogicMessage.value = "Retrieving your messages"

  if (msalInstance.getAccount()) {
    var tokenRequest = {
      scopes: ["user.read", "mail.read", "mail.send"]
    }
    await msalInstance.acquireTokenSilent(tokenRequest)
    .then(response => {
      // get access token from response
      token.value = response.accessToken
      // console.log(response.accessToken)
      initializeMsGraph()

      // resets
      msgraphLogicMessage.value = null
      msgraphErrorMessage.value = null
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
            msgraphErrorMessage.value = err
          });
      }
    })
  } else {
    // user is not logged in, you will need to log them in to acquire a token
  }
}
const initializeMsGraph = async () => {
  msgraphLogicMessage.value = "Retrieving your messages"

  await fetchMailFolder(token.value, route.params.id)
  await fetchMailFolderMessages(token.value, getMailFolder.value)

  // assign
  folderMessages.value = getMailFolderMessages.value.value
  msgraphLogicMessage.value = null
}
const nextLink = () => {
  console.log(getMailFolderMessages.value['@odata.nextLink'])
  folderMailMessagesNavigate(token.value, getMailFolderMessages.value['@odata.nextLink'])
}
const prevLink = () => {
  console.log(getSkipValue.value)
  if (getSkipValue.value) {
    console.log(getPreviousLink.value)

    let splittedLink = getPreviousLink.value.split("24")
    let skipParam = splittedLink.find(item => item.toLowerCase().indexOf('skip=') > -1)

    let newLink = getPreviousLink.value.replace(skipParam, `skip=${getSkipValue.value - 10}`)
    folderMailMessagesNavigate(token.value, newLink)
  }
}

// lifecycles
watch(() => searchFolder.value, (newVal, oldVal) => {
  if (newVal) {
    let filtered = getMailFolderMessages.value.value.filter(fm => {
      if (
        fm.subject.toLowerCase().indexOf(newVal) > -1 ||
        fm.from.emailAddress.name.toLowerCase().indexOf(newVal) > -1 ||
        fm.from.emailAddress.address.toLowerCase().indexOf(newVal) > -1
      ) return fm
    })
    folderMessages.value = filtered
  } else folderMessages.value = getMailFolderMessages.value.value
})

watch(() => getMailFolderMessages.value, (newVal, oldVal) => {
  folderMessages.value = newVal.value

  // console.log(oldVal.value)
  // console.log(newVal.value)

  // select first message on the list
  newVal.value.map((mfm, ix) => {
    if (ix === 0) selectedMessage.value = mfm
  })
})

onMounted(async () => {
  await getToken()
  if (!token.value) await login()

  initializeMsGraph()

  // fetch inquiry module
  const res = await _fetchBaseModuleByField({ field: 'name', value: 'inquiries' })
  inquiryModuleInfo.value = res

  inquiryRequiredFields.value = inquiryModuleInfo.value.fields && inquiryModuleInfo.value.fields.filter(field => field.rules.required).map(field => field.name)
})

</script>

<template>
  {{ inquiryRequiredFields }}
  <div v-if="msgraphErrorMessage" class="flex justify-content-center" style="height: 60vh !important;">
    <div class="flex flex-column align-items-center justify-content-center text-center mt-n6">
      <div>{{ msgraphErrorMessage }}</div>
      <div><Button link >Refresh page to retry</Button></div>
    </div>
  </div>
  <div v-else-if="msgraphLogicMessage" class="flex justify-content-center" style="height: 60vh !important;">
    <div class="flex flex-column align-items-center justify-content-center text-center mt-n6">
      <ProgressSpinner />
      <div>{{ msgraphLogicMessage }}</div>
      <div>Please wait...</div>
    </div>
  </div>
  <BlockUI v-else :blocked="mailFolderLoading">
    <Splitter>
      <SplitterPanel class="flex" :size="5">
        <div style="height: 85vh !important; overflow-y: scroll;">
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

            <div class="flex align-items-center gap-3 m-3">
              <div>{{ itemPage }} - {{ currentPage }} of ({{ getMailFolder.totalItemCount }})</div>
              <div>
                <Button
                  @click="prevLink()"
                  :disabled="getSkipValue == 0"
                  icon="pi pi-chevron-left"
                  text rounded />
                <Button
                  @click="nextLink()"
                  :disabled="!getMailFolderMessages['@odata.nextLink']"
                  icon="pi pi-chevron-right"
                  text rounded />
              </div>
            </div>

            <div>
              <div
                v-if="folderMessages && folderMessages.length > 0"
                v-for="(message, mx) in folderMessages"
                :key="mx"
                @click="selectMessage(message)"
                class="p-4 cursor-pointer border-1 border-300 border-x-none white-space-nowrap overflow-hidden text-overflow-ellipsis"
                :class="`${message.convertedToInquiry && 'bg-primary-50'} ${mx !== 0 && 'border-top-none'} ${(message.id === (selectedMessage && selectedMessage.id)) && 'bg-primary-100'}`">
                <div class="flex align-items-center justify-content-between gap-6">
                  <div class="flex flex-column gap-1">
                    <div class="font-bold">{{ message.from.emailAddress.name }}</div>
                    <div
                      class="text-overflow-ellipsis w-14rem overflow-hidden"
                      :class="`${!message.isRead && 'font-bold'}`"
                    >{{ message.subject }}</div>
                  </div>
                  <div class="flex flex-column gap-2 align-self-start">
                    <div
                      class="text-xs text-700"
                      :class="`${!message.isRead && 'font-bold'}`"
                    >{{ message.receivedDateTime }}</div>
                    <div v-if="message.convertedToInquiry">
                      <Button
                        @click="router.push({ name: 'modules.pages.detail', params: { name: 'inquiries', id: inquiryModuleInfo._id, pageid: message.inquiry_id }})"
                        label="View inquiry"
                        size="small"
                        outlined>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="p-4 white-space-nowrap overflow-hidden text-overflow-ellipsis">
                No messages found
              </div>
            </div>

            <div class="flex align-items-center gap-3 m-3">
              <div>{{ itemPage }} - {{ currentPage }} of ({{ getMailFolder.totalItemCount }})</div>
              <div>
                <Button
                  @click="prevLink()"
                  :disabled="getSkipValue == 0"
                  icon="pi pi-chevron-left"
                  text rounded />
                <Button
                  @click="nextLink()"
                  :disabled="!getMailFolderMessages['@odata.nextLink']"
                  icon="pi pi-chevron-right"
                  text rounded />
              </div>
            </div>
          </div>
        </div>
      </SplitterPanel>
      <SplitterPanel class="flex" :size="75" >
        <div style="height: 85vh !important; overflow-y: scroll;" class="p-4 w-full">
          <MailboxMessage :token="token" :message="selectedMessage" :inquiryModuleInfo="inquiryModuleInfo" />
        </div>
      </SplitterPanel>
    </Splitter>
  </BlockUI>
</template>

<style scoped>

</style>