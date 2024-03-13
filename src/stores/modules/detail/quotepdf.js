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

    //getters
    const getTemplates = computed(() => templates.value)

    //actions
    const fetchQuoteTemplates = async()=>{
        const res = await axios.get(`/quotationtemplates`)
  
        if (res.status === 200) {
            templates.value = res.data
        }
    }

    return{
        getTemplates,
        fetchQuoteTemplates
    }
})