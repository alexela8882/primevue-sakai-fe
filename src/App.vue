<script setup>
// imports
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, onMounted, watch } from 'vue'
// stores & composables
import { useGeneralStore } from './stores/general'

// refs
// stores & composables
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
