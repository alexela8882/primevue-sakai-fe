<script setup>
// imports
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useOutlookMailStore } from '@/stores/outlookmails'
// tinymce
import Editor from '@tinymce/tinymce-vue'

// defines
const props = defineProps({
  mail: Object,
  token: String
})

// refs
const replySubject = ref()
const replyBody = ref()
const tinyApiKey = ref('izbi1p0d9vddiqqrjjtgx2a6ech4jv2wqogrplsesugoa0gs')
const tinyPlugins = ref([
  'advlist autolink lists link image charmap print preview anchor',
  'searchreplace visualblocks code fullscreen',
  'insertdatetime media table contextmenu paste'
])
const tinyInit = ref({
  inline: true,
  plugins: tinyPlugins.value,
  toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image'
})
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
    <!-- <Editor v-model="replyBody" editorStyle="height: 320px" /> -->

    <editor :api-key="tinyApiKey" :plugins="tinyPlugins"></editor>
    <!-- <editor
      v-model="replyBody"
      :api-key="tinyApiKey"
      :init="tinyInit"/> -->

    <div>
      <Button
        @click="replyToMail()"
        :loading="folderMessageReplyLoading"
        :disabled="folderMessageReplyLoading"
        :label="`${folderMessageReplyLoading ? 'Sending...' : 'Send'}`" />
    </div>
  </div>
</template>

<style>
</style>