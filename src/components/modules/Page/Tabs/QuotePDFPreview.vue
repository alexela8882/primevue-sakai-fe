<script setup>
import { onMounted, onUnmounted, ref, inject,defineAsyncComponent, watch,computed  } from "vue";
import { storeToRefs } from 'pinia'
import _ from 'lodash';
import axios from 'axios'
import helper from '@/mixins/Helper';
import { useToast } from "primevue/usetoast"
import { useModuleDetailStore } from '@/stores/modules/detail'
import { useModuleStore } from '@/stores/modules/index'
import { useQuotePDF } from '@/stores/modules/detail/quotepdf'
import { useBaseStore } from '@/stores/base'
import { jsPDF } from "jspdf";

const PDFPage = defineAsyncComponent(() => import('@/components/modules/Page/Tabs/PDFPage.vue'))

const quotePDF = useQuotePDF()
const moduleDetailStore = useModuleDetailStore()
const moduleStore = useModuleStore()
const baseStore = useBaseStore()
const { fetchQuoteTemplates,fetchQuoteTemplatesInfo,fetchQuoteTemplate } = quotePDF
const { getTemplates,getCurrentTemplate,getQuoteInfo } = storeToRefs(quotePDF)
const { getItem, _getRelatedLists } = storeToRefs(moduleDetailStore)
const { fetchModuleFields } = moduleStore
const { getEntityFields,getModuleByName } = storeToRefs(moduleStore)
const { getAuthUser } = storeToRefs(baseStore)
const { transformLookupDisplay, transformNumberCurrency } = helper()


const selectedTemplate = ref(null)
const templatesLoading = ref(true)
const fetchingCurrentTemplate = ref(false)
const pageContent = ref({'headerPanel':[],'bodyPanel':[],'footerPanel':[]})
const sectionHeight = ref({'headerPanel':null,'bodyPanel':null,'footerPanel':null})
const pages = ref([{'page':1}])

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
    // pdfLoaded()
}


const pdfLoaded = () =>{
    let myDiv = document.getElementById("headerPanel");
    if(myDiv){
        sectionHeight.value.headerPanel = myDiv.offsetHeight ;
    }
    myDiv = document.getElementById("bodyPanel");
    if(myDiv){
        sectionHeight.value.bodyPanel = myDiv.offsetHeight;
    }
    myDiv = document.getElementById("footerPanel");
    if(myDiv){
        sectionHeight.value.footerPanel = myDiv.offsetHeight ;
    }
    let pdfHeight = 1120
    let bodyHeight = pdfHeight - sectionHeight.value.headerPanel - sectionHeight.value.footerPanel
    let page = Math.ceil(sectionHeight.value.bodyPanel/880)
    let ctr = 0
    console.log(page)
    console.log(sectionHeight.value.bodyPanel)
    _.forEach(_.fill(Array(page),'1'), function(p){
        let index = _.findIndex(pages.value,{'page':ctr+1})
        if(index > -1){
            let h = ((bodyHeight * ctr) + bodyHeight) + 'px'
            let m = bodyHeight * ctr
            let margin = (m > 0) ? "-" + m + 'px' : ''
            pages.value[ctr]['height'] = h
            pages.value[ctr]['margin'] = margin
        }else{
            let h = ((bodyHeight * ctr) + bodyHeight) + 'px'
            let m = bodyHeight * ctr
            let margin = (m > 0) ? "-" + m + 'px' : ''
            pages.value.push({'page':ctr+1,'height':h,'margin':margin})
        }           

        console.log(_.cloneDeep(pages.value))
        ctr++;
    })
}

const transformQuoteTemplate = async() =>{

    let cur = _.get(getItem.value.data,'currency_id.code','')
    _.forEach(getCurrentTemplate.value.pages[0], function(panels,pageSection){
        let panel = []
       if(pageSection!='pageNo'){
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
                                }else if(_.includes(['percentage','number','currency','formula','rollUpSummary'],field.field_type.name)){
                                    let numberVal = (_.isString(values[field.name])) ? _.toNumber(values[field.name]) : ((_.isNumber(values[field.name])) ? values[field.name] : 0)
                                    if(field.field_type.name=='percentage') {
                                        let tmp =  numberVal * 100
                                        numberVal = tmp+"%"
                                    }else{
                                        numberVal =  ((field.field_type.name=='currency' || _.get(field,'formulaType','')=='currency') && cur) ? cur + " " + transformNumberCurrency(numberVal,field.rules,true) : transformNumberCurrency(numberVal,field.rules,true)
                                    }
                                    elements.push({'elemType':el.elemType,'fieldType':field.field_type.name,'label':el.label.value,'value': numberVal})
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
                                    if(field.field_type.name=='lookupModel'){
                                        fields.push({'name':field.name,'field':field,'label':f.label,'width':f.width,'displayFieldName':f.displayFieldName[0]})
                                    }else{
                                        
                                        let label = ((field.field_type.name=='currency' || _.get(field,'formulaType','')=='currency') && cur) ? f.label + " ("+cur+")" : f.label
                                        fields.push({'name':field.name,'field':field,'label':label,'width':f.width,'displayFieldName':field.name})
                                    }
                                    
                                }
                            })

                            let values = _.find(_getRelatedLists.value,{'cname':'salesopptitem-panel-2'})
                            let products = _.cloneDeep(getQuoteInfo.value['Product'].collection)

                            let opptItems = []
                            if(values){
                                _.forEach(_.get(values,'collection.data',[]),function(item){
                                    let tmpRow = {}
                                    _.forEach(fields, function(f){
                                        if(f.name=='product_id'){
                                            let prod = _.find(products, {'_id':item['product_id']['_id']})
                                            if(prod){
                                                tmpRow[f.displayFieldName] = prod[f.displayFieldName]
                                            }
                                        }else if(_.includes(['percentage','number','currency','formula','rollUpSummary'],f.field.field_type.name)){
                                            tmpRow[f.name] = (_.isString(item[f.name])) ? _.toNumber(item[f.name]) : ((_.isNumber(item[f.name])) ? item[f.name] : 0)
                                        
                                            if(f.field.field_type.name=='percentage') {
                                                let tmp =  tmpRow[f.name] * 100
                                                tmpRow[f.name] = tmp+"%"
                                            }else{
                                                tmpRow[f.name] =  transformNumberCurrency(tmpRow[f.name],f.field.rules,true)
                                            }
                                        }else{
                                            tmpRow[f.name] = item[f.name]
                                        }
                                    })
                                    opptItems.push(tmpRow)
                                })
                            }
                            elements.push({'elemType':el.elemType,'type': el.type,'fields':fields,'values':opptItems})
                            
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
       }
    })
}
//works but adds extra empty page
// const downloadPDF = async() =>{
    
