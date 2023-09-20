<script setup>
// imports
import RadioButton from 'primevue/radiobutton'
import Button from 'primevue/button'
import InputSwitch from 'primevue/inputswitch'
import Sidebar from 'primevue/sidebar'
import { useToast } from "primevue/usetoast"
import { ref, onMounted } from 'vue'
import { useLayout } from '@/layout/composables/layout'
import axios from 'axios'

defineProps({
  simple: {
    type: Boolean,
    default: false
  }
})

// refs
const toast = useToast()
const scales = ref([12, 13, 14, 15, 16])
const visible = ref(false)
const { changeThemeSettings, setScale, layoutConfig } = useLayout()

// actions
const onConfigButtonClick = () => {
  visible.value = !visible.value
}

const onChangeTheme = async (theme, mode) => {
  const elementId = 'theme-css'
  const linkElement = document.getElementById(elementId)
  const cloneLinkElement = linkElement.cloneNode(true)
  const newThemeUrl = linkElement.getAttribute('href').replace(layoutConfig.theme.value, theme)
  cloneLinkElement.setAttribute('id', elementId + '-clone')
  cloneLinkElement.setAttribute('href', newThemeUrl)
  cloneLinkElement.addEventListener('load', () => {
    linkElement.remove()
    cloneLinkElement.setAttribute('id', elementId)
    changeThemeSettings(theme, mode === 'dark')
  })
  linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling)

  // store to localstorage
  localStorage.setItem('layoutConfig.theme', theme)
  localStorage.setItem('layoutConfig.darkTheme', mode)

  console.log(localStorage.getItem('layoutConfig.theme'))

  const obj = { app_theme: theme, app_theme_dark: mode }
  updateBackend(obj)
}

const decrementScale = () => {
  setScale(layoutConfig.scale.value - 1)
  applyScale()
}
const incrementScale = () => {
  setScale(layoutConfig.scale.value + 1)
  applyScale()
}

const applyScale = () => {
  document.documentElement.style.fontSize = layoutConfig.scale.value + 'px'

  // store to localstorage
  localStorage.setItem('layoutConfig.scale', layoutConfig.scale.value)

  const obj = { app_theme_scale: layoutConfig.scale.value }
  updateBackend(obj)
}

const onChangeRipple = () => {
  console.log(layoutConfig.ripple.value)

  // store to localstorage
  localStorage.setItem('layoutConfig.ripple', layoutConfig.ripple.value)

  const obj = { app_theme_ripple: layoutConfig.ripple.value }
  updateBackend(obj)
}

const onChangeMenuType = () => {
  console.log(layoutConfig.menuMode.value)

  // store to localstorage
  localStorage.setItem('layoutConfig.menuMode', layoutConfig.menuMode.value)

  const obj = { app_theme_menu_type: layoutConfig.menuMode.value }
  updateBackend(obj)
}

const onChangeInputStyle = () => {
  console.log(layoutConfig.inputStyle.value)

  // store to localstorage
  localStorage.setItem('layoutConfig.inputStyle', layoutConfig.inputStyle.value)

  const obj = { app_theme_input_style: layoutConfig.inputStyle.value }
  updateBackend(obj)
}

const updateBackend = async (body) => {
  await axios.post('/user-configs/change-app-theme', body).then((response) => {
    console.log(response)
    // toast.add({ severity: 'success', summary: 'Success', detail: response.data.message, life: 3000 })
  }).catch((err) => { console.log(err) })
}

