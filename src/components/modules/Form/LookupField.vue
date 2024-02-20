<script setup>
import { onMounted, onUnmounted, ref  } from "vue";
import { storeToRefs } from 'pinia'
import _ from 'lodash';
import axios from 'axios'
import helper from '@/mixins/Helper';

import { useModuleStore } from '../../../stores/modules'
const moduleStore = useModuleStore()
const { getModules } = storeToRefs(moduleStore)

import { useFormDataStore } from '../../../stores/forms'
const formDataStore = useFormDataStore()
const { fetchLookupPaginated } = formDataStore

const { formatLookupOptions } = helper();

const entityModule = ref({});
const value = ref()
const searchText = ref("")
const items = ref({})
const pagination = ref({})
const open = ref(false)
const page = ref(1)
const fetching = ref(true)
const multiple = ref(false)
const toggle = async (event) => {
    if(!open.value){
        open.value = true
        fetchData()
    }
}

const props = defineProps({
    field: Object
})

onMounted(() => {
    let vm = this;
    if(_.get(props.field,'rules.ms_pop_up',false)){
        multiple.value = true
    }
    entityModule.value = _.find(getModules.value,{'mainEntity':props.field.relation.entity_id.name})

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

    // Create a new cancel token
    cancelToken = axios.CancelToken.source();
    try {
        let records = await fetchLookupPaginated({"fieldId":props.field.uniqueName,"page":page.value,"search":searchText.value,"cancelToken":cancelToken})
        items.value = formatLookupOptions(records, [], props.field)
        pagination.value = _.cloneDeep(_.get(records,'meta.pagination',{}))
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

const removeSelected = (index) =>{
    if(multiple.value){
        _.remove(value.value, function(n,i){
            return i==index
        })
    }else{
        value.value = {}
    }
}

const checkBeforeClose = (index) =>{
    if(!multiple.value){
        closePopup()
    }
}
</script>
<template>
    <div class="lookupField" v-click-outside="closePopup">
        <div v-if="!_.isEmpty(value)" class="selectedValue" :class="(!multiple) ? 'single flex align-items-center' : 'multiple'" @click="toggle">
            <template v-if="multiple">
                <el-tag class="mr-1" closable v-for="(v,i) in value" :key="v.value" @close="removeSelected(i)">{{ v.value }}</el-tag>
            </template>
            <div v-else class="flex align-items-center" style="width:100%" >
                <div class="material-icons text-white ml-2" :style="'background:'+ _.get(entityModule,'color','#0091D0')">{{ _.get(entityModule,'icon','person') }}</div>
                <div class="flex justify-content-between" style="width:100%">
                    <span class="flex flex-colum ml-2">{{ value.value }}</span>
                    <span class="flex flex-colum mr-2" @click="removeSelected"><i class="pi pi-times"></i></span>
                </div>
                
            </div>
        </div>
        <el-input 
            v-model="searchText" @click="toggle" @keyup="handleSearch" class="lookupInput"
            placeholder="Please input">
            <template #append>
                <el-button ><i class="pi pi-search"></i></el-button>
            </template>
        </el-input>
        <div v-if="open" class="lookupOverlay p-overlaypanel p-component" :class="{ 'open' : open == true}">
            <template v-if="fetching"><Skeleton v-for="(item,index) in _.fill(Array(10),'i')" :key="index" height="2rem" :width="90" class="m-2" borderRadius="5px"></Skeleton></template>
            <Listbox v-else v-model="value" :multiple="multiple" :options="_.get(items,'options',[])" optionLabel="firstName" @update:modelValue="checkBeforeClose" listStyle="max-height:300px">
                <template #option="slotProps">
                    <div class="flex align-items-center">
                        <div class="material-icons text-white mr-2" :style="'background:'+ _.get(entityModule,'color','#0091D0')">{{ _.get(entityModule,'icon','person') }}</div>
                        <div>
                            <template v-for="(val,i) in slotProps.option.poupDisplayValues" :key="i">
                                <span v-if="i==0"  class="font-medium">{{ val }}</span>
                                <div v-else class="text-sm text-color-secondary">{{  val }}</div>
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
    width: 100%;
    position: absolute;
    z-index: 2 !important;
    background-color: #fff;
    height: 0px;
    box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
    overflow-y: hidden;
}
.lookupOverlay.open{
    height: auto;
    min-height: 50px;
}
.lookupField .lookupInput .el-input-group__append{
    padding:0px 10px;
}
.lookupField .selectedValue{
    position: absolute;
    z-index: 2;
    
    background: white;
    top: 5px;
    height: calc(100% - 10px);
    margin-left: 5px;
}
.lookupField .selectedValue.single{
    width: calc(100% - 45px);
    border: 1px solid #bfbbbb;
    border-radius: 4px;
}
.lookupField .selectedValue.multiple{
    width: calc(100% - 40px);
    display: block;
    white-space: nowrap;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
}
.lookupField .selectedValue .pi-times{
    cursor: pointer;
}
.lookupField .selectedValue .material-icons{
    font-size: 18px;
}
</style>
