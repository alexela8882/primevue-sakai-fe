// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'

export const useFormDataStore = defineStore('formDataStore', () => {
    const forms = ref([])
    return {
        forms
    }
})