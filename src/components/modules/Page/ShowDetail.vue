<script setup>
// imports
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from "primevue/usetoast"
// components
import RdBreadCrumbs from '../../RdBreadCrumbs.vue'
const MailboxThreads = defineAsyncComponent(() =>
  import('@/components/outlookmails/MailboxThreads.vue')
)
const DynamicDataTable = defineAsyncComponent(() => import('@/components/modules/DynamicDataTable/dynamicdatatablemain.vue'))
const SalesTab = defineAsyncComponent(() => import('@/components/modules/Page/Tabs/SalesTab.vue'))
const ServicesTab = defineAsyncComponent(() => import('@/components/modules/Page/Tabs/ServicesTab.vue'))
const RelatedListPanel = defineAsyncComponent(() => import('@/components/modules/Page/Tabs/RelatedListPanel.vue'))
const SectionFields = defineAsyncComponent(() => import('@/components/modules/Page/SectionFields.vue'))
const UploadFileContent = defineAsyncComponent(() => import('@/components/modules/Files/UploadFileContent.vue'))
// loaders
import DataTableLoader from '@/components/modules/DynamicDataTable/Loaders/DataTableLoader.vue'
import SimpleLoader from '@/components/loading/Simple2.vue'
import TwoColumnList from '@/components/loading/TwoColumnList.vue'
// stores
import { useModuleStore } from '@/stores/modules'
import { useModuleDetailStore } from '@/stores/modules/detail'
import { useModuleFileStore } from '@/stores/modules/file'
import { useTabStore } from '@/stores/tabs'

// refs
const linkedInquiryModule = ref(null)
const fileMenu = ref()
const toast = useToast()
const tabIndex = ref(0)
const route = useRoute()
const router = useRouter()
const localItemLoading = ref(true)
const localBaseModule = ref()
const localModule = ref()
const localItemPanels = ref()
const localRelatedList = ref()
const localRelatedLists = ref()
const atIndexRelatedLists = ref()
const atShowRelatedLists = ref([])
// stores
const moduleStore = useModuleStore()
const moduleDetailStore = useModuleDetailStore()
const moduleFileStore = useModuleFileStore()
const tabStore = useTabStore()
const { fetchModule, fetchLinkedModuleData, fetchBaseModule } = moduleStore
const { getModule, getLinkedModuleData, getBaseModule, getFieldDetailsById } = storeToRefs(moduleStore)
const {
    itemLoading,
    relatedListLoading,
    getItem,
    _relatedLists,
    getRelatedLists,
    _getRelatedOrderedLists,
    getRelatedListsByCname,
    _getItemPanels,
    getItemPanels,
    getItemValueByName } = storeToRefs(moduleDetailStore)
const { fetchItem, fetchItemRelatedList, fetchItemRelatedLists } = moduleDetailStore
const { fileLoading, fileDialogSwitch, fileDialog, getFiles, getModuleFiles } = storeToRefs(moduleFileStore)
const { addModuleFiles } = moduleFileStore
const { addTab, toggleWindows} = tabStore
const { getTabs } = storeToRefs(tabStore)
// presets
const bcrumbs = ref([
  {
    label: `${route.params.name}`,
    to: `/modules/${route.params.name}/${route.params.id}`
  }, {
    label: `${route.params.name} details`,
    to: null
  }
])
const fileMenuItems = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Add files',
        icon: 'pi pi-plus',
        command: () => {
          fileDialogSwitch.value = true
          fileDialog.value = true
          console.log(fileDialog.value)
        }
      }
    ]
  }
])

// actions
const tabChanged = (e) => {
  tabIndex.value = e.index
}
const pullRelatedList = async (payload) => {
  // console.log(document.getElementById(`rl-panel-${payload._id}`))
  const params = {
    moduleName: route.params.name,
    panelName: payload.panelName
  }
  await fetchItemRelatedList(params)
}
const isElVisible = (el) => {
  if (el) {
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }
}
const checkElVisibility = () => {
  // console.log(document.getElementById('rl-panel-5cfa27c4a6ebc787575ff2a2'))
  const panels = _getItemPanels.value(getModule.value.panels)
  panels.map(panel => {
    const yourElement = document.getElementById(`rl-panel-${panel._id}`)
    // console.log(yourElement)
    if (isElVisible(yourElement)) {
      // Element is visible, do something
      console.log(`Element with ${panel._id} id is visible`)
      pullRelatedList(panel)
    }
  })
}
const onAdvancedUpload = async (e) => {
  const files = e.files
  const reConstructedFiles = []
  const lastId = getFiles.value.length > 0 ? getFiles.value[getFiles.value.length - 1] : 0

  files.map(file => {
    // res-construct file
    let obj = Object.assign({}, {
      id: lastId + 1,
      label: file.name,
      date: Date.now(),
      size: file.size,
      type: file.type,
      selected: false
    })
    reConstructedFiles.push(obj)
  })

  // push new files
  addModuleFiles(reConstructedFiles)
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 })
}
const onErrorUpload = (e) => {
  console.log(e)
}
const removeModuleFile = (payload) => {
  const index = getModuleFiles.value.findIndex(moduleFile => moduleFile.id === payload.id)
  getModuleFiles.value.splice(index, 1)
}

