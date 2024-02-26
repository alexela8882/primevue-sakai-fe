<script setup>
// imports
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import _ from 'lodash'
// stores & composables
import { useGeneralStore } from './stores/general'// stores
import { useTabStore } from '@/stores/tabs/index'
import { useModuleStore } from '@/stores/modules/index'

// refs
const router = useRouter()
// stores & composables
const moduleStore = useModuleStore()
const tabStore = useTabStore()
const { getModules } = storeToRefs(moduleStore)
const { fetchModules } = moduleStore
const { tabDialog, getMaximizedTab } = storeToRefs(tabStore)
const generalStore = useGeneralStore()
const { minimizeTab } = tabStore
const { formModalTrigger, popUpModalTrigger } = storeToRefs(generalStore)

const FormDialog = defineAsyncComponent(() => import('@/components/dynamic/FormDialog.vue'))
const PopUpDialog = defineAsyncComponent(() => import('@/components/dynamic/PopUpDialog.vue'))
const GlobalDialog = defineAsyncComponent(() => import('@/components/dynamic/GlobalDialog.vue'))

onMounted(async () => {
  await fetchModules()

  console.log('get modules',_.cloneDeep(getModules.value))
})

</script>

<template>
  <div v-if="!_.isEmpty(getModules)" class="mb-6 pb-6">
    <router-view></router-view>
  </div>

  <Toast class="z-index-900" />

  <Suspense v-if="formModalTrigger">
    <FormDialog />
  </Suspense>
  <Suspense v-if="popUpModalTrigger">
    <PopUpDialog />
  </Suspense>

  <div class="hidden-div hidden"></div>
  <GlobalDialog
    @close="minimizeTab()"
    v-model:visible="tabDialog"
    :title="getMaximizedTab && getMaximizedTab.label" icon="pi pi-info-circle">
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