onMounted(async () => {
  // fetch user config
  await axios.get('/user-configs/get-app-theme').then((response) => {
    layoutConfig.theme.value = response.data.app_theme ? response.data.app_theme : 'lara-light-indigo'
    layoutConfig.darkTheme.value = response.data.app_theme_dark ? response.data.app_theme_dark : false
    layoutConfig.scale.value = response.data.app_theme_scale ? response.data.app_theme_scale : '14'
    layoutConfig.ripple.value = response.data.app_theme_ripple ? response.data.app_theme_ripple : false
    layoutConfig.menuMode.value = response.data.app_theme_menu_type ? response.data.app_theme_menu_type : 'static'
    layoutConfig.inputStyle.value = response.data.app_theme_input_style ? response.data.app_theme_input_style : 'outlined'

    // store in localstorage
    localStorage.setItem('layoutConfig.theme', layoutConfig.theme.value)
    localStorage.setItem('layoutConfig.darkTheme', layoutConfig.darkTheme.value)
    localStorage.setItem('layoutConfig.scale', layoutConfig.scale.value)
    localStorage.setItem('layoutConfig.ripple', layoutConfig.ripple.value)
    localStorage.setItem('layoutConfig.menuMode', layoutConfig.menuMode.value)
    localStorage.setItem('layoutConfig.inputStyle', layoutConfig.inputStyle.value)
  }).catch((err) => {
    console.log(err)

    layoutConfig.theme.value = localStorage.getItem('layoutConfig.theme')
    layoutConfig.darkTheme.value = localStorage.getItem('layoutConfig.darkTheme')
    layoutConfig.scale.value = localStorage.getItem('layoutConfig.scale')
    layoutConfig.ripple.value = localStorage.getItem('layoutConfig.ripple')
    layoutConfig.menuMode.value = localStorage.getItem('layoutConfig.menuMode')
    layoutConfig.inputStyle.value = localStorage.getItem('layoutConfig.inputStyle')

    const elementId = 'theme-css'
    const linkElement = document.getElementById(elementId)
    const cloneLinkElement = linkElement.cloneNode(true)
    const newThemeUrl = linkElement.getAttribute('href').replace('lara-light-indigo', layoutConfig.theme.value)
    cloneLinkElement.setAttribute('id', elementId + '-clone')
    cloneLinkElement.setAttribute('href', newThemeUrl)
    cloneLinkElement.addEventListener('load', () => {
      linkElement.remove()
      cloneLinkElement.setAttribute('id', elementId)
      changeThemeSettings(layoutConfig.theme.value, layoutConfig.darkTheme.value === 'dark')
    })
    linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling)

    // theme scale
    document.documentElement.style.fontSize = layoutConfig.scale.value + 'px'

    // theme ripple
    layoutConfig.ripple.value = layoutConfig.ripple.value

    // theme menu type
    layoutConfig.menuMode.value = layoutConfig.menuMode.value

    // theme input style
    layoutConfig.inputStyle.value = layoutConfig.inputStyle.value

    console.log(localStorage.getItem('layoutConfig.theme'))
  })
})
</script>

