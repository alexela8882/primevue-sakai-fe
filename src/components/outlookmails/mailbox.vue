<script setup>
// imports
import { ref, onMounted, watch, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
// components
const MailboxMessage = defineAsyncComponent(() =>
  import('@/components/outlookmails/MailboxMessage.vue')
)
// stores
import { useOutlookMailStore } from '@/stores/outlookmails'

// refs
const folderOpened = ref(true)
// stores
const outlookMailStore = useOutlookMailStore()
const {
  getMailFolderMessages,
  getMailFolderMessagesMessage,
  mailFolderMessagesLoading,
  folderMessageReplyLoading
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
    <MailboxMessage :token="token" :message="getMailFolderMessagesMessage" />
  </div>
</template>

<style scoped>

</style>