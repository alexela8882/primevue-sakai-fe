<script setup>
// -----------
// imports
// -----------
import { onMounted, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
// stores
import { useModuleStore } from '../../../stores/modules/index'
import { useModuleDynamicTableStore } from '../../../stores/modules/dynamictable/index'
import router from '../../../router'

// defines
const props = defineProps({
  mode: String,
  sidebar: Boolean,
  moduleId: String,
  moduleEntityName: String,
  moduleName: String,
  moduleLabel: String,
  data: Array,
  pagination: Object,
  pageItems: Array,
  rows: Number,
  pages: Number,
  fields: Array,
  collectionLoading: Boolean
})
const emit = defineEmits(['toggle-sidebar'])

// refs
const listViewFilterRef = ref(null)
const cellEdit = ref(false)
const editingRows = ref([])
const route = useRoute()
const rightShadowStyle = ref()
const leftShadowStyle = ref()
const menu = ref()
const cm = ref()
const updateRows = ref()
const selectedData = ref()
const selectedContextData = ref()
const menuSelectedData = ref()
// stores
const moduleStore = useModuleStore()
const moduleDynamicTableStore = useModuleDynamicTableStore()
const { getCollection, getBaseModule, getEntity } = storeToRefs(moduleStore)
const { fetchModule, fetchBaseModule, fetchCollection } = moduleStore
const { getDropdownLists, getDropdown } = storeToRefs(moduleDynamicTableStore)
const { fetchDropdownLists } = moduleDynamicTableStore
// presets
const menuModel = ref([
  {label: 'View', icon: 'pi pi-fw pi-search', command: () => console.log(selectedContextData.value)},
  {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => console.log(selectedContextData.value)}
])
const menuItems = ref([
  {
    label: 'View',
    icon: 'pi pi-reply',
    command: (event) => {
      console.log(event)
      console.log(menuSelectedData.value)
      // redirect to detail page
      const routerObj = Object.assign({},
        {
          name: 'modules.pages.detail',
          params: {
            name: props.moduleName,
            id: props.moduleId,
            pageid: menuSelectedData.value._id
          }
        }
      )
      router.push(routerObj)
    }
  }, {
    label: 'Change Owner',
    icon: 'pi pi-user',
    command: (event) => {
      console.log(event)
      console.log(menuSelectedData.value)
    },
    visible: props.moduleEntityName === getBaseModule.value.mainEntity
  }, {
    label: 'Update',
    icon: 'pi pi-refresh',
    command: (event) => {
      console.log(event)
      console.log(menuSelectedData.value)
    },
    visible: props.moduleEntityName === getBaseModule.value.mainEntity
  }, {
    label: 'Delete',
    icon: 'pi pi-times',
    command: (event) => {
      console.log(event)
      console.log(menuSelectedData.value)
    },
    visible: props.moduleEntityName === getBaseModule.value.mainEntity
  }
])
const perPageItems = ref([
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '20', value: 20 },
  { label: '25', value: 25 },
  { label: '30', value: 30 },
  { label: '35', value: 35 },
  { label: '40', value: 40 },
  { label: '45', value: 45 },
  { label: '50', value: 50 }
])

// actions
const cellEditAction = (payload) => {
  const cellModule = payload.relation && payload.relation.entity_id.name
  cellEdit.value = true

  console.log(getEntity.value(cellModule))
  fetchDropdownLists(getEntity.value(cellModule).name)
}
const paginate = async (event, jump) => {
  let page = 1
  if (!jump) {
    page = event.page + 1
  } else page = props.pagination.current_page

  // re-fetch module & collection
  await fetchModule(props.moduleName, page > 1 ? page : null)
}
const onRowContextMenu = (event) => {
  // cm.value.show(event.originalEvent)
}
const onRowEditSave = (event) => {
  let { newData, index } = event
  props.data[index] = newData
}
const menuToggle = (event, data) => {
  menu.value.toggle(event)
  menuSelectedData.value = data
}
const handleHoverIn = (event) => {
  const sameStyles = `background-color: white;
                      box-shadow: 0 0 5px 2px rgba(0,0,0,0.5);`
  rightShadowStyle.value = `${sameStyles} clip-path: inset(0px -15px 0px 0px);`
  leftShadowStyle.value = `${sameStyles} clip-path: inset(0px 0px 0px -15px);`
}
const onCellEditComplete = (event) => {
  cellEdit.value = false
  let { data, newValue, field } = event
  data[field] = newValue
}

