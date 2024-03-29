<script setup>
    import { ref, onMounted, defineAsyncComponent,provide, onBeforeUnmount,watch } from 'vue'
    import { useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useToast } from "primevue/usetoast"
    import axios from 'axios'
    import helper from '@/mixins/Helper';
    import _ from 'lodash'
    import validate from '@/mixins/Validate';

    import { useFormDataStore } from '../../../stores/forms'
    import { useModuleDetailStore } from '../../../stores/modules/detail'
    import { useModuleStore } from '../../../stores/modules/index'
    import { useTabStore } from '@/stores/tabs/index'
    import { useBaseStore } from '../../../stores/base'

    const Field = defineAsyncComponent(() => import('@/components/modules/Form/Field.vue'))
    const FormPanel = defineAsyncComponent(() => import('@/components/modules/Form/FormPanel.vue'))
    const QuoteLineItem = defineAsyncComponent(() => import('@/components/modules/Form/QuoteLineItem.vue'))

    const props = defineProps({
        config: Object
    })
    const formDataStore = useFormDataStore()
    const moduleDetailStore = useModuleDetailStore()
    const moduleStore = useModuleStore()
    const tabStore = useTabStore()
    const baseStore = useBaseStore()
    const { formatLookupOptions, getPicklistFields, getLookupFields,transformFormValues,transformDate,transformForSaving,getAllHiddenFieldsAndPanels,controllingFieldChecker,getAllDisabledFields,checkSetValRule } = helper();
    const { fetchPicklist, fetchLookup, saveForm, setFormReset, saveFormValues } = formDataStore
    const { getCachedFormData,getFormReset } = storeToRefs(formDataStore)
    const { getItem } = storeToRefs(moduleDetailStore)
    const { fetchModuleFields, fetchModulePanels} = moduleStore
    const { removeTab } = tabStore
    const { getModuleByName } = storeToRefs(moduleStore)
    const { getAuthUser } = storeToRefs(baseStore)
    const { validateForm, errorChecker } = validate();
    const toast = useToast();
    const tempFields = ref(_.fill(Array(10),1))
    const formLoading = ref(true)
    const formSaving = ref(false)
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
        'formName':props.config.name,
        'formSaving': false
    })
    const formPage = ref()
    const hiddenPanels = ref([])
    provide('form', formData)
    onMounted(async () => {
        console.log('mounted',formLoading.value)
        let tmpData = getCachedFormData.value(props.config.name)
        formPage.value = (_.includes(props.config.name,'edit')) ? 'update' : 'create'
        console.log('tmpData',tmpData)
        if(tmpData){
             formData.value =  _.merge(formData.value,_.cloneDeep(tmpData))
             if(props.config.name==getFormReset.value){
                 formData.value.values.main = transformFormValues(formData.value.fields,getItem.value,formPage.value)
                 
                setFormReset("")
             }
        }else{
            // let moduleData = _.cloneDeep(getModuleByName.value(props.config._module))
            if(_.isEmpty(getModuleByName.value(props.config._module).fields))
                await fetchModuleFields(getModuleByName.value(props.config._module).mainEntity)
            if(_.isEmpty(getModuleByName.value(props.config._module).panels))
                await fetchModulePanels(props.config._module)
            let moduleData = _.cloneDeep(getModuleByName.value(props.config._module))
            formData.value.fields = moduleData.fields 
            formData.value.panels = moduleData.panels
            // let listNames = getPicklistFields(formData.value.fields)
            // let lookupFields = getLookupFields(formData.value.fields)
            // await fetchPicklistandLookup(listNames,lookupFields)
            
            initialize();
        }
        formLoading.value = false
    })

    onBeforeUnmount(()=>{
        console.log('before unmount')
        saveForm(formData.value)
    })
    watch(() => getFormReset.value, (newValue, oldValue) => {
        if(newValue==props.config.name){
            formData.value.values.main = transformFormValues(props.config.module.fields)
            setFormReset("")
        }
    })

    const fetchPicklistandLookup  = async (picklist, lookup) =>{
        const promises = [];

        if(picklist.length > 0){
            // promises.push(fetchPicklist(picklist))
            console.log('done all picklist')
        }
        if(lookup.length > 0){
            _.forEach(lookup, function(field){
                console.log('start lookup')
                promises.push(fetchLookup(props.config._module,field))
                console.log('end lookup')
            });
            console.log('done all lookup')
        }
        await Promise.all(promises);
    }

    const initialize  = () => {
        let quickAddFields = _.chain(formData.value.fields).filter({'quick':true}).map('_id').value()
        let values = (formPage.value=='create') ? null : getItem.value.data
        console.log(values)
        let tmpValues = transformFormValues(formData.value.fields,values,formPage.value)
        let setVal = checkSetValRule(formData.value.fields,tmpValues,getModuleByName.value(props.config._module).mainEntity)
        formData.value.values.main = _.merge(_.cloneDeep(tmpValues),_.cloneDeep(setVal))
        formData.value.hidden = getAllHiddenFieldsAndPanels(formData.value.panels,formData.value.fields,formData.value.values.main,formPage.value)
        formData.value.disabled = getAllDisabledFields(formData.value.fields,formData.value.values.main,formPage.value)
        if(props.config._module=='pricebooks'){
            let pricelistField = _.find(formData.value.fields,{'name':'pricelist_ids'})
            if(pricelistField){
                if(!_.includes(formData.value.hidden.fields,pricelistField._id)){
                    formData.value.hidden.fields.push(pricelistField._id)
                }
            }
        }
        //disable fields
        if(props.config._module=='defectreports' && formPage.value=='update'){
        //   var rps = _.find(vm.connectedEntity(),['entityName',"RPWorkOrder"]);
        //   if(!_.isUndefined(rps)){
        //     if(!_.isEmpty(rps.collection.data)){
        //         formData.value.disabled = _.union(formData.value.disabled,['defectreport_product_unit_id','defectreport_end_user_id'])
        //     }
        //   }
        }
        if(props.config._module=='rpworkorders' && (!_.includes(getAuthUser.value.roles,'rpwo_operator') && !_.includes(getAuthUser.value.roles,'crm_admin'))){
          formData.value.disabled = _.union(formData.value.disabled,['rpworkorder_operator_status_id'])
        }
        if(props.config._module=='salesopportunities' && formPage.value=='update'){
            let f = _.find(formData.value.fields,{'uniqueName':'salesopportunity_account_id'})
            formData.value.disabled = _.union(formData.value.disabled,[f._id])
        }

        //get quick add panels
        _.forEach(formData.value.panels, function(panel, panelI){
            formData.value.panels[panelI]['quick'] = false
            _.forEach(panel.sections, function(section, sectionI){
                formData.value.panels[panelI]['sections'][sectionI]['quick'] = false
                let allF = section.field_ids[0]
                if(section.field_ids.length>1){
                    allF.concat(section.field_ids[1])
                }
                let tmpFields = _.filter(allF, function(f){
                    if(_.includes(quickAddFields, f)){
                        return true
                    }
                })
                if(tmpFields.length > 0){
                    formData.value.panels[panelI]['quick'] = true
                    formData.value.panels[panelI]['sections'][sectionI]['quick'] = true
                }
            })
            if(formPage.value=='create'){
                formData.value.values[panel.panelName] = []
                formData.value.errors[panel.panelName] = []
            }
        })
        console.log(formLoading.value)
        console.log('done initialize')
    }

    const resetForm  = () =>{
       formLoading.value = true
       let formPage = (_.includes(props.config.name,'edit')) ? 'update' : 'create'
       formData.value.values.main = transformFormValues(formData.value.fields,getItem.value,formPage) 
       formLoading.value = false
    }

    const submitForm = async () =>{
        let isModalForm = _.get(props.config,'maximized',false)
        formData.value.formSaving = true
        formData.value.errors.main = validateForm(formData.value.values.main,formData.value.fields,formData.value.hidden.fields,isModalForm)
        let noError = errorChecker(formData.value.errors.main)
        // let noError = true
        if(noError){
            let values = transformForSaving(formData.value.values.main,formData.value.fields, isModalForm)
            let res = await saveFormValues(values,props.config.base_module)
            if(res.status==200){
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Record added', life: 3000 });
                formData.value.formSaving = false  
                removeTabAction(props.config)
            }
        }else{
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Please check the form again', life: 3000 });
            formData.value.formSaving = false  
        } 
        
    }
    const removeTabAction = async (tab) => {
        await removeTab(tab)
    }
    
