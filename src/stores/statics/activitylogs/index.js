// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useActivityLogStore = defineStore('activityLogStore', () => {
  // states
  const jsonDbUrl = ref('http://localhost:3000')
  const backendUrl = ref('http://localhost/api')
  const activity_logs = ref([])

  // getters
  const getActivityLogs = computed(() => activity_logs.value)

  // actions
  const saveActivityLog = async (payload) => {
    const uri = '/activity-logs'
    const res = await axios(uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: payload
    })

    console.log(res)
  }

  return {
    saveActivityLog,
    getActivityLogs
  }
})