//     var bodyElement = document.getElementById('pdfContent');
 
//     var doc = new jsPDF();

//     doc.html(bodyElement.innerHTML, {
//         callback: function(doc) {
//             //html rendered in pdf
//             window.open(doc.output('bloburl'))
           
//         },
 
//         x: getCurrentTemplate.value.config.left * 20,
//         y:0,
//         width: 180, //target width in the PDF document
//         windowWidth: 780 //window width in CSS pixels
//     });

// }

const downloadPDF = () => {
    let jsPdf = new jsPDF('p', 'pt', 'letter');
    var htmlElement = document.getElementById('pdfContent');
    // you need to load html2canvas (and dompurify if you pass a string to html)
    const opt = {
        callback: function (jsPdf) {
            // jsPdf.save("Test.pdf");
            // to open the generated PDF in browser window
            window.open(jsPdf.output('bloburl'));
        },
        margin: [30, 50, 30, 50],
        autoPaging: 'text',
        width:180,
        windowWidth: 780,
        html2canvas: {
            allowTaint: true,
            dpi: 300,
            letterRendering: true,
            logging: false,
            scale: .65
        }
    };

    jsPdf.html(htmlElement, opt);
}

const downloadPDF2 = () =>{
    const pdfDoc = new jsPDF('p', 'pt', 'a4');
    const options = {
        pdfDoc: pdfDoc,
        component: $('#DataGrid').dxDataGrid('instance')
    };

    exportDataGrid(options).then(() => {
          pdfDoc.setFontSize(12);
          const pageCount = pdfDoc.internal.getNumberOfPages();
          for(let i = 1; i <= pageCount; i++) {
            pdfDoc.setPage(i);
            const pageSize = pdfDoc.internal.pageSize;
            const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
            const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            const header = 'Report 2014';
            const footer = `Page ${i} of ${pageCount}`;

            // Header
            pdfDoc.text(header, 40, 15, { baseline: 'top' });

            // Footer
            pdfDoc.text(footer, pageWidth / 2 - (pdfDoc.getTextWidth(footer) / 2), pageHeight - 15, { baseline: 'bottom' });
        }
      }).then(() => {
        pdfDoc.save('filePDF.pdf');
      });
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
         <Button  icon="pi pi-download" rounded  class="ml-2" aria-label="Download" @click="downloadPDF2"/>
        <div class="flex justify-content-between">
            <Dropdown v-model="selectedTemplate" :options="getTemplates" filter optionLabel="name" placeholder="Select a template" class="w-full md:w-14rem" @change="changeTemplate"/>
            <div class="flex">
                <Button icon="pi pi-save" rounded aria-label="Save" />
                <Button  icon="pi pi-download" rounded  class="ml-2" aria-label="Download" @click="downloadPDF"/>
                <Button icon="pi pi-envelope" rounded class="ml-2" aria-label="Email" />
            </div>
            
        </div>
        <div id="pdfContainer" class="pdfPreview w-full mt-2 card flex">
             <div
                v-if="fetchingCurrentTemplate"
                class="flex align-items-center justify-content-center w-full"
                style="height: 60vh !important;">
                <ProgressSpinner />
            </div>
            <PDFPage v-if="selectedTemplate && !fetchingCurrentTemplate" :selectedTemplate="selectedTemplate" :pageContent="pageContent" :pages="pages" :numberofPages="pages.length" @mounted="pdfLoaded"/>
            
        </div>
    </template>
</template>
<style>
.pdfPreview{
    border-radius: 0;
    overflow: auto;
    height: calc(100vh - 300px);
    background:rgb(220, 220, 220);
}
</style>