<script setup>
// imports
import { ref, watch, defineAsyncComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
// stores
import { useModuleStore } from '@/stores/modules'
import { useModuleDetailStore } from '@/stores/modules/detail'
import { useOutlookMailStore } from '@/stores/outlookmails'
// loaders
import TwoColumnList from '@/components/loading/TwoColumnList.vue'
// components
const SectionFields = defineAsyncComponent(() => import('@/components/modules/Page/SectionFields.vue'))
const Form = defineAsyncComponent(() => import('@/components/modules/Form/Form.vue'))

// defines
const props = defineProps({
  token: String,
  convertModule: Object,
  mailboxMessage: Object
})
const emit = defineEmits(['update-timeout'])

// refs
const reconstructedCollection = ref([])
const testValidationSchema = ref({
  test: 'initial value'
})
const testInputObj = ref()
const moduleValidationSchemes = ref({})
const moduleValidationInputs = ref({})
const timeout = ref(true)
const atIndexRelatedLists = ref([])
const requiredFields = ref([])
const requiredFieldsCount = ref(0)
const newModuleFields = ref([])
const selectedModule = ref(null)
const createInquiryFrom = ref()
const {
  values,
  errors,
  setErrors,
  setFieldError,
  ErrorBag,
  defineComponentBinds,
  isSubmitting,
  setFieldValue,
  handleSubmit,
  meta
} = useForm({
  // validationSchema: yup.object({
  //   // field0: yup.string().label('Field 0').required(),
  //   // test_fields: yup.object().shape({
  //   //   field_1: yup.string().label('Field 1').required()
  //   // }),
  //   // testInputs: yup.object({
  //   //   lead_first_name: yup.string().label('First Name').required()
  //   // }),
  //   testInputs: testInputObj.value
  // })
  // validationSchema: yup.object({
  //   lead_company: yup.string().label('Company').required()
  // }),
  // initialValues: testValidationSchema.value,
  // enableReinitialize: true
})
const field0 = defineComponentBinds('field0')
const test_fields = ref({
  field_1: defineComponentBinds('test_fields.field_1')
})
// const field_1 = defineComponentBinds('test_fields.field_1')
// stores
const moduleStore = useModuleStore()
const moduleDetailStore = useModuleDetailStore()
const outlookMailStore = useOutlookMailStore()
const {
    getEntityByName,
    getFieldDetailsByUname,
    getCollection,
    getModule,
    convertMailboxLoading } = storeToRefs(moduleStore)
const { getItemPanels, getRelatedListsByCname } = storeToRefs(moduleDetailStore)
const { getMailFolderMessages, getConversationMessages } = storeToRefs(outlookMailStore)
const { fetchConversationMessages } = outlookMailStore
const { fetchModule, convertMailboxToInquiry, insertModuleFromMailbox } = moduleStore
// presets
const testTab = ref({
  "type": "module-form",
  "style": "window",
  "name": "leads-window-create-form",
  "label": "Leads Form",
  "_module": "leads",
  "expanded": true,
  "opened": true,
  "opened_order": 1,
  "modalWidth": "900px",
  "base_module": {
    "_id": "5c906a1ba6ebc7193110f8b4",
    "name": "leads",
    "label": "Leads",
    "icon": "trending_up",
    "route": null,
    "color": "rgba(76, 175, 80, 0.7)",
    "description": "",
    "order": 2,
    "folder_id": "5c906a1ba6ebc7193110f893",
    "mainEntity": "Lead",
    "permissions": [
      "index",
      "create",
      "show",
      "delete",
      "update",
      "convert",
      "index",
      "create",
      "show",
      "delete",
      "update",
      "convert"
    ]
  }
})

// actions
const initialize = async () => {
  convertMailboxLoading.value = false

  await fetchModule({moduleName: props.convertModule.name})

  reconstructedCollection.value = getModule.value.data.filter(module => module.owner_id !== null)

  newModuleFields.value = getModule.value.fields
  // add collection item for filling field data
  newModuleFields.value.map(nmf => Object.assign(nmf, { ...nmf, data: { value: null } }))
  // generate dynamic fields for validation
  const testConst = {}
  newModuleFields.value.map(nmf => {
    if (nmf.rules && nmf.rules.required) {
      testConst[nmf.uniqueName] = yup.string().label(nmf.label).required()
      // moduleValidationSchemes.value[nmf.uniqueName] = yup.string().label(nmf.label).required()

      // console.log(yup.string().label(nmf.label).required())
      // console.log(moduleValidationSchemes.value[nmf.uniqueName])

      let obj = Object.assign({}, {
        [nmf.uniqueName]: yup.string().label(nmf.label).required()
      })

      console.log(obj)
    } else {
      testConst[nmf.uniqueName] = yup.string().label(nmf.label).nullable()
      // moduleValidationSchemes.value[nmf.uniqueName] = yup.string().label(nmf.label).nullable()
    }

    moduleValidationInputs.value[nmf.uniqueName] = defineComponentBinds(`${nmf.uniqueName}`)
    setFieldValue(`${nmf.uniqueName}`, null)

    // console.log(moduleValidationInputs.value)
    // console.log(moduleValidationInputs.value[nmf.uniqueName])

    // console.log(test_fields.value)
  })

  moduleValidationSchemes.value = testConst
  moduleValidationSchemes.value = yup.object(testConst)
  console.log(moduleValidationSchemes.value)

  // generate required fields for quick add
  requiredFields.value = newModuleFields.value.filter(nmf => (nmf.rules && nmf.rules.required))
  requiredFieldsCount.value = requiredFields.value.length

  let testObj = {
    test_fields: yup.object().shape({
      field_1: yup.string().label('Field 1').required()
    })
  }

  // console.log(testObj.test_fields.fields)

  // console.log(moduleValidationSchemes.value)
  // console.log(moduleValidationInputs.value)

  atIndexRelatedLists.value = getItemPanels.value.filter(ip => ip.controllerMethod.includes('@index'))

  // bug fix
  setTimeout(() => {
    timeout.value = false
    emit('update-timeout')
  }, 100)
}
const convertBtn = async () => {
  if (createInquiryFrom.value == 1) {
    proceedConvertMailbox(null)
  } else saveNewConvert()
}

const proceedConvertMailbox = async (module) => {
  let _module = null
  if (module !== null) _module = module
  else _module = selectedModule.value

  const convertedModule = getEntityByName.value(props.convertModule.name)
  let data = null

  const mailboxmsgName = props.mailboxMessage.from.emailAddress.name
  const mailboxmsgEmail = props.mailboxMessage.from.emailAddress.address

  // get convertsation messages
  await fetchConversationMessages(props.mailboxMessage, props.token)

  data = Object.assign({}, {
    owner_id: localStorage.getItem('auth_id'),
    source_id: 'Email',
    dateRequested: "01-06-2024",
    dateResponded: "01-06-2024",
    assigned_to_id: _module.owner_id,
    description: `This is a test from converted mailbox - ${Date.now()}`,
    type_id: convertedModule.mainEntity,
    link_id: _module._id,
    inquiryDate: Date.now(),
    subject: props.mailboxMessage.subject,
    remarks: 'dummy remarks',
    email_id: props.mailboxMessage.id,
    name: mailboxmsgName,
    email: mailboxmsgEmail,
    conversation_id: props.mailboxMessage.conversationId,
    conversations: getConversationMessages.value
  })

  // convert mailbox to inquiry
  proceedConvertMailboxToInquiry(data)
}

const saveNewConvert = async () => {
  const res = await validateSyncFunc()

  if (!res.inner) {
    const uuidDummy = Date.now()
    let obj = {_id: uuidDummy}

    Object.keys(res).forEach(r => {
      if (res[r] !== null) {
        const fieldName = getFieldDetailsByUname.value(r).name
        const fieldValue = res[r]
        // console.log(`${fieldName} - ${fieldValue}`)
        obj[fieldName] = fieldValue
      }
    })

    // dummy required lead owner
    obj['owner_id'] = {
      "_id": "5bb104ed678f71061f6451f8",
      "firstName": "Ninoy",
      "lastName": "Cahayon",
      "email": "ninoy.cahayon@escolifesciences.com"
    }

    // push new obj into collection
    // getCollection.value.data.push(obj)

    // console.log(getCollection.value)
    // console.log(props.convertModule.name)

    // proceed to call api
    const data = { module: props.convertModule, data: obj }
    const moduleRes = await insertModuleFromMailbox(data)

    if (moduleRes && moduleRes.status === 200) proceedConvertMailbox(data.data)
  } else console.log(moduleRes)
}
const validateSyncFunc = handleSubmit((values, actions) => {
  // update errors
  Object.keys(moduleValidationInputs.value).forEach((key, index) => {
    const val = moduleValidationInputs.value[key].modelValue
    if (val !== null) setFieldError(key, null)
  })

  try {
    moduleValidationSchemes.value.validateSync(values, { abortEarly: false })

    // alert(JSON.stringify(values, null, 2))
    // console.log(values)
    return values
  } catch (error) {
    // console.log(errors)
    // console.log(error.inner)
    let errArray = []
    error.inner.map(err => {
      let obj = { [err.path]: err.message }
      errArray.push(obj)
      // actions.setErrors(obj)
      actions.setFieldError(err.path, err.message)
    })

    return error
  }
})
const proceedConvertMailboxToInquiry = async (data) => {
  const res = await convertMailboxToInquiry(data)

  if (res && res.status === 200) {
    const inquiry_id = res.data.collection.data.find(d => d.email_id == data.email_id)._id

    getMailFolderMessages.value.value.find(fm => {
      if (fm.id === data.email_id) {
        let newObj = { ...fm, convertedToInquiry: true, inquiry_id: inquiry_id }
        Object.assign(fm, newObj)
      }
    })
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
  <!-- <pre>{{ reconstructedCollection }}</pre> -->
  <div>
    <!-- <pre>{{ getEntityByName(convertModule.name) }}</pre> -->
    <div class="flex flex-column gap-3 m-4">
      <div class="flex align-items-center">
        <RadioButton v-model="createInquiryFrom" inputId="ingredient1" name="1" :value="1" disabled />
        <label class="ml-2">Choose existing</label>
      </div>
      <Dropdown
        v-model="selectedModule"
        :options="reconstructedCollection"
        optionLabel="owner_id.firstName"
        optionvalue="_id"
        filter
        placeholder="Select"
        class="w-full">
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
        <!-- <Form :config="testTab"></Form> -->
        <!-- <div class="text-l text-700 font-bold bg-primary-50 p-2 mb-4">All required fields</div>
        <div class="grid">
          <div v-for="(requiredField, rfx) in requiredFields" :key="rfx" class="col-6">
            <span class="p-float-label">
              <InputText
                @update:modelValue="validateSyncFunc()"
                v-bind="moduleValidationInputs[requiredField.uniqueName]"
                class="w-full border-left-3"
                :class="`${!errors[requiredField.uniqueName] && meta.touched ? 'border-green-600' : 'border-red-600'}`"
              />
              <label>{{ requiredField.label }}</label>
            </span>
            <small v-if="errors[requiredField.uniqueName]" class="text-red-600">
              {{ errors[requiredField.uniqueName] }}
            </small>
          </div>
        </div> -->

        <!-- <h3>Detailed add</h3> -->
        <!-- <div v-for="(panel, px) in atIndexRelatedLists" :key="px" class="flex flex-column gap-1">
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
                      :moduleValidationInputs="moduleValidationInputs"
                      :moduleValidationErrors="errors"
                      :moduleValidationMeta="meta"
                      @validate-sync-func="validateSyncFunc()" />
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
                          :moduleValidationInputs="moduleValidationInputs"
                          :moduleValidationErrors="errors"
                          :moduleValidationMeta="meta"
                          @validate-sync-func="validateSyncFunc()" />
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
        </div> -->
      </div>
    </div>

    <Teleport to=".mailbox-dialog-footer">
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
            @click="convertBtn()"
            :disabled="!createInquiryFrom || (createInquiryFrom == 2 && (!meta.valid))"
            :loading="convertMailboxLoading || isSubmitting"
            label="Proceed"
            class="border-round-3xl py-2 px-4" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>

</style>