// life cycles
onMounted(async () => {
  console.log(route.params)
})

onClickOutside(listViewFilterRef, (event) => {
  if (event.target && event.target.attributes.class.value !== 'p-dropdown-item') {
    emit('toggle-sidebar', false)
  }
})

</script>

<template>
  <!-- Test
  {{ moduleEntityName }} {{ getBaseModule.mainEntity }} -->
  <DataTable
    v-model:selection="selectedData"
    v-model:contextMenuSelection="selectedContextData"
    v-model:editingRows="editingRows"
    :editMode="cellEdit ? 'cell' : null"
    @cell-edit-complete="onCellEditComplete"
    @row-edit-save="onRowEditSave"
    @rowContextmenu="onRowContextMenu"
    tableClass="editable-cells-table"
    :value="data"
    :loading="collectionLoading"
    stripedRows
    stateStorage="local"
    :stateKey="`dt-state-${moduleLabel}`"
    resizableColumns
    columnResizeMode="fit"
    sortMode="multiple"
    removableSort
    scrollable
    scrollHeight="60vh"
    class="dynamic-tbl">
    <Column
      v-if="mode === 'edit'"
      frozen
      headerClass="custom-header bg-primary-100 text-color-secondary"
      :style="`min-width: 60px; ${rightShadowStyle}`"
      bodyClass="text-center py-1"
      selectionMode="multiple"></Column>
    <Column
      v-for="col of fields"
      :key="col._id"
      :field="col.name"
      :header="col.label"
      sortable
      sorticon="check"
      style="min-width: 200px !important;"
      :bodyClass="`text-color-secondary ${mode === 'edit' ? 'py-1' : 'py-2'}`"
      headerClass="bg-primary-100 text-color-secondary">
      <template #body="slotProps">
        <div v-if="slotProps.data[col.name]">
          <div class="flex align-items-center justify-content-between">
            <div>
              <span v-if="col.relation">
                <span
                  v-for="(diplayFieldName, dfn) in col.relation.displayFieldName"
                  :key="dfn">
                  <span v-if="col.rules.ss_pop_up" class="mr-1">{{ slotProps.data[col.name][diplayFieldName] }}</span>
                  <span v-else-if="col.rules.ss_dropdown" class="mr-1">
                    <a href="javascript:void(0);" style="color: red;">{{ slotProps.data[col.name][diplayFieldName] }}</a>
                  </span>
                  <span v-else class="mr-1">
                    <a href="javascript:void(0);">{{ slotProps.data[col.name][diplayFieldName] }}</a>
                  </span>
                </span>
              </span>
              <span v-else>{{ slotProps.data[col.name] }}</span>
            </div>
            <div v-if="mode === 'edit'">
              <i @click="cellEditAction(col)" class="edit-icon cursor-pointer pi pi-pencil ml-3"></i>
            </div>
          </div>
        </div>
      </template>
      <template #editor="{ data, field }">
        <div v-if="data[col.name]" style="overflow: scroll;">
          <div v-if="col.relation">
            <div
              v-for="(diplayFieldName, dfn) in col.relation.displayFieldName"
              :key="dfn">
              <div v-if="col.rules.ss_pop_up" class="flex align-items-center justify-content-center">
                <div>
                  <inputText
                    v-model="data[col.name][diplayFieldName]"
                    style="box-sizing: border-box; max-width: 100%;" />
                </div>
              </div>
              <div v-if="col.rules.ss_dropdown" class="my-1">
                <Dropdown
                  v-model="data[col.name]['_id']"
                  :options="getDropdown(getEntity(col.relation.entity_id.name).name) && getDropdown(getEntity(col.relation.entity_id.name).name).collection.data"
                  optionLabel="name"
                  optionValue="_id"
                  :placeholder="`Select a ${col.relation.entity_id.name}`"
                  class="border-round-xl border-primary w-full md:w-12rem mr-2 mb-2 md:mb-0"/>
              </div>
              <div v-else class="my-1">
                Other edits here...
              </div>
            </div>
          </div>
          <div v-else>
            <inputText
              v-model="data[col.name]"
              style="box-sizing: border-box; max-width: 100%;" />
          </div>
        </div>
      </template>
    </Column>
    <Column
      frozen
      alignFrozen="right"
      :exportable="false"
      :style="`min-width: 60px; ${leftShadowStyle}`"
      :bodyClass="`text-color-secondary text-center py-1`"
      headerClass="bg-primary-100 text-color-secondary">
      <template #body="slotProps">
        <Button
          class="menu-btn"
          icon="pi pi-ellipsis-v"
          text
          size="small"
          @click="menuToggle($event, slotProps.data)"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          style="font-size: .3rem; padding: 2px 0; background-color: transparent;" />
        <Menu ref="menu" id="overlay_menu" :data-value="slotProps" :model="menuItems" :popup="true" />
      </template>
    </Column>
    <template #footer>
      <div v-if="pagination" class="md:flex justify-content-between font-light">
        <div class="flex align-items-center px-3">
          <div class="text-sm text-color-secondary">
            Items per page:
            <Dropdown
              v-model="pagination.per_page"
              :options="perPageItems"
              optionLabel="label"
              optionValue="value"
              placeholder="Select a page"
              class="filled-dropdown" />
          </div>
          <Divider type="solid" layout="vertical" />
          <div class="text-sm text-color-secondary">
            {{ pagination.current_page }} - {{ pagination.total_pages }} of {{ pagination.total }} items
          </div>
        </div>
        <Paginator
          @page="paginate($event, false)"
          template="JumpToPageDropdown PrevPageLink NextPageLink"
          :rows="pagination && pagination.per_page"
          :totalRecords="pagination && pagination.total"
          :rowsPerPageOptions="[5, 10, 15, 20, 25, 30]"
          class="custom-paginator">
        </Paginator>
      </div>
    </template>
    <Transition name="lvf-slide-fade">
      <div v-if="sidebar" ref="listViewFilterRef" class="ddt-slot-1 shadow-4 bg-white">
        <div style="overflow: scroll; max-height: 100%;">
          <slot name="list-view-filter"></slot>
        </div>
        <div class="ddt-div-1 shadow-4 bg-white"></div>
      </div>
    </Transition>
  </DataTable>
  <!-- <ContextMenu ref="cm" :model="menuModel" /> -->
