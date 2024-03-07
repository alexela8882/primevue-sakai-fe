<script setup>
import { onMounted, watch, ref, inject  } from "vue";
import { storeToRefs } from 'pinia'
import _ from 'lodash';
import axios from 'axios'
import helper from '@/mixins/Helper';
import parsify from '@/mixins/Parsify';

const { formatLookupOptions,extractFieldinExpressionFormat,extractEntityinExpressionFormat } = helper();
const { parseExpression } = parsify()


const props = defineProps({
    field: Object,
    keyName: String,
    module: String,
    mutableIndex: Number,
    entity: String
})

const value = ref(0)

const form = inject('form')
watch(() => form.value.values[props.keyName][props.mutableIndex], (newVal, oldVal) => {
    console.log(newVal,oldVal)
})
</script>
<template>
   {{ value }}
</template>
