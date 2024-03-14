<script setup>
import { onMounted, onUnmounted, ref, inject,defineAsyncComponent, watch  } from "vue";
import { storeToRefs } from 'pinia'
import _ from 'lodash';
import axios from 'axios'
import helper from '@/mixins/Helper';
import { useToast } from "primevue/usetoast"
import { useModuleDetailStore } from '@/stores/modules/detail'
import { useModuleStore } from '@/stores/modules/index'
import { useQuotePDF } from '@/stores/modules/detail/quotepdf'
import { useBaseStore } from '@/stores/base'

const PDFPage = defineAsyncComponent(() => import('@/components/modules/Page/Tabs/PDFPage.vue'))

const quotePDF = useQuotePDF()
const moduleDetailStore = useModuleDetailStore()
const moduleStore = useModuleStore()
const baseStore = useBaseStore()
const { fetchQuoteTemplates,fetchQuoteTemplatesInfo,fetchQuoteTemplate } = quotePDF
const { getTemplates,getCurrentTemplate,getQuoteInfo } = storeToRefs(quotePDF)
const { getItem } = storeToRefs(moduleDetailStore)
const { fetchModuleFields } = moduleStore
const { getEntityFields,getModuleByName } = storeToRefs(moduleStore)
const { getAuthUser } = storeToRefs(baseStore)
const { transformLookupDisplay } = helper()


const selectedTemplate = ref(null)
const templatesLoading = ref(true)
const fetchingCurrentTemplate = ref(false)
const pageContent = ref({'headerPanel':[],'bodyPanel':[],'footerPanel':[]})

onMounted(async() => {
    await fetchQuoteTemplates()
    await fetchQuoteTemplatesInfo(getItem.value.data._id)

    //fetching fields
    if(_.isEmpty(getModuleByName.value('accounts').fields))
        await fetchModuleFields("Account")
    if(_.isEmpty(getModuleByName.value('salesopportunities').fields))
        await fetchModuleFields("SalesOpportunity")
    if(_.isEmpty(getEntityFields.value('SalesOpptItem')))
        await fetchModuleFields("SalesOpptItem")
    if(_.isEmpty(getEntityFields.value('User')))
        await fetchModuleFields("User")

    
    templatesLoading.value = false
})

const changeTemplate = async() =>{
    fetchingCurrentTemplate.value = true
    await fetchQuoteTemplate(selectedTemplate.value._id)
    await transformQuoteTemplate()
    fetchingCurrentTemplate.value = false
    pdfLoaded()
}


const pdfLoaded = () =>{
    const myDiv = document.getElementById("pdfContent");
    console.log(myDiv)
    // Get the height of the div
   if(myDiv){
     const divHeight = myDiv.offsetHeight;
    console.log(divHeight)
   }
}

