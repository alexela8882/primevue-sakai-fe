import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBranchStore = defineStore('branch', () => {
  
  // states
  const branches = ref([])

  // getters
  const getBranches = computed(() => branches.value)

  // actions
  const setBranches = (payload) => { branches.value = payload }
  const addBranch = (payload) => { branches.value.push(payload) }
  const updateBranch = (payload) => {
    getBranches.value.map((u, index) => {
      if (u._id === payload._id) branches.value[index] = Object.assign({}, payload)
    })
  }
  const deleteBranch = (payload) => {
    const index = branches.value.findIndex((u) => u._id === payload._id)
    branches.value.splice(index, 1)
  }

  return {
    branches,
    getBranches,
    setBranches,
    addBranch,
    updateBranch,
    deleteBranch
  }
})