</script>
<template>
    <div class="relative min-h-full p-3">
        <Suspense  v-if="!formLoading">
            <template v-if="_.filter(formData.panels,{quick: true}).length == 1 && _.get(config,'maximized',false)==false">
                <template v-for="field in _.filter(formData.fields,{'quick': true})" :key="field._id">
                    <Field v-if="!_.includes(formData.hidden.fields,field._id)" keyName="main" :config="field" :module="config._module" :formPage="formPage"/>
                </template>
            </template>
            <template v-else>
                <FormPanel v-for="panel in _.filter(formData.panels, function(p){ if(!_.includes(formData.hidden.panels,p.panelName) && _.endsWith(p.controllerMethod,'@index') && ((_.get(config,'maximized',false)==false && p.quick) || _.get(config,'maximized',false)==true)){ return true;} })"
                    :key="panel._id" 
                    :panel="panel"
                    :quickAdd="!_.get(config,'maximized',false)"
                    :module="config._module"
                    :formPage="formPage"
                />
                <template v-if="formPage=='create'">
                    <template v-for="panel in _.filter(formData.panels, function(p){ if(!_.includes(formData.hidden.panels,p.panelName) &&_.endsWith(p.controllerMethod,'@show') && _.get(config,'maximized',false)==true){ return true;} })" :key="panel._id">
                        <template v-if="_.includes(['SalesOpptItem'], panel.entityName)">
                            <div v-for="section in panel.sections" :key="section._id" class="flex flex-column px-1 py-2 mt-2" >
                                <QuoteLineItem v-if="panel.entityName=='SalesOpptItem'" :panel="panel" :module="config._module" :formPage="formPage"></QuoteLineItem>
                            </div>
                        </template>
                    </template>
                </template>
            </template>
        <template #fallback>
            <Skeleton v-for="(item,index) in tempFields" :key="index" height="2rem" class="mb-2" borderRadius="16px"></Skeleton>
        </template>
        </Suspense>
        

    </div>
    <div class="sticky bottom-0 right-0 py-2 surface-50">
        <div class="flex justify-content-end gap-2 px-3 py-1">
            <el-button v-if="formPage=='create'" @click="resetForm" :disabled="formLoading || formData.formSaving">Reset</el-button>
            <el-button v-else @click="resetForm" :disabled="formLoading || formData.formSaving">Cancel</el-button>
            <el-button type="primary" @click="submitForm" :disabled="formLoading || formData.formSaving" :loading="formData.formSaving"><template v-if="formPage=='create'">Save</template><template v-else>Update</template></el-button>
        </div>
    </div>
</template>
<style>
    .formFooter{
        position: absolute;
        bottom: 0px;
        height: 54px;
        text-align: right;
        padding: 12px;
        background-color: #f8f9fa;
        left: 0;
        border-top: 1px solid var(--surface-300);
        width: calc(100% - 4px);
        margin-left: 2px;
    }
</style>