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

    const Field = defineAsyncComponent(() => import('@/components/modules/Form/Field.vue'))
    const FormPanel = defineAsyncComponent(() => import('@/components/modules/Form/FormPanel.vue'))

    const props = defineProps({
        config: Object
    })
    const formDataStore = useFormDataStore()
    const moduleDetailStore = useModuleDetailStore()
    const moduleStore = useModuleStore()
    const tabStore = useTabStore()
    const { formatLookupOptions, getPicklistFields, getLookupFields,transformFormValues,transformDate,transformForSaving,getAllHiddenFieldsAndPanels } = helper();
    const { fetchPicklist, fetchLookup, saveForm, setFormReset, saveFormValues } = formDataStore
    const { getCachedFormData,getFormReset } = storeToRefs(formDataStore)
    const { getItem } = storeToRefs(moduleDetailStore)
    const { fetchModuleFields, fetchModulePanels} = moduleStore
    const { removeTab } = tabStore
    const { getModuleByName } = storeToRefs(moduleStore)
    const { validateForm, errorChecker } = validate();
    const toast = useToast();
    const tempFields = ref(_.fill(Array(10),1))
    const formLoading = ref(true)
    const formSaving = ref(false)
    const formData = ref({
        'fields':[],
        'panels':[],
        'values':{
            'main':{},
            'mutable':[]
        },
        'lookup':{},
        'errors':{
            'main':{},
            'mutable':[]
        },
        'hidden':{
            'fields':[],
            'panels':[]
        },
        'formName':props.config.name,
        'formSaving': false
    })
    const formPage = ref()
    const hiddenPanels = ref([])
    provide('form', formData)
    onMounted(async () => {
        let tmpData = getCachedFormData.value(props.config.name)
        formPage.value = (_.includes(props.config.name,'edit')) ? 'edit' : 'create'
        console.log('mounted',formLoading.value)
        if(tmpData){
             formData.value =  _.merge(formData.value,_.cloneDeep(tmpData))
             if(props.config.name==getFormReset.value){
                 formData.value.values.main = transformFormValues(formData.value.fields,getItem.value,formPage.value)
                 
                setFormReset("")
             }
             formLoading.value = false
        }else{
            if(_.isEmpty(getModuleByName.value(props.config._module).fields))
                await fetchModuleFields(props.config._module)
            if(_.isEmpty(getModuleByName.value(props.config._module).panels))
                await fetchModulePanels(props.config._module)
            formData.value.fields = getModuleByName.value(props.config._module).fields
            formData.value.panels = getModuleByName.value(props.config._module).panels
            
            let listNames = getPicklistFields(formData.value.fields)
            let lookupFields = getLookupFields(formData.value.fields)
            await fetchPicklistandLookup(listNames,lookupFields)
            formData.value.values.main = transformFormValues(formData.value.fields,getItem.value,formPage.value)
            initialize();
            formLoading.value = false
        }
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
            promises.push(fetchPicklist(picklist))
            console.log('done all picklist')
        }
        if(lookup.length > 0){
            _.forEach(lookup, function(field){
                console.log('start lookup')
                // promises.push(fetchLookup(field))
                console.log('end lookup')
            });
            console.log('done all lookup')
        }
        await Promise.all(promises);
    }

    // const fetchLookups  = (field) =>{
    //     return new Promise((resolve, reject) => {
    //         let data = fetchLookup(field);
    //         console.log(data)
    //         if(!_.has(formData.value.lookup,field)){
    //             formData.value.lookup[field] = formatLookupOptions(_.cloneDeep(data.values),formData.value.fields)
    //         };
    //         resolve();
    //    });
    // }

    const initialize  = () => {
        let quickAddFields = _.chain(formData.value.fields).filter({'quick':true}).map('_id').value()
        formData.value.hidden = getAllHiddenFieldsAndPanels(formData.value.panels,formData.value.fields,formData.value.values.main,formPage.value)
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
        })
        console.log('done initialize')
    }

    const resetForm  = () =>{
       formLoading.value = true
       let formPage = (_.includes(props.config.name,'edit')) ? 'edit' : 'create'
       formData.value.values.main = transformFormValues(formData.value.fields,getItem.value,formPage) 
       formLoading.value = false
    }

    const submitForm = async () =>{
        let isModalForm = _.get(props.config,'maximized',false)
        formData.value.formSaving = true
        formData.value.errors.main = validateForm(formData.value.values.main,formData.value.fields,isModalForm)
        let noError = errorChecker(formData.value.errors.main)
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
        <template v-if="formLoading">
            <Skeleton v-for="(item,index) in tempFields" :key="index" height="2rem" class="mb-2" borderRadius="16px"></Skeleton>
        </template>
        <Suspense  v-if="!formLoading">
            <template v-if="_.filter(formData.panels,{quick: true}).length == 1 && _.get(config,'maximized',false)==false">
                <template v-for="field in _.filter(formData.fields,{'quick': true})" :key="field._id">
                    <Field v-if="!_.includes(formData.hidden.fields,field.uniqueName)" keyName="main" :config="field"/>
                </template>
            </template>
            <template v-else>
                <FormPanel v-for="panel in _.filter(formData.panels, function(p){ if(!_.includes(formData.hidden.panels,p.panelName) && _.endsWith(p.controllerMethod,'@index') && ((config.style=='window' && p.quick) || config.style!='window' && !p.quick)){ return true;} })"
                    :key="panel._id" 
                    :panel="panel"
                    :quickAdd="!_.get(config,'maximized',false)"
                />
            </template>
        <template #fallback>
            <Skeleton v-for="(item,index) in tempFields" :key="index" height="2rem" class="mb-2" borderRadius="16px"></Skeleton>
        </template>
        </Suspense>
        

    </div>
    <div class="sticky bottom-0 right-0 py-2 surface-50">
        <div class="flex justify-content-end gap-2 px-3 py-1">
            <el-button @click="resetForm" :disabled="formLoading || formData.formSaving">Reset</el-button>
            <el-button type="primary" @click="submitForm" :disabled="formLoading || formData.formSaving" :loading="formData.formSaving">Save</el-button>
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