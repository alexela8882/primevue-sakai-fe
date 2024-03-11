<script setup>
// --------------
// imports
// --------------
import {
  ref,
  shallowRef,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  defineAsyncComponent  } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToast } from "primevue/usetoast"
import { useConfirm } from "primevue/useconfirm"
import axios from 'axios'
import _ from 'lodash'
import { filter, includes, reduce, orderBy, startCase } from 'lodash'
// stores & composables
import { useBaseStore } from '@/stores/base'
import { useLayout } from '@/layout/composables/layout'
import { useModuleStore } from '@/stores/modules'
import { useTabStore } from '@/stores/tabs/index'
import { useFormDataStore } from '@/stores/forms'
// components
const FloatingWindow = defineAsyncComponent(() =>
  import('@/components/tabs/FloatingWindow.vue')
)

// -----------
// refs
// -----------
const fwMenu = ref(false)
const newForms = ref([])
const createNewItems = ref()
const menu = ref()
const toast = useToast()
const confirm = useConfirm()
const router = useRouter()
const outsideClickListener = ref(null)
const topbarMenuActive = ref(false)
const isAuthenticated = localStorage.getItem('isAuthenticated')
const { layoutConfig, onMenuToggle } = useLayout()
// stores & composables
const baseStore = useBaseStore()
const moduleStore = useModuleStore()
const tabStore = useTabStore()
const formDataStore = useFormDataStore()
const { getModules,getModulesUserCanAccess } = storeToRefs(moduleStore)
const { configBar,getAuthUser } = storeToRefs(baseStore)
const { getTabs, tabsLoading } = storeToRefs(tabStore)
const { toggleTabs, generateTabs, addTab, toggleWindows } = tabStore
const { setFormReset } = formDataStore
// presets
const items = ref([
  {
    label: 'Themes',
    icon: 'pi pi-palette',
    command: () => {
      configBar.value = true
    }
  }, {
    label: 'Modules',
    icon: 'pi pi-book',
    command: () => {
      router.push('/modules')
    }
  }, {
    separator: true
  }, {
    label: 'Sign Out',
    icon: 'pi pi-sign-out',
    command: () => {
      logout()
    }
  }
])
const floatingItems = ref([
  {
    label: 'Test Pages',
    icon: 'pi pi-book',
    items: [
      {
        label: 'Tabs',
        icon: 'pi pi-clone',
        command: () => {
          router.push({ name: 'test-pages.tabs' })
        }
      }
    ]
  }, {
    label: 'Activity',
    icon: 'pi pi-form',
    items: []
  }, {
    label: 'Tables',
    icon: 'pi pi-table',
    items: []
  }, {
    label: 'Forms',
    icon: 'pi pi-form',
    items: []
  }
])
const staticForms = ref([
  {
    label: 'Task',
    name: 'task',
    icon: 'pi pi-calendar',
    form: {
      fields: [
        {
          label: 'Subject',
          name: 'subject',
          uniqueName: 'task_subject',
          type: 'text',
          rules: {
            required: true,
          },
          data: {
            value: null
          }
        }, {
          label: 'Type',
          name: 'type_id',
          uniqueName: 'task_type_id',
          type: 'picklist',
          items: [
            { label: 'Verbal', name: 'verbal' },
            { label: 'Call', name: 'call' },
            { label: 'E-mail', name: 'email,' },
            { label: 'Send Quotation', name: 'send_quotation,' }
          ],
          rules: {
            required: true,
          },
          data: {
            value: null
          }
        }, {
          label: 'Due Date',
          name: 'date',
          uniqueName: 'task_date',
          type: 'date',
          rules: {
            required: true,
          },
          data: {
            value: null
          }
        }, {
          label: 'Status',
          name: 'status',
          uniqueName: 'task_status',
          type: 'picklist',
          items: [
            { label: 'Pending', name: 'pending' },
            { label: 'Cancelled', name: 'cancelled' },
            { label: 'Completed', name: 'completed' }
          ],
          rules: {
            required: true,
          },
          data: {
            value: null
          }
        }, {
          label: 'Remarks',
          name: 'remarks',
          uniqueName: 'task_remarks',
          type: 'text',
          rules: {
            required: true,
          },
          data: {
            value: null
          }
        }, {
          label: 'Linked To',
          name: 'link_id',
          uniqueName: 'task_link_id',
          type: 'related',
          rules: {
            required: true,
          },
          data: {
            value: null
          }
        }, {
          label: 'Module',
          name: 'module_id',
          uniqueName: 'task_module_id',
          type: 'related',
          rules: {
            required: true,
          },
          data: {
            value: null
          }
        }
      ]
    }
  }, {
    label: 'Event',
    name: 'event',
    icon: 'pi pi-book',
    form: {
      fields: [
        {
          label: 'Subject',
          name: 'subject',
          uniqueName: 'event_subject',
          type: 'text',
          rules: {
            required: true,
          },
          data: {
            value: null
          }
        }, {
          label: 'Type',
          name: 'type_id',
          uniqueName: 'event_type_id',
          type: 'picklist',
          items: [
            { label: 'Meeting with Customer', name: 'meeting_with_customer' },
            { label: 'Customer Visit', name: 'customer_visit' }
          ],
          rules: {
            required: true,
          },
          data: {
            value: null
          }
        }, {
          label: 'Event Date',
          name: 'date',
          uniqueName: 'event_date',
          type: 'date',
          rules: {
            required: true,
          },
          data: {
            value: null
          }
        }, {
          label: 'Status',
          name: 'status',
          uniqueName: 'event_status',
          type: 'picklist',
          items: [
            { label: 'Pending', name: 'pending' },
            { label: 'Cancelled', name: 'cancelled' },
            { label: 'Completed', name: 'completed' }
          ],
          rules: {
            required: true,
          },
          data: {
            value: null
          }
        }, {
          label: 'Start Time',
          name: 'startTime',
          uniqueName: 'event_starttime',
          type: 'time',
          rules: {
            required: true,
          },
          data: {
            value: null
          }
        }, {
          label: 'End Time',
          name: 'endTime',
          uniqueName: 'event_endtime',
          type: 'time',
          rules: {
            required: false,
          },
          data: {
            value: null
          }
        }, {
          label: 'Remarks',
          name: 'remarks',
          uniqueName: 'event_remarks',
          type: 'text',
          rules: {
            required: true,
          },
          data: {
            value: null
          }
        }, {
          label: 'Linked To',
          name: 'link_id',
          uniqueName: 'event_link_id',
          type: 'related',
          rules: {
            required: true,
          },
          data: {
            value: null
          }
        }, {
          label: 'Module',
          name: 'module_id',
          uniqueName: 'event_module_id',
          type: 'related',
          rules: {
            required: true,
          },
          data: {
            value: null
          }
        }
      ]
    }
  }
])

