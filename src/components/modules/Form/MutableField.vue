<script setup>
    import { ref, onMounted,inject, defineAsyncComponent    } from 'vue'
    import { useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useToast } from "primevue/usetoast"
    import axios from 'axios'
    import _ from 'lodash'
    import helper from '@/mixins/Helper';
    import validate from '@/mixins/Validate';
    
    import { useModuleStore } from '../../../stores/modules'
    import { useFormDataStore } from '../../../stores/forms'

    import Editor from '@tinymce/tinymce-vue'
    
    const LookupField = defineAsyncComponent(() => import('@/components/modules/Form/LookupField.vue'))
    const FormulaField = defineAsyncComponent(() => import('@/components/modules/Form/FormulaField.vue'))

    const props = defineProps({
        config: Object,
        type: String,
        keyName: String,
        inline: Boolean,
        module: String,
        entity: String,
        mutableIndex: Number,
        inputWidth: String
    })

    const emit = defineEmits(['changeValue'])

    const formDataStore = useFormDataStore()
    const { fetchPicklist, fetchLookup  } = formDataStore
    const { getPicklistByListName, getLookupOptions } = storeToRefs(formDataStore)
    const { checkFieldIfMultipleSelect } = helper();
    const { validateField } = validate();

    const value = ref()
    const form = inject('form')
    const lookupLoading = ref(false)
    const picklistLoading = ref(false)

    const fieldChange  = (field) =>{
        if(!props.inline)
            form.value.errors[props.keyName][field.name] = validateField(form.value.values[props.keyName],field,form.value.fields)
        
        emit('changeValue',field.name,props.mutableIndex)
    }
    onMounted(async()=>{
        if(props.inline && props.config.field_type.name=='picklist'){
            picklistLoading.value = true
            let data = getPicklistByListName.value(props.config.listName)
            if(_.isEmpty(data))
                await fetchPicklist([props.config.listName])
            picklistLoading.value = false
        }
    })

     const fetchLookupOptions = async(val) => {
        console.log('fetchLookupOptions')
        if(val){
            let data = getLookupOptions.value(props.config.uniqueName,'group')
           
            if(_.isEmpty(data)){
                lookupLoading.value = true
                await fetchLookup(props.module,props.config)
                lookupLoading.value = false
            }
            
        }
    }
