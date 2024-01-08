// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
// stores
import { useBaseStore } from '@/stores/base'
import { useModuleStore } from '@/stores/modules'

export const useModuleFileStore = defineStore('moduleFileStore', () => {
  // refs
  const toast = useToast()
  // stores
  const baseStore = useBaseStore()
  const moduleStore = useModuleStore()
  const { jsonDbUrl } = storeToRefs(baseStore)
  const { getBaseModule, getModule } = storeToRefs(moduleStore)

  // states
  const fileLoading = ref(false)
  const fileDialog = ref(false)
  const fileDialogSwitch = ref(false)
  const moduleFiles = ref([])
  // content for dummy data
  const files = ref([
    {
      categoryValue: 0,
      items: [
        { id: 1, label: 'Test 1', date: 'Jan 23, 2023', size: '55kb', type: 'jpg', selected: false },
        { id: 2, label: 'Test 2', date: 'Aug 01, 2023', size: '45kb', type: 'jpg', selected: false },
        { id: 3, label: 'Test 3', date: 'Nov 23, 2023', size: '100kb', type: 'jpg', selected: false },
        { id: 4, label: 'Test 4', date: 'Sept 23, 2023', size: '1mb', type: 'png', selected: false },
        { id: 5, label: 'Test 5', date: 'Jan 06, 2023', size: '2.3mb', type: 'jpg', selected: false },
        { id: 6, label: 'Test 6', date: 'March 24, 2023', size: '50kb', type: 'jpeg', selected: false },
        { id: 7, label: 'Test 7', date: 'Nov 23, 2023', size: '1kb', type: 'jpeg', selected: false },
        { id: 8, label: 'Test 8', date: 'Nov 23, 2023', size: '0kb', type: 'png', selected: false },
        { id: 9, label: 'Test 9', date: 'Nov 23, 2023', size: '90kb', type: 'png', selected: false },
        { id: 10, label: 'Test 10', date: 'Nov 23, 2023', size: '1.1mb', type: 'jpg', selected: false },
        { id: 11, label: 'Test 11', date: 'Nov 23, 2023', size: '1.1mb', type: 'jpg', selected: false },
        { id: 12, label: 'Test 12', date: 'Dec 23, 2023', size: '1.1mb', type: 'jpg', selected: false }
      ]
    }, {
      categoryValue: 2,
      items: [
        { label: 'Test 1', date: 'Nov 23, 2023', size: '55kb', file_type: 'jpg' }
      ]
    }
  ])
  const file = ref({})

  // getters
  const getModuleFiles = computed(() => moduleFiles.value)
  const getFiles = computed(() => files.value)
  const getFile = computed(() => file.value)

  // actions
  const addModuleFiles = async (payload) => {
    // push new files
    payload.map(file => moduleFiles.value.push(file))
  }

  return {
    fileLoading,
    fileDialog,
    fileDialogSwitch,
    getModuleFiles,
    getFiles,
    getFile,
    addModuleFiles
  }
})