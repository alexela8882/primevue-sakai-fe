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
  const files = ref([])
  const file = ref({})

  // getters
  const getFiles = computed(() => files.value)
  const getFile = computed(() => file.value)

  // actions

  return {
    fileLoading,
    fileDialog,
    fileDialogSwitch,
    getFiles,
    getFile
  }
})