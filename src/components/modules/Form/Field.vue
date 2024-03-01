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
        keyName: String
    })

    const formDataStore = useFormDataStore()
    const { getPicklistByListName, getLookupOptions } = storeToRefs(formDataStore)
    const { checkFieldIfMultipleSelect } = helper();
    const { validateField } = validate();

    const value = ref()
    const tinyApiKey = ref('izbi1p0d9vddiqqrjjtgx2a6ech4jv2wqogrplsesugoa0gs')
    const form = inject('form')
    const popupLoading = ref(false)

    const remoteLookupOptions = (query) => {
        if (query) {
            popupLoading.value = true
            setTimeout(() => {
                popupLoading.value = false
                options.value = list.value.filter((item) => {
                    return item.label.toLowerCase().includes(query.toLowerCase())
                })
            }, 3000)
        } else {
            options.value = []
        }
    } 

    const fieldChange  = (field) =>{
       form.value.errors.main[field.name] = validateField(form.value.values[props.keyName],field,form.value.fields)
    }
    onMounted(()=>{
        
    })


</script>
<template>
   
    <template v-if="config.field_type.name=='text'">
        <div class="fieldInput flex flex-column" :class="{'required': _.get(config.rules,'required',false)}">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <InputText v-model="form.values[keyName][config.name]" :id="config.name" :class="{'p-invalid': !_.isEmpty(_.get(form.errors[keyName],config.name,[]))}" @change="fieldChange(config)" />
            <small class="errMsg" v-for="msg,i in _.get(form.errors[keyName],config.name,[])" :key="i">{{ msg }}</small>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='number' || config.field_type.name=='percentage'">
        <div class="fieldInput flex flex-column" :class="{'required': _.get(config.rules,'required',false)}">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <InputNumber v-model="form.values[keyName][config.name]" inputId="config.name" 
            mode="decimal"
            :useGrouping="_.get(config.rules,'comma_separated',false)" 
            :suffix="(config.field_type.name=='percentage') ? '%' : ''"
            :minFractionDigits="_.get(config.rules,'decimal',null)" 
            :maxFractionDigits="_.get(config.rules,'decimal',null)" 
            :min="_.get(config.rules,'digits_between.min',null)" 
            :max="_.get(config.rules,'digits_between.max',null)" />
        </div>
    </template>
    <template v-else-if="config.field_type.name=='currency'">
        <div class="fieldInput flex flex-column" :class="{'required': _.get(config.rules,'required',false)}">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <InputNumber v-if="(_.get(form.values[keyName],config.currencySource.field+'.code','')=='')" v-model="form.values[keyName][config.name]" inputId="config.name" 
            mode="decimal"
            :useGrouping="_.get(config.rules,'comma_separated',false)" 
            :minFractionDigits="_.get(config.rules,'decimal',null)" 
            :maxFractionDigits="_.get(config.rules,'decimal',null)" 
            :min="_.get(config.rules,'digits_between.min',null)" 
            :max="_.get(config.rules,'digits_between.max',null)" />
            <InputNumber v-else v-model="form.values[keyName][config.name]" inputId="config.name" 
            mode="currency"
            :useGrouping="_.get(config.rules,'comma_separated',false)" 
            :currency="(config.field_type.name=='currency') ? _.get(form.values[keyName],config.currencySource.field+'.code','') : ''"
            :currencyDisplay="_.get(config,'currencySource.concat','')"
            :minFractionDigits="_.get(config.rules,'decimal',null)" 
            :maxFractionDigits="_.get(config.rules,'decimal',null)" 
            :min="_.get(config.rules,'digits_between.min',null)" 
            :max="_.get(config.rules,'digits_between.max',null)" />
        </div>
    </template>
    <template v-else-if="config.field_type.name=='date'">
        <div class="fieldInput flex flex-column" >
        <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
        <el-date-picker class="w-full"
            v-model="form.values[keyName][config.name]"
            clearable
            :type="_.get(config.rules,'date_selection','date')"
            :format="((_.get(config.rules,'date_selection','date') == 'month') ? 'MMM YYYY' : ((_.get(config.rules,'date_selection','date') == 'week') ?  'YYYY [w]ww' : 'MM/DD/YYYY'))"
            value-format="YYYY-MM-DD">
            </el-date-picker>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='richTextBox'">
        <div class="fieldInput flex flex-column" :class="{'required': _.get(config.rules,'required',false)}">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <editor :api-key="tinyApiKey" :init="{
                plugins: ['lists link image paste help wordcount table'],
                menubar:false,
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image table'
            }">
            </editor>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='longText'">
        <div class="fieldInput flex flex-column" :class="{'required': _.get(config.rules,'required',false)}">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <editor :api-key="tinyApiKey" :init="{
                plugins: ['lists link image paste help wordcount'],
                menubar:false,
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent'
            }">
            </editor>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='boolean'">
        <div class="fieldInput checkbox" :class="{'required': _.get(config.rules,'required',false)}">
            <InputSwitch v-if="_.get(config.rules,'switch',false)"  v-model="form.values[keyName][config.name]" :inputId="config.name" />
            <Checkbox v-else :inputId="config.name" v-model="form.values[keyName][config.name]" :binary="true"  />
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='picklist'">
        <div class="fieldInput flex flex-column" :class="{'required': _.get(config.rules,'required',false)}">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <div v-if="_.get(config.rules,'checkbox',false) || _.get(config.rules,'checkbox_inline',false) || _.get(config.rules,'radiobutton',false) || _.get(config.rules,'radiobutton_inline',false)" :class="(_.get(config.rules,'checkbox_inline',false) || _.get(config.rules,'radiobutton_inline',false)) ? 'card flex flex-wrap justify-content-center gap-3': ''">
            <div  v-for="option of getPicklistByListName(config.listName)" :key="option._id" class="flex align-items-center" :class="(_.get(config.rules,'checkbox',false) || _.get(config.rules,'radiobutton',false)) ? 'mb-1 mt-1 ml-3' : ''">
                <Checkbox v-if="_.get(config.rules,'checkbox',false) || _.get(config.rules,'checkbox_inline',false)" v-model="form.values[keyName][config.name]" :inputId="option._id" name="category" :value="option" />
                <RadioButton v-else :inputId="option._id" name="dynamic" :value="option" v-model="form.values[keyName][config.name]"/>
                <label :for="option._id" class="ml-1">{{ option.value }}</label>
            </div>
            </div>
            <Listbox v-else-if="_.get(config.rules,'ss_list_view',false) || _.get(config.rules,'ms_list_view',false)" v-model="form.values[keyName][config.name]" :options="getPicklistByListName(config.listName)" :multiple="_.get(config.rules,'ms_list_view',false)" optionLabel="value" class="w-full mt-2 mb-2" />
            <el-select v-else 
                v-model="form.values[keyName][config.name]"
                :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName],config.name,[]))}"
                class="w-full" :multiple="checkFieldIfMultipleSelect(config.rules)"
                :collapse-tags="checkFieldIfMultipleSelect(config.rules)"
                :collapse-tags-tooltip="checkFieldIfMultipleSelect(config.rules)"
                placeholder="Select" clearable filterable
                @change="fieldChange(config)">
                    <el-option
                    v-for="item in getPicklistByListName(config.listName)"
                    :key="item._id"
                    :label="item.value"
                    :value="item"
                    />
            </el-select>
            <small class="errMsg mt-1" v-for="msg,i in _.get(form.errors[keyName],config.name,[])" :key="i">{{ msg }}</small>
            <!-- <Dropdown v-else-if="_.get(config.rules,'ss_dropdown',false)" v-model="form.values[keyName][config.name]" :options="getPicklistByListName(config.listName)" showClear filter  optionLabel="value" :placeholder="'Select '+ config.label" checkmark :highlightOnSelect="false" class="w-full" />
            <MultiSelect v-else v-model="form.values[keyName][config.name]" display="chip" :options="getPicklistByListName(config.listName)" optionLabel="value" :placeholder="'Select '+ config.label" :selectionLimit="_.get(config.rules,'between.max',0)" class="w-full" /> -->
        </div>
    </template>
    <template v-else-if="config.field_type.name=='lookupModel'">
        <div class="fieldInput flex flex-column" :class="{'required': _.get(config.rules,'required',false)}">
            <label :for="config.name" v-if="type!='tableForm'">{{ config.label }}</label>
            <template v-if="_.get(config.rules,'ss_dropdown',false) || _.get(config.rules,'ms_dropdown',false)">
                <el-select v-if="getLookupOptions(config.uniqueName,'group')" v-model="form.values[keyName][config.name]" :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName],config.name,[]))}" placeholder="Select" clearable filterable class="w-full">
                    <el-option-group
                    v-for="group in getLookupOptions(config.uniqueName,'options')"
                    :key="group.label"
                    :label="group.label"
                    @change="fieldChange(config)">
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
                    class="w-full" :class="{'invalid': !_.isEmpty(_.get(form.errors[keyName],config.name,[]))}"
                    placeholder="Select" clearable filterable
                    @change="fieldChange(config)">
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
                    <Checkbox v-if="_.get(config.rules,'checkbox',false) || _.get(config.rules,'checkbox_inline',false)" v-model="form.values[keyName][config.name]" :inputId="option._id" name="category" :value="option" />
                    <RadioButton v-else :inputId="option._id" name="dynamic" :value="option" v-model="form.values[keyName][config.name]"/>
                    <label :for="option._id" class="ml-1">{{ option.value }}</label>
                </div>
            </div>
            <Listbox v-else-if="_.get(config.rules,'ss_list_view',false) || _.get(config.rules,'ms_list_view',false)" v-model="form.values[keyName][config.name]" :options="getLookupOptions(config.uniqueName,'options')" :multiple="_.get(config.rules,'ms_list_view',false)" optionLabel="value" class="w-full mt-2 mb-2" />
            <template v-else>
                <LookupField :field="config" :keyName="keyName" v-model="form.values[keyName][config.name]"/>
            </template>
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
.fieldInput{
    margin-top:5px;
}
.fieldInput.required input, .fieldInput.required .el-input__wrapper, .fieldInput.required .p-dropdown{
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
.fieldInput .el-input__wrapper.is-focus,.fieldInput .el-select .el-input.is-focus .el-input__wrapper{
    box-shadow: inset 0 0 0 2px #3F51B5, inset 0 0 0 1px #3F51B5, inset 0 0 0 1px #3F51B5, inset 0 0 0 1px #3F51B5 !important;
}
.fieldInput .el-select.invalid .el-input__wrapper{
    box-shadow: 0 0 0 1px #B00020 !important;
}
.fieldInput .el-input__wrapper:hover,.fieldInput .el-select .el-input__wrapper:hover{
    box-shadow: 0 0 0 1px rgb(0 0 0 / 87%) inset;
}
.fieldInput .errMsg{
    color: #c13939;
}
</style>