<script setup>
// imports
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
// stores & composables
import { useGeneralStore } from './stores/general'// stores
import { useTabStore } from '@/stores/tabs/index'

// refs
const router = useRouter()
// stores & composables
const tabStore = useTabStore()
const { tabDialog } = storeToRefs(tabStore)
const generalStore = useGeneralStore()
const { minimizeTab } = tabStore
const { formModalTrigger, popUpModalTrigger } = storeToRefs(generalStore)

const FormDialog = defineAsyncComponent(() => import('@/components/dynamic/FormDialog.vue'))
const PopUpDialog = defineAsyncComponent(() => import('@/components/dynamic/PopUpDialog.vue'))
const GlobalDialog = defineAsyncComponent(() => import('@/components/dynamic/GlobalDialog.vue'))

</script>

<template>
  <router-view></router-view>

  <Toast class="z-index-900" />

  <Suspense v-if="formModalTrigger">
    <FormDialog />
  </Suspense>
  <Suspense v-if="popUpModalTrigger">
    <PopUpDialog />
  </Suspense>

  <div class="hidden-div hidden"></div>
  <!-- <div class="fw-dialog-content"></div> -->
  <GlobalDialog @close="minimizeTab()" v-model:visible="tabDialog" title="Custom Dialog" icon="pi pi-info-circle">
    <template #default>
      <div class="fw-dialog-content"></div>
    </template>
  </GlobalDialog>
</template>

<style>

::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 20px;
  border: transparent;
}

</style>
