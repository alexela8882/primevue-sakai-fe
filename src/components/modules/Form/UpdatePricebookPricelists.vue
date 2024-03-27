<script setup>
import { onMounted, onUnmounted, ref, computed, provide ,defineAsyncComponent, watch  } from "vue";
import { storeToRefs } from 'pinia'
import _ from 'lodash';
import { useModuleStore } from '@/stores/modules/index'
import { useFormDataStore } from '@/stores/forms'
import helper from '@/mixins/Helper';
import { useToast } from "primevue/usetoast"


const LookupField = defineAsyncComponent(() => import('@/components/modules/Form/LookupField.vue'))
//store

const moduleStore = useModuleStore()
const formDataStore = useFormDataStore()
const { getModuleByName } = storeToRefs(moduleStore)
const { updatePricebookPricelists } = formDataStore
const { transformLookupValue  } = helper();
const toast = useToast()


const emit = defineEmits(['closeForm'])

const props = defineProps({
    record: Object
})

const loading = ref(false)
const saving = ref(false)
const pricelistIds = ref([])
const pricelistField = ref({})

onMounted( async()=>{
    loading.value = true
    pricelistField.value = _.find(getModuleByName.value('pricebooks').fields,{'name':'pricelist_ids'})
    pricelistIds.value = transformLookupValue(props.record['pricelist_ids'],pricelistField.value,false)
    loading.value = false
})

const closeForm = (save) =>{
    emit('closeForm',save)
}

const updatePricelist = async() =>{
    saving.value = true

    if(!_.isEmpty(pricelistIds.value)){
        let values = {'pricelist-ids':_.map(pricelistIds.value,'_id')}
        let res = await updatePricebookPricelists(values,props.record._id)
        if(res.status==200){
            toast.add({ severity: 'success', summary: 'Success Message', detail: 'Record added', life: 3000 });
            saving.value = false  
            closeForm(true)
        }
    }else{
        toast.add({ severity: 'error', summary: 'Error Message', detail: 'Please select pricelist', life: 3000 });
        saving.value = false  
    } 
}

</script>
<template>
    <div
      v-if="loading"
      class="flex align-items-center justify-content-center">
      <ProgressSpinner />
    </div>
    <template v-else>
        <LookupField :field="pricelistField" v-model="pricelistIds" keyName="" :multiple="true" :formField="false" :inline="true" module="pricebooks" entity="Pricebook"/>
        <div class="flex justify-content-end gap-2 px-3 py-1 mt-3">
            <el-button @click="closeForm(false)" :disabled="loading || saving">Cancel</el-button>
            <el-button type="primary" @click="updatePricelist" :disabled="loading || saving" :loading="saving">Update</el-button>
        </div>
    </template>
</template>
<style>
</style>
