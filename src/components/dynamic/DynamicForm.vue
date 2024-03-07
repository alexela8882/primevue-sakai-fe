<script setup>
// imports
import { ref, defineProps, onMounted, defineAsyncComponent, defineEmits } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
// components
const DynamicFields = defineAsyncComponent(() => import('@/components/dynamic/DynamicFields.vue'))

// defines
const props = defineProps({
  form: Object
})

// refs
const moduleValidationSchemes = ref({})
const moduleValidationInputs = ref({})
const atIndexRelatedLists = ref([])
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

// actions
const proceedAction = async () => {
  const res = await validateSyncFunc()
  if (!res.inner) console.log('passed')
  else console.log('error')
}
const validateSyncFunc = handleSubmit((values, actions) => {
  // update errors
  Object.keys(moduleValidationInputs.value).forEach((key, index) => {
    const val = moduleValidationInputs.value[key].modelValue
    if (val !== null) setFieldError(key, null)
  })

  try {
    moduleValidationSchemes.value.validateSync(values, { abortEarly: false })
    return values
  } catch (error) {
    let errArray = []
    error.inner.map(err => {
      let obj = { [err.path]: err.message }
      errArray.push(obj)
      actions.setFieldError(err.path, err.message)
    })

    return error
  }
})
const initialize = async () => {
  // add collection item for filling field data
  props.form.fields.map(field => Object.assign(field, { ...field, data: { value: null } }))
  // generate dynamic fields for validation
  const testConst = {}
  props.form.fields.map(field => {
    if (field.rules && field.rules.required) {
      testConst[field.name] = yup.string().label(field.label).required()
    } else {
      testConst[field.name] = yup.string().label(field.label).nullable()
    }

    moduleValidationInputs.value[field.name] = defineComponentBinds(`${field.name}`)
    setFieldValue(`${field.name}`, null)
  })

  moduleValidationSchemes.value = testConst
  moduleValidationSchemes.value = yup.object(testConst)
}

onMounted(async () => {
  await initialize()
})
</script>

<template>
  <div class="relative h-full px-3">
    <div>
      <DynamicFields
        :fields="form.fields"
        :moduleValidationInputs="moduleValidationInputs"
        :moduleValidationErrors="errors"
        :moduleValidationMeta="meta"
        @validate-sync-func="validateSyncFunc()" />
    </div>
  </div>
  <div class="sticky bottom-0 right-0 py-2 surface-50">
    <div class="flex justify-content-end gap-2 px-3 py-1">
      <Button label="Reset" outlined />
      <Button @click="proceedAction" label="Save" size="large" />
    </div>
  </div>
</template>

<style scoped>

</style>