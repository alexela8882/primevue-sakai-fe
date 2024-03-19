<script setup>
// imports
import { ref, watch, onMounted, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
// components
const DynamicFields = defineAsyncComponent(() => import('@/components/dynamic/DynamicFields.vue'))

// defines
const props = defineProps({
  form: Object,
  loading: Boolean,
  response: String
})
const emit = defineEmits(['save-action'])

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
  resetForm,
  meta
} = useForm({})

// actions
const proceedAction = async () => {
  const res = await validateSyncFunc()
  if (!res.inner) {
    let _values = {}
    if (props.form.prevalue) _values = { ...values, ...props.form.prevalue }
    else _values = values

    let finalValues = Object.assign({}, {
      be_nec: props.form.be_nec,
      fields: _values
    })

    // emit action
    emit('save-action', finalValues)

  } else console.log('error')
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
  props.form.data.fields.map(field => Object.assign(field, { ...field, data: { value: null } }))
  // generate dynamic fields for validation
  const testConst = {}
  props.form.data.fields.map(field => {
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

// lifecycles
onMounted(async () => {
  await initialize()
})

watch(() => props.response, (newVal, oldVal) => {
  if (newVal) resetForm()
})
</script>

<template>
  <div class="relative h-full px-3">
    <div>
      <DynamicFields
        :fields="form.data.fields"
        :moduleValidationInputs="moduleValidationInputs"
        :moduleValidationErrors="errors"
        :moduleValidationMeta="meta"
        :loading="loading"
        @validate-sync-func="validateSyncFunc()" />
    </div>
  </div>
  <div class="sticky bottom-0 right-0 py-2 surface-50">
    <div class="flex justify-content-end gap-2 px-3 py-1">
      <Button @click="resetForm()" label="Reset" :disabled="loading" outlined />
      <Button
        @click="proceedAction()"
        :disabled="loading"
        :loading="loading"
        :label="`${loading ? 'Saving...' : 'Save'}`"
        size="large"
      ></Button>
    </div>
  </div>
</template>

<style scoped>

</style>