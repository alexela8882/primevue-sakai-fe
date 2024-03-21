<script setup>
import { onMounted, onUnmounted, ref, inject,defineAsyncComponent  } from "vue";
import { storeToRefs } from 'pinia'
import _ from 'lodash';
import axios from 'axios'
import helper from '@/mixins/Helper';
import { useToast } from "primevue/usetoast"
import { Search } from '@element-plus/icons-vue'

import { useModuleStore } from '../../../stores/modules'
const moduleStore = useModuleStore()
const { getModules,getModuleByName } = storeToRefs(moduleStore)

import { useFormDataStore } from '../../../stores/forms'
const formDataStore = useFormDataStore()
const { fetchLookupPaginated } = formDataStore

const { formatLookupOptions,extractFieldinExpressionFormat,extractEntityinExpressionFormat } = helper();

const AddableForm = defineAsyncComponent(() => import('@/components/modules/Form/AddableForm.vue'))

const entityModule = ref({});
const value = ref([])
const searchText = ref("")
const items = ref({})
const pagination = ref({})
const open = ref(false)
const page = ref(1)
const fetching = ref(true)
const multiple = ref(false)
const toggle = async (event) => {
    if((!_.get(form.value,'formSaving',false) && !_.includes(_.get(form.value,'disabled',[]),props.field._id)) || !props.formField){
        if(!open.value){
            open.value = true
            fetchData()
        }
    }
}
const filters = ref([])
const toast = useToast()
const addableFormVisible = ref(false)
const selectedValues = ref([])

const props = defineProps({
    field: Object,
    keyName: String,
    module: String,
    inline: Boolean,
    entity: String,
    formField: Boolean,
    modelValue: Array,
    optionValue: String,
    onLoad: Boolean,
    multiple: Boolean
})

const emit = defineEmits(['changeValue','update:modelValue'])
const addableModule = ref(null)

