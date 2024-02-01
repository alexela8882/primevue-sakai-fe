<script setup>
// imports
import { ref, watch, defineAsyncComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
// stores
import { useOutlookMailStore } from '@/stores/outlookmails'
import { useModuleStore } from '@/stores/modules'
// loaders
import TwoColumnList from '@/components/loading/TwoColumnList.vue'
// components
const MailboxReply = defineAsyncComponent(() =>
  import('@/components/outlookmails/MailboxReply.vue')
)
const ConvertMailboxMessage = defineAsyncComponent(() =>
  import('@/components/outlookmails/ConvertMailboxMessage.vue')
)
const MailboxMessageBody = defineAsyncComponent(() =>
  import('@/components/outlookmails/MailboxMessageBody.vue')
)

// defines
const props = defineProps({
  token: String,
  message: Object,
  inquiryModuleInfo: Object
})

// refs
const router = useRouter()
const cmmtimeout = ref(false)
const outlookReplyDialog = ref(false)
const convertMailboxToModule = ref()
const convertMailboxTo = ref([
  {
    label: 'Leads',
    name: 'leads',
    command: (event) => {
      convertMailboxMessageBtn(event.item)
    }
  }, {
    label: 'Defect Reports',
    name: 'defectreports',
    command: (event) => {
      convertMailboxMessageBtn(event.item)
    }
  }, {
    label: 'Breakdown Log',
    name: 'breakdownlogs',
    command: (event) => {
      convertMailboxMessageBtn(event.item)
    }
  }, {
    label: 'Job Request',
    name: 'servicejobs',
    command: (event) => {
      convertMailboxMessageBtn(event.item)
    }
  }
])
// stores
const outlookMailStore = useOutlookMailStore()
const moduleStore = useModuleStore()
const { folderMessageReplyLoading } = storeToRefs(outlookMailStore)
const { fetchConversationMessages } = outlookMailStore
const { convertMailboxDialog } = storeToRefs(moduleStore)

// actions
const mailReply = async () => {
  outlookReplyDialog.value = true
}
const convertMailboxMessageBtn = (payload) => {
  console.log(props.message)
  convertMailboxDialog.value = true
  convertMailboxToModule.value = payload
}

// lifecycles
watch(() => folderMessageReplyLoading.value, (newVal, oldVal) => {
  if (!newVal) outlookReplyDialog.value = false
})

onMounted(() => {
  // fetchConversationMessages(props.message, props.token)
})
</script>

<template>
  <div class="w-full">
    <!-- <pre>{{ message.conversationId }}</pre> -->
    <div v-if="message" class="flex flex-column gap-4">
      <div class="flex justify-content-between">
        <div class="flex align-items-center gap-2">
          <span class="font-bold text-2xl">{{ message.subject }}</span>
          <span v-if="message.convertedToInquiry" class="flex align-items-center gap-2">
            <span class="text-xl">&nbsp;(Converted to inquiry)</span>
            <span
              @click="router.push({ name: 'modules.pages.detail', params: { name: 'inquiries', id: inquiryModuleInfo._id, pageid: message.inquiry_id }})"
              class="pi pi-reply cursor-pointer font-bold text-primary"
              v-tooltip.bottom="{
                value: 'view inquiry',
                pt: {
                  arrow: {
                    style: {
                      borderBottomColor: 'var(--primary-color)'
                    }
                  },
                  text: 'bg-primary font-medium'
                }
              }"></span>
            </span>
        </div>
        <div class="flex align-items-center gap-3">
          <div>
            <font-awesome-icon
              @click="mailReply()"
              icon="fa-solid fa-reply"
              class="cursor-pointer"
              style="font-size: 1.5rem; color: var(--primary-300);">
            </font-awesome-icon>
          </div>
          <div>
            <SplitButton
              :model="convertMailboxTo"
              :disabled="message.convertedToInquiry"
              label="Convert"
              outlined></SplitButton>
          </div>
        </div>
      </div>
      <div>
        <MailboxMessageBody :message="message" />
      </div>
    </div>
  </div>

  <!-- Mail Reply Dialog -->
  <Dialog
    v-model:visible="outlookReplyDialog"
    maximizable
    modal
    header="You are replying to a mail"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <p class="m-0">
      <MailboxReply :mail="message" :token="token" />
    </p>
  </Dialog>

  <!-- Convert Mailbox Dialog -->
  <Dialog
    v-model:visible="convertMailboxDialog"
    modal
    maximizable
    :style="{ width: '60vw' }"
    class="convert-mailbox-dialog">
    <template #header>
      <div class="flex align-items-center text-2xl">
        <div>Convert to Inquiry &mdash; {{ convertMailboxToModule.label }}</div>
      </div>
    </template>
    <ConvertMailboxMessage
      :token="token"
      :mailboxMessage="message"
      :convertModule="convertMailboxToModule"
      @trigger-dialog="convertMailboxDialog = false"
      @update-timeout="cmmtimeout = false"
    />
    <template #footer>
      <div class="mailbox-dialog-footer surface-50">
        <div v-if="cmmtimeout" class="flex align-items-center justify-content-end gap-2 p-2">
          <Skeleton width="5rem" height="2rem"></Skeleton>
          <Skeleton width="5rem" height="2rem"></Skeleton>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style>
.convert-mailbox-dialog .p-dialog-header {
  background-color: var(--primary-color);
  color: var(--surface-a);
}
.convert-mailbox-dialog.p-dialog .p-dialog-header .p-dialog-header-icon {
  color: var(--surface-a);
}

.convert-mailbox-dialog.p-dialog .p-dialog-content, .p-dialog-footer {
  padding: 0 !important;
}
</style>