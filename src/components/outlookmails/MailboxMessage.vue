<script setup>
// imports
import { ref, watch, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useOutlookMailStore } from '@/stores/outlookmails'
import { useModuleStore } from '@/stores/modules'
// components
const MailboxReply = defineAsyncComponent(() =>
  import('@/components/outlookmails/MailboxReply.vue')
)
const ConvertMailboxMessage = defineAsyncComponent(() =>
  import('@/components/outlookmails/ConvertMailboxMessage.vue')
)

// defines
const props = defineProps({
  token: String,
  message: Object
})

// refs
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
</script>

<template>
  <div class="w-full">
    <div v-if="message" class="flex flex-column gap-4">
      <div class="flex justify-content-between">
        <div class="flex align-items-center gap-2">
          <span class="font-bold text-2xl">{{ message.subject }}</span>
          <span v-if="message.convertedToInquiry" class="text-xl">&nbsp;(Converted to inquiry)</span>
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
        <div class="flex align-items-center justify-content-between">
          <div class="flex align-items-center mb-5 gap-2">
            <div>
              <Avatar icon="pi pi-user" class="mr-2" shape="circle" size="xlarge" />
            </div>
            <div>
              <div>
                {{ message.from.emailAddress.name }}
                &lt;{{ message.from.emailAddress.address }}&gt;
              </div>

              <div>
                <div v-for="recipient in message.toRecipients.slice(0, 2)">
                  To: {{ recipient.emailAddress.address }}
                  <span v-if="message.toRecipients.length > 2">
                    and {{ message.toRecipients.length - 2 }} others
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p class="m-0">
          <!-- <pre>{{ message }}</pre> -->
          <div v-html="message.body.content"></div>
        </p>
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
      :mailboxMessage="message"
      :convertModule="convertMailboxToModule"
      @trigger-dialog="convertMailboxDialog = false"
    />
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

.convert-mailbox-dialog.p-dialog .p-dialog-content {
  padding: 0 !important;
}
</style>