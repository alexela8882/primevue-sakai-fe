// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBaseStore = defineStore('baseStore', () => {
  // states
  const jsonDbUrl = ref('http://localhost:3000')
  const backendUrl = ref('https://dfbe-2001-4452-2be-4000-f1f-af8a-47e1-f3eb.ngrok-free.app')
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
