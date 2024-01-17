<script setup>
// imports
import { ref, watch, defineAsyncComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useModuleStore } from '@/stores/modules'

// defines
const props = defineProps({
  convertModule: Object,
  mailboxMessage: Object
})

// refs
const selectedModule = ref(null)
const createInquiryFrom = ref()
// stores
const moduleStore = useModuleStore()
const { getEntityByName, getCollection, convertMailboxLoading } = storeToRefs(moduleStore)
const { fetchModule, convertMailboxToInquiry } = moduleStore

// actions
const initialize = async () => {
  convertMailboxLoading.value = false

  fetchModule(props.convertModule.name)
}
const proceedConvert = async () => {
  const convertedModule = getEntityByName.value(props.convertModule.name)

  if (createInquiryFrom.value == 1) {
    const data = Object.assign({}, {
      source_id: 'Email',
      dateRequested: Date.now(),
      dateResponded: Date.now(),
      dateResponded: Date.now(),
      assigned_to_id: selectedModule.value.owner_id,
      description: `This is a test - ${Date.now()}`,
      type: convertedModule.mainEntity,
      link_id: selectedModule.value._id,
      email_id: props.mailboxMessage.id,
      conversation_id: props.mailboxMessage.conversationId
    })

    await convertMailboxToInquiry(data)
  }
}

// lifecycles
// watchers
watch(() => createInquiryFrom.value, (newVal, oldVal) => {
  if (newVal == 2) selectedModule.value = null
})
watch(() => selectedModule.value, (newVal, oldVal) => {
  if (newVal) createInquiryFrom.value = 1
})
watch(() => props.convertModule, (newVal, oldVal) => {
  console.log(newVal)
  initialize()
})
onMounted(() => {
  initialize()

  console.log(getEntityByName.value(props.convertModule.name))
})

</script>

<template>
  <div>
    <!-- <pre>{{ getEntityByName(convertModule.name) }}</pre> -->
    <div class="flex flex-column gap-3 m-4">
      <div class="flex align-items-center">
        <RadioButton v-model="createInquiryFrom" inputId="ingredient1" name="1" :value="1" disabled />
        <label class="ml-2">Choose existing</label>
      </div>
      <Dropdown
        v-model="selectedModule"
        :options="getCollection.data"
        optionLabel="owner_id.email"
        optionvalue="_id"
        filter
        placeholder="Select"
        class="w-full">
        <template #option="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.owner_id.email }} ({{ slotProps.option.company }})</div>
          </div>
        </template>
      </Dropdown>

      <div v-if="selectedModule">
        <!-- {{ selectedModule }} -->
        <div>
          {{ selectedModule.firstName }}&nbsp;{{ selectedModule.lastName }}
        </div>
        <div>
          Owner: {{ selectedModule.owner_id.firstName }}&nbsp;{{ selectedModule.owner_id.lastName }}
        </div>
        <div>Company: {{ selectedModule.company }}</div>
        <div>Status: {{ selectedModule.status_id }}</div>
        <div>Country: {{ selectedModule.country_id.name }}</div>
      </div>
    </div>
    <Divider />
    <div class="flex flex-column gap-3 m-4">
      <div class="flex align-items-center">
        <RadioButton v-model="createInquiryFrom" inputId="ingredient1" name="2" :value="2" />
        <label class="ml-2">Create new</label>
      </div>
    </div>

    <div class="m-4">
      <div class="flex align-items-center justify-content-end my-2 gap-2">
        <Button
          @click="$emit('trigger-dialog')"
          :disabled="convertMailboxLoading"
          outlined
          label="Cancel"
          class="border-round-3xl py-2 px-4 border-color-primary"
          size="small" />
        <Button
          @click="proceedConvert()"
          :disabled="!createInquiryFrom || convertMailboxLoading"
          label="Proceed"
          class="border-round-3xl py-2 px-4" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>