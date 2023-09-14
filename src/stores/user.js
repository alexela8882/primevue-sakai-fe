import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  
  // states
  const users = ref([])

  // getters
  const doubleCount = computed(() => count.value * 2)
  const getUsers = computed(() => users.value)


  // actions
  const setUsers = (payload) => {
    users.value = payload
  }

  return {
    users,
    getUsers,
    doubleCount,
    setUsers
  }
})