<script setup>
    import { ref, onMounted, defineAsyncComponent,provide } from 'vue'
    import { useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useToast } from "primevue/usetoast"
    import axios from 'axios'
    import helper from '@/mixins/Helper';
    import _ from 'lodash'

    import { useFormDataStore } from '../../../stores/forms'
    

    const Field = defineAsyncComponent(() => import('@/components/modules/Form/Field.vue'))
    const FormPanel = defineAsyncComponent(() => import('@/components/modules/Form/FormPanel.vue'))

    const props = defineProps({
        config: Object
    })
    const formDataStore = useFormDataStore()
    const { formatLookupOptions, getPicklistFields, getLookupFields,transformFormValues } = helper();
    const { fetchPicklist, fetchLookup } = formDataStore
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
        }
    })

    const hiddenPanels = ref([])
    
    onMounted(async () => {
        formData.value.fields = props.config.module.fields
        formData.value.panels = props.config.module.panels
        formData.value.values.main = transformFormValues(props.config.module.fields)
        let listNames = getPicklistFields(props.config.module.fields)
        let lookupFields = getLookupFields(props.config.module.fields)
  
        await fetchPicklistandLookup(listNames,lookupFields)
        initialize();
    })

    const fetchPicklistandLookup  = async (picklist, lookup) =>{
        if(picklist.length > 0){
            fetchPicklist(picklist);
        }
        if(lookup.length > 0){
            _.forEach(lookup, function(field){
                fetchLookups(field);
            });
        }
    }

    const fetchLookups  = async (field) =>{
        try {
            const data = await fetchLookup(field);
            // Handle the resolved data here
            console.log(data)
            if(!_.has(formData.value.lookup,data['id'])){
                formData.value.lookup[data['field']] = formatLookupOptions(_.cloneDeep(data),formData.value.fields)
            };
        } catch (error) {
            // Handle errors here
            console.error(error);
        }
    }

    const initialize  = () => {
        let quickAddFields = _.chain(formData.value.fields).filter({'quick':true}).map('_id').value()
        console.log('initialize')
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

    provide('form', formData)
</script>
<template>
    <Suspense v-if="!formLoading">
        <template v-if="_.filter(formData.panels,{quick: true}).length == 1 && config.style == 'window' ">
            <Field v-for="field in _.filter(formData.fields,{'quick': true})" :key="field._id" :config="field"/>
        </template>
        <template v-else>
            <FormPanel v-for="panel in _.filter(formData.panels, function(p){ if(!_.includes(hiddenPanels,p._id) && _.endsWith(p.controllerMethod,'@index') && ((config.style=='window' && p.quick) || config.style!='window' && !p.quick)){ return true;} })" :quickAdd="config.style == 'window'" :key="panel._id" :panel="panel"/>
        </template>
        <template #fallback>
           <Skeleton v-for="(item,index) in tempFields" :key="index" height="2rem" class="mb-2" borderRadius="16px"></Skeleton>
        </template>
    </Suspense>
    
</template>