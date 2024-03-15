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

    const props = defineProps({
        config: Object,
        type: String,
        keyName: String,
        inline: Boolean,
        module: String,
        entity: String,
        small: Boolean,
        formPage: String
    })

    const emit = defineEmits(['changeValue'])

    const formDataStore = useFormDataStore()
    const { fetchPicklist, fetchLookup  } = formDataStore
    const { getPicklistByListName, getLookupOptions } = storeToRefs(formDataStore)
    const { checkFieldIfMultipleSelect,controllingFieldChecker,parseHiddenFields,checkSetValRule } = helper();
    const { validateField } = validate();

    const value = ref()
    const tinyApiKey = ref('izbi1p0d9vddiqqrjjtgx2a6ech4jv2wqogrplsesugoa0gs')
    const form = inject('form')
    const lookupLoading = ref(false)
    const picklistLoading = ref(false)

    const fieldChange  = (field) =>{
        if(!props.inline){
            form.value.errors[props.keyName][field.name] = validateField(form.value.values[props.keyName],field,form.value.fields)
            let result = controllingFieldChecker(field,form.value.fields,props.entity)
            console.log('fieldChange',field.name,result)
            if(!_.isEmpty(result.visible_if) || !_.isEmpty(result.hide_if)){ 
                let hiddenFields = parseHiddenFields(form.value.hidden.fields,result,props.entity,form.value.values.main)
                form.value.hidden.fields = hiddenFields
            }
            if(!_.isEmpty(result.set_val_disable_if) || !_.isEmpty(result.set_val_if)){ 
                let setVal = checkSetValRule(result,form.value.values.main,props.entity)
                if(!_.isEmpty(setVal.disabled)){
                    form.value.disabled = _.union(form.value.disabled,setVal.disabled)
                }
                if(!_.isEmpty(setVal.removeDisabled)){

                    form.value.disabled = _.pullAll(form.value.disabled,setVal.removeDisabled)
                }
                if(!_.isEmpty(setVal.values)){
                    form.value.values.main = _.merge(form.value.values.main,setVal.values)
                }
            }
            if(!_.isEmpty(result.filtered_by)){
               
                _.forEach(result.filtered_by, function(f){
                     console.log(f)
                    form.value.values.main[f] = null
                })
            }
        }
            
        emit('changeValue',field)
    }
    onMounted(async()=>{
        if(props.config.field_type.name=='picklist' && (_.get(props.config.rules,'ss_dropdown',false)!=true && _.get(props.config.rules,'ms_dropdown',false)!=true)){
            fetchPicklistOptions(true)
        }
        if(props.config.field_type.name=='lookupModel' && (_.get(props.config.rules,'ss_pop_up',false)!=true && _.get(props.config.rules,'ms_pop_up',false)!=true && _.get(props.config.rules,'ss_dropdown',false)!=true && _.get(props.config.rules,'ms_dropdown',false)!=true)){
           fetchLookupOptions(true)
        }
    })

    const fetchPicklistOptions = async(val) => {
        if(val){
            let data = getPicklistByListName.value(props.config.listName)
           
            if(_.isEmpty(data)){
                picklistLoading.value = true
                await fetchPicklist([props.config.listName])
                picklistLoading.value = false
            }
            
        }
        
    }

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
        <div class="fieldInput flex flex-column" :class="{'required': _.get(config.rules,'required',false)}">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <InputText v-model="form.values[keyName][config.name]" :id="config.name" :class="{'p-invalid': !_.isEmpty(_.get(form.errors[keyName],config.name,[]))}" :disabled="form.formSaving || _.includes(form.disabled,config._id)" @blur="fieldChange(config)" />
            <small class="errMsg" v-for="msg,i in _.get(form.errors[keyName],config.name,[])" :key="i">{{ msg }}</small>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='number' || config.field_type.name=='percentage'">
        <div class="fieldInput flex flex-column" :class="{'required': _.get(config.rules,'required',false)}">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <InputNumber v-model="form.values[keyName][config.name]" inputId="config.name" 
            mode="decimal"
            :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName],config.name,[]))}"
            :useGrouping="_.get(config.rules,'comma_separated',false)" 
            :suffix="(config.field_type.name=='percentage') ? '%' : ''"
            :minFractionDigits="_.get(config.rules,'decimal',null)" 
            :maxFractionDigits="_.get(config.rules,'decimal',null)" 
            @blur="fieldChange(config)"/>
            <small class="errMsg" v-for="msg,i in _.get(form.errors[keyName],config.name,[])" :key="i">{{ msg }}</small>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='currency'">
        <div class="fieldInput flex flex-column" :class="{'required': _.get(config.rules,'required',false)}">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <InputNumber v-if="(_.get(form.values[keyName],config.currencySource.field+'.code','')=='')" :disabled="form.formSaving || _.includes(form.disabled,config._id)" v-model="form.values[keyName][config.name]" inputId="config.name" 
            mode="decimal"
            :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName],config.name,[]))}"
            :useGrouping="_.get(config.rules,'comma_separated',false)" 
            :minFractionDigits="_.get(config.rules,'decimal',null)" 
            :maxFractionDigits="_.get(config.rules,'decimal',null)" 
            @blur="fieldChange(config)"/>
            <InputNumber v-else v-model="form.values[keyName][config.name]" 
            :disabled="form.formSaving || _.includes(form.disabled,config._id)"
            inputId="config.name" 
            mode="currency"
            :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName],config.name,[]))}"
            :useGrouping="_.get(config.rules,'comma_separated',false)" 
            :currency="(config.field_type.name=='currency') ? _.get(form.values[keyName],config.currencySource.field+'.code','') : ''"
            :currencyDisplay="_.get(config,'currencySource.concat','')"
            :minFractionDigits="_.get(config.rules,'decimal',null)" 
            :maxFractionDigits="_.get(config.rules,'decimal',null)" 
            @blur="fieldChange(config)"/>
            <small class="errMsg" v-for="msg,i in _.get(form.errors[keyName],config.name,[])" :key="i">{{ msg }}</small>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='date'">
        <div class="fieldInput flex flex-column">
        <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
        <el-date-picker class="w-full" :disabled="form.formSaving || _.includes(form.disabled,config._id)"
            v-model="form.values[keyName][config.name]"
            clearable
            :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName],config.name,[])),'required': _.get(config.rules,'required',false)}"
            :type="_.get(config.rules,'date_selection','date')"
            :format="((_.get(config.rules,'date_selection','date') == 'month') ? 'MMM YYYY' : ((_.get(config.rules,'date_selection','date') == 'week') ?  'YYYY [w]ww' : 'MM/DD/YYYY'))"
            value-format="YYYY-MM-DD"
            @change="fieldChange(config)" >
            </el-date-picker>
            <small class="errMsg" v-for="msg,i in _.get(form.errors[keyName],config.name,[])" :key="i">{{ msg }}</small>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='richTextBox'">
        <div class="fieldInput flex flex-column" :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName],config.name,[])),'required': _.get(config.rules,'required',false)}">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <editor class="required" :api-key="tinyApiKey" :init="{
                plugins: ['lists link image paste help wordcount table'],
                menubar:false,
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image table'
            }">
            </editor>
            <small class="errMsg" v-for="msg,i in _.get(form.errors[keyName],config.name,[])" :key="i">{{ msg }}</small>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='longText'">
        <div class="fieldInput flex flex-column" :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName],config.name,[])),'required': _.get(config.rules,'required',false)}">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <editor :api-key="tinyApiKey" :init="{
                plugins: ['lists link image paste help wordcount'],
                menubar:false,
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent'
            }">
            </editor>
            <small class="errMsg" v-for="msg,i in _.get(form.errors[keyName],config.name,[])" :key="i">{{ msg }}</small>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='boolean'">
        <div class="fieldInput checkbox" :class="{'required': _.get(config.rules,'required',false)}">
            <InputSwitch v-if="_.get(config.rules,'switch',false)"  v-model="form.values[keyName][config.name]" :disabled="form.formSaving || _.includes(form.disabled,config._id)" :inputId="config.name" />
            <Checkbox v-else :inputId="config.name" v-model="form.values[keyName][config.name]" :binary="true" :disabled="form.formSaving || _.includes(form.disabled,config._id)"  />
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='picklist'">
        <div class="fieldInput flex flex-column" :class="{'required': _.get(config.rules,'required',false)}">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <div v-if="_.get(config.rules,'checkbox',false) || _.get(config.rules,'checkbox_inline',false) || _.get(config.rules,'radiobutton',false) || _.get(config.rules,'radiobutton_inline',false)" :class="(_.get(config.rules,'checkbox_inline',false) || _.get(config.rules,'radiobutton_inline',false)) ? 'card flex flex-wrap justify-content-center gap-3': ''">
            <div  v-for="option of getPicklistByListName(config.listName)" :key="option._id" class="flex align-items-center" :class="(_.get(config.rules,'checkbox',false) || _.get(config.rules,'radiobutton',false)) ? 'mb-1 mt-1 ml-3' : ''">
                <Checkbox v-if="_.get(config.rules,'checkbox',false) || _.get(config.rules,'checkbox_inline',false)" v-model="form.values[keyName][config.name]" :inputId="option._id" name="category" :value="option" :disabled="form.formSaving || _.includes(form.disabled,config._id)"/>
                <RadioButton v-else :inputId="option._id" name="dynamic" :value="option" v-model="form.values[keyName][config.name]" :disabled="form.formSaving || _.includes(form.disabled,config._id)"/>
                <label :for="option._id" class="ml-1">{{ option.value }}</label>
            </div>
            </div>
            <Listbox v-else-if="_.get(config.rules,'ss_list_view',false) || _.get(config.rules,'ms_list_view',false)" v-model="form.values[keyName][config.name]" :disabled="form.formSaving || _.includes(form.disabled,config._id)" :options="getPicklistByListName(config.listName)" :multiple="_.get(config.rules,'ms_list_view',false)" optionLabel="value" class="w-full mt-2 mb-2" />
            <el-select v-else 
                v-model="form.values[keyName][config.name]"
                :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName],config.name,[]))}"
                class="w-full" :multiple="checkFieldIfMultipleSelect(config.rules)"
                :collapse-tags="checkFieldIfMultipleSelect(config.rules)"
                :collapse-tags-tooltip="checkFieldIfMultipleSelect(config.rules)"
                placeholder="Select" clearable filterable
                :disabled="form.formSaving || _.includes(form.disabled,config._id)"
                :loading="picklistLoading"
                :size="(small) ? 'small' : ''"
                @visible-change="fetchPicklistOptions"
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
            <small class="errMsg mt-1" v-for="msg,i in _.get(form.errors[keyName],config.name,[])" :key="i">{{ msg }}</small></div>
    </template>
    <template v-else-if="config.field_type.name=='lookupModel'">
        <div class="fieldInput flex flex-column" :class="{'required': _.get(config.rules,'required',false)}">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <template v-if="_.get(config.rules,'ss_dropdown',false) || _.get(config.rules,'ms_dropdown',false)">
                <el-select v-if="getLookupOptions(config.uniqueName,'group')" v-model="form.values[keyName][config.name]" :disabled="form.formSaving || _.includes(form.disabled,config._id)" :loading="lookupLoading" :size="(small) ? 'small' : ''" :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName],config.name,[]))}" placeholder="Select" clearable filterable class="w-full"
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
                    v-model="form.values[keyName][config.name]"
                    :disabled="form.formSaving || _.includes(form.disabled,config._id)"
                    :loading="lookupLoading"
                    :size="(small) ? 'small' : ''"
                    class="w-full" :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName],config.name,[]))}"
                    placeholder="Select" clearable filterable
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
            <div v-else-if="_.get(config.rules,'checkbox',false) || _.get(config.rules,'checkbox_inline',false) || _.get(config.rules,'radiobutton',false) || _.get(config.rules,'radiobutton_inline',false)" :class="(_.get(config.rules,'checkbox_inline',false) || _.get(config.rules,'radiobutton_inline',false)) ? 'card flex flex-wrap justify-content-center gap-3': ''">
                <div  v-for="option of getLookupOptions(config.uniqueName,'options')" :key="option._id" class="flex align-items-center" :class="(_.get(config.rules,'checkbox',false) || _.get(config.rules,'radiobutton',false)) ? 'mb-1 mt-1 ml-3' : ''">
                    <Checkbox v-if="_.get(config.rules,'checkbox',false) || _.get(config.rules,'checkbox_inline',false)" v-model="form.values[keyName][config.name]" :inputId="option._id" name="category" :value="option" :disabled="form.formSaving || _.includes(form.disabled,config._id)" />
                    <RadioButton v-else :inputId="option._id" name="dynamic" :value="option" v-model="form.values[keyName][config.name]" :disabled="form.formSaving || _.includes(form.disabled,config._id)"/>
                    <label :for="option._id" class="ml-1">{{ option.value }}</label>
                </div>
            </div>
            <Listbox v-else-if="_.get(config.rules,'ss_list_view',false) || _.get(config.rules,'ms_list_view',false)" v-model="form.values[keyName][config.name]" :options="getLookupOptions(config.uniqueName,'options')" :multiple="_.get(config.rules,'ms_list_view',false)" optionLabel="value" class="w-full mt-2 mb-2" />
            <template v-else>
                <LookupField :field="config" :keyName="keyName" :inline="inline" :module="module" :entity="entity" :formField="true"  @changeValue="fieldChange(config)"/>
            </template>
            <small class="errMsg" v-for="msg,i in _.get(form.errors[keyName],config.name,[])" :key="i">{{ msg }}</small>
        </div>
    </template>
    <template v-else>
        <div class="fieldInput flex flex-column" :class="{'required': _.get(config.rules,'required',false)}">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <InputText :id="config.name" v-model="form.values[keyName][config.name]" />
            <!-- <small></small> -->
        </div>
    </template>