</template>

<style scoped>
</style>

<style>
.dynamic-tbl.p-datatable .p-datatable-footer {
  padding: 0 !important;
  margin: 0 !important;
  background-color: rgb(233, 233, 233);
}
.dynamic-tbl.p-datatable .p-checkbox .p-checkbox-box {
  border: 1px solid var(--surface-700) !important;
  height: 14px !important;
  width: 14px !important;
  margin: auto;
}
.custom-paginator .p-paginator {
  background-color: transparent !important;
  font-size: 11px !important;
  padding: 0 1rem !important;
  margin: 0 !important;
}
.custom-paginator .p-paginator .p-paginator-first,
.custom-paginator .p-paginator .p-paginator-prev,
.custom-paginator .p-paginator .p-paginator-next,
.custom-paginator .p-paginator .p-paginator-last {
  min-width: 1.5rem;
  height: 1.5rem;
  background-color: transparent !important;
}
.custom-paginator .p-paginator-current {
  background-color: transparent !important;
}
.custom-header .p-column-header-content {
  text-align: center;
  display: block !important;
}
.custom-paginator .p-paginator .p-dropdown {
  border: transparent !important;
  background-color: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  outline: none !important;
  box-shadow: none !important;
}
.filled-dropdown.p-dropdown {
  box-shadow: none !important;
  outline: none !important;
}
.edit-icon {
  opacity: 0;
  /* transform: translateX(-10px);
  transition: all ease-out .2s; */
}
.p-editable-column:hover .edit-icon {
  opacity: 1 !important;
  /* transform: translateX(0);
  transition: transform ease-in .2s; */
}
</style>