onMounted(() => {
    let vm = this;
    multiple.value = props.multiple
    if(_.get(props.field,'rules.ms_pop_up',false)){
        multiple.value = true
    }
    if(!props.formField){
        multiple.value = true
    }
    if(!_.isEmpty(props.modelValue) && !_.isNull(props.modelValue) && !props.formField){
        value.value = _.reduce(props.modelValue, function(r,v,i){
            r.push(_.merge(v,{'value':v.label}))
            return r
        },[])
    }
    entityModule.value = _.find(getModules.value,{'mainEntity':props.field.relation.entity_id.name})
    if(_.has(props.field,'filterQuery')){
        var filter = props.field.filterQuery;
        var query = filter.match(/(\%[a-zA-Z0-9_\:\.\#]*\%)/gi);
        _.forEach(query, function(q){
            var val = _.trim(q,'%')
            var fieldName = extractFieldinExpressionFormat(val)
            var entityName = extractEntityinExpressionFormat(val)
            if(_.isEmpty(entityName)){
                let tmp = _.find(getModules.value,{'name':props.module})
                entityName = tmp.mainEntity
            }
            if(entityName==props.entity){
                filters.value.push({'field':fieldName,'entity':entityName})
            }
            
        })
    }
    if(_.has(props.field,'rules.filtered_by')){
        if(!_.isEmpty(props.field.rules.filtered_by)){
            filters.value.push({'field':props.field.rules.filtered_by,'entity':props.entity})
        }
    }

    // fetch data onload
    console.log(props.onLoad)
    if (props.onLoad) fetchData()
})

const changePage = async(p) => {
    page.value = p
    fetchData()
}

const closePopup = () =>{
    open.value = false
}

let cancelToken = null; // Variable to store the cancel token
const fetchData = async() =>{
    fetching.value = true
    // Cancel the previous request if it exists
    if (cancelToken) {
        cancelToken.cancel('Previous search canceled');
    }

    // // Create a new cancel token
    cancelToken = axios.CancelToken.source();
    try {
        let params = {"fieldId":props.field.uniqueName,"page":page.value,"moduleName":props.module,"search":searchText.value}
        let err = []
        if(!props.formField){
            params['forReport'] = true
        }
        if(!_.isEmpty(filters.value) && props.formField){
            
            _.forEach(filters.value, function(f){
                if(!_.isEmpty(form.value.values.main[f.field]) && !_.isNull(form.value.values.main[f.field])){
                    let key = f.entity+"::"+f.field
                    params[key] = (_.isArray(form.value.values.main[f.field])) ? _.map(form.value.values.main[f.field],'_id') : form.value.values.main[f.field]['_id']
                }else{
                    err.push(f.field)
                }
            })
        }
        if(_.isEmpty(err)){
            let records = await fetchLookupPaginated(params,cancelToken)
            // const res = await axios(`/lookup`, {
            //     method: 'POST',
            //     params: params,
            //     headers: { 'Content-Type': 'application/json' }
            // })
            items.value = formatLookupOptions(records.data, [], props.field)
            pagination.value = _.cloneDeep(_.get(records,'meta.pagination',{}))

            selectedValues.value = _.filter(items.value.options, function(o){ if(_.includes(_.map(value.value,'_id'),o._id)){ return true; }})
            // value.value = selectedValues.value
        }else{
            toast.add({ severity: 'error', summary: 'Error', detail: 'Please select '+_.join(err,', '), position:"top-center", life: 3000 });
        }
        fetching.value = false
        
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('Request canceled:', error.message);
        } else {
            console.error('Error fetching data:', error);
        }
    } 
}
const handleSearch = async () =>{
    page.value = 1
    await fetchData()
}

const removeSelected = (index,id) =>{
    if((!_.get(form.value,'formSaving',false) && !_.includes(_.get(form.value,'disabled',[]),props.field._id)) || !props.formField){
        if(multiple.value){
            if(props.formField){
                    _.remove(form.value.values[props.keyName][props.field.name], function(n,i){
                        return i==index
                    })
            }else{
                    _.remove(selectedValues.value, function(n,i){
                        return i==index
                    })
                    _.remove(value.value, function(v,i){
                        return v._id == id
                    })
                    emit('update:modelValue', value.value)
            }
        }else{
            if(props.formField){
                form.value.values[props.keyName][props.field.name] = null
            }else{
                value.value = null
            }
            
        }
        emit('changeValue')
    }
    

}

const checkBeforeClose = (index) =>{
    if(!multiple.value){
        closePopup()
    }
    if(!props.formField) {
        let newlyAdded = _.filter(selectedValues.value, function(v){ if(!_.includes(_.map(value.value,'_id'),v._id)){ return true;}})
        let removed = _.chain(value.value).filter(function(v){ if(!_.includes(_.map(selectedValues.value,'_id'),v._id)){ return true;}}).filter(function(v){ if(_.includes(_.map(items.value.options,'_id'),v._id)){ return true;}}).map('_id').value()
        console.log('removed',removed)
        _.remove(value.value, function(v,i){
            return _.includes(removed,v._id)
        })
        value.value = _.concat(value.value, newlyAdded)
        emit('update:modelValue', value.value)
    }

    emit('changeValue')
}

const openAddableForm = async() =>{
    if((!_.get(form.value,'formSaving',false) && !_.includes(_.get(form.value,'disabled',[]),props.field._id)) || !props.formField){
        addableModule.value = getModuleByName.value(props.field.addable.moduleName)
        addableFormVisible.value = true
    }
}
const form = (props.formField) ? inject('form') : {}

</script>
<template>
    <div v-if="formField" class="lookupField" :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName],field.name,[]))}" v-click-outside="closePopup">
        <div v-if="!_.isEmpty(form.values[keyName][field.name])" class="selectedValue" :class="(!multiple) ? 'single flex align-items-center' : 'multiple'" @click="toggle">
            <template v-if="multiple">
                <el-tag class="mr-1" v-for="(v,i) in value" :key="v.value" @close="removeSelected(i,v._id)" :closable="!form.formSaving && !_.includes(form.disabled,field._id)">{{ v.value }}</el-tag>
            </template>
            <div v-else class="flex align-items-center lookupSelected" style="width:100%" >
                <div class="material-icons text-white ml-2 lookupSelected" :style="'background:'+ _.get(entityModule,'color','#0091D0')">{{ _.get(entityModule,'icon','person') }}</div>
                <div class="flex justify-content-between align-items-center lookupSelected" style="width:100%">
                    <span class="flex flex-colum ml-2 lookupSelected">{{ form.values[keyName][field.name].value }}</span>
                    <span v-if="!form.formSaving && !_.includes(form.disabled,field._id)" class="flex flex-colum mr-2 lookupRemoveBtn" @click="removeSelected"><i class="pi pi-times lookupRemoveBtn"></i></span>
                </div>
                
            </div>
        </div>
        <el-input 
            v-model="searchText" @click="toggle" @keyup="handleSearch" class="lookupInput" :disabled="form.formSaving || _.includes(form.disabled,field._id)"
            placeholder="Please search here" :suffix-icon="Search">
            <template v-if="field.addable"  #append>
                <!-- <el-button ><i class="pi pi-search"></i></el-button> -->
                <el-button :class="{'disabled': form.formSaving || _.includes(form.disabled,field._id)}"><i class="pi pi-plus" @click="openAddableForm"></i></el-button>
            </template>
        </el-input>
        <div v-if="open" class="lookupOverlay p-overlaypanel p-component" :class="{ 'open' : open == true, 'w-full':!inline,'w-auto':inline}">
            <template v-if="fetching"><Skeleton v-for="(item,index) in _.fill(Array(10),'i')" :key="index" height="2rem" :width="(inline) ? '300px': '100%'" class="m-2" borderRadius="5px"></Skeleton></template>
            <Listbox v-else-if="items.group" v-model="form.values[keyName][field.name]" :multiple="multiple" :options="_.get(items,'options',[])" optionLabel="value" optionGroupLabel="label" optionGroupChildren="options" @update:modelValue="checkBeforeClose" listStyle="max-height:300px">
                <template #option="slotProps">
                    <div class="flex align-items-center lookupSelection">
                        <div class="material-icons text-white mr-2 lookupSelection" :style="'background:'+ _.get(entityModule,'color','#0091D0')">{{ _.get(entityModule,'icon','person') }}</div>
                        <div class="lookupSelection">
                            <template v-for="(val,i) in slotProps.option.poupDisplayValues" :key="i">
                                <span v-if="i==0"  class="font-medium lookupSelection">{{ val }}</span>
                                <div v-else class="text-sm text-color-secondary lookupSelection">{{  val }}</div>
                            </template>
                        </div>
                    </div>
                </template>
            </Listbox>
            <Listbox v-else v-model="form.values[keyName][field.name]" :multiple="multiple"  :options="_.get(items,'options',[])" optionLabel="value" @update:modelValue="checkBeforeClose" listStyle="max-height:300px">
                <template #option="slotProps">
                    <div class="flex align-items-center lookupSelection">
                        <div class="material-icons text-white mr-2 lookupSelection" :style="'background:'+ _.get(entityModule,'color','#0091D0')">{{ _.get(entityModule,'icon','person') }}</div>
                        <div class="lookupSelection">
                            <template v-for="(val,i) in slotProps.option.poupDisplayValues" :key="i">
                                <span v-if="i==0"  class="font-medium lookupSelection">{{ val }}</span>
                                <div v-else class="text-sm text-color-secondary lookupSelection">{{  val }}</div>
                            </template>
                        </div>
                    </div>
                </template>
            </Listbox>
            <div class="flex justify-content-center">
                <div class="flex flex-column mt-1">
                    <el-pagination
                small
                background
                layout="prev, pager, next"
                :default-page-size="10"
                :current-page="page"
                :total="_.get(pagination,'total',0)"
                @current-change="changePage"/>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="lookupField"  v-click-outside="closePopup">
        <div v-if="!_.isEmpty(value)" class="selectedValue multiple" @click="toggle">
            <el-tag class="mr-1 mb-1" :closable="!open" v-for="(v,i) in value" :key="v.value" @close="removeSelected(i,v._id)">{{ v.value }}</el-tag>
        </div>
        <el-input 
            v-model="searchText" @click="toggle" clearable @keyup="handleSearch" class="lookupInput" 
            placeholder="Please search here" :suffix-icon="Search">
        </el-input>
        <div v-if="open" class="lookupOverlay p-overlaypanel p-component" :class="{ 'open' : open == true, 'w-full':!inline,'w-auto':inline}">
            <template v-if="fetching"><Skeleton v-for="(item,index) in _.fill(Array(10),'i')" :key="index" height="2rem" :width="(inline) ? '300px': '100%'" class="m-2" borderRadius="5px"></Skeleton></template>
            <Listbox v-else-if="items.group" v-model="selectedValues" :multiple="true" dataKey="_id" :options="_.get(items,'options',[])" optionLabel="value" optionGroupLabel="label" optionGroupChildren="options" @update:modelValue="checkBeforeClose" listStyle="max-height:300px">
                <template #option="slotProps">
                    <div class="flex align-items-center lookupSelection">
                        <div class="material-icons text-white mr-2 lookupSelection" :style="'background:'+ _.get(entityModule,'color','#0091D0')">{{ _.get(entityModule,'icon','person') }}</div>
                        <div class="lookupSelection">
                            <template v-for="(val,i) in slotProps.option.poupDisplayValues" :key="i">
                                <span v-if="i==0"  class="font-medium lookupSelection">{{ val }}</span>
                                <div v-else class="text-sm text-color-secondary lookupSelection">{{  val }}</div>
                            </template>
                        </div>
                    </div>
                </template>
            </Listbox>
            <Listbox v-else v-model="selectedValues" :multiple="true" dataKey="_id"  :options="_.get(items,'options',[])" optionLabel="value" @update:modelValue="checkBeforeClose" listStyle="max-height:300px">
                <template #option="slotProps">
                    <div class="flex align-items-center lookupSelection">
                        <div class="material-icons text-white mr-2 lookupSelection" :style="'background:'+ _.get(entityModule,'color','#0091D0')">{{ _.get(entityModule,'icon','person') }}</div>
                        <div class="lookupSelection">
                            <template v-for="(val,i) in slotProps.option.poupDisplayValues" :key="i">
                                <span v-if="i==0"  class="font-medium lookupSelection">{{ val }}</span>
                                <div v-else class="text-sm text-color-secondary lookupSelection">{{  val }}</div>
                            </template>
                        </div>
                    </div>
                </template>
            </Listbox>
            <div class="flex justify-content-center">
                <div class="flex flex-column mt-1">
                    <el-pagination
                small
                background
                layout="prev, pager, next"
                :default-page-size="10"
                :current-page="page"
                :total="_.get(pagination,'total',0)"
                @current-change="changePage"/>
                </div>
            </div>
        </div>
    </div>
    <Dialog v-if="field.addable" v-model:visible="addableFormVisible" modal :header="'New ' + _.startCase(_.get(addableModule,'name',''))" :style="{ width: '40vw' }" draggable :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <AddableForm :moduleName="field.addable.moduleName" formPage="create" @close="addableFormVisible=false"></AddableForm>
    </Dialog>