<template>
  <button class="layout-config-button p-link" type="button" @click="onConfigButtonClick()">
    <i class="pi pi-cog"></i>
  </button>

  <Sidebar v-model:visible="visible" position="right" :transitionOptions="'.3s cubic-bezier(0, 0, 0.2, 1)'" class="layout-config-sidebar w-22rem">
    <h5>Scale</h5>
    <div class="flex align-items-center">
      <Button icon="pi pi-minus" type="button" @click="decrementScale()" class="p-button-text p-button-rounded w-2rem h-2rem mr-2" :disabled="layoutConfig.scale.value === scales[0]"></Button>
      <div class="flex gap-2 align-items-center">
        <i class="pi pi-circle-fill text-300" v-for="s in scales" :key="s" :class="{ 'text-primary-500': s === layoutConfig.scale.value }"></i>
      </div>
      <Button icon="pi pi-plus" type="button" pButton @click="incrementScale()" class="p-button-text p-button-rounded w-2rem h-2rem ml-2" :disabled="layoutConfig.scale.value === scales[scales.length - 1]"></Button>
    </div>

    <template v-if="!simple">
      <h5>Menu Type</h5>
      <div class="flex">
        <div class="field-radiobutton flex-1">
          <RadioButton name="menuMode" value="static" @change="onChangeMenuType()" v-model="layoutConfig.menuMode.value" inputId="mode1"></RadioButton>
          <label for="mode1">Static</label>
        </div>

        <div class="field-radiobutton flex-1">
          <RadioButton name="menuMode" value="overlay" @change="onChangeMenuType()" v-model="layoutConfig.menuMode.value" inputId="mode2"></RadioButton>
          <label for="mode2">Overlay</label>
        </div>
      </div>
    </template>

    <template v-if="!simple">
      <h5>Input Style</h5>
      <div class="flex">
        <div class="field-radiobutton flex-1">
          <RadioButton name="inputStyle" value="outlined" @change="onChangeInputStyle()" v-model="layoutConfig.inputStyle.value" inputId="outlined_input"></RadioButton>
          <label for="outlined_input">Outlined</label>
        </div>
        <div class="field-radiobutton flex-1">
          <RadioButton name="inputStyle" value="filled" @change="onChangeInputStyle()" v-model="layoutConfig.inputStyle.value" inputId="filled_input"></RadioButton>
          <label for="filled_input">Filled</label>
        </div>
      </div>

      <h5>Ripple Effect</h5>
      <InputSwitch @change="onChangeRipple()" v-model="layoutConfig.ripple.value"></InputSwitch>
    </template>

    <h5>Bootstrap</h5>
    <div class="grid">
      <div class="col-3">
        <Button
          @click="onChangeTheme('bootstrap4-light-blue', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'bootstrap4-light-blue'"
          :class="`${layoutConfig.theme.value == 'bootstrap4-light-blue' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/bootstrap4-light-blue.svg" class="w-3rem h-3rem" alt="Bootstrap Light Blue" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('bootstrap4-light-purple', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'bootstrap4-light-purple'"
          :class="`${layoutConfig.theme.value == 'bootstrap4-light-purple' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/bootstrap4-light-purple.svg" class="w-3rem h-3rem" alt="Bootstrap Light Purple" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('bootstrap4-dark-blue', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'bootstrap4-dark-blue'"
          :class="`${layoutConfig.theme.value == 'bootstrap4-dark-blue' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/bootstrap4-dark-blue.svg" class="w-3rem h-3rem" alt="Bootstrap Dark Blue" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('bootstrap4-dark-purple', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'bootstrap4-dark-purple'"
          :class="`${layoutConfig.theme.value == 'bootstrap4-dark-purple' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/bootstrap4-dark-purple.svg" class="w-3rem h-3rem" alt="Bootstrap Dark Purple" />
        </Button>
      </div>
    </div>

    <h5>Material Design</h5>
    <div class="grid">
      <div class="col-3">
        <Button
          @click="onChangeTheme('md-light-indigo', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'md-light-indigo'"
          :class="`${layoutConfig.theme.value == 'md-light-indigo' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/md-light-indigo.svg" class="w-3rem h-3rem" alt="Material Light Indigo" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('md-light-deeppurple', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'md-light-deeppurple'"
          :class="`${layoutConfig.theme.value == 'md-light-deeppurple' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/md-light-deeppurple.svg" class="w-3rem h-3rem" alt="Material Light DeepPurple" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('md-dark-indigo', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'md-dark-indigo'"
          :class="`${layoutConfig.theme.value == 'md-dark-indigo' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/md-dark-indigo.svg" class="w-3rem h-3rem" alt="Material Dark Indigo" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('md-dark-deeppurple', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'md-dark-deeppurple'"
          :class="`${layoutConfig.theme.value == 'md-dark-deeppurple' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/md-dark-deeppurple.svg" class="w-3rem h-3rem" alt="Material Dark DeepPurple" />
        </Button>
      </div>
    </div>

    <h5>Material Design Compact</h5>
    <div class="grid">
      <div class="col-3">
        <Button
          @click="onChangeTheme('mdc-light-indigo', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'mdc-light-indigo'"
          :class="`${layoutConfig.theme.value == 'mdc-light-indigo' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/md-light-indigo.svg" class="w-3rem h-3rem" alt="Material Light Indigo" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('mdc-light-deeppurple', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'mdc-light-deeppurple'"
          :class="`${layoutConfig.theme.value == 'mdc-light-deeppurple' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/md-light-deeppurple.svg" class="w-3rem h-3rem" alt="Material Light Deep Purple" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('mdc-dark-indigo', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'mdc-dark-indigo'"
          :class="`${layoutConfig.theme.value == 'mdc-dark-indigo' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/md-dark-indigo.svg" class="w-3rem h-3rem" alt="Material Dark Indigo" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('mdc-dark-deeppurple', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'mdc-dark-deeppurple'"
          :class="`${layoutConfig.theme.value == 'mdc-dark-deeppurple' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/md-dark-deeppurple.svg" class="w-3rem h-3rem" alt="Material Dark Deep Purple" />
        </Button>
      </div>
    </div>

    <h5>Tailwind</h5>
    <div class="grid">
      <div class="col-3">
        <Button
          @click="onChangeTheme('tailwind-light', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'tailwind-light'"
          :class="`${layoutConfig.theme.value == 'tailwind-light' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/tailwind-light.png" class="w-3rem h-3rem" alt="Tailwind Light" />
        </Button>
      </div>
    </div>

    <h5>Fluent UI</h5>
    <div class="grid">
      <div class="col-3">
        <Button
          @click="onChangeTheme('fluent-light', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'fluent-light'"
          :class="`${layoutConfig.theme.value == 'fluent-light' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/fluent-light.png" class="w-3rem h-3rem" alt="Fluent Light" />
        </Button>
      </div>
    </div>

    <h5>PrimeOne Design - 2022</h5>
    <div class="grid">
      <div class="col-3">
        <Button
          @click="onChangeTheme('lara-light-indigo', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'lara-light-indigo'"
          :class="`${layoutConfig.theme.value == 'lara-light-indigo' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/lara-light-indigo.png" class="w-3rem h-3rem" alt="Lara Light Indigo" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('lara-light-blue', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'lara-light-blue'"
          :class="`${layoutConfig.theme.value == 'lara-light-blue' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/lara-light-blue.png" class="w-3rem h-3rem" alt="Lara Light Blue" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('lara-light-purple', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'lara-light-purple'"
          :class="`${layoutConfig.theme.value == 'lara-light-purple' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/lara-light-purple.png" class="w-3rem h-3rem" alt="Lara Light Purple" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('lara-light-teal', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'lara-light-teal'"
          :class="`${layoutConfig.theme.value == 'lara-light-teal' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/lara-light-teal.png" class="w-3rem h-3rem" alt="Lara Light Teal" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('lara-dark-indigo', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'lara-dark-indigo'"
          :class="`${layoutConfig.theme.value == 'lara-dark-indigo' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/lara-dark-indigo.png" class="w-3rem h-3rem" alt="Lara Dark Indigo" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('lara-dark-blue', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'lara-dark-blue'"
          :class="`${layoutConfig.theme.value == 'lara-dark-blue' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/lara-dark-blue.png" class="w-3rem h-3rem" alt="Lara Dark Blue" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('lara-dark-purple', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'lara-dark-purple'"
          :class="`${layoutConfig.theme.value == 'lara-dark-purple' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/lara-dark-purple.png" class="w-3rem h-3rem" alt="Lara Dark Purple" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('lara-dark-teal', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'lara-dark-teal'"
          :class="`${layoutConfig.theme.value == 'lara-dark-teal' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/lara-dark-teal.png" class="w-3rem h-3rem" alt="Lara Dark Teal" />
        </Button>
      </div>
    </div>

    <h5>PrimeOne Design - 2021</h5>
    <div class="grid">
      <div class="col-3">
        <Button
          @click="onChangeTheme('saga-blue', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'saga-blue'"
          :class="`${layoutConfig.theme.value == 'saga-blue' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/saga-blue.png" class="w-3rem h-3rem" alt="Saga Blue" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('saga-green', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'saga-green'"
          :class="`${layoutConfig.theme.value == 'saga-green' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/saga-green.png" class="w-3rem h-3rem" alt="Saga Green" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('saga-orange', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'saga-orange'"
          :class="`${layoutConfig.theme.value == 'saga-orange' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/saga-orange.png" class="w-3rem h-3rem" alt="Saga Orange" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('saga-purple', 'light')"
          link
          :disabled="layoutConfig.theme.value == 'saga-purple'"
          :class="`${layoutConfig.theme.value == 'saga-purple' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/saga-purple.png" class="w-3rem h-3rem" alt="Saga Purple" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('vela-blue', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'vela-blue'"
          :class="`${layoutConfig.theme.value == 'vela-blue' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/vela-blue.png" class="w-3rem h-3rem" alt="Vela Blue" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('vela-green', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'vela-green'"
          :class="`${layoutConfig.theme.value == 'vela-green' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/vela-green.png" class="w-3rem h-3rem" alt="Vela Green" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('vela-orange', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'vela-orange'"
          :class="`${layoutConfig.theme.value == 'vela-orange' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/vela-orange.png" class="w-3rem h-3rem" alt="Vela Orange" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('vela-purple', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'vela-purple'"
          :class="`${layoutConfig.theme.value == 'vela-purple' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/vela-purple.png" class="w-3rem h-3rem" alt="Vela Purple" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('arya-blue', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'arya-blue'"
          :class="`${layoutConfig.theme.value == 'arya-blue' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/arya-blue.png" class="w-3rem h-3rem" alt="Arya Blue" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('arya-green', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'arya-green'"
          :class="`${layoutConfig.theme.value == 'arya-green' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/arya-green.png" class="w-3rem h-3rem" alt="Arya Green" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('arya-orange', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'arya-orange'"
          :class="`${layoutConfig.theme.value == 'arya-orange' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/arya-orange.png" class="w-3rem h-3rem" alt="Arya Orange" />
        </Button>
      </div>
      <div class="col-3">
        <Button
          @click="onChangeTheme('arya-purple', 'dark')"
          link
          :disabled="layoutConfig.theme.value == 'arya-purple'"
          :class="`${layoutConfig.theme.value == 'arya-purple' && 'selected-theme'}`"
          class="p-2">
          <img src="/layout/images/themes/arya-purple.png" class="w-3rem h-3rem" alt="Arya Purple" />
        </Button>
      </div>
    </div>
  </Sidebar>
</template>

<style scoped>

.selected-theme {
  border: 1px solid #000;
  background-color: #fff;
  cursor: pointer;
}

</style>
