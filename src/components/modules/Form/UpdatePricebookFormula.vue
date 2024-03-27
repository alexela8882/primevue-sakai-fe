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
const { getModuleByName, getEntityFields } = storeToRefs(moduleStore)
const { fetchModuleFields } = moduleStore
const { updatePricebookFormula } = formDataStore
const { transformLookupValue  } = helper();
const toast = useToast()


const emit = defineEmits(['closeForm'])

const props = defineProps({
    record: Object
})

const loading = ref(false)
const saving = ref(false)
const formula = ref("")
const oldFormula = ref("")
const formulaField = ref({})
const allFields = ref([])
const selectedField = ref()
const selectedFunction = ref()
const formulaFunctions = ref([
    {
        'label':'IF',
        'formula':'IF(logical_test, value_if_true, value_if_false)'
    },
    {
        'label':'ISPICKVAL',
        'formula':'ISPICKVAL(picklist_field_name, option_value)'
    },
    {
        'label':'ROUND',
        'formula':'ROUND(number,num_digits)'
    }
])
const activeTab = ref(0)
const formulaInput = ref(null)

onMounted( async()=>{
    loading.value = true
    formulaField.value = _.find(getModuleByName.value('pricebooks').fields,{'name':'formula'})
    oldFormula.value = _.get(props.record,'formula','')
    //fetching fields
    if(_.isEmpty(getModuleByName.value('pricebooks').fields))
        await fetchModuleFields("Pricebook")
    if(_.isEmpty(getEntityFields.value('Price')))
        await fetchModuleFields("Price")
    if(_.isEmpty(getModuleByName.value('pricelists').fields))
        await fetchModuleFields("Pricelist")
    if(_.isEmpty(getModuleByName.value('products').fields))
        await fetchModuleFields("Product")
    if(_.isEmpty(getEntityFields.value('Currency')))
        await fetchModuleFields("Currency")
    if(_.isEmpty(getEntityFields.value('ExworkPrice')))
        await fetchModuleFields("ExworkPrice")

    allFields.value.push({'label':'Pricebook','items':_.reduce(getModuleByName.value('pricebooks').fields,function(r,v,i){ r.push(_.merge(v,{'module':'Pricebook'})); return r;},[])})
    allFields.value.push({'label':'Pricelist','items':_.reduce(getModuleByName.value('pricelists').fields,function(r,v,i){ r.push(_.merge(v,{'module':'Pricelist'})); return r;},[])})
    allFields.value.push({'label':'List Price','items':_.reduce(getEntityFields.value('Price'),function(r,v,i){ r.push(_.merge(v,{'module':'Price'})); return r;},[])})
    allFields.value.push({'label':'Product','items':_.reduce(getModuleByName.value('products').fields,function(r,v,i){ r.push(_.merge(v,{'module':'Product'})); return r;},[])})
    allFields.value.push({'label':'Currency','items':_.reduce(getEntityFields.value('Currency'),function(r,v,i){ r.push(_.merge(v,{'module':'Currency'})); return r;},[])})
    allFields.value.push({'label':'ExworkPrice','items':_.reduce(getEntityFields.value('ExworkPrice'),function(r,v,i){ r.push(_.merge(v,{'module':'ExworkPrice'})); return r;},[])})

    loading.value = false
})

const closeForm = (save) =>{
    emit('closeForm',save)
}

const updateFormula = async() =>{
    saving.value = true

    if(oldFormula.value != formula.value){
        let values = {'formula':_.trim(formula.value)}
        let res = await updatePricebookFormula(values,props.record._id)
        if(res.status==200){
            toast.add({ severity: 'success', summary: 'Success Message', detail: 'Record added', life: 3000 });
            saving.value = false  
            closeForm(true)
        }
    }else{
        toast.add({ severity: 'warning', summary: 'Warning', detail: 'No change, form will close', life: 3000 });
        saving.value = false  
    } 
}

