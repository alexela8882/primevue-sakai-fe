// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
import _ from 'lodash'

import { useBaseStore } from '@/stores/base'
import { useModuleStore } from '@/stores/modules'

export const useFormDataStore = defineStore('formDataStore', () => {
    const baseStore = useBaseStore()
    const moduleStore = useModuleStore()
    const { jsonDbUrl } = storeToRefs(baseStore)
    const { _fetchModule, fetchBaseModuleByField } = moduleStore

    //ref
    const forms = ref([])
    const picklist = ref([])
    const formReset = ref("")
    //getters
    const getForms = computed(() => forms.value)
    const getPicklist = computed(() => picklist.value)
    const getPicklistByListName = computed(() => {
      return (payload) => {
        let attr = payload+'.values'
        return _.get(picklist.value,attr,[])
      }
    })
    const getCachedFormData = computed(() => {
      return (payload) => {
        if(_.endsWith(payload,'create-form')){
          return _.find(forms.value,{'formName':payload})
        }else{
          return null
        }
      }
    })
    const getFormReset = computed(() => formReset.value)

    //actions
    const saveForm = (form) =>{
       let index = _.findIndex(forms.value,{'formName':form.formName})
       if(index > -1){
          forms.value[index] = _.cloneDeep(form)
       }else{
          forms.value.push(_.cloneDeep(form))
       }
    }
    
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

    const fetchLookup = async (payload) => {
      try {
        const response = await axios(`${jsonDbUrl.value}/lookup/${payload}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        return {'values':response.data.values.data,'field':payload};
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw the error so the caller can handle it if needed
      }
    }

    const fetchLookupPaginated = async (payload) => {
      // let cancelToken = null; // Variable to store the cancel token
      // // Cancel the previous request if it exists
      // if (cancelToken) {
      //     cancelToken.cancel('Previous search canceled');
      // }

      // // Create a new cancel token
      // cancelToken = axios.CancelToken.source();
      
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const res = await axios(`${jsonDbUrl.value}/lookupPaginated`, {
          method: 'GET',
          params: { "_page": payload.page,"field-name": payload.fieldId, "search": payload.search },
          headers: { 'Content-Type': 'application/json' }
        })
        // const res = await axios(`${jsonDbUrl.value}/lookupPaginated?_page=${payload.page}&field-name=${payload.fieldId}`, {
        //   method: 'GET',
        //   headers: { 'Content-Type': 'application/json' }
        // })
        let meta = {
          "pagination": {
            "total": 50,
            "count": 10,
            "per_page": 10,
            "current_page": payload.page,
            "total_pages": 5,
            "links": {
              "previous": "http://reddotcrm.com/api/lookup?page=1",
              "next": "http://reddotcrm.com/api/lookup?page=3"
            }
          }
        }
        console.log(res)
        // return {'values':response.data,'field':payload.fieldId,'meta':meta};
        return {'values':res.data[0]['data'],'field':payload.fieldId,'meta':meta};
      } catch (error) {
        // if (axios.isCancel(error)) {
        //     console.log('Request canceled:', error.message);
        // } else {
        //     console.error('Error fetching data:', error);
        // }
        throw error; // Re-throw the error so the caller can handle it if needed
      }
    }

    const setFormReset = (payload) =>{
      console.log('reset')
      formReset.value = payload
    }

    return {
        forms,
        picklist,
        getForms,
        getPicklist,
        getPicklistByListName,
        getCachedFormData,
        getFormReset,
        saveForm,
        generateForm,
        fetchPicklist,
        fetchLookup,
        fetchLookupPaginated,
        setFormReset
    }
})