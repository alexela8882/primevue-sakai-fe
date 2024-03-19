// imports
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

export const useActivityLogStore = defineStore('activityLogStore', () => {
  // refs
  const toast = useToast()

  // states
  const jsonDbUrl = ref('http://localhost:3000')
  const backendUrl = ref('http://localhost/api')
  const activity_logs = ref([])

  // getters
  const getActivityLogs = computed(() => activity_logs.value)

  // actions
  const saveActivityLog = async (payload) => {
    const uri = payload.be_nec.uri
    const _method = payload.be_nec.method
    const res = await axios(uri, {
      method: _method,
      headers: { 'Content-Type': 'application/json' },
      data: payload.fields
    })

    if (res && res.status === 200) {
      console.log(res)
      // toast
      toast.add({
        severity: 'success',
        summary: 'Success Message',
        detail: res.data.message,
        life: 3000
      })

      return _method
    }
  }

  return {
    saveActivityLog,
    getActivityLogs
  }
})
