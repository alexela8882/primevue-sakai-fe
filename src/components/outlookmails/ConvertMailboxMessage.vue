<script setup>
// imports
import { ref, watch, defineAsyncComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useModuleStore } from '@/stores/modules'
import { useModuleDetailStore } from '@/stores/modules/detail'
import { useOutlookMailStore } from '@/stores/outlookmails'
// loaders
import TwoColumnList from '@/components/loading/TwoColumnList.vue'
// components
const SectionFields = defineAsyncComponent(() => import('@/components/modules/Page/SectionFields.vue'))

// defines
const props = defineProps({
  convertModule: Object,
  mailboxMessage: Object
})

// refs
const timeout = ref(true)
const atIndexRelatedLists = ref([])
const requiredFields = ref([])
const requiredFieldsCount = ref(0)
const newModuleFields = ref([])
const selectedModule = ref(null)
const createInquiryFrom = ref()
// stores
const moduleStore = useModuleStore()
const moduleDetailStore = useModuleDetailStore()
const outlookMailStore = useOutlookMailStore()
const {
    getEntityByName,
    getCollection,
    getModule,
    convertMailboxLoading } = storeToRefs(moduleStore)
const { getItemPanels, getRelatedListsByCname } = storeToRefs(moduleDetailStore)
const { getMailFolderMessages } = storeToRefs(outlookMailStore)
const { fetchModule, convertMailboxToInquiry } = moduleStore

// actions
const initialize = async () => {
  setTimeout(() => {
    timeout.value = false
    $emit('update-timeout')
  }, 100)

  convertMailboxLoading.value = false

  await fetchModule(props.convertModule.name)

  newModuleFields.value = getModule.value.fields
  // add collection item for filling field data
  newModuleFields.value.map(nmf => Object.assign(nmf, { ...nmf, data: { value: null } }))

  // generate required fields for quick add
  requiredFields.value = newModuleFields.value.filter(nmf => (nmf.rules && nmf.rules.required))
  requiredFieldsCount.value = requiredFields.value.length

  console.log(newModuleFields.value)

  atIndexRelatedLists.value = getItemPanels.value.filter(ip => ip.controllerMethod.includes('@index'))
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
    getMailFolderMessages.value.value.find(fm => {
      if (fm.id === data.email_id) {
        let newObj = { ...fm, convertedToInquiry: true }
        Object.assign(fm, newObj)
      }
    })
  }
}
const fillFields = (args) => {
  // console.log(args)
  // console.log(newModuleFields.value)

  const index = newModuleFields.value.findIndex(nmf => nmf._id === args.field_id)
  if (index !== -1) {
    newModuleFields.value[index].data.value = args.modelValue
  }

  // update required fields
  requiredFieldsCount.value = newModuleFields.value.filter(nmf => ((nmf.rules && nmf.rules.required) && (nmf.data.value == null || nmf.data.value == ''))).length

  // console.log(requiredFieldsCount.value)
  // console.log(newModuleFields.value)
}
const updateModuleFields = () => {
  // console.log(newModuleFields.value)

  // update required fields
  requiredFieldsCount.value = newModuleFields.value.filter(nmf => ((nmf.rules && nmf.rules.required) && (nmf.data.value == null || nmf.data.value == ''))).length
  console.log(requiredFieldsCount.value)
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
        <RadioButton v-model="createInquiryFrom" name="2" :value="2" />
        <label class="ml-2">Create new</label>
      </div>

      <div>
        <h3>Quick add</h3>
        <div class="grid">
          <div v-for="(requiredField, rfx) in requiredFields" :key="rfx" class="col-6">
            <span class="p-float-label">
              <InputText
                v-model="requiredField.data.value"
                :disabled="requiredField.name == 'source_id'"
                @update:modelValue="updateModuleFields()"
                class="w-full border-left-3 border-red-600"
              />
              <label>{{ requiredField.label }}</label>
            </span>
          </div>
        </div>

        <h3>Detailed add</h3>
        <div v-for="(panel, px) in atIndexRelatedLists" :key="px" class="flex flex-column gap-1">
          <div v-for="(section, sx) in panel.sections" :key="sx" :class="`${sx !== 0 && 'mt-4'}`">
            <div>
              <div>
                <div v-if="section.sectionLabel">
                  <div class="text-l text-700 font-bold bg-primary-50 p-2">{{ section.sectionLabel }}</div>
                </div>
              </div>
              <div class="flex flex-column mt-4">
                <div v-if="panel.controllerMethod.indexOf('@index') > -1">
                  <Suspense v-if="section.field_ids.length > 0">
                    <SectionFields
                      mode="edit"
                      source="Email"
                      :fieldIds="section.field_ids"
                      :newModuleFields="newModuleFields"
                      @update-module-fields="updateModuleFields()" />
                    <template #fallback>
                      <TwoColumnList />
                    </template>
                  </Suspense>
                  <div v-if="section.additional_fields.length > 0">
                    <div v-for="(addition_field, afx) in section.additional_fields" :key="afx">
                      <Suspense v-if="addition_field.ids.length > 0">
                        <SectionFields
                          mode="edit"
                          source="Email"
                          :fieldIds="addition_field.ids"
                          :newModuleFields="newModuleFields"
                          @update-module-fields="updateModuleFields()" />
                        <template #fallback>
                          <TwoColumnList />
                        </template>
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport v-if="!timeout" to=".mailbox-dialog-footer">
      <div class="p-2 border-top-1 border-200">
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
            :disabled="!createInquiryFrom || (createInquiryFrom == 2 && requiredFieldsCount > 1)"
            :loading="convertMailboxLoading"
            label="Proceed"
            class="border-round-3xl py-2 px-4" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>

</style>