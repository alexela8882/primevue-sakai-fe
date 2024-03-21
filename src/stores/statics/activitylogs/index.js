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
  const activity_logs_by_record = ref([])

  // getters
  const getActivityLogs = computed(() => activity_logs.value)
  const getActivityLogsByRecord = computed(() => activity_logs_by_record.value)

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
      // push new item
      if (activity_logs_by_record.value && activity_logs_by_record.value.length <= 0) {
        activity_logs_by_record.value = res.data.data
      } else {
        const newItemDate = res.data.data && res.data.data[0].date
        const newItem = res.data.data && res.data.data[0].items[0]
        const index = getActivityLogsByRecord.value.findIndex(record => record.date === newItemDate)
        // console.log(newItemDate)
        // console.log(newItem)
        // console.log(index)
        getActivityLogsByRecord.value[index].items.push(newItem)
      }

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
  const fetchActivityLogsByRecord = async (payload) => {
    const uri = `/activity-logs/by-record/${payload}`

    const res = await axios(uri, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (res && res.status === 200) {
      activity_logs_by_record.value = res.data.data
      return res.data
    }
  }

  return {
    saveActivityLog,
    fetchActivityLogsByRecord,
    getActivityLogs,
    getActivityLogsByRecord
  }
})
