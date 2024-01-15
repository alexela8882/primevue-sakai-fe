<script setup>
// imports
import { ref, watch, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useOutlookMailStore } from '@/stores/outlookmails/index'
// components
const MailboxReply = defineAsyncComponent(() =>
  import('@/components/outlookmails/MailboxReply.vue')
)

// defines
const props = defineProps({
  token: String,
  message: Object
})

// refs
const outlookReply = ref(false)
// stores
const outlookMailStore = useOutlookMailStore()
const { folderMessageReplyLoading } = storeToRefs(outlookMailStore)

// actions
const mailReply = async () => {
  outlookReply.value = true
}

// lifecycles
watch(() => folderMessageReplyLoading.value, (newVal, oldVal) => {
  if (!newVal) outlookReply.value = false
})
</script>

<template>
  <div class="w-full">
    <div v-if="message" class="flex flex-column gap-4">
      <div class="flex justify-content-between">
        <div class="font-bold text-2xl">{{ message.subject }}</div>
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
    v-model:visible="outlookReply"
    maximizable
    modal
    header="You are replying to a mail"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <p class="m-0">
      <MailboxReply :mail="message" :token="token" />
    </p>
  </Dialog>
</template>

<style scoped>

</style>