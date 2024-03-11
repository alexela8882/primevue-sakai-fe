<script setup>
import { onMounted, watch, ref, inject  } from "vue";
import { storeToRefs } from 'pinia'
import _ from 'lodash';
import axios from 'axios'
import helper from '@/mixins/Helper';
import formulaParser from '@/mixins/FormulaParser';

const { formatLookupOptions,extractFieldinExpressionFormat,extractEntityinExpressionFormat } = helper();
const { parseExpression } = formulaParser()


const props = defineProps({
    field: Object,
    keyName: String,
    module: String,
    mutableIndex: Number,
    entity: String
})

const value = ref(0)

const form = inject('form')
watch(form.value.values[props.keyName][props.mutableIndex], (newVal, oldVal) => {
    console.log('changed',newVal,oldVal)
    computeValue()
})

onMounted(()=>{
    computeValue()
})

const computeValue = () =>{
    if(props.field.formulaType=='currency' || props.field.formulaType=='number'){
        let formValues =  form.value.values[props.keyName][props.mutableIndex]
        let result = parseExpression(props.field.formulaExpression,form.value.values[props.keyName],props.entity,props.mutableIndex)
        // console.log(formValues)
        console.log(props.field.name,props.field.formulaExpression,result)
    }
}
</script>
<template>
   {{ value }}
</template>
