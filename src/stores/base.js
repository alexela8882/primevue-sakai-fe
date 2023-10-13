// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBaseStore = defineStore('baseStore', () => {
  // states
  const jsonDbUrl = ref('http://localhost:3000')
  const backendUrl = ref('http://localhost:8000')

  // getters

  // actions

  return {
    jsonDbUrl,
    backendUrl
  }
})
