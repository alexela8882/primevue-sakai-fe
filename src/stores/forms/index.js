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
// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
import { get } from 'lodash'

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
    const picklist = ref([])
    //getters
    const getForms = computed(() => forms.value)
    const getPicklist = computed(() => picklist.value)
    const getPicklistByListName = computed(() => {
        return (payload) => {
          let attr = payload+'.values'
          return get(picklist.value,attr,[])
        }
      })

    //actions
    const generateForm = async (payload) => {
        const moduleData = await _fetchModule(payload)
        forms.value.push({'module':payload,'fields':moduleData.fields,'panels':moduleData.panels})
    }

    const fetchPicklist = async (payload) => {
        const res = await axios(`${jsonDbUrl.value}/picklist`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
    
        if (res.status === 200) {
          const data = (res.data && res.data.length > 0) ? res.data[0] : res.data
          picklist.value = data
        }
    }
    return {
        forms,
        picklist,
        formLoading,
        getForms,
        getPicklistByListName,
        generateForm,
        fetchPicklist 
    }
})