<script setup>
// imports
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from "primevue/usetoast"

// refs
const toast = useToast()
const router = useRouter()
const message = ref()

// life cycles
onMounted(() => {
  var url = window.location.href
  const token = new URL(`https://1.com?${url.split("?")[1]}`).searchParams.get("token")
  const auth_id = new URL(`https://1.com?${url.split("?")[1]}`).searchParams.get("auth_id")

  // console.log(token)
  // console.log(auth_id)

  if (token) {
    message.value = "Microsoft Authentication"
    localStorage.clear() // clear

    localStorage.setItem('token', token)
    localStorage.setItem('auth_id', auth_id)
    localStorage.setItem('isAuthenticated', true)
    localStorage.setItem('SAMLauth', true)

    toast.add({ severity: 'success', summary: 'Success', detail: 'Microsoft login successful', life: 3000 })
    router.push('/')
  } else {
    message.value = "Your account cannot be logged in. Please contact the adminstrator."
    toast.add({ severity: 'error', summary: 'Error', detail: error.response.data.message, life: 9000 })
    router.push({name: 'login'})
  }
})

</script>

<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center">
      <div class="text-center">
        <ProgressSpinner />
        <div>{{ message.value }}</div>
        <div>Please wait...</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>