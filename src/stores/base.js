// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useBaseStore = defineStore('baseStore', () => {
  // states
  const jsonDbUrl = ref('http://localhost:3000')
  const backendUrl = ref('http://localhost/api')
  const configBar = ref(false)
  const routerLoading = ref(false)
  const authUser = ref()

  // getters
  const getAuthUser = computed(() => authUser.value)
 
  // actions
  const setAuthuser = async () => {

    const res = await axios(`user`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.status === 200) {
      authUser.value = res.data.data
    }
  }


  return {
    jsonDbUrl,
    backendUrl,
    configBar,
    routerLoading,
    getAuthUser,
    setAuthuser
  }
})