</script>
<template>
   
    <template v-if="config.field_type.name=='text'">
        <div class="fieldInput mutableField flex flex-column" :class="{'required': _.get(config.rules,'required',false)}" :style="'width:' + inputWidth[config.name]">
            <InputText v-model="form.values[keyName][mutableIndex][config.name]" :id="config.name"  size="small" :class="{'p-invalid': !_.isEmpty(_.get(form.errors[keyName][mutableIndex],config.name,[]))}" :disabled="form.formSaving" @change="fieldChange(config)" :style="'width:' + inputWidth[config.name]"/>
            <small class="errMsg" v-for="msg,i in _.get(form.errors[keyName][mutableIndex],config.name ,[])" :key="i">{{ msg }}</small>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='number' || config.field_type.name=='percentage'">
        <div class="fieldInput mutableField flex flex-column w-auto" :class="{'required': _.get(config.rules,'required',false)}">
            <InputNumber v-model="form.values[keyName][mutableIndex][config.name]" inputId="config.name" 
            mode="decimal"
            class="w-auto"
            size="small"
            :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName][mutableIndex],config.name,[]))}"
            :useGrouping="_.get(config.rules,'comma_separated',false)" 
            :suffix="(config.field_type.name=='percentage') ? '%' : ''"
            :minFractionDigits="_.get(config.rules,'decimal',null)" 
            :maxFractionDigits="_.get(config.rules,'decimal',null)" 
            @update:modelValue="fieldChange(config)"/>
            <small class="errMsg" v-for="msg,i in _.get(form.errors[keyName][mutableIndex],config.name,[])" :key="i">{{ msg }}</small>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='currency'">
        <div class="fieldInput mutableField flex flex-column" :class="{'required': _.get(config.rules,'required',false)}" :style="'width:' + inputWidth[config.name]">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <InputNumber v-if="(_.get(form.values[keyName][mutableIndex],config.currencySource.field+'.code','')=='')" :disabled="form.formSaving" v-model="form.values[keyName][mutableIndex][config.name]" inputId="config.name" 
            mode="decimal"
            :style="'width:' + inputWidth[config.name]"
            :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName][mutableIndex],config.name,[]))}"
            :useGrouping="_.get(config.rules,'comma_separated',false)" 
            :minFractionDigits="_.get(config.rules,'decimal',null)" 
            :maxFractionDigits="_.get(config.rules,'decimal',null)" 
            @update:modelValue="fieldChange(config)"/>
            <InputNumber v-else v-model="form.values[keyName][mutableIndex][config.name]" 
            :disabled="form.formSaving"
            inputId="config.name" 
            :style="'width:' + inputWidth[config.name]"
            mode="currency"
            :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName][mutableIndex],config.name,[]))}"
            :useGrouping="_.get(config.rules,'comma_separated',false)" 
            :currency="(config.field_type.name=='currency') ? _.get(form.values[keyName][mutableIndex],config.currencySource.field+'.code','') : ''"
            :currencyDisplay="_.get(config,'currencySource.concat','')"
            :minFractionDigits="_.get(config.rules,'decimal',null)" 
            :maxFractionDigits="_.get(config.rules,'decimal',null)" 
            @update:modelValue="fieldChange(config)"/>
            <small class="errMsg" v-for="msg,i in _.get(form.errors[keyName][mutableIndex],config.name,[])" :key="i">{{ msg }}</small>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='formula'">
        <FormulaField :field="config" :keyName="keyName" :mutableIndex="mutableIndex" :module="module" :entity="entity" :style="'width:' + inputWidth[config.name]"></FormulaField>
    </template>
    <template v-else-if="config.field_type.name=='date'">
        <div class="fieldInput mutableField flex flex-column" :style="'width:' + inputWidth[config.name]">
        <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
        <el-date-picker class="w-full" :disabled="form.formSaving"
            v-model="form.values[keyName][mutableIndex][config.name]"
            clearable
            :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName][mutableIndex],config.name,[])),'required': _.get(config.rules,'required',false)}"
            :type="_.get(config.rules,'date_selection','date')"
            :format="((_.get(config.rules,'date_selection','date') == 'month') ? 'MMM YYYY' : ((_.get(config.rules,'date_selection','date') == 'week') ?  'YYYY [w]ww' : 'MM/DD/YYYY'))"
            value-format="YYYY-MM-DD"
            @change="fieldChange(config)" >
            </el-date-picker>
            <small class="errMsg" v-for="msg,i in _.get(form.errors[keyName][mutableIndex],config.name,[])" :key="i">{{ msg }}</small>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='boolean'">
        <div class="fieldInput checkbox" :class="{'required': _.get(config.rules,'required',false)}" :style="'width:' + inputWidth[config.name]">
            <InputSwitch v-if="_.get(config.rules,'switch',false)"  v-model="form.values[keyName][mutableIndex][config.name]" :disabled="form.formSaving" :inputId="config.name" />
            <Checkbox v-else :inputId="config.name" v-model="form.values[keyName][mutableIndex][config.name]" :binary="true" :disabled="form.formSaving"  />
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='picklist'">
        <div class="fieldInput mutableField flex flex-column" :class="{'required': _.get(config.rules,'required',false)}" :style="'width:' + inputWidth[config.name]">
            <el-select
                v-model="form.values[keyName][mutableIndex][config.name]"
                :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName][mutableIndex],config.name,[]))}"
                class="w-full" :multiple="checkFieldIfMultipleSelect(config.rules)"
                :collapse-tags="checkFieldIfMultipleSelect(config.rules)"
                :collapse-tags-tooltip="checkFieldIfMultipleSelect(config.rules)"
                placeholder="Select" clearable filterable
                :disabled="form.formSaving"
                :loading="picklistLoading"
                @change="fieldChange(config)">
                    <el-option
                    v-for="item in getPicklistByListName(config.listName)"
                    :key="item._id"
                    :label="item.value"
                    :value="item">
                    <span class="fieldInputSelection">{{ item.value }}</span>
                    </el-option>
                    
                    <template #loading>
                        <svg class="circular" viewBox="0 0 50 50">
                            <circle class="path" cx="25" cy="25" r="20" fill="none" />
                        </svg>
                    </template>
            </el-select>
            <small class="errMsg mt-1" v-for="msg,i in _.get(form.errors[keyName][mutableIndex],config.name,[])" :key="i">{{ msg }}</small></div>
    </template>
    <template v-else-if="config.field_type.name=='lookupModel'">
        <div class="fieldInput mutableField flex flex-column" :class="{'required': _.get(config.rules,'required',false)}" :style="'width:' + inputWidth[config.name]">
            <template v-if="_.get(config.rules,'ss_dropdown',false) || _.get(config.rules,'ms_dropdown',false)">
                <el-select v-if="getLookupOptions(config.uniqueName,'group')" v-model="form.values[keyName][mutableIndex][config.name]" :disabled="form.formSaving"  :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName][mutableIndex],config.name,[]))}" placeholder="Select" clearable filterable class="w-full"
                    :loading="lookupLoading" 
                    @change="fieldChange(config)"
                    @visible-change="fetchLookupOptions">
                    <el-option-group
                    v-for="group in getLookupOptions(config.uniqueName,'options')"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                        v-for="item in group.options"
                        :key="item._id"
                        :label="item.value"
                        :value="item"
                    />
                    </el-option-group>
                </el-select>
                <el-select v-else 
                    v-model="form.values[keyName][mutableIndex][config.name]"
                    :disabled="form.formSaving"
                    class="w-full" :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName][mutableIndex],config.name,[]))}"
                    placeholder="Select" clearable filterable size="small"
                    :loading="lookupLoading" 
                    @change="fieldChange(config)"
                    @visible-change="fetchLookupOptions">
                        <el-option
                        v-for="item in getLookupOptions(config.uniqueName,'options')"
                        :key="item._id"
                        :label="item.value"
                        :value="item"
                        />
                </el-select>
            </template>
            <template v-else>
                <LookupField :field="config" :keyName="keyName" :inline="inline" :module="module" :formField="true" :entity="entity"  @changeValue="fieldChange(config)"/>
            </template>
            <small class="errMsg" v-for="msg,i in _.get(form.errors[keyName][mutableIndex],config.name,[])" :key="i">{{ msg }}</small>
        </div>
    </template>
    <template v-else>
        <div class="fieldInput mutableField flex flex-column" :class="{'required': _.get(config.rules,'required',false)}" :style="'width:' + inputWidth[config.name]">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <InputText :id="config.name" v-model="form.values[keyName][mutableIndex][config.name]" />
        </div>
    </template>

</template>
<style>
.fieldInput.mutableField .p-inputtext{
    width: 100% !important;
    font-size: 0.875rem;
    padding: 0.4rem;
}
</style>