const insertToken = (token) =>{
    //get position where to insert field or function
    let textarea = formulaInput.value
    let sentence = formula.value
    let len = sentence.length
    let pos = textarea.$refs.textarea.selectionStart
    if (pos === undefined) {
        pos = len
    }
    let before = sentence.substr(0, pos)
    let after = sentence.substr(pos, len)

    if(!_.isNil(token) && _.isString(token)){
        selectedFunction.value = null
        selectedField.value = null
        formula.value = before + token + after        
    }else if(activeTab.value==0){ // insert field
        selectedFunction.value = null
        formula.value = before + selectedField.value.module + "::" + selectedField.value.name + after        
        selectedField.value = null;
    }else if(activeTab.value==1){ //insert function
        selectedField.value = null
        formula.value = before + selectedFunction.value.formula + after        
        selectedFunction.value = null
    }
}

const updateTab = (v) =>{
    console.log(v)
}

</script>
<template>
    <div
      v-if="loading"
      class="flex align-items-center justify-content-center">
      <ProgressSpinner />
    </div>
    <template v-else>
        <div class="flex formulaBuilder" style="border: 1px solid #ddd;">
            <div class="flex-initial justify-items-stretch" style="width:30%;border-right: 1px solid #ddd;">
                <TabView :activeIndex="activeTab" @update:activeIndex="function(v){ activeTab=v }">
                    <TabPanel header="Fields">
                        <Listbox v-model="selectedField" :options="allFields" filter  dataKey="_id" optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" class="w-full" listStyle="height:250px">
                        <template #optiongroup="slotProps">
                            <div class="flex align-items-center">
                                <strong>{{ slotProps.option.label }}</strong>
                            </div>
                        </template>
                        <template #option="slotProps">
                            <div class="flex align-items-center">
                                <div v-tooltip="slotProps.option.module+' - '+slotProps.option.label">{{ slotProps.option.label }}</div>
                            </div>
                        </template>
                    </Listbox>
                    </TabPanel>
                    <TabPanel header="Functions">
                        <Listbox v-model="selectedFunction" :options="formulaFunctions" filter dataKey="label" optionLabel="label" class="w-full" listStyle="height:250px">
                        <template #optiongroup="slotProps">
                            <div class="flex align-items-center">
                                <div>{{ slotProps.option.label }}</div>
                            </div>
                        </template>
                    </Listbox>
                    </TabPanel>
                </TabView>   
                <p style="margin:0" v-if="selectedFunction && activeTab==1"><b>{{ selectedFunction.formula }}</b></p>         
                <Button class="w-full" label="Insert" icon="pi pi-angle-right" iconPos="right" @click="insertToken"></Button>
            </div>
            <div class="flex-1"  style="width:70%">
              <div class="flex align-items-center justify-content-between">
                <div class="ml-2"><b>Formula</b></div>
                <div class="p-1">
                    <el-button class="operatorBtn" size="small" @click="insertToken('+')">+</el-button>
                    <el-button class="operatorBtn" size="small" @click="insertToken('-')">-</el-button>
                    <el-button class="operatorBtn" size="small" @click="insertToken('x')">x</el-button>
                    <el-button class="operatorBtn" size="small" @click="insertToken('/')">/</el-button>
                    <el-button class="operatorBtn" size="small" @click="insertToken('(')">(</el-button>
                    <el-button class="operatorBtn" size="small" @click="insertToken(')')">)</el-button>
                </div>
              </div>
             <el-input v-model="formula" ref="formulaInput" type="textarea" :autosize="{ minRows: 6, maxRows: 10}"></el-input>
             <!-- <el-button type="primary" class="mt-2 ml-2" size="small" >Validate</el-button> -->
            </div>
        </div>
        <div class="flex justify-content-end gap-2 px-3 py-1 mt-3">
            <el-button @click="closeForm(false)" :disabled="loading || saving">Cancel</el-button>
            <el-button type="primary" @click="updateFormula" :disabled="loading || saving" :loading="saving">Update</el-button>
        </div>
    </template>
</template>
<style>
.formulaBuilder .p-listbox.p-focus{
    border-color:  rgb(229, 229, 229);
}
.formulaBuilder .operatorBtn{
    margin-left:4px;
}
</style>
