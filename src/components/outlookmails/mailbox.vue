<script setup>
// imports
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useOutlookMailStore } from '@/stores/outlookmails/index'

// refs
const folderOpened = ref(true)
const selectedContextData = ref()
// stores
const outlookMailStore = useOutlookMailStore()
const {
  getMailFolderMessages,
  getMailFolderMessagesMessage,
  mailFolderMessagesLoading
} = storeToRefs(outlookMailStore)
const {
  fetchMailFolderMessages,
  fetchMailFolderMessagesMessage
} = outlookMailStore
// defines
const props = defineProps({
  token: String,
  folder: Object
})

// actions
const onRowClick = (event) => {
  console.log(event.data)
  const message = event.data

  // fetch message
  fetchMailFolderMessagesMessage(message.id)

  folderOpened.value = false
}

// lifecycles
watch(() => props.folder, (newFolder, oldFolder) => {
  console.log(oldFolder)
  fetchMailFolderMessages(props.token, newFolder)
  folderOpened.value = true
})

</script>

<template>
  <div v-if="folderOpened">
    <!-- <pre>{{ getMailFolderMessages }}</pre> -->
    <DataTable
      :value="getMailFolderMessages"
      :loading="mailFolderMessagesLoading"
      @row-click="onRowClick"
      class="w-full">
      <Column field="from.emailAddress.name" header="From" class="cursor-pointer"></Column>
      <Column field="subject" header="Subject" class="cursor-pointer"></Column>
      <Column field="receivedDateTime" header="Received" class="cursor-pointer"></Column>
    </DataTable>
  </div>

  <div v-else>
    <Card>
      <template #title>{{ getMailFolderMessagesMessage.subject }}</template>
      <template #content>
        <div class="flex align-items-center mb-5 gap-2">
          <div>
            <Avatar icon="pi pi-user" class="mr-2" shape="circle" size="xlarge" />
          </div>
          <div>
            <div>
              {{ getMailFolderMessagesMessage.from.emailAddress.name }}
              &lt;{{ getMailFolderMessagesMessage.from.emailAddress.address }}&gt;
            </div>

            <div>
              <div v-for="recipient in getMailFolderMessagesMessage.toRecipients">
                To: {{ recipient.emailAddress.address }}
              </div>
            </div>
          </div>
        </div>

        <p class="m-0">
          <div v-html="getMailFolderMessagesMessage.body.content"></div>
        </p>
      </template>
    </Card>
  </div>
</template>

<style scoped>

</style>