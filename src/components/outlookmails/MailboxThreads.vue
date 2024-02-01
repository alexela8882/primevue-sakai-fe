<script setup>
// imports
import { ref, defineAsyncComponent } from 'vue'
// components
const MailboxMessageBody = defineAsyncComponent(() =>
  import('@/components/outlookmails/MailboxMessageBody.vue')
)

// defines
const props = defineProps({
  threads: Array
})

</script>

<template>
  <div>
    <div v-for="(thread, tx) in threads" :key="tx">
      <Panel
        :header="`${thread.from.emailAddress.name} (${thread.from.emailAddress.address})`"
        toggleable
        collapsed
        class="my-2 detail-page-panel">
        <p class="my-3">
          <MailboxMessageBody :message="thread" />
        </p>
      </Panel>
    </div>
  </div>
</template>

<style>
.detail-page-panel .p-panel-header {
  background-color: var(--primary-color) !important;
  color: white !important;
}
</style>