</template>
<style>
.fieldInput.required input, .fieldInput.required .el-input__wrapper, .fieldInput.required .p-dropdown, .fieldInput .el-date-editor.required .el-input__wrapper{
    border-left: 5px solid #f44336;
}
.fieldInput.required .el-select .el-input__wrapper input,.fieldInput.required .lookupField .el-input__wrapper input,.fieldInput.required .el-select .el-select__tags input{
    border-left: 0px !important;
}
.fieldInput.required .p-inputtext:enabled:focus{
    border-left-color: #f44336;;
}
.fieldInput.required .p-inputtext:enabled:hover{
    border-left-color: #f44336;;
}

.fieldInput.checkbox label{
    margin-left:10px;
}
.fieldInput .el-input, .fieldInput .el-input__wrapper{
    height: 36.5px;
    --el-input-border-color: rgba(0,0,0,0.38);
}
.fieldInput .el-input.el-input--small, .fieldInput .el-input--small .el-input__wrapper{
    height: auto;
}
.fieldInput .el-input__wrapper.is-focus,.fieldInput .el-select .el-input.is-focus .el-input__wrapper{
    box-shadow: inset 0 0 0 2px #3F51B5, inset 0 0 0 1px #3F51B5, inset 0 0 0 1px #3F51B5, inset 0 0 0 1px #3F51B5 !important;
}
.fieldInput .el-select.invalid .el-input__wrapper,.fieldInput .el-date-editor.invalid .el-input__wrapper{
    box-shadow: 0 0 0 1px #B00020 !important;
}
.lookupField.invalid .el-input, .lookupField.invalid .el-input__wrapper{
    --el-input-border-color: #B00020 !important;
}
.fieldInput.invalid .tox.tox-tinymce, .fieldInput .p-inputnumber.invalid .p-inputtext{
    border-color:#B00020 !important;
}
.fieldInput .el-input__wrapper:hover,.fieldInput .el-select .el-input__wrapper:hover{
    box-shadow: 0 0 0 1px rgb(0 0 0 / 87%) inset;
}
.fieldInput .errMsg{
    color: #c13939;
}
</style>