const transformQuoteTemplate = async() =>{
    let body = _.get(getCurrentTemplate.value,'pages.0.bodyPanel',[])
   
    _.forEach(getCurrentTemplate.value.pages[0], function(panels,pageSection){
        let panel = []
        _.forEach(panels, function(p,panelIndex){
            let sections = []
            _.forEach(p.sections, function(sec, secIndex){
                let elements = []
                _.forEach(sec.elements, function(el, elIndex){
                    if(el.elemType=='field'){
                        let field = {}
                        let values = {}
                        if(el.value.entityName=='Account' || el.value.entityName=='SalesOpportunity'){
                            let moduleName = (el.value.entityName=='Account') ? 'accounts' : 'salesopportunities'
                            field = _.find(getModuleByName.value(moduleName).fields,{'_id':el.value.source})
                            values = _.cloneDeep(getQuoteInfo.value[el.value.entityName])
                        }else if(el.value.entityName=='User'){
                            field = _.find(getEntityFields.value('User').fields,{'_id':el.value.source})
                            values = _.cloneDeep(getAuthUser.value)
                        }else if(el.value.entityName=='SalesQuote'){
                            field = _.find(getModuleByName.value('salesquotes').fields,{'_id':el.value.source})
                            values = _.cloneDeep(getItem.value.data)
                        }
                        if(field){
                            if(!_.isEmpty(_.get(values,field.name,'')) && !_.isNull(_.get(values,field.name,''))){
                                if(field.field_type.name=='lookupModel'){
                                    let lookupVal = transformLookupDisplay(values[field.name],field)
                                    elements.push({'elemType':el.elemType,'fieldType':field.field_type.name,'label':el.label.value,'value': lookupVal.label})
                                }else{
                                    elements.push({'elemType':el.elemType,'fieldType':field.field_type.name,'label':el.label.value,'value': values[field.name]})
                                }
                            }
                        }
                    }else if(el.elemType=='groupField'){
                        let elFields = []
                        let values = {}
                        if(el.entityName=='Account' || el.entityName=='SalesOpportunity'){
                            let moduleName = (el.entityName=='Account') ? 'accounts' : 'salesopportunities'
                            elFields = _.filter(getModuleByName.value(moduleName).fields, function(f){ if(_.includes(el.fields,f._id)){ return true; }})
                            values = _.cloneDeep(getQuoteInfo.value[el.value.entityName])
                            
                        }else if(el.entityName=='User'){
                            elFields = _.filter(getEntityFields.value('User'), function(f){ if(_.includes(el.fields,f._id)){ return true; }})
                            values = _.cloneDeep(getAuthUser.value)
                        }else if(el.entityName=='SalesQuote'){
                            elFields = _.filter(getModuleByName.value('salesquotes').fields, function(f){ if(_.includes(el.fields,f._id)){ return true; }})
                            values = _.cloneDeep(getItem.value.data)
                        }
                        if(!_.isEmpty(elFields)){
                            let tmpVal = {}
                            _.forEach(elFields, function(f){
                                if(f.field_type.name=='lookupModel'){
                                    let lookupVal = transformLookupDisplay(values[f.name],f)
                                    tmpVal[f.name] = lookupVal.label
                                }else{
                                    tmpVal[f.name] = values[f.name]
                                }
                            })
                            elements.push({'elemType':el.elemType,'fieldType':'groupField','label':el.label.value,'value': _.join(_.values(_.pick(tmpVal,_.map(elFields,'name'))), " ")})
                        }
                    }else if(el.elemType=='mutable'){
                        let fields = []
                        _.forEach(el.fields, function(f){
                            let field = _.find(getEntityFields.value('SalesOpptItem'),{'_id':f.fieldID})
                            if(field){
                                fields.push({'field':field.name,'label':f.label,'width':f.width,'displayFieldName':f.displayFieldName})
                            }
                        })
                        elements.push({'elemType':el.elemType,'type': el.type,'style': el.style,'fields':fields})
                    }else if(el.elemType=='label'){
                        elements.push({'elemType':el.elemType,'value': el.value,'style': el.style})
                    }else if(el.elemType=='richTextbox'){
                        elements.push({'elemType':el.elemType,'value': el.html})
                    }
                })
                if(!_.isEmpty(elements)){
                sections.push({'alignment':sec.alignment,'width':sec.width,'label':_.get(sec,'label',''),'elements':elements})
                }
            })
            if(!_.isEmpty(sections)){
                panel.push({'label':p.label,'sections':sections})
            }
        })
        pageContent.value[pageSection] = panel
    })
}

</script>
<template>
    <div
      v-if="templatesLoading"
      class="flex align-items-center justify-content-center"
      style="height: 60vh !important;">
      <ProgressSpinner />
    </div>
    <template v-if="!templatesLoading">
        <div class="flex justify-content-between">
            <Dropdown v-model="selectedTemplate" :options="getTemplates" filter optionLabel="name" placeholder="Select a template" class="w-full md:w-14rem" @change="changeTemplate"/>
            <div class="flex">
                <Button icon="pi pi-save" rounded aria-label="Save" />
                <Button  icon="pi pi-download" rounded  class="ml-2" aria-label="Download" />
                <Button icon="pi pi-envelope" rounded class="ml-2" aria-label="Email" />
            </div>
        </div>
        <div class="pdfPreview w-full mt-2 card flex">
             <div
                v-if="fetchingCurrentTemplate"
                class="flex align-items-center justify-content-center"
                style="height: 60vh !important;">
                <ProgressSpinner />
            </div>
            <PDFPage v-if="selectedTemplate && !fetchingCurrentTemplate" :selectedTemplate="selectedTemplate" :pageContent="pageContent" @mounted="pdfLoaded"/>
            
        </div>
    </template>
</template>
