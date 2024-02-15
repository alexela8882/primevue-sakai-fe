<script setup>
    import { ref, onMounted,inject   } from 'vue'
    import { useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useToast } from "primevue/usetoast"
    import axios from 'axios'
    import { get } from 'lodash'

    import { useModuleStore } from '../../../stores/modules'
    import { useFormDataStore } from '../../../stores/forms'

    import Editor from '@tinymce/tinymce-vue'

    const props = defineProps({
        config: Object
    })

    const formDataStore = useFormDataStore()
    const { getPicklistByListName } = storeToRefs(formDataStore)

    const value = ref()
    const tinyApiKey = ref('izbi1p0d9vddiqqrjjtgx2a6ech4jv2wqogrplsesugoa0gs')
    const form = inject('form')

    onMounted(()=>{
        
    })

</script>
<template>
    <template v-if="config.field_type.name=='text'">
        <div class="fieldInput flex flex-column" :class="{'required': get(config.rules,'required',false)}">
            <label :for="config.name">{{ config.label }}</label>
            <InputText v-model="form.values.main[config.name]" :id="config.name" />
            <!-- <small></small> -->
        </div>
    </template>
    <template v-else-if="config.field_type.name=='number' || config.field_type.name=='percentage'">
        <div class="fieldInput flex flex-column" :class="{'required': get(config.rules,'required',false)}">
            <label :for="config.name">{{ config.label }}</label>
            <InputNumber v-model="form.values.main[config.name]" inputId="config.name" 
            mode="decimal"
            :useGrouping="get(config.rules,'comma_separated',false)" 
            :suffix="(config.field_type.name=='percentage') ? '%' : ''"
            :minFractionDigits="get(config.rules,'decimal',null)" 
            :maxFractionDigits="get(config.rules,'decimal',null)" 
            :min="get(config.rules,'digits_between.min',null)" 
            :max="get(config.rules,'digits_between.max',null)" />
        </div>
    </template>
    <template v-else-if="config.field_type.name=='currency'">
        <div class="fieldInput flex flex-column" :class="{'required': get(config.rules,'required',false)}">
            <label :for="config.name">{{ config.label }}</label>
            <InputNumber v-model="form.values.main[config.name]" inputId="config.name" 
            mode="currency"
            :useGrouping="get(config.rules,'comma_separated',false)" 
            :currency="(config.field_type.name=='currency') ? get(form.values.main,config.currencySource.field+'.code','SGD') : ''"
            :currencyDisplay="get(config,'currencySource.concat','')"
            :minFractionDigits="get(config.rules,'decimal',null)" 
            :maxFractionDigits="get(config.rules,'decimal',null)" 
            :min="get(config.rules,'digits_between.min',null)" 
            :max="get(config.rules,'digits_between.max',null)" />
        </div>
    </template>
    <template v-else-if="config.field_type.name=='date'">
        <div class="fieldInput flex flex-column" >
        <label :for="config.name">{{ config.label }}</label>
         <el-date-picker class="w-full"
            v-model="form.values.main[config.name]"
            clearable
            :type="get(config.rules,'date_selection','date')"
            :format="((get(config.rules,'date_selection','date') == 'month') ? 'MMM YYYY' : ((get(config.rules,'date_selection','date') == 'week') ?  'YYYY [w]ww' : 'MM/DD/YYYY'))">
            </el-date-picker>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='richTextBox'">
        <div class="fieldInput flex flex-column" :class="{'required': get(config.rules,'required',false)}">
            <label :for="config.name">{{ config.label }}</label>
            <editor :api-key="tinyApiKey" :init="{
                plugins: ['lists link image paste help wordcount table'],
                menubar:false,
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image table'
            }">
            </editor>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='longText'">
        <div class="fieldInput flex flex-column" :class="{'required': get(config.rules,'required',false)}">
            <label :for="config.name">{{ config.label }}</label>
            <editor :api-key="tinyApiKey" :init="{
                plugins: ['lists link image paste help wordcount'],
                menubar:false,
                toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent'
            }">
            </editor>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='boolean'">
        <div class="fieldInput checkbox" :class="{'required': get(config.rules,'required',false)}">
            <InputSwitch v-if="get(config.rules,'switch',false)"  v-model="form.values.main[config.name]" :inputId="config.name" />
            <Checkbox v-else :inputId="config.name" v-model="form.values.main[config.name]" :binary="true"  />
            <label :for="config.name">{{ config.label }}</label>
        </div>
    </template>
    <template v-else-if="config.field_type.name=='picklist'">
        <div class="fieldInput flex flex-column" :class="{'required': get(config.rules,'required',false)}">
            <label :for="config.name">{{ config.label }}</label>
            <div v-if="get(config.rules,'checkbox',false) || get(config.rules,'checkbox_inline',false) || get(config.rules,'radiobutton',false) || get(config.rules,'radiobutton_inline',false)" :class="(get(config.rules,'checkbox_inline',false) || get(config.rules,'radiobutton_inline',false)) ? 'card flex flex-wrap justify-content-center gap-3': ''">
            <div  v-for="option of getPicklistByListName(config.listName)" :key="option._id" class="flex align-items-center" :class="(get(config.rules,'checkbox',false) || get(config.rules,'radiobutton',false)) ? 'mb-1 mt-1 ml-3' : ''">
                <Checkbox v-if="get(config.rules,'checkbox',false) || get(config.rules,'checkbox_inline',false)" v-model="form.values.main[config.name]" :inputId="option._id" name="category" :value="option" />
                <RadioButton v-else :inputId="option._id" name="dynamic" :value="option" v-model="form.values.main[config.name]"/>
                <label :for="option._id" class="ml-1">{{ option.value }}</label>
            </div>
            </div>
            <Listbox v-else-if="get(config.rules,'ss_list_view',false) || get(config.rules,'ms_list_view',false)" v-model="form.values.main[config.name]" :options="getPicklistByListName(config.listName)" :multiple="get(config.rules,'ms_list_view',false)" optionLabel="value" class="w-full mt-2 mb-2" />
            <Dropdown v-else-if="get(config.rules,'ss_dropdown',false)" v-model="form.values.main[config.name]" :options="getPicklistByListName(config.listName)" showClear filter  optionLabel="value" :placeholder="'Select '+ config.label" checkmark :highlightOnSelect="false" class="w-full" />
            <MultiSelect v-else v-model="form.values.main[config.name]" display="chip" :options="getPicklistByListName(config.listName)" optionLabel="value" :placeholder="'Select '+ config.label" :selectionLimit="get(config.rules,'between.max',0)" class="w-full" />
        </div>
    </template>
    <template v-else-if="config.field_type.name=='lookupModel'">
        <div class="fieldInput flex flex-column" :class="{'required': get(config.rules,'required',false)}">
            <label :for="config.name">{{ config.label }}</label>
            <Dropdown v-if="get(config.rules,'ss_dropdown',false)" v-model="form.values.main[config.name]" :options="getPicklistByListName(config.listName)" showClear filter  optionLabel="code" :placeholder="'Select '+ config.label" checkmark :highlightOnSelect="false" class="w-full">
                <!-- <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                        <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 18px" />
                        <div>{{ slotProps.value.name }}</div>
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
                <template #option="slotProps">
                    <div class="flex align-items-center">
                        <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" style="width: 18px" />
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template> -->
            </Dropdown>
            <MultiSelect v-else v-model="form.values.main[config.name]" display="chip" :options="getPicklistByListName(config.listName)" optionLabel="value" :placeholder="'Select '+ config.label" :selectionLimit="get(config.rules,'between.max',0)" class="w-full" />
        </div>
    </template>
    <template v-else>
        <div class="fieldInput flex flex-column" :class="{'required': get(config.rules,'required',false)}">
            <label :for="config.name">{{ config.label }}</label>
            <InputText :id="config.name" v-model="form.values.main[config.name]" />
            <!-- <small></small> -->
        </div>
    </template>
</template>
<style>
.fieldInput.required input, .fieldInput.required .p-dropdown{
    border-left: 5px solid #f44336 !important;
}
.fieldInput.checkbox label{
    margin-left:10px;
}
.el-date-editor.el-input, .el-date-editor.el-input__wrapper{
    height: 36.5px;
    --el-input-border-color: rgba(0,0,0,0.38);
}
.el-date-editor .el-input__wrapper.is-focus{
    box-shadow: inset 0 0 0 2px #3F51B5, inset 0 0 0 1px #3F51B5, inset 0 0 0 1px #3F51B5, inset 0 0 0 1px #3F51B5 !important;
}
.el-date-editor .el-input__wrapper:hover{
    box-shadow: 0 0 0 1px rgb(0 0 0 / 87%) inset;
}
</style>