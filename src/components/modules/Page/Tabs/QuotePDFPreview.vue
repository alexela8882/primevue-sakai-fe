<script setup>
import { onMounted, onUnmounted, ref, inject,defineAsyncComponent  } from "vue";
import { storeToRefs } from 'pinia'
import _ from 'lodash';
import axios from 'axios'
import helper from '@/mixins/Helper';
import { useToast } from "primevue/usetoast"
import { useModuleDetailStore } from '@/stores/modules/detail'
import { useQuotePDF } from '@/stores/modules/detail/quotepdf'


const quotePDF = useQuotePDF()
const moduleDetailStore = useModuleDetailStore()
const { fetchQuoteTemplates } = quotePDF
const { getTemplates } = storeToRefs(quotePDF)


const selectedTemplate = ref(null)
const templatesLoading = ref(true)
onMounted(async() => {
    await fetchQuoteTemplates()
    templatesLoading.value = false
})


</script>
<template>
    <div
      v-if="templatesLoading"
      class="flex align-items-center justify-content-center"
      style="height: 60vh !important;">
      <ProgressSpinner />
    </div>
    <div class="flex justify-content-between">
        <Dropdown v-model="selectedTemplate" :options="getTemplates" filter optionLabel="name" placeholder="Select a template" class="w-full md:w-14rem"/>
        <div class="flex">
            <Button icon="pi pi-save" rounded aria-label="Save" />
            <Button  icon="pi pi-download" rounded  class="ml-2" aria-label="Download" />
            <Button icon="pi pi-envelope" rounded class="ml-2" aria-label="Email" />
        </div>
    </div>
    <div class="pdfPreview w-full mt-2">
        <!-- <div class="flex flex-column border shadow-2 p-3 text-center">
            <div class="pdfPage"></div>
            <p>1</p>
            <div class="pdfPage"></div>
            <p>2</p>
            <div class="pdfPage"></div>
            <p>3</p>
        </div> -->
        <div class="flex shadow-2 m-3">
            asd
        </div>
    </div>
</template>
<style>
.pdfPreview{
    border: 1px solid rgb(188, 187, 187);   
}
.pdfPreview div{
    height: calc(100vh - 350px);
}
.pdfPage{
    height:8rem;
    width: 6rem;
    border: 1px solid rgb(188, 187, 187);   
}
</style>
