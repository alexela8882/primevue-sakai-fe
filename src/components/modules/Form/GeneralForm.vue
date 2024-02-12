<script setup>
// imports
import { ref, defineProps, onMounted, defineAsyncComponent, defineEmits } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
// stores
import { useModuleStore } from '@/stores/modules'
import { useModuleDetailStore } from '@/stores/modules/detail'
// components
const SectionFields = defineAsyncComponent(() => import('@/components/modules/Page/SectionFields.vue'))
// loaders
import TwoColumnList from '@/components/loading/TwoColumnList.vue'

// defines & emits
const props = defineProps({
  tabStyle: String,
  name: String,
  module: Object
})
const emit = defineEmits(['update-timeout'])

// refs
const timeout = ref(true)
const moduleValidationSchemes = ref({})
const moduleValidationInputs = ref({})
const atIndexRelatedLists = ref([])
const requiredFields = ref([])
const newModuleFields = ref([])
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
} = useForm({})
// stores
const moduleStore = useModuleStore()
const moduleDetailStore = useModuleDetailStore()
const {
    getEntityByName,
    getFieldDetailsByUname } = storeToRefs(moduleStore)
const { getItemPanels, getRelatedListsByCname } = storeToRefs(moduleDetailStore)

// actions
const proceedBtn = async () => {
  const res = await validateSyncFunc()
  if (!res.inner) console.log('passed')
  else console.log('error')
}
const initialize = () => {
  newModuleFields.value = props.module.fields
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

  let testObj = {
    test_fields: yup.object().shape({
      field_1: yup.string().label('Field 1').required()
    })
  }

  // console.log(testObj.test_fields.fields)

  // console.log(moduleValidationSchemes.value)
  // console.log(moduleValidationInputs.value)

  atIndexRelatedLists.value = props.module.panels.filter(ip => ip.controllerMethod.includes('@index'))

  // bug fix
  setTimeout(() => {
    timeout.value = false
    emit('update-timeout')
  }, 100)
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

// lifecycles
onMounted(() => {
  initialize()
})
</script>

<template>
  <div class="relative mt-4">
    <div>
      <div class="text-l text-700 font-bold bg-primary-50 p-2 mb-4">All required fields</div>
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
      </div>
    </div>

    <h5>Detailed add</h5>
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
                  source="Form"
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
              <div v-if="section.additional_fields && section.additional_fields.length > 0">
                <div v-for="(addition_field, afx) in section.additional_fields" :key="afx">
                  <Suspense v-if="addition_field.ids.length > 0">
                    <SectionFields
                      mode="edit"
                      source="Form"
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
    </div>

    <div
      class="sticky bottom-0 right-0 pt-3 surface-0"
      :class="`${tabStyle === 'tab' && 'mb-7 pb-7'}`">
      <Button @click="proceedBtn" label="Save" />
    </div>
  </div>
</template>

<style scoped>

</style>