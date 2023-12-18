<script setup>
// imports
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

// refs
const router = useRouter()

// life cycles
onMounted(() => {
  const queryString = window.location.search
  console.log(queryString)
  const urlParams = new URLSearchParams(queryString)
  const token = urlParams.get('token')
  const auth_id = urlParams.get('auth_id')

  console.log(token)
  console.log(auth_id)

  if (token) {
    localStorage.clear() // clear

    localStorage.setItem('token', token)
    localStorage.setItem('auth_id', auth_id)
    localStorage.setItem('isAuthenticated', true)
    router.push('/')
  } else router.push({name: 'login'})
})

</script>

<template>
  <div>
    SAML LOGIN
  </div>
</template>

<style scoped>

</style>