</template>
<style>
.lookupField.p-overlaypanel .p-overlaypanel-content{
    padding:.8rem;
}
.lookupField{
    position: relative;
}
.lookupField .material-icons{
    border-radius:3px;
}
.lookupOverlay{
        -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
    position: absolute;
    z-index: 2 !important;
    background-color: #fff;
    height: 0px;
    box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
    overflow: hidden;
}
.lookupOverlay.open{
    height: auto;
    min-height: 50px;
}
.lookupField .lookupInput{
    font-size:12px;
}
.lookupField .lookupInput .el-input-group__append{
    padding:0px 10px;
}
.lookupField .selectedValue{
    /* position: absolute; */
    z-index: 1;
    
    background: white;
    top: 5px;
    height: calc(100% - 10px);
    margin-left: 5px;
}
.lookupField .selectedValue.single{
    width: calc(100% - 45px);
    border: 1px solid #cdcdcd;
    border-radius: 4px;
    margin-left:10px;
    background: #f1f1f1;
}
.lookupField .selectedValue.multiple{
    width: calc(100% - 40px);
    display: block;
    /* white-space: nowrap; */
    cursor: pointer;
    /* overflow: hidden;
    text-overflow: ellipsis; */
}
.lookupField .selectedValue .pi-times{
    cursor: pointer;
}
.lookupField .selectedValue .material-icons{
    font-size: 18px;
}
.lookupField .lookupInput.is-disabled .el-input-group__append{
    box-shadow:  0 1px 0 0 #ddd inset,0 -1px 0 0 #ddd inset,-1px 0 0 0 #ddd inset;
}
.lookupField .lookupInput.is-disabled .el-input-group__append i{
    color: #ddd;
}
.lookupField .lookupRemoveBtn{
    font-size: 10px;
}
.lookupField .lookupRemoveBtn:hover{
    color: #3F51B5;
    font-weight: 600;
}
</style>
