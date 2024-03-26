// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useModuleDetailStore } from '../../../stores/modules/detail'
import _ from 'lodash'

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

    const generateQuotePdf = async(payload)=>{

        const res = await axios.post(`/generate-pdf`,payload)
  
        if (res.status === 200) {
            let fname = _.split(res.data.filename,'_')

            let filename = res.data.filename
            let version = filename.match(/_v\d+/i)
            // var param = {'api':'/api/download-pdf/','filename':res.data.filename,'download_filename': fname,'fileType':'pdf'}
            console.log(fname[0]+version[0])
        }
    }

    return{
        getTemplates,
        getQuoteInfo,
        getCurrentTemplate,
        fetchQuoteTemplates,
        fetchQuoteTemplate,
        fetchQuoteTemplatesInfo,
        generateQuotePdf
    }
})