// actions
const createNewForm = (module) => {
  let obj = Object.assign({}, {
    type: 'module-form',
    style: 'window',
    name: `${module.name}-${route.params.pageid}-window-edit-form`,
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
    toggleWindows(getTabs.value[index])
  }
}


// lifecycles
watch(getRelatedLists, (newVal, oldVal) => {
  // console.log(newVal)
  if (newVal) localRelatedLists.value = newVal
})

onMounted(async() => {
  // fetches
  await fetchBaseModule(route.params.id)
  await fetchModule({moduleName: route.params.name})

  const lmdParams = { module: 'inquiries', link_field: 'link_id', link_id: route.params.pageid }
  await fetchLinkedModuleData(lmdParams)

  await fetchItem(route.params)

  console.log(route.params)
  console.log(getModule.value.relatedLists)

  const payload = Object.assign({}, {
    // for json db
    id: route.params.id,
    name: route.params.name,
    pageid: route.params.pageid,

    // for be db
    moduleName: route.params.name,
    base: route.params.pageid,
    relatedLists: getModule.value.relatedLists
  })
  await fetchItemRelatedLists(payload)

  // pre-assignments
  localItemLoading.value = itemLoading.value
  localBaseModule.value = getBaseModule.value
  localModule.value = getModule.value
  localItemPanels.value = getItemPanels.value(null)
  localRelatedLists.value = getRelatedLists.value
  atIndexRelatedLists.value = localItemPanels.value.filter(ip => ip.controllerMethod.includes('@index'))
  atShowRelatedLists.value = _getRelatedOrderedLists.value.filter(rol => (rol.entityName === 'Contact' || rol.entityName === 'Unit'))
  linkedInquiryModule.value = getLinkedModuleData.value

  console.log(_relatedLists.value)
  console.log(_getRelatedOrderedLists.value)
  console.log(atShowRelatedLists.value) // not working

  // other logics
  // Attach the scroll event listener to the window or container
  window.addEventListener('scroll', checkElVisibility)

  // Optionally, you can also call the function on initial load in case the element is already visible.
  checkElVisibility()
})

</script>

<template>
  <div>
    <!-- <pre>{{ _getRelatedOrderedLists.map(i => i.entityName) }}</pre> -->
    <RdBreadCrumbs :bcrumbs="bcrumbs" />

    <div
      v-if="localItemLoading"
      class="flex align-items-center justify-content-center"
      style="height: 60vh !important;">
      <ProgressSpinner />
    </div>
    <div v-else>
      <div
        style="position: sticky !important; top: 72px; z-index: 2 !important;"
        class="bg-white px-5 py-3 mb-5 border-round-xl flex align-items-center justify-content-between shadow-2">
        <div class="flex">
          <div v-for="(field, fx) in localModule.fields" :key="fx">
            <div :class="`${localModule.fields.length === fx + 1 && 'mr-8'}`">
              <div v-if="field.title" class="flex flex-column text-md mr-4">
                <div v-if="field.groupWith">
                  <div>{{ field.groupLabel }}</div>
                  <div class="flex">
                    <div v-for="(groupField, gfx) in field.groupWith" :key="gfx">
                      <div class="font-bold text-md">{{ getItemValueByName(groupField) }}{{ field.fieldGlue === ' ' ? '&nbsp;' : field.fieldGlue }}</div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div>{{ field.label }}</div>
                  <div class="font-bold text-md">{{ getItemValueByName(field.name) }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-for="(field, fx) in localModule.fields" :key="fx">
            <div v-if="field.header" class="flex flex-column text-md mx-4">
              <div>{{ field.label }}</div>
              <div class="font-bold text-md">{{ getItemValueByName(field.name) ? getItemValueByName(field.name) : null }}</div>
            </div>
          </div>
        </div>

        <div>
          <Button label="Edit" size="large" @click="createNewForm(getBaseModule)" class="px-6 border-round-xl"></Button>
        </div>
      </div>


      <div class="grid">
        <div class="col-7">
          <div class="p-3 bg-white border-round-xl shadow-2">
            <TabView @tab-change="tabChanged">
              <TabPanel header="Details">
                <div>
                  <div class="flex flex-column gap-3">
                    <div v-for="(panel, px) in atIndexRelatedLists" :key="px" class="flex flex-column gap-1">
                      <div v-for="(section, sx) in panel.sections" :key="sx" class="shadow-1 mt-4">
                        <Panel class="detail-page-panel">
                          <template #header>
                            <div v-if="section.sectionLabel">
                              <div class="text-2xl font-bold">{{ section.sectionLabel }}</div>
                              <div v-if="getRelatedListsByCname(panel.panelName)">
                                <div class="material-icons cursor-pointer">playlist_add</div>
                              </div>
                            </div>
                          </template>
                          <div class="flex flex-column px-3 mt-4">
                            <div v-if="panel.controllerMethod.indexOf('@show') > -1">
                              <div v-if="getRelatedListsByCname(panel.panelName)">
                                <Suspense v-if="getRelatedListsByCname(panel.panelName)">
                                  <DynamicDataTable
                                    :key="panel._id"
                                    :moduleId="panel._id"
                                    :moduleEntityName="panel.entityName"
                                    :moduleName="getRelatedListsByCname(panel.panelName).link"
                                    :moduleLabel="getRelatedListsByCname(panel.panelName).label"
                                    :fields="getRelatedListsByCname(panel.panelName).fields.data"
                                    :data="getRelatedListsByCname(panel.panelName).collection.data"
                                    :pagination="getRelatedListsByCname(panel.panelName).collection.meta"
                                    :collectionLoading="false">
                                  </DynamicDataTable>
                                  <template #fallback>
                                    <DataTableLoader />
                                  </template>
                                </Suspense>
                              </div>
                              <div v-else :id="`rl-panel-${panel._id}`">
                                <div @click="pullRelatedList(panel)" class="flex align-items-center gap-2 cursor-pointer text-700">
                                  <i class="pi pi-eye"></i> View data
                                </div>
                              </div>
                            </div>
                            <div v-else>
                              <Suspense v-if="section.field_ids && section.field_ids.length > 0">
                                <SectionFields :newModuleFields="localModule.fields" :fieldIds="section.field_ids" />
                                <template #fallback>
                                  <TwoColumnList />
                                </template>
                              </Suspense>
                              <div v-if="section.additional_fields.length > 0">
                                <div v-for="(addition_field, afx) in section.additional_fields" :key="afx">
                                  <Suspense v-if="addition_field.ids && addition_field.ids.length > 0">
                                    <SectionFields :newModuleFields="localModule.fields" :fieldIds="addition_field.ids" />
                                    <template #fallback>
                                      <TwoColumnList />
                                    </template>
                                  </Suspense>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Panel>
                      </div>
                    </div>
                    <div
                      v-for="(relatedList, rlx) in _getRelatedOrderedLists.filter(rol => (rol.entityName === 'Contact' || rol.entityName === 'Unit'))"
                      :key="rlx">
                      <div class="my-4">
                        <RelatedListPanel :relatedList="relatedList" />
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel v-if="localBaseModule && localBaseModule.name === 'accounts'" header="Sales">
                <div>
                  <Suspense v-if="tabIndex === 1">
                    <div
                      v-for="(salesRelatedList, srlx) in _getRelatedOrderedLists.filter(orl => (orl.entityName === 'SalesOpportunity' || orl.entityName === 'SalesOpportunity'))"
                      :key="srlx">
                      <div class="my-4">
                        <RelatedListPanel :relatedList="salesRelatedList" />
                      </div>
                    </div>
                    <template #fallback>
                      <SimpleLoader class="mt-4" />
                    </template>
                  </Suspense>
                </div>
              </TabPanel>
              <TabPanel v-if="localBaseModule && localBaseModule.name === 'accounts'" header="Services">
                <div>
                  <Suspense v-if="tabIndex === 2">
                    <div
                      v-for="(serviceRelatedList, srlx) in _getRelatedOrderedLists.filter(orl => (orl.entityName === 'DefectReport' || orl.entityName === 'ServiceJob' || orl.entityName === 'ServiceSchedule' || orl.entityName === 'BreakdownLog' || orl.entityName === 'ServiceReport'))"
                      :key="srlx">
                      <div class="my-4">
                        <RelatedListPanel :relatedList="serviceRelatedList" />
                      </div>
                    </div>
                    <template #fallback>
                      <SimpleLoader class="mt-4" />
                    </template>
                  </Suspense>
                </div>
              </TabPanel>
              <TabPanel v-if="linkedInquiryModule" header="Email">
                <div>
                  <MailboxThreads :threads="linkedInquiryModule.conversations.slice().reverse()" />
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
        <div class="col-5">
          <div
            style="position: sticky !important; top: 145px !important; height: 75vh !important;"
            class="flex flex-column gap-4 overflow-scroll p-1">
            <div class="bg-white border-round-xl shadow-2">
              <div class="p-3">
                <div class="flex align-items-center justify-content-between">
                  <div class="text-xl font-bold text-primary">Activity</div>
                  <div>
                    <div class="p-inputgroup">
                      <Dropdown
                        placeholder="Filters"
                        class="border-round-xl border-primary w-full md:w-12rem"/>
                      <Button label="add activity" class="ml-3 border-round-xl px-4"></Button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-column gap-1 mb-6">
                <Panel
                  v-for="(dummy, dmx) in ['October 2023', 'November 2023', 'December 2023']"
                  :key="dmx"
                  toggleable
                  collapsed
                  class="activity-panel">
                  <template #header>
                    <div class="text-sm text-900">
                      <span v-if="dmx === 0">This months</span>
                    </div>
                  </template>
                  <template #togglericon>
                    <font-awesome-icon icon="fa-solid fa-caret-down" style="font-size: 1.5rem;"></font-awesome-icon>
                  </template>
                  <template #icons>
                    <div class="text-sm text-900 ml-2">{{ dummy }}</div>
                  </template>
                  <p class="m-0 mt-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </Panel>
              </div>
            </div>

            <div class="bg-white border-round-xl shadow-2">
              <div class="p-3">
                <div class="flex justify-content-between align-items-center text-xl font-bold text-primary">
                  <div>Files</div>
                  <div>
                    <div @click="fileMenu.toggle($event)" class="cursor-pointer">
                      <font-awesome-icon icon="fa-regular fa-square-caret-down" style="font-size: 1.5rem;"></font-awesome-icon>
                    </div>
                    <Menu ref="fileMenu" id="overlay_menu" :model="fileMenuItems" :popup="true" />
                  </div>
                </div>
                <div class="mt-5 flex flex-column gap-2 text-700">
                  <div class="text-lg font-bold">Upload files</div>
                  <div class="">only .jpg and .png files. 5 MB max file size.</div>
                  <!-- <div class="border-dashed h-10rem border-2 border-500 p-3 cursor-pointer">
                    <div class="text-primary">Drag and drop files here or click to upload</div>
                  </div> -->
                  <div>
                    <FileUpload
                      name="demo[]"
                      url="/api/upload"
                      customUpload
                      @uploader="onAdvancedUpload($event)"
                      @error="onErrorUpload($event)"
                      :multiple="true"
                      accept="image/*"
                      :maxFileSize="5000000">
                      <template #empty>
                        <p v-if="getModuleFiles.length <= 0">Drag and drop files to here to upload.</p>
                      </template>
                      <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                        <div v-if="files.length > 0">
                          <div v-for="(file, fx) in files" :key="fx" class="mb-2">
                            <div class="border-round border-1 border-orange-300 p-2 flex align-items-center justify-content-between">
                              <div class="flex align-items-center gap-3">
                                <Image
                                  src="/demo/images/galleria/galleria6s.jpg"
                                  alt="dummy-img"
                                  width="50"
                                  class="cursor-pointer"/>
                                <div>
                                  <a href="javascript: void(0);">{{ file.name }}</a>
                                  <div class="text-700">{{ Date.now() }} &#x2022; {{ file.size }} &#x2022; {{ file.type }}</div>
                                  <div class="text-orange-500">Pending</div>
                                </div>
                              </div>
                              <div @click="removeFileCallback(fx)" class="cursor-pointer mr-2">
                                <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-for="(moduleFile, mfx) in getModuleFiles" :key="mfx" class="mb-2">
                          <div class="border-round border-1 border-300 p-2 flex align-items-center justify-content-between">
                            <div class="flex align-items-center gap-3">
                              <Image
                                src="/demo/images/galleria/galleria6s.jpg"
                                alt="dummy-img"
                                width="50"
                                class="cursor-pointer"/>
                              <div>
                                <a href="javascript: void(0);">{{ moduleFile.label }}</a>
                                <div class="text-700">{{ moduleFile.date }} &#x2022; {{ moduleFile.size }} &#x2022; {{ moduleFile.type }}</div>
                              </div>
                            </div>
                            <div @click="removeModuleFile(moduleFile)" class="cursor-pointer mr-2">
                              <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel" />
                            </div>
                          </div>
                        </div>
                      </template>
                    </FileUpload>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white border-round-xl shadow-2">
              <div class="p-3 h-15rem">
                <div class="text-xl font-bold text-primary">Reminders</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UploadFileContent :module="localModule" />
  </div>
</template>

<style>

.detail-page-panel .p-panel-header {
  background-color: var(--primary-color) !important;
  color: white !important;
}
.activity-panel.p-panel {
  box-shadow: none;
  border-radius: none !important;
}
.activity-panel.p-panel.p-panel-toggleable .p-panel-header {
  background-color: var(--primary-200);
  display: flex;
  flex-direction: row-reverse;
}
.activity-panel.p-panel.p-panel-toggleable .p-panel-header .p-panel-icons button {
  color: var(--cyan-900);
}

.activity-panel.p-panel.p-panel-toggleable .p-panel-header .p-panel-icons {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}

</style>