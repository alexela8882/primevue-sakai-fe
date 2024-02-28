<script setup>
    import { ref, onMounted, defineAsyncComponent,provide, onBeforeUnmount,watch } from 'vue'
    import { useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useToast } from "primevue/usetoast"
    import axios from 'axios'
    import helper from '@/mixins/Helper';
    import _ from 'lodash'

    import { useFormDataStore } from '../../../stores/forms'
    import { useModuleDetailStore } from '../../../stores/modules/detail'
    import { useModuleStore } from '../../../stores/modules/index'

    const Field = defineAsyncComponent(() => import('@/components/modules/Form/Field.vue'))
    const FormPanel = defineAsyncComponent(() => import('@/components/modules/Form/FormPanel.vue'))

    const props = defineProps({
        config: Object
    })
    const formDataStore = useFormDataStore()
    const moduleDetailStore = useModuleDetailStore()
    const moduleStore = useModuleStore()
    const { formatLookupOptions, getPicklistFields, getLookupFields,transformFormValues,transformDate } = helper();
    const { fetchPicklist, fetchLookup, saveForm, setFormReset } = formDataStore
    const { getCachedFormData,getFormReset } = storeToRefs(formDataStore)
    const { getItem } = storeToRefs(moduleDetailStore)
    const { fetchModuleFields, fetchModulePanels} = moduleStore
    const { getModuleByName } = storeToRefs(moduleStore)
    const tempFields = ref(_.fill(Array(10),1))
    const formLoading = ref(true)
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
        'formName':props.config.name
    })

    const hiddenPanels = ref([])
    
    onMounted(async () => {
        let tmpData = getCachedFormData.value(props.config.name)
        let formPage = (_.includes(props.config.name,'edit')) ? 'edit' : 'create'
        if(tmpData){
             formData.value =  _.merge(formData.value,_.cloneDeep(tmpData))
             if(props.config.name==getFormReset.value){
                 formData.value.values.main = transformFormValues(formData.value.fields,getItem.value,formPage)
                 
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
            formData.value.values.main = transformFormValues(formData.value.fields,getItem.value,formPage)
            initialize();
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
        }
        if(lookup.length > 0){
            _.forEach(lookup, function(field){
                promises.push(fetchLookups(field))
            });
        }
        await Promise.all(promises);
    }

    const fetchLookups  = (field) =>{
        return new Promise((resolve, reject) => {
            const data = fetchLookup(field);
            if(!_.has(formData.value.lookup,data['id'])){
                formData.value.lookup[data['field']] = formatLookupOptions(_.cloneDeep(data),formData.value.fields)
            };
            resolve();
       });
    }

    const initialize  = () => {
        let quickAddFields = _.chain(formData.value.fields).filter({'quick':true}).map('_id').value()
        
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

        formLoading.value = false
    }

    const resetForm  = () =>{
       formLoading.value = true
       let formPage = (_.includes(props.config.name,'edit')) ? 'edit' : 'create'
       formData.value.values.main = transformFormValues(formData.value.fields,getItem.value,formPage) 
       formLoading.value = false
    }
    provide('form', formData)
</script>
<template>
    <div class="h-full p-3">
        <Suspense v-if="!formLoading">       
            <template v-if="_.filter(formData.panels,{quick: true}).length == 1 && _.get(config,'maximized',false)==false">
                <Field v-for="field in _.filter(formData.fields,{'quick': true})" :key="field._id" keyName="main" :config="field"/>
            </template>
            <template v-else>
                <FormPanel v-for="panel in _.filter(formData.panels, function(p){ if(!_.includes(hiddenPanels,p._id) && _.endsWith(p.controllerMethod,'@index') && ((config.style=='window' && p.quick) || config.style!='window' && !p.quick)){ return true;} })"
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
            <el-button @click="resetForm">Reset</el-button>
            <el-button type="primary">Save</el-button>
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