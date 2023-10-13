<script setup>
// imports
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, watch } from 'vue'
// import FormDialog from './components/dynamic/FormDialog.vue'
// import PopUpDialog from './components/dynamic/PopUpDialog.vue'
// stores
import { useGeneralStore } from './stores/general'

// refs
const generalStore = useGeneralStore()
const { formModalTrigger, popUpModalTrigger } = storeToRefs(generalStore)

const FormDialog = defineAsyncComponent(() => import('./components/dynamic/FormDialog.vue'))
const PopUpDialog = defineAsyncComponent(() => import('./components/dynamic/PopUpDialog.vue'))

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
