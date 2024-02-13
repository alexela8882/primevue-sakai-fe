<script setup>
    import { ref, onMounted, defineAsyncComponent,provide } from 'vue'
    import { useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useToast } from "primevue/usetoast"
    import axios from 'axios'
    import { fill,cloneDeep,filter, forEach,map,value,chain, includes,endsWith, reduce,get } from 'lodash'

    import { useModuleStore } from '../../../stores/modules'
    import { useFormDataStore } from '../../../stores/forms'
    

    const Field = defineAsyncComponent(() => import('@/components/modules/Form/Field.vue'))
    const FormPanel = defineAsyncComponent(() => import('@/components/modules/Form/FormPanel.vue'))

    const props = defineProps({
        config: Object
    })
    const formDataStore = useFormDataStore()
    const { fetchPicklist } = formDataStore
    const tempFields = ref(fill(Array(10),1))
    const formLoading = ref(true)
    const formData = ref({
        'fields':[],
        'panels':[],
        'values':{
            'main':{},
            'mutable':[]
        },
        'errors':{
            'main':{},
            'mutable':[]
        }
    })

    const hiddenPanels = ref([])
    
    onMounted(async () => {
        formData.value.fields = props.config.module.fields
        formData.value.panels = props.config.module.panels
        formData.value.values.main = reduce(formData.value.fields, function(res,val,i){
            res[val.name] = (val.field_type.name=='number' || val.field_type.name=='percentage' || val.field_type.name=='currency') ? 0 : ((val.field_type.name=='boolean') ? true : ((get(val.rules,'ms_dropdown',false) ? [] : null) ))
            return res
        },{})
        await fetchPicklist()
        initialize();
    })

    function initialize(){
        let quickAddFields = chain(formData.value.fields).filter({'quick':true}).map('_id').value()

        //get quick add panels
        forEach(formData.value.panels, function(panel, panelI){
            formData.value.panels[panelI]['quick'] = false
            forEach(panel.sections, function(section, sectionI){
                formData.value.panels[panelI]['sections'][sectionI]['quick'] = false
                let allF = section.field_ids[0]
                if(section.field_ids.length>1){
                    allF.concat(section.field_ids[1])
                }
                let tmpFields = filter(allF, function(f){
                    if(includes(quickAddFields, f)){
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
        <template v-if="filter(formData.panels,{quick: true}).length == 1 && config.style == 'window' ">
            <Field v-for="field in filter(formData.fields,{'quick': true})" :key="field._id" :config="field"/>
        </template>
        <template v-else>
            <FormPanel v-for="panel in filter(formData.panels, function(p){ if(!includes(hiddenPanels,p._id) && endsWith(p.controllerMethod,'@index') && ((config.style=='window' && p.quick) || config.style!='window' && !p.quick)){ return true;} })" :quickAdd="config.style == 'window'" :key="panel._id" :panel="panel"/>
        </template>
        <template #fallback>
           <Skeleton v-for="(item,index) in tempFields" :key="index" height="2rem" class="mb-2" borderRadius="16px"></Skeleton>
        </template>
    </Suspense>
    
</template>