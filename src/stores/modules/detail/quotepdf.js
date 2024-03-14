// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useModuleDetailStore } from '../../../stores/modules/detail'

export const useQuotePDF = defineStore('quotePDF', () => {

    const moduleDetailStore = useModuleDetailStore()

    //ref
    const templates = ref([])
    const currentTemplate = ref([])
    const quoteInfo = ref({})

    //getters
    const getTemplates = computed(() => templates.value)
    const getCurrentTemplate = computed(() => currentTemplate.value)
    const getQuoteInfo = computed(() => quoteInfo.value)

    //actions
    const fetchQuoteTemplates = async()=>{
        const res = await axios.get(`/quotationtemplates`)
  
        if (res.status === 200) {
            templates.value = res.data
        }
    }

    const fetchQuoteTemplate = async(id)=>{
        const res = await axios.get(`/quotationtemplates/${id}`)
  
        if (res.status === 200) {
            currentTemplate.value = res.data
        }
    }

    const fetchQuoteTemplatesInfo = async(id)=>{
        let param = {'_id':id}
        console.log(param)
        const res = await axios.get(`/quotationtemplates/getInfo/${id}`)
  
        if (res.status === 200) {
            quoteInfo.value = res.data
        }
    }

    return{
        getTemplates,
        getQuoteInfo,
        getCurrentTemplate,
        fetchQuoteTemplates,
        fetchQuoteTemplate,
        fetchQuoteTemplatesInfo
    }
})