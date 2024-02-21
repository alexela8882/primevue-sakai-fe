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
        const response = await axios.get(jsonDbUrl.value+'/lookup-paginated', {
            headers: { 'Content-Type': 'application/json' },
            params: { "_page": payload.page,"fieldId": payload.fieldId, "search": payload.search },
            cancelToken: payload.cancelToken.token // Pass the cancel token to the request
        });
        // const response = await axios(`${jsonDbUrl.value}/lookup-paginated?_page=${payload.page}&fieldId=${payload.fieldId}`, {
        //   method: 'GET',
        //   headers: { 'Content-Type': 'application/json' },
        // });
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
        return {'values':response.data,'field':payload.fieldId,'meta':meta};
      } catch (error) {
        // if (axios.isCancel(error)) {
        //     console.log('Request canceled:', error.message);
        // } else {
        //     console.error('Error fetching data:', error);
        // }
        throw error; // Re-throw the error so the caller can handle it if needed
      }
    }

    return {
        forms,
        picklist,
        formLoading,
        getForms,
        getPicklist,
        getPicklistByListName,
        generateForm,
        fetchPicklist ,
        fetchLookup,
        fetchLookupPaginated
    }
})