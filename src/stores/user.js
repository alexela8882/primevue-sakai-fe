import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  
  // states
  const users = ref([])

  // getters
  const doubleCount = computed(() => count.value * 2)
  const getUsers = computed(() => users.value)


  // actions
  const setUsers = (payload) => { users.value = payload }
  const addUser = (payload) => { users.value.push(payload) }
  const updateUser = (payload) => {
    getUsers.value.map((u, index) => {
      if (u._id === payload._id) users.value[index] = Object.assign({}, payload)
    })
  }
  const deleteUser = (payload) => {
    const index = users.value.findIndex((u) => u._id === payload._id)
    users.value.splice(index, 1)
  }

  return {
    users,
    getUsers,
    doubleCount,
    setUsers,
    addUser,
    updateUser,
    deleteUser
  }
})