// -------------
// methods
// -------------
const toggle = (event) => {
  menu.value.toggle(event)
}
const fwMenuToggle = (event) => {
  fwMenu.value.toggle(event)
}
const logoUrl = computed(() => {
  return `layout/${layoutConfig.darkTheme.value ? 'reddot-logo' : 'reddot-logo'}.png`
})
const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value
}
const onSettingsClick = () => {
  topbarMenuActive.value = false
  router.push('/documentation')
}
const topbarMenuClasses = computed(() => {
  return {
    'layout-topbar-menu-mobile-active': topbarMenuActive.value
  }
})
const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false
      }
    };
    document.addEventListener('click', outsideClickListener.value)
  }
}
const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener)
    outsideClickListener.value = null
  }
}
const isOutsideClicked = (event) => {
  if (!topbarMenuActive.value) return

  const sidebarEl = document.querySelector('.layout-topbar-menu')
  const topbarEl = document.querySelector('.layout-topbar-menu-button')

  return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target))
}
const logout = () => {
  // localStorage.clear()
  localStorage.removeItem("token")
  localStorage.removeItem("auth_id")
  localStorage.removeItem("isAuthenticated")

  router.push({name: 'login'})
  toast.add({ severity: 'success', summary: 'Success', detail: 'Logged out successfully', life: 3000 })
}
const createStaticForm = (sform) => {
  let obj = Object.assign({}, {
    type: 'static-form',
    style: 'window',
    name: `${sform.name}-window-sform`,
    label: sform.label,
    icon: sform.icon,
    form: sform.form,
    expanded: true,
    opened: false,
    opened_order: null
  })
  const index = getTabs.value.findIndex(form => form.name === obj.name)
  if (index === -1) {
    addTab(obj, true)
  }
}
const createNewForm = (module) => {
  let obj = Object.assign({}, {
    type: 'module-form',
    style: 'window',
    name: `${module.name}-window-create-form`,
    label: `${module.label} Form`,
    _module: module.name,
    expanded: true,
    opened: false,
    opened_order: null
  })
  const index = getTabs.value.findIndex(form => form.name === obj.name)
  if (index === -1) {
    addTab(obj, true)
  }else{
    confirmAddTab(module,index)
  }
}
const createNewTable = (module) => {
  let obj = Object.assign({}, {
    type: 'module',
    style: 'window',
    display: 'table',
    name: `${module.name}-window-table`,
    label: `${module.label} Table`,
    _module: module.name,
    visible: true,
    expanded: true,
    opened: false,
    opened_order: null
  })
  const index = getTabs.value.findIndex(form => form.name === obj.name)
  if (index === -1) {
    addTab(obj, true)
  }
}

const confirmAddTab = (module,index) => {
    confirm.require({
        group: 'templating',
        header: 'Unsaved '+module.mainEntity+' Alert',
        message: module.mainEntity,
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-outlined',
        rejectLabel: 'Continue',
        acceptLabel: 'Create New '+module.mainEntity,
        accept: () => {
            let index = getTabs.value.findIndex(form => form.name === `${module.name}-window-create-form`)
            setFormReset(`${module.name}-window-create-form`)
            toggleWindows(getTabs.value[index])
        },
        reject: () => {
          let index = getTabs.value.findIndex(form => form.name === `${module.name}-window-create-form`)
          toggleWindows(getTabs.value[index])
        }
    });
};

const initialize = async () => {
  // create forms and tables
  getModules.value && getModules.value.map(module => {
    if (_.includes(['Account','Contact','Lead','SalesOpportunity'],module.mainEntity) && !_.isNil(module.folder_id) && _.includes(getModulesUserCanAccess.value,module._id)) {    
      // create forms
      let formObj = Object.assign({}, {
        label: module.label,
        icon: module.icon,
        command: () => {
          createNewForm(module)
        }
      })
      let fwForm = floatingItems.value.find(fw => fw.label == 'Forms')
      fwForm.items.push(formObj)

      // create tables
      let tableObj = Object.assign({}, {
        label: module.label,
        icon: module.icon,
        command: () => {
          createNewTable(module)
        }
      })
      let fwTable = floatingItems.value.find(fw => fw.label == 'Tables')
      fwTable.items.push(tableObj)
    }
  })

  // push static forms
  staticForms.value.map(sform => {
    let sformObj = Object.assign({}, {
      label: sform.label,
      icon: sform.icon,
      form: sform.form,
      command: () => {
        createStaticForm(sform)
      }
    })
    let fwSForm = floatingItems.value.find(fw => fw.label == 'Activity')
    fwSForm.items.push(sformObj)
  })
}

