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
    pdfLoaded()
}


const pdfLoaded = () =>{
    let myDiv = document.getElementById("headerPanel");
    if(myDiv){
        sectionHeight.value.headerPanel = myDiv.offsetHeight;
    }
    myDiv = document.getElementById("bodyPanel");
    if(myDiv){
        sectionHeight.value.bodyPanel = myDiv.offsetHeight;
    }
    myDiv = document.getElementById("footerPanel");
    if(myDiv){
        sectionHeight.value.footerPanel = myDiv.offsetHeight;
    }
    let pdfHeight = 1145
    let bodyHeight = pdfHeight - sectionHeight.value.headerPanel - sectionHeight.value.footerPanel
    let page = Math.ceil(sectionHeight.value.bodyPanel/950)
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
    })
}

const downloadPDF = async() =>{
    var element = document.getElementById('bodyPanel');
    // html2pdf(element);
    // var opt = {
    //     margin:       [getCurrentTemplate.value.config.top,getCurrentTemplate.value.config.left,getCurrentTemplate.value.config.bottom,getCurrentTemplate.value.config.right],
    //     filename:     'myfile.pdf',
    //     image:        { type: 'jpeg', quality: 0.95 },
    //     html2canvas:  { scale: 1 },
    //     jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    // };
    // console.log(opt)
    // html2pdf().set(opt).from(element.innerHTML).save();
    var doc = new jsPDF();

    doc.html(element, {
        callback: function(doc) {
            // Save the PDF
            var pageCount = doc.internal.getNumberOfPages(); // Get total number of pages
            console.log(pageCount);
            for (var i = 1; i <= pageCount; i++) {
                doc.setPage(i); // Set the current page
                const pageSize = doc.internal.pageSize;
                const footer = `Page ${i} of ${pageCount}`;
                const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
                const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                const header = 'Report 2014';
                console.log(pageHeight,pageSize.height,pageSize.getHeight())
                console.log(pageWidth,pageSize.width,pageSize.getWidth())
                // doc.text(10, doc.internal.pageSize.height - 10, "Footer Text - Page " + i); // Add footer text
                doc.text(footer, 0, pageHeight - 15, { baseline: 'bottom' });
            }
            doc.save('sample-document.pdf');
        },
        margin: [getCurrentTemplate.value.config.top,getCurrentTemplate.value.config.right,getCurrentTemplate.value.config.bottom,getCurrentTemplate.value.config.left],
        x: 15,
        y: 15,
        width: 180, //target width in the PDF document
        windowWidth: 780 //window width in CSS pixels
    });

}
const data = ref([
  { name: 'Item 1', quantity: 25 },
  { name: 'Item 2', quantity: 49 },
  { name: 'Item 3', quantity: 19 },
  { name: 'Item 4', quantity: 9 },
  { name: 'Item 5', quantity: 6 },
  { name: 'Item 6', quantity: 3 },
  { name: 'Item 7', quantity: 36 },
  { name: 'Item 8', quantity: 13 },
  { name: 'Item 9', quantity: 12 },
  { name: 'Item 10', quantity: 28 },
  { name: 'Item 11', quantity: 19 },
  { name: 'Item 12', quantity: 34 },
  { name: 'Item 13', quantity: 17 },
  { name: 'Item 14', quantity: 42 },
  { name: 'Item 15', quantity: 32 },
  { name: 'Item 16', quantity: 30 },
  { name: 'Item 17', quantity: 5 },
  { name: 'Item 18', quantity: 38 },
  { name: 'Item 19', quantity: 1 },
  { name: 'Item 20', quantity: 10 },
  { name: 'Item 21', quantity: 37 },
  { name: 'Item 22', quantity: 42 },
  { name: 'Item 23', quantity: 23 },
  { name: 'Item 24', quantity: 44 },
  { name: 'Item 25', quantity: 43 },
  { name: 'Item 26', quantity: 4 },
  { name: 'Item 27', quantity: 7 },
  { name: 'Item 28', quantity: 16 },
  { name: 'Item 29', quantity: 27 },
  { name: 'Item 30', quantity: 20 },
  { name: 'Item 31', quantity: 8 },
  { name: 'Item 32', quantity: 39 },
  { name: 'Item 33', quantity: 43 },
  { name: 'Item 34', quantity: 21 },
  { name: 'Item 35', quantity: 39 },
  { name: 'Item 36', quantity: 26 },
  { name: 'Item 37', quantity: 39 },
  { name: 'Item 38', quantity: 32 },
  { name: 'Item 39', quantity: 34 },
  { name: 'Item 40', quantity: 1 },
  { name: 'Item 41', quantity: 34 },
  { name: 'Item 42', quantity: 4 },
  { name: 'Item 43', quantity: 19 },
  { name: 'Item 44', quantity: 12 },
  { name: 'Item 45', quantity: 1 },
  { name: 'Item 46', quantity: 37 },
  { name: 'Item 47', quantity: 2 },
  { name: 'Item 48', quantity: 28 },
  { name: 'Item 49', quantity: 22 },
  { name: 'Item 50', quantity: 2 },
])

const downloadPDF2 = async() =>{
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const lineHeight = 8;
    const startingHeight = 10;
    let currentHeight = createPdfHeader(doc);
     let currentPage = 1;
    for (let item of data.value) {
        if (currentHeight > pageHeight - 30) {
            doc.addPage();
            currentPage++;
            currentHeight = createPdfHeader(doc);
        }
        doc.setFontSize(12);
        doc.text(item.name, 10, currentHeight);
        doc.text(`${item.quantity}`, pageWidth - 10, currentHeight, {
        align: 'right',
        });
        currentHeight += lineHeight;
    }
     createPdfFooter(doc, currentPage);
    window.open(doc.output('bloburl'));
}

const createPdfHeader = (doc) => {
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const startingHeight = 10;
  let currentHeight = startingHeight;
  doc.setFontSize(20);
  doc.text('Packing List', pageWidth / 2, currentHeight, { align: 'center' });
  currentHeight += 10;
  doc.line(10, currentHeight, pageWidth - 10, currentHeight);
  return currentHeight + 10;
}

const createPdfFooter = (doc,numberOfPages) => {
  for (let i = 1; i <= numberOfPages; i++) {
    doc.setPage(i);
    doc.line(
      10,
      doc.internal.pageSize.height - 20,
      doc.internal.pageSize.width - 10,
      doc.internal.pageSize.height - 20
    );
    doc.text(
      `Page ${i} of ${numberOfPages}`,
      10,
      doc.internal.pageSize.height - 10
    );
  }
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
        <!-- <div class="flex justify-content-between">
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
            <PDFPage v-if="selectedTemplate && !fetchingCurrentTemplate" :selectedTemplate="selectedTemplate" :pageContent="pageContent" :pages="pages" @mounted="pdfLoaded"/>
            
        </div> -->
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