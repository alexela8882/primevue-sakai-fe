<script setup>
    import { ref, onMounted   } from 'vue'
    import { useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useToast } from "primevue/usetoast"
    import axios from 'axios'
    import { fill,cloneDeep } from 'lodash'

    import { useModuleStore } from '../../../stores/modules'

    const props = defineProps({
        config: Object
    })

    const tempFields = ref(fill(Array(10),1))
    const formLoading = ref(true)
    
    onMounted(async () => {
        console.log(cloneDeep(props.config.module))
    })
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