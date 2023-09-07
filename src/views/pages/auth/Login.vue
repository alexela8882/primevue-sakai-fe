<script setup>
// ---------
// imports
// ---------
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useLayout } from '@/layout/composables/layout'
import { ref, computed } from 'vue'
import AppConfig from '@/layout/AppConfig.vue'
import { useToast } from "primevue/usetoast"



// ----------------
// refs
// ----------------
const localLoading = ref(false)
const toast = useToast()
const { layoutConfig } = useLayout()
const router = useRouter()
const form = ref({ email: { value: null, error: null }, password: { value: null, error: null } })
const checked = ref(false)
const isAuthenticated = localStorage.getItem('isAuthenticated')

// ------------
// methods
// ------------
const submit = async () => {
  localLoading.value = true

  // reset form
  form.value.email.error = null
  form.value.password.error = null

  const fEmail = form.value.email.value
  const fPassword = form.value.password.value

  // validation
  if (fEmail === '' || fEmail === null) {
    form.value.email.error = 'Enter your email'
  }

  if (fPassword === '' || fPassword === null) {
    form.value.password.error = 'Enter your password'
  }

  await axios.post('/login', {
    email: fEmail,
    password: fPassword
  }).then((response) => {
    // isAuthenticated.value = true

    localStorage.setItem('token', response.data.token)
    localStorage.setItem('isAuthenticated', true)
    router.push({ path: '/' })

    localLoading.value = false
    toast.add({ severity: 'success', summary: 'Success', detail: response.data.message, life: 3000 })
  }).catch((error) => {
    if (error) {
      console.log(error)

      toast.add({ severity: 'error', summary: 'Error', detail: error.response.data.message, life: 3000 })
    }

    localLoading.value = false
  })
}

const logoUrl = computed(() => {
  return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
})
</script>

<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center">
      <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" />
            <div class="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div>
            <span class="text-600 font-medium">Sign in to continue</span>
          </div>

          <div>
            <div class="flex flex-column gap-2 mb-5">
              <label for="email1" class="block text-900 text-xl font-medium">Email</label>
              <InputText
                @keypress.enter="submit()"
                :disabled="localLoading"
                type="text"
                placeholder="Email address"
                class="w-full md:w-30rem"
                :class="`${form.email.error && 'p-invalid'}`"
                style="padding: 1rem"
                v-model="form.email.value" />
              <small v-if="form.email.error" class="text-red-600">{{ form.email.error }}</small>
            </div>

            <div class="flex flex-column gap-2 mb-5">
              <label for="email1" class="block text-900 text-xl font-medium">Password</label>
              <Password
                @keypress.enter="submit()"
                :disabled="localLoading"
                v-model="form.password.value"
                placeholder="Password"
                :toggleMask="true"
                class="w-full"
                :class="`${form.password.error && 'p-invalid'}`"
                inputClass="w-full"
                :inputStyle="{ padding: '1rem' }"></Password>
              <small v-if="form.password.error" class="text-red-600">{{ form.password.error }}</small>
            </div>

            <div class="flex align-items-center justify-content-between mb-5 gap-5">
              <div class="flex align-items-center">
                <Checkbox :disabled="localLoading" v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                <label for="rememberme1">Remember me</label>
              </div>
              <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
            </div>
            <Button
              :loading="localLoading"
              @click="submit()"
              :label="`${localLoading ? 'Signing in...' : 'Sign In'}`"
              class="w-full p-3 text-xl"></Button>
          </div>
      </div>
      </div>
    </div>
  </div>
  <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
