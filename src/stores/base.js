// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBaseStore = defineStore('baseStore', () => {
  // states
  const jsonDbUrl = ref('https://data.reddotcrm.com')
  const backendUrl = ref('https://api.reddotcrm.com')
  const configBar = ref(false)
  const routerLoading = ref(false)

  // getters

  // actions

  return {
    jsonDbUrl,
    backendUrl,
    configBar,
    routerLoading
  }
})
