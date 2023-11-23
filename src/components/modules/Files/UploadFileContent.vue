<script setup>
// imports
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useModuleFileStore } from '../../../stores/modules/file'

// refs
const itemSearch = ref()
const moduleFileStore = useModuleFileStore()
const { fileDialog } = storeToRefs(moduleFileStore)
const selectedCategory = ref(0)
const selectedCategoryFile = ref()
const selectedFileItems = ref([])
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
const files = ref([
  {
    categoryValue: 0,
    items: [
      { label: 'Test 1', date: 'Jan 23, 2023', size: '55kb', file_type: 'jpg', selected: false },
      { label: 'Test 2', date: 'Aug 01, 2023', size: '45kb', file_type: 'jpg', selected: false },
      { label: 'Test 3', date: 'Nov 23, 2023', size: '100kb', file_type: 'jpg', selected: false },
      { label: 'Test 4', date: 'Sept 23, 2023', size: '1mb', file_type: 'png', selected: false },
      { label: 'Test 5', date: 'Jan 06, 2023', size: '2.3mb', file_type: 'jpg', selected: false },
      { label: 'Test 6', date: 'March 24, 2023', size: '50kb', file_type: 'jpeg', selected: false },
      { label: 'Test 7', date: 'Nov 23, 2023', size: '1kb', file_type: 'jpeg', selected: false },
      { label: 'Test 8', date: 'Nov 23, 2023', size: '0kb', file_type: 'png', selected: false },
      { label: 'Test 9', date: 'Nov 23, 2023', size: '90kb', file_type: 'png', selected: false },
      { label: 'Test 10', date: 'Nov 23, 2023', size: '1.1mb', file_type: 'jpg', selected: false },
      { label: 'Test 11', date: 'Nov 23, 2023', size: '1.1mb', file_type: 'jpg', selected: false },
      { label: 'Test 12', date: 'Dec 23, 2023', size: '1.1mb', file_type: 'jpg', selected: false }
    ]
  }, {
    categoryValue: 2,
    items: [
      { label: 'Test 1', date: 'Nov 23, 2023', size: '55kb', file_type: 'jpg' }
    ]
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

// lifecycles
watch(files.value, (newVal, oldVal) => {
  selectedFileItems.value = [] // reset
  selectedCategoryFile.value.items.map(item => {
    if (item.selected) selectedFileItems.value.push(item)
  })
})

onMounted(() => {
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
          <div class="p-3 w-full" style="max-height: 100% !important; overflow-y: scroll;">
            <span class="p-input-icon-left w-full mb-5" style="position: sticky !important;">
              <i class="pi pi-search" />
              <InputText v-model="itemSearch" placeholder="Search" class="w-full" />
            </span>
            <div v-if="selectedCategoryFile && selectedCategoryFile.items.length > 0">
              <div v-for="(item, itx) in selectedCategoryFile.items" :key="itx">
                <BlockUI :blocked="selectedFileItems.length >= 10 && !item.selected">
                  <div
                    @click="item.selected = !item.selected"
                    class="items-div flex align-items-center border-top-1 gap-3 p-3 cursor-pointer"
                    :class="`${item.selected ? 'border-primary border-bottom-1' : 'border-300'}`">
                    <Checkbox :readonly="true" v-model="item.selected" :binary="true" />
                    <div>
                      <a href="javascript: void(0);">{{ item.label }}</a>
                      <div class="text-700">{{ item.date }} &#x2022; {{ item.size }} &#x2022; {{ item.file_type }}</div>
                    </div>
                  </div>
                </BlockUI>
              </div>
            </div>
            <div v-else>You don't have any files here. Try a different filter, or upload a file.</div>
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