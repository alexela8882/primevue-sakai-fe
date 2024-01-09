<script setup>
// imports
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useOutlookMailStore } from '@/stores/outlookmails/index'

// defines
const props = defineProps({
  mail: Object,
  token: String
})

// refs
const replySubject = ref()
const replyBody = ref()
// stores
const outlookMailStore = useOutlookMailStore()
const {
  folderMessageReplyLoading
} = storeToRefs(outlookMailStore)
const {
  replyToMailFolderMessagesMessage
} = outlookMailStore

// actions
const replyToMail = () => {
  replyToMailFolderMessagesMessage(props.token, props.mail, replyBody.value)
}

// lifecycles
onMounted(() => {
  replySubject.value = `Re: ${props.mail.subject}`
})

</script>

<template>
  <div class="flex flex-column gap-2">
    <InputText type="text" v-model="replySubject" class="w-full" />
    <Editor v-model="replyBody" editorStyle="height: 320px" />

    <div>
      <Button
        @click="replyToMail()"
        :loading="folderMessageReplyLoading"
        :disabled="folderMessageReplyLoading"
        :label="`${folderMessageReplyLoading ? 'Sending...' : 'Send'}`" />
    </div>
  </div>
</template>

<style scoped>

</style>