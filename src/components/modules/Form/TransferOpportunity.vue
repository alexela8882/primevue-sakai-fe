<script setup>
import { onMounted, onUnmounted, ref, computed, provide ,defineAsyncComponent, watch  } from "vue";
import { storeToRefs } from 'pinia'
import _ from 'lodash';
import { useModuleStore } from '@/stores/modules/index'
import { useFormDataStore } from '@/stores/forms'
import helper from '@/mixins/Helper';
import validate from '@/mixins/Validate';
import { useToast } from "primevue/usetoast"


const LookupField = defineAsyncComponent(() => import('@/components/modules/Form/LookupField.vue'))
const Field = defineAsyncComponent(() => import('@/components/modules/Form/Field.vue'))
//store

const moduleStore = useModuleStore()
const formDataStore = useFormDataStore()
const { fetchModuleFields, fetchModulePanels } = moduleStore
const { getModuleByName } = storeToRefs(moduleStore)
const { transferOpportunity } = formDataStore
const { controllingFieldChecker,applyAutofill,transformForSaving  } = helper();
const { validateForm, errorChecker } = validate();
const toast = useToast()


const emit = defineEmits(['mounted','closeForm'])

const props = defineProps({
    record: Object
})

const loading = ref(false)
const quoteFields = ref(['account_id','quoteToEmail','quoteToPhoneNo','quote_to_name_id','quoteToName','billingStreet','billingZipCode','billingCity','billingState','billing_country_id',
'billToName','billEmail','billPhoneNo','bill_to_name_id','shippingStreet','shippingZipCode','shippingCity','shippingState','shipping_country_id','shipToName','shipEmail','shipPhoneNo','ship_to_name_id'])
const formFieldIds = ref([])
const values = ref({})
const panels = ref([])
const formData = ref({
        'fields':[],
        'panels':[],
        'values':{
            'main':{}
        },
        'lookup':{},
        'errors':{
            'main':{}
        },
        'hidden':{
            'fields':[],
            'panels':[]
        },
        'disabled':[],
        'formName':'transfer-opportunity-form',
        'formSaving': false
    })

onMounted( async()=>{
    loading.value = true
    if(_.isEmpty(getModuleByName.value('salesquotes').fields))
        await fetchModuleFields("SalesQuote")
    if(_.isEmpty(getModuleByName.value('salesquotes').panels))
        await fetchModulePanels("salesquotes")
    
    _.forEach(quoteFields.value, function(f){
        formData.value.values.main[f] = null
    })
    formData.value.fields = _.filter(getModuleByName.value('salesquotes').fields,function(f){ if(_.includes(quoteFields.value,f.name)){ return true;}})
    let index = _.findIndex(formData.value.fields,{'name':'account_id'})
    if(index > -1){
        formData.value.fields[index]['rules']['required'] = true
    }
    formData.value.hidden.fields = _.filter(getModuleByName.value('salesquotes').fields,function(f){ if(!_.includes(quoteFields.value,f.name)){ return true;}})
    let fieldsDisplayed = _(formData.value.fields).filter(function(f){ if(f.name!='account_id'){ return true;}}).map('_id').value()
    _.forEach(getModuleByName.value('salesquotes').panels, function(p){
        let sections = []
        _.forEach(p.sections, function(sec){
            let firstIds = _.intersection(sec.field_ids[0], fieldsDisplayed)
            let secondIds = []
            if(_.has(sec.field_ids,1)){
                secondIds = _.intersection(sec.field_ids[1], fieldsDisplayed)
            }
            let tmpSec = _.cloneDeep(sec)
            tmpSec['field_ids'] = []
            if(firstIds.length > 0){
                tmpSec['field_ids'].push(firstIds)
            }
            if(secondIds.length > 0){
                tmpSec['field_ids'].push(secondIds)
            }
            if(firstIds.length > 0 || secondIds.length > 0){
                sections.push(tmpSec)
            }
        })
        if(sections.length > 0){
            let tmpPanel = _.cloneDeep(p)
            tmpPanel['sections'] = sections
            formData.value.panels.push(tmpPanel)
        }
    })
    loading.value = false
})

const closeForm = (save) =>{
    emit('closeForm',save)
}

const transferOppt = async() =>{
    formData.value.formSaving = true
    formData.value.errors.main = validateForm(formData.value.values.main,formData.value.fields,formData.value.hidden.fields,true)

    let noError = errorChecker(formData.value.errors.main)
 
    // let noError = true
    if(noError){
        let values = transformForSaving(formData.value.values.main,formData.value.fields, true)
        let res = await transferOpportunity(values,props.record._id)
        if(res.status==200){
            toast.add({ severity: 'success', summary: 'Success Message', detail: 'Record added', life: 3000 });
            formData.value.formSaving = false  
            closeForm(true)
        }
    }else{
        toast.add({ severity: 'error', summary: 'Error Message', detail: 'Please check the form again', life: 3000 });
        formData.value.formSaving = false  
    } 
}
provide('form', formData)
</script>
<template>
    <div
      v-if="loading"
      class="flex align-items-center justify-content-center">
      <ProgressSpinner />
    </div>
    <template v-else>
        <div style="height:60vh;overflow-y:auto;overflow-x:hidden">
            <p><b>Opportunity</b>: {{ record.name }}<br/><b>Current Account Name</b>: {{ record.account_id.name }}</p>
            <p class="p-text-secondary block mt-3 mb-0">Please select account where to transfer the opportunity:</p>
            <!-- <LookupField :field="_.find(getModuleByName('salesquotes').fields,{'name':'account_id'})" v-model="formData.values.main['account_id']" keyName="" :multiple="false" :formField="false" :inline="true" module="salesquotes" entity="SalesQuote" @changeValue="fieldChange(_.find(getModuleByName('salesquotes').fields,{'name':'account_id'}))"/> -->
            <Field formPage="create" module="salesquotes" :inline="false" keyName="main" entity="SalesQuote" :config="_.find(formData.fields,{'name':'account_id'})"/>
            <div v-for="panel in formData.panels" :key="panel._id">
                <template v-for="(section,sectioni) in panel.sections" :key="section._id">
                    <div class="flex flex-column px-1 py-2" :class="(sectioni > 1) ? 'mt-2' : ''">
                        <h6 class="formSectionLabel" v-if="section.label">{{ section.label }}</h6>
                        <div class="grid">
                            <div  v-for="(col,colI) in section.field_ids" :key="colI" class="col flex flex-column gap-2">
                                <template v-for="field in col" :key="field" >
                                    <Field 
                                        formPage="create" 
                                        module="salesquotes" 
                                        :inline="false" 
                                        keyName="main" 
                                        entity="SalesQuote"
                                        :config="_.find(formData.fields,{'_id':field})"/>
                                </template>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        
        </div>
        <div class="flex justify-content-end gap-2 px-3 py-1 mt-3">
                <el-button @click="closeForm(false)" :disabled="loading || formData.formSaving">Cancel</el-button>
                <el-button type="primary" @click="transferOppt" :disabled="loading || formData.formSaving" :loading="formData.formSaving">Transfer</el-button>
            </div>
    </template>
</template>
<style>
</style>
