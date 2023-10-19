<script setup>
// -----------
// imports
// -----------
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useModuleStore } from '../../stores/modules/index'

// refs
const moduleStore = useModuleStore()
const { getCollection } = storeToRefs(moduleStore)
const { fetchCollection } = moduleStore
const props = defineProps({
  moduleName: String,
  moduleLabel: String,
  data: Array,
  pagination: Object,
  rows: Number,
  pages: Number,
  fields: Array,
  collectionLoading: Boolean
})
const rightShadowStyle = ref()
const leftShadowStyle = ref()
const menu = ref()
const cm = ref()
const selectedData = ref()
const selectedContextData = ref()
const menuSelectedData = ref()
const menuModel = ref([
  {label: 'View', icon: 'pi pi-fw pi-search', command: () => console.log(selectedContextData.value)},
  {label: 'Delete', icon: 'pi pi-fw pi-times', command: () => console.log(selectedContextData.value)}
])
const menuItems = ref([
    {
      label: 'Update',
      icon: 'pi pi-refresh',
      command: (event) => {
        console.log(event)
        console.log(menuSelectedData.value)
      }
    }, {
      label: 'Delete',
      icon: 'pi pi-times',
      command: (event) => {
        console.log(event)
        console.log(menuSelectedData.value)
      }
    }
])

// actions
const paginate = async (event) => {
  console.log(event.page + 1)

  // re-fetch collection
  await fetchCollection(props.moduleName, event.page + 1)
}
const onRowContextMenu = (event) => {
  // cm.value.show(event.originalEvent)
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

const handleHoverOut = (event) => {
  rightShadowStyle.value = null
  leftShadowStyle.value = null
}

// life cycles
onMounted(async () => {
  // const dynamicTbl = document.getElementsByClassName('p-datatable-tbody')[0]
  // dynamicTbl.addEventListener('onmouseover', handleScroll)

  // console.log(dynamicTbl)
})

</script>

<template>
  <DataTable
    v-model:selection="selectedData"
    v-model:contextMenuSelection="selectedContextData"
    @rowContextmenu="onRowContextMenu"
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
    scrollHeight="55vh"
    class="dynamic-tbl">
    <Column
      frozen
      headerClass="custom-header bg-primary-100 text-color-secondary"
      :style="`min-width: 60px; ${rightShadowStyle}`"
      bodyClass="text-center"
      selectionMode="multiple"></Column>
    <Column
      v-for="col of fields"
      :key="col._id"
      :field="col.name"
      :header="col.label"
      sortable
      sorticon="check"
      style="min-width: 200px !important;"
      bodyClass="text-color-secondary"
      headerClass="bg-primary-100 text-color-secondary">
      <template #body="slotProps">
        <span v-if="slotProps.data[col.name]">
          <span v-if="col.relation">
            <span
              v-for="(diplayFieldName, dfn) in col.relation.displayFieldName"
              :key="dfn">
              <span v-if="col.rules.ss_pop_up" class="mr-1">{{ slotProps.data[col.name][diplayFieldName] }}</span>
            </span>
          </span>
          <span v-else>{{ slotProps.data[col.name] }}</span>
        </span>
      </template>
    </Column>
    <Column
      frozen
      alignFrozen="right"
      :exportable="false"
      :style="`min-width: 60px; ${leftShadowStyle}`"
      bodyClass="text-color-secondary text-center"
      headerClass="bg-primary-100 text-color-secondary">
      <template #body="slotProps">
        <Button
          class="menu-btn"
          icon="pi pi-ellipsis-v"
          text
          @click="menuToggle($event, slotProps.data)"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          style="font-size: .5rem; padding: 5px 0; background-color: transparent;" />
        <Menu ref="menu" id="overlay_menu" :data-value="slotProps" :model="menuItems" :popup="true" />
      </template>
    </Column>
    <template #footer>
      <Paginator
        @page="paginate"
        template="CurrentPageReport PrevPageLink NextPageLink"
        :rows="pagination && pagination.per_page"
        :totalRecords="pagination && pagination.total"
        :rowsPerPageOptions="[5, 10, 15, 20, 25, 30]"
        class="custom-paginator">
        <template #start="slotProps">
          <div class="flex align-items-center">
            <div class="text-sm text-color-secondary">Items per page: {{ slotProps.state.rows }}</div>
            <Divider type="solid" layout="vertical" />
            <div v-if="pagination" class="text-sm text-color-secondary">
              {{ pagination.current_page }} - {{ pagination.total_pages }} of {{ pagination.total }} items
            </div>
          </div>
        </template>
      </Paginator>
    </template>
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
</style>