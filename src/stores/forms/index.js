// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'

import { useBaseStore } from '@/stores/base'
import { useModuleStore } from '@/stores/modules'

const baseStore = useBaseStore()
const moduleStore = useModuleStore()
const { jsonDbUrl } = storeToRefs(baseStore)
const { _fetchModule, fetchBaseModuleByField } = moduleStore



export const useFormDataStore = defineStore('formDataStore', () => {
    //ref
    const forms = ref([])
    const formLoading = ref(true)

    //getters
    const getForms = computed(() => forms.value)

    //actions
    const generateForm = async (payload) => {
        const moduleData = await _fetchModule(payload)
        forms.value.push({'module':payload,'fields':moduleData.fields,'panels':moduleData.panels})
    }
    return {
        forms,
        formLoading,
        getForms,
        generateForm
    }
})