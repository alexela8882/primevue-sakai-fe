<script setup>
// imports
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from "primevue/usetoast"
// stores
import { useModuleFileStore } from '../../../stores/modules/file'

// refs
const toast = useToast()
const itemSearch = ref()
const moduleFileStore = useModuleFileStore()
const { fileDialog, getFiles } = storeToRefs(moduleFileStore)
const { addModuleFiles } = moduleFileStore
const selectedCategory = ref(0)
const selectedCategoryFile = ref()
const selectedFileItems = ref([])
const files = ref([])
// presets
const fileCategories = ref([
  {
    label: 'Owned by Me',
    value: 0
  }, {
    label: 'Shared with Me',
    value: 1
  }, {
    label: 'Recent',
    value: 2
  }, {
    label: 'Following',
    value: 3
  }, {
    label: 'Libraries',
    value: 4
  }, {
    label: 'Related Files',
    value: 5
  }
])
// defines
const props = defineProps({
  module: Object
})

// actions
const selectFileCategory = (ctx) => {
  // resets
  selectedFileItems.value = []
  files.value.map(file => {
    file.items.filter(item => item.selected = false)
  })

  //
  selectedCategoryFile.value = files.value.find(file => ctx === file.categoryValue)
  selectedCategory.value = ctx
}
const addFiles = () => {
  if (selectedFileItems.value.length > 0) addModuleFiles(selectedFileItems.value)

  // resets
  selectedFileItems.value = []
  fileDialog.value = false
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 })
}

// lifecycles
watch(getFiles.value, (newVal, oldVal) => {
  selectedFileItems.value = [] // reset
  selectedCategoryFile.value.items.map(item => {
    if (item.selected) selectedFileItems.value.push(item)
  })
})

onMounted(() => {
  // pre-assignments
  files.value = getFiles.value

  // initial selected file category
  selectedCategoryFile.value = files.value.find(file => selectedCategory.value === file.categoryValue)
})
</script>

<template>
  <div>
    <Dialog
      v-model:visible="fileDialog"
      modal
      :style="{ width: '50vw' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      class="files-content-dialog">
      <template #header>
        <div class="inline-flex align-items-center justify-content-center gap-2 w-full">
          <div class="text-3xl">Select Files</div>
        </div>
      </template>
      <div>
        <div class="flex" style="height: 55vh;">
          <div class="border-right-1 border-300">
            <div class="p-3">
              <Button
                icon="pi pi-upload"
                label="Upload Files"
                outlined
                size="large"
                class="px-6 white-space-nowrap" />
            </div>
            <div class="mt-3 mb-5">
              <div
                v-for="(category, ctx) in fileCategories"
                :key="ctx"
                @click="selectFileCategory(ctx)"
                class="p-3 px-5 cursor-pointer"
                :class="`${selectedCategory === ctx ? 'category-items-active' : 'category-items'}`">{{ category.label }}</div>
            </div>
          </div>
          <div class="w-full" style="max-height: 100% !important; overflow-y: scroll;">
            <div class="file-search-container bg-white p-3">
              <div class="p-input-icon-left w-full">
                <i class="pi pi-search" />
                <InputText v-model="itemSearch" placeholder="Search" class="w-full" />
              </div>
            </div>
            <div v-if="selectedCategoryFile && selectedCategoryFile.items.length > 0" class="p-3">
              <div v-for="(item, itx) in selectedCategoryFile.items" :key="itx">
                <BlockUI :blocked="selectedFileItems.length >= 10 && !item.selected">
                  <div
                    @click="item.selected = !item.selected"
                    class="items-div flex align-items-center border-top-1 gap-3 p-3 cursor-pointer"
                    :class="`${item.selected ? 'border-primary border-bottom-1' : 'border-300'}`">
                    <Checkbox :readonly="true" v-model="item.selected" :binary="true" />
                    <Image src="/demo/images/galleria/galleria6s.jpg" alt="Image" width="50" />
                    <div>
                      <a href="javascript: void(0);">{{ item.label }}</a>
                      <div class="text-700">{{ item.date }} &#x2022; {{ item.size }} &#x2022; {{ item.type }}</div>
                    </div>
                  </div>
                </BlockUI>
              </div>
            </div>
            <div v-else class="p-3">You don't have any files here. Try a different filter, or upload a file.</div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex align-items-center justify-content-between">
          <div>
            {{ selectedFileItems.length }} of 10 files selected
          </div>
          <div class="flex align-items-center">
            <Button @click="fileDialog = false" label="Cancel" severity="secondary" outlined />
            <Button
              @click="addFiles"
              :disabled="selectedFileItems.length <= 0"
              :label="`Add${selectedFileItems.length > 0 ? ` (${selectedFileItems.length})` : ''}`"
              severity="primary" />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.category-items:hover {
  background-color: var(--surface-200);
  text-decoration: underline;
}
.category-items-active:hover {
  text-decoration: underline;
}
.category-items-active {
  border-top: 1px solid var(--primary-100);
  border-bottom: 1px solid var(--primary-100);
  border-left: 7px solid var(--primary-color);
  background-color: var(--primary-50);
}
.items-div:hover {
  background-color: var(--surface-100);
}
.file-search-container {
  position: sticky !important;
  top: 0;
  z-index: 2;
}
</style>

<style>
.files-content-dialog.p-dialog .p-dialog-header {
  border-bottom: 2px solid var(--surface-300);
}
.files-content-dialog.p-dialog .p-dialog-content {
  padding: 0;
}
.files-content-dialog.p-dialog .p-dialog-footer {
  background-color: var(--surface-200);
  border-top: 2px solid var(--surface-300);
  padding: 1.5rem 1rem;
  text-align: left;
}
</style>