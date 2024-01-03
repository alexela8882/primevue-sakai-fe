<script setup>
// imports
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
// stores
import { useGeneralStore } from '../../stores/general'
import { useUserStore } from '../../stores/user'
import { useBranchStore } from '../../stores/branch'
// components
import axios from 'axios'

// refs
const router = useRouter()
const toast = useToast()
const generalStore = useGeneralStore()
const userStore = useUserStore()
const branchStore = useBranchStore()
const statusCode = ref()
const data = ref()
const error = ref()

const { toastTimer, toastOpen, popUpModalOpen, popUpModalData, pageData } = storeToRefs(generalStore)
const { toastDataFill } = generalStore

const uri = ref()
const apiMethod = ref()
const redirectUrl = ref()

const _store = ref()
const _action = ref()

const loading = ref(false)

const executeAction = async () => {
  loading.value = true

  _store.value = popUpModalData.value.data.store.name
  _action.value = popUpModalData.value.data.store.action

  uri.value = popUpModalData.value.data.api.uri
  apiMethod.value = popUpModalData.value.data.api.method
  redirectUrl.value = popUpModalData.value.data.redirectUrl

  // axios
  await axios({
    url: uri.value,
    method: apiMethod.value
  }).then((response) => {
    statusCode.value = response.status
    data.value = response.data
  }).catch((err) => {
    error.value = err.response
  })

  const toastObj = ref({})
  if (statusCode.value === 200) {
    // dynamic store
    // const store = JSON.stringify(store.value)
    // const action = JSON.stringify(action.value)
    if (_store.value === 'tagStore') tagStore[_action.value](data.value.data)
    if (_store.value === 'roleStore') roleStore[_action.value](data.value.data)
    if (_store.value === 'userStore') userStore[_action.value](data.value.data)
    if (_store.value === 'branchStore') branchStore[_action.value](data.value.data)
    if (_store.value === 'galleryStore') {
      // to update sidebar
      removeUGallery(data.value.data._token)

      galleryStore[_action.value](data.value.data)
    }
    if (_store.value === 'albumStore') {
      if (_action.value === 'deleteAlbum') router.push(redirectUrl.value)
      if (_action.value === 'emptyAlbum') albumStore[_action.value](data.value.data)
    }
    if (_store.value === 'photoStore') {
      if (_action.value === 'deletePhoto') albumStore[_action.value](data.value.data)
      redirectUrl.value && router.push(redirectUrl.value)
    }
    if (_store.value === 'subdomainStore') {
      if (_action.value === 'deleteSubdomain') subdomainStore[_action.value](data.value.data)
    }

    // close modal
    popUpModalOpen.value = false

    // -------------------
    // -------TOAST-------
    // -------------------
      // clearTimeout(toastTimer.value)

      // const obj = {
      //   title: 'Success!',
      //   type: 'success',
      //   message: data.value.message
      // }
      // toastObj.value = Object.assign({}, obj)

      toast.add({ severity: 'success', summary: 'Success', detail: data.value.message, life: 3000 })
      loading.value = false
  } else {
    toast.add({ severity: 'error', summary: 'Forbidden', detail: error.value.data.message, life: 3000 })
    loading.value = false
  }

  loading.value = false
  popUpModalOpen.value = false

  console.log(popUpModalOpen.value)
}

</script>

<template>
<Dialog v-model:visible="popUpModalOpen" :style="{width: '450px'}" :breakpoints="{ '960px': '75vw', '641px': '95vw' }" header="Confirm" :modal="true">
  <div class="flex items-center confirmation-content">
    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
    <span>{{ generalStore.popUpModalData.title }}</span>
  </div>
  <template #footer>
    <span class="flex items-center justify-end">
      <Button
        @click="popUpModalOpen = false"
        type="button"
        class="reddot-button-secondary">
        No, cancel
      </Button>
      <Button
        @click="executeAction"
        type="button"
        :disabled="loading"
        :loading="loading"
        class="reddot-button-danger"
        :label="loading ? 'Please wait...' : 'Yes, I\'m sure'"
      />
    </span>
  </template>
</Dialog>

</template>