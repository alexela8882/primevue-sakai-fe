<script setup>
// imports
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, routerKey } from 'vue-router'
import { useToast } from "primevue/usetoast"
// stores
import { useGeneralStore } from '../../stores/general'
import { useUserStore } from '../../stores/user'
// components
import axios from 'axios'

// refs
const router = useRouter()
const uri = ref()
const apiMethod = ref()
const _store = ref()
const _action = ref()
const loading = ref(false)
const urlParams = ref()
const toast = useToast()
const statusCode = ref()
const data = ref()
const error = ref()

const generalStore = useGeneralStore()
const { toastTimer, toastOpen, formModalOpen, formModalData } = storeToRefs(generalStore)
const { toastDataFill } = generalStore

const userStore = useUserStore()

// for uploading image use formdata
const formDataPayload = ref({})
formDataPayload.value = new FormData()

// trigger input onchange
const uploadImg = (e) => {
  if (e.target && e.dataTransfer) {
    let files = e.target.files || e.dataTransfer.files
    if (!files.length) return
    formDataPayload.value.append('image', e.target.files[0])

    console.log(formDataPayload.value)
  }
}

const executeAction = async () => {
  console.log(formModalData.value)
  loading.value = true

  _store.value = formModalData.value.data.store.name
  _action.value = formModalData.value.data.store.action

  uri.value = formModalData.value.data.api.uri
  apiMethod.value = formModalData.value.data.api.method



  // re-construct payload
  const payload = ref({})

  // populate
  formModalData.value.data.fields.map((f) => {
    payload.value[f.name] = f.value
    formDataPayload.value[f.name] = f.value
    formDataPayload.value.append([f.name], f.value),
    f.error = null // clear error messages
  })

  // axios
  await axios({
    url: uri.value,
    method: apiMethod.value,
    data: payload.value
  }).then((response) => {
    statusCode.value = response.status
    data.value = response.data
  }).catch((err) => {
    statusCode.value = err.response.status
    error.value = err.response
  })

  if (statusCode.value === 200) {
    console.log(statusCode.value)
    // dynamic callback
    if (_store.value === 'roleStore') {
      if (_action.value === 'addRole') router.push(`/roles/edit/${data.value.data._token}`)
      roleStore[_action.value](data.value.data)
    } else if (_store.value === 'userStore') {
      console.log(_action.value)
      // if (_action.value === 'addUser') router.push(`/users/edit/${data.value.data._id}`)
      userStore[_action.value](data.value.data)
    } else if (_store.value === 'galleryStore') {
      if (_action.value === 'addGallery') {
        // to update sidebar
        pushUGallery(data.value.data)

        // redirect to edit page
        router.push(`/galleries/edit/${data.value.data._token}`)
      }
      galleryStore[_action.value](data.value.data)
    } else if (_store.value === 'albumStore') {
      if (_action.value === 'addPhoto') {
        // get current page uri params
        urlParams.value = new URLSearchParams(window.location.search)
        router.push(`/albums/${data.value.data.album._token}/${data.value.data._token}?${urlParams.value}`)
      }
      albumStore[_action.value](data.value.data)
    } else if (_store.value === 'tagStore') {
      tagStore[_action.value](data.value.data)
    } else if (_store.value === 'subdomainStore') subdomainStore[_action.value](data.value.data)

    // close modal
    formModalOpen.value = false

    toast.add({ severity: 'success', summary: 'Success', detail: data.value.message, life: 3000 })
  } else {
    console.log(error)
    formModalData.value.data.fields.map((f) => {
      f.error = error.value.data
    })

    if (error.value.status !== 422) {

      // reset form
      loading.value = false

      toast.add({ severity: 'error', summary: 'Forbidden', detail: error.value, life: 3000 })
    }
  }

  loading.value = false
}

</script>

<template>
  <Dialog v-model:visible="formModalOpen" modal :header="generalStore.formModalData.title" :style="{ width: '30vw' }" :breakpoints="{ '960px': '75vw', '641px': '95vw' }">
    <!-- Modal content -->
    <div>
      <!-- Modal body -->
      <div>
        <form class="space-y-6" @submit.prevent="">
          <div v-if="formModalData.data">
            <span v-for="(field, i) in formModalData.data.fields">
              <label :class="`${i !== 0 ? 'mt-5' : ''}`" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                <strong class="capitalize">{{ field.label ? field.label : field.name }}</strong>
                <span class="text-12px italic">&nbsp;{{ field.instruction ? `(${field.instruction})` : null }}</span>
              </label>
              <Dropdown
                v-if="field.type == 'select'"
                v-model="field.value"
                filter
                removable
                showClear
                :options="field.items"
                optionLabel="name"
                optionValue="id"
                class="w-full text-sm" />
              <InputText
                v-else
                @change="uploadImg"
                @keyup.enter="executeAction"
                :disabled="field.disabled && (formModalData.data.fields[field.requiringIndex] && (formModalData.data.fields[field.requiringIndex]['value'] === null || formModalData.data.fields[field.requiringIndex]['value'] === ''))"
                :type="field.type"
                v-model="field.value"
                :accept="`${field.type == 'file' && 'image/png, image/gif, image/jpeg'}`"
                class="w-full" />
              <span v-if="field.error">
                <p v-for="err in field.error[field.name]" class="mb2 mt1 text-red-600 dark:text-red-500"><small>{{ err }}</small></p>
              </span>
            </span>
          </div>
        </form>
      </div>
    </div>

    <template #footer>
      <span class="flex items-center justify-end">
        <Button
          :disabled="loading"
          @click="formModalOpen = false"
          class="reddot-button-secondary"
        >
          Cancel
        </Button>
        <Button
          :disabled="loading"
          :loading="loading"
          @click="executeAction"
          severity="primary"
          :label="loading ? 'Saving...' : 'Save'"
        />
      </span>
    </template>
  </Dialog>
  
  </template>