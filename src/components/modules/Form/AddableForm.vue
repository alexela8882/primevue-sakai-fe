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
        moduleName: String,
        formPage: String
    })
    const formDataStore = useFormDataStore()
    const moduleDetailStore = useModuleDetailStore()
    const moduleStore = useModuleStore()
    const tabStore = useTabStore()
    const { formatLookupOptions, getPicklistFields, getLookupFields,transformFormValues,transformDate,transformForSaving,getAllHiddenFieldsAndPanels,controllingFieldChecker,getAllDisabledFields,checkSetValRule } = helper();
    const { fetchPicklist, fetchLookup, saveForm, setFormReset, saveFormValues } = formDataStore
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
        'formSaving': false
    })

    const hiddenPanels = ref([])
    provide('form', formData)
    onMounted(async () => {
        let moduleData = getModuleByName.value(props.moduleName)
        formData.value.fields = moduleData.fields
        formData.value.panels = moduleData.panels
        initialize();

        formLoading.value = false
    })


    const initialize  = () => {
        let quickAddFields = _.chain(formData.value.fields).filter({'quick':true}).map('_id').value()
        let values = (props.formPage=='create') ? null : getItem.value
        let tmpValues = transformFormValues(formData.value.fields,values,props.formPage)
        let setVal = checkSetValRule(formData.value.fields,tmpValues,getModuleByName.value(props.moduleName).mainEntity)
        formData.value.values.main = _.merge(_.cloneDeep(tmpValues),_.cloneDeep(setVal))
        formData.value.hidden = getAllHiddenFieldsAndPanels(formData.value.panels,formData.value.fields,formData.value.values.main,props.formPage)
        formData.value.disabled = getAllDisabledFields(formData.value.fields,formData.value.values.main,props.formPage)
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
            if(props.formPage=='create'){
                formData.value.values[panel.panelName] = []
                formData.value.errors[panel.panelName] = []
            }
        })
        console.log(formLoading.value)
    }

    const resetForm  = () =>{
       formLoading.value = true
       let values = (props.formPage=='create') ? null : getItem.value
       formData.value.values.main = transformFormValues(formData.value.fields,values,props.formPage) 
       formLoading.value = false
    }

    const submitForm = async () =>{
        formData.value.formSaving = true
        formData.value.errors.main = validateForm(formData.value.values.main,formData.value.fields,false)
        let noError = errorChecker(formData.value.errors.main)
        if(noError){
            let values = transformForSaving(formData.value.values.main,formData.value.fields, false)
            let res = await saveFormValues(values,getModuleByName.value(props.moduleName))
            if(res.status==200){
                toast.add({ severity: 'success', summary: 'Success Message', detail: 'Record added', life: 3000 });
                formData.value.formSaving = false  
     
            }
        }else{
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Please check the form again', life: 3000 });
            formData.value.formSaving = false  
        } 
        
    }

    
</script>
<template>
    <div class="relative min-h-full p-3">
        <Suspense  v-if="!formLoading">
            <template v-if="_.filter(formData.panels,{quick: true}).length == 1">
                <template v-for="field in _.filter(formData.fields,{'quick': true})" :key="field._id">
                    <Field v-if="!_.includes(formData.hidden.fields,field._id)" keyName="main" :config="field" :module="moduleName" :formPage="formPage"/>
                </template>
            </template>
            <template v-else>
                <FormPanel v-for="panel in _.filter(formData.panels, function(p){ if(!_.includes(formData.hidden.panels,p.panelName) && _.endsWith(p.controllerMethod,'@index') && p.quick){ return true;} })"
                    :key="panel._id" 
                    :panel="panel"
                    :quickAdd="true"
                    :module="moduleName"
                    :formPage="formPage"
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