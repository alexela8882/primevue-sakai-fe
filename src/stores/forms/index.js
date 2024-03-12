// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
import _ from 'lodash'
import helper from '@/mixins/Helper';

import { useBaseStore } from '@/stores/base'
import { useModuleStore } from '@/stores/modules'

export const useFormDataStore = defineStore('formDataStore', () => {
    const baseStore = useBaseStore()
    const moduleStore = useModuleStore()
    const { jsonDbUrl } = storeToRefs(baseStore)
    const { _fetchModule, fetchBaseModuleByField } = moduleStore
    const { formatLookupOptions } = helper();
    const toast = useToast()

    //ref
    const forms = ref([])
    const picklist = ref({})
    const lookupModel = ref({})
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

    const getLookupOptions = computed(() => {
      return (field,attr) => {
        let attribute = field+"."+attr;
        if(attr=='group'){
          return _.get(lookupModel.value,attribute,false)
        }else{
          return _.get(lookupModel.value,attribute,[])
        }
        
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
      let param = {'listName':payload}
        const res = await axios.post(`/picklist`,param)
    
        if (res.status === 200) {
          picklist.value = _.merge(picklist.value,res.data)
        }
    }

    const fetchLookup = async (moduleName,field) => {
      try {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        let param = {"moduleName":moduleName,"fieldId":field.uniqueName}
        const response = await axios.post(`/lookup`,param); 
        lookupModel.value[field.uniqueName] = formatLookupOptions(_.cloneDeep(response.data.values.data),null,field) 
        // return {'values':response.data.values.data,'field':payload}
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw the error so the caller can handle it if needed
      }
    }

    const fetchEntityFields = async (entity) => {
      const res = await axios.get(`${jsonDbUrl.value}/efields?entity=${entity}`)
  
      if (res.status === 200) {
         return res.data[0]['data']
      }
    }

    // const fetchLookup = async (payload) => {
    //   try {
    //     await new Promise(resolve => setTimeout(resolve, 2000));
    //     const response = await axios(`${jsonDbUrl.value}/lookup/${payload}`, {
    //       method: 'GET',
    //       headers: { 'Content-Type': 'application/json' },
    //     });
    //     return {'values':response.data.values.data,'field':payload}
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //     throw error; // Re-throw the error so the caller can handle it if needed
    //   }
    // }

    const fetchLookupPaginated = async (params) => {
      // let cancelToken = null; // Variable to store the cancel token
      // // Cancel the previous request if it exists
      // if (cancelToken) {
      //     cancelToken.cancel('Previous search canceled');
      // }

      // // Create a new cancel token
      // cancelToken = axios.CancelToken.source();
      
      try {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        const res = await axios(`/lookup`, {
          method: 'POST',
          // params: { "_page": payload.page,"field-name": payload.fieldId, "search": payload.search }, //db3
          params: params,
          headers: { 'Content-Type': 'application/json' }
        })
        // const res = await axios(`${jsonDbUrl.value}/lookupPaginated?_page=${payload.page}&field-name=${payload.fieldId}`, {
        //   method: 'GET',
        //   headers: { 'Content-Type': 'application/json' }
        // })
        // let meta = {
        //   "pagination": {
        //     "total": 50,
        //     "count": 10,
        //     "per_page": 10,
        //     "current_page": payload.page,
        //     "total_pages": 5,
        //     "links": {
        //       "previous": "http://reddotcrm.com/api/lookup?page=1",
        //       "next": "http://reddotcrm.com/api/lookup?page=3"
        //     }
        //   }
        // }
        console.log(res)
        return res.data.values
        // return {'values':res.data[0]['data'],'field':payload.fieldId,'meta':meta};
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

    const saveFormValues = async (values,module) =>{
      try {
        const response = await axios.post(`/modules/${module.name}`,values);
        return response
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw the error so the caller can handle it if needed
      }
    }

    const massUpdateRecords = async (values,module) =>{
      try {
        let params = {'module-name': module,'items':values}
        const response = await axios.patch(`/patchInlineUpdates`,params);
        console.log(response)
        if(response.status==200){
          toast.add({ severity: 'success', summary: 'Success', detail: response.data.message, life: 3000 });
        }
        return response
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw the error so the caller can handle it if needed
      }
    }

    const saveQuickAdd = async (values,module) =>{
      try {
        const response = await axios.post(`/quickadd/${module.mainEntity}`,values);
        return response
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw the error so the caller can handle it if needed
      }
    }

    return {
        forms,
        picklist,
        lookupModel,
        getForms,
        getPicklist,
        getPicklistByListName,
        getCachedFormData,
        getFormReset,
        getLookupOptions,
        saveForm,
        generateForm,
        fetchPicklist,
        fetchLookup,
        fetchLookupPaginated,
        setFormReset,
        saveFormValues,
        fetchEntityFields,
        massUpdateRecords,
        saveQuickAdd
    }
})