// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBaseStore = defineStore('baseStore', () => {
  // states
  const jsonDbUrl = ref('http://localhost:3000')
  const backendUrl = ref('http://localhost/api')
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