// lifecycles
onMounted(async () => {
  bindOutsideClickListener()
  // initialize
  initialize()
})
onBeforeUnmount(() => {
  unbindOutsideClickListener()
})
// Watch for changes in the 'modules' state of moduleStore
watch(() => getModules.value, (newValue, oldValue) => {
  // Update the value in the component when it changes
  // if(createNewItems.value == null){
  //   createNewItems.value = reduce(newValue, function(res, val, i){
  //     if(includes(['Account','Lead','Opportunity'],val.mainEntity)){
  //       res.push({'label':val.mainEntity,'command':()=>{ createNewForm(val.name) }})
  //     }
  //     return res
  //   }, [])
  // }
})
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-menu-button" style="width: 100px;"></div>
    <router-link to="/" class="layout-topbar-logo">
      <div>
        <img :src="logoUrl" width="110" alt="logo" />
      </div>
      <!-- <div class="flex flex-column" style="font-size: 15px">
        <div>
          <span class="text-red-600 font-bold">RED</span>
          <span>dot</span>
        </div>
        <div class="text-sm font-semibold">CRM</div>
      </div> -->
    </router-link>
    
    <!-- <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
      <i class="pi pi-bars"></i>
    </button> -->

    <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <span class="flex align-items-center layout-search p-input-icon-left ml-3">
        <i class="pi pi-search" />
        <InputText class="atb-inputtext" placeholder="Quick search..." size="large" />
      </span>
      <!-- <div class="flex align-items-center">
        <span>Hello!&nbsp;</span>
        <span class="capitalize font-bold">{{ getAuthUser.name }}</span>
      </div> -->
      <!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-calendar"></i>
        <span>Calendar</span>
      </button>
      <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-user"></i>
        <span>Profile</span>
      </button> -->
      <!-- <SplitButton label="New" :model="createNewItems" text class="ml-3"></SplitButton> -->
      <div class="justify-content-center">
        <button v-if="isAuthenticated" @click="fwMenuToggle" class="p-link layout-topbar-button">
          <i class="pi pi-plus" style="font-size: 1rem;"></i>
          <span>FwMenu</span>
        </button>
        <Menu class="fw-menu" ref="fwMenu" :model="floatingItems" :popup="true" />
      </div>
      <button @click="onSettingsClick()" class="p-link layout-topbar-button">
        <i class="pi pi-bell"></i>
        <span>Bell</span>
      </button>
      <button @click="router.push('/outlook-mail')" class="p-link layout-topbar-button">
        <i class="pi pi-envelope"></i>
        <span>Mail</span>
      </button>
      <!-- <Button icon="pi pi-bell" rounded aria-label="Filter" /> -->
      <div class="justify-content-center">
        <button v-if="isAuthenticated" @click="toggle" class="p-link layout-topbar-button">
          <i class="pi pi-bars" style="font-size: 1rem;"></i>
          <span>Menu</span>
        </button>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
      </div>
      <!-- <button v-if="isAuthenticated" @click="logout()" class="p-link layout-topbar-button">
        <i class="pi pi-bars" size="small"></i>
        <span>SignOut</span>
      </button> -->
    </div>
  </div>
  <ConfirmDialog group="templating">
        <template #message="{message}">
            <div class="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
                <i :class="message.icon" class="text-6xl text-primary-500"></i>
                <div class="flex flex-column p-5 surface-overlay border-round">
            <p class="mb-0">You have unsaved {{ _.toLower(_.startCase(message.message)) }} data. <br/>Would you like to continue filling up the current form, or start a new {{ _.toLower(_.startCase(message.message)) }} entry?</p>
            <br/>
            <p class="mb-0">- <b>Continue</b>: Resume filling up the current {{ _.toLower(_.startCase(message.message)) }} form.</p>
            <p class="mb-0">- <b>Create New {{ _.startCase(message.message) }}</b>: Discard the current {{ _.toLower(_.startCase(message.message)) }} data and start a new {{ _.toLower(_.startCase(message.message)) }} entry.</p>
        </div>
            </div>
            
        </template>
    </ConfirmDialog>
  <FloatingWindow />
 
</template>

<style>

.layout-topbar a:focus {
  box-shadow: none !important;
}
.atb-inputtext.p-inputtext {
  border: 1px solid lightgray !important;
  border-radius: 10px !important;
  padding: 7px 15px 7px 35px !important;
}
.fw-menu.p-menu ul {
  overflow-y: scroll;
  height: 300px;
}
</style>
