<script setup>
// -----------
// imports
// -----------
import { onMounted, ref, watch, defineAsyncComponent,provide } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import _ from 'lodash'
import validate from '@/mixins/Validate';
import helper from '@/mixins/Helper';
// stores
import { useModuleStore } from '../../../stores/modules/index'
import { useModuleDynamicTableStore } from '../../../stores/modules/dynamictable/index'
import { useFormDataStore } from '../../../stores/forms'
import router from '../../../router'

//components
const Field = defineAsyncComponent(() => import('@/components/modules/Form/Field.vue'))

// defines
const props = defineProps({
  mode: String,
  sidebar: Boolean,
  moduleId: String,
  moduleEntityName: String,
  moduleName: String,
  modulePermissions: {
    type: Array,
    default: []
  },
  moduleLabel: String,
  data: Array,
  pagination: Object,
  pageItems: Array,
  rows: Number,
  pages: Number,
  viewFilter: Object,
  fields: Array,
  collectionLoading: Boolean
})
const emit = defineEmits(['toggle-sidebar', 'paginate', 'limit-page'])

// refs
const multiSortMeta = ref([])
if (props.viewFilter) {
  let sort = Object.assign({}, {
    field: props.viewFilter.sortField,
    order: props.viewFilter.sortOrder == 'ASC' ? 1 : -1
  })
  multiSortMeta.value.push(sort)
}
const toast = useToast()
const fetchedModule = ref()
const pageOffset = ref(0)
const listViewFilterRef = ref(null)
const fieldEditingRef = ref(null)
const cellEdit = ref(false)
const cellEditing = ref({'rowId':null,'field':null,'rowIndex':null,'columnIndex':null})
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
const formDataStore = useFormDataStore()
const moduleDynamicTableStore = useModuleDynamicTableStore()
const { getModule, getCollection, getBaseModule, getEntity } = storeToRefs(moduleStore)
const { _fetchModule, fetchModule, fetchBaseModule, fetchCollection } = moduleStore
const { massUpdateRecords } = formDataStore
const { getDropdownLists, getDropdown } = storeToRefs(moduleDynamicTableStore)
const { fetchDropdownLists } = moduleDynamicTableStore
const { validateField, errorChecker } = validate();
const { transformLookupValue,transformFieldForSaving } = helper();
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
      if (props.modulePermissions.includes("show")) {
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
      } else {
        // toast
        toast.add({
          severity: 'warn',
          summary: 'Attention',
          detail: "You don't have permission please contact administrator.",
          life: 10000
        })
      }
    }
  }, {
    label: 'Change Owner',
    icon: 'pi pi-user',
    command: (event) => {
      // console.log(event)
      // console.log(menuSelectedData.value)
    },
    visible: props.moduleEntityName === getBaseModule.value.mainEntity
  }, {
    label: 'Update',
    icon: 'pi pi-refresh',
    disabled: !props.modulePermissions.includes("update"),
    command: (event) => {
      // console.log(event)
      // console.log(menuSelectedData.value)
    },
    visible: props.moduleEntityName === getBaseModule.value.mainEntity
  }, {
    label: 'Delete',
    icon: 'pi pi-times',
    disabled: !props.modulePermissions.includes("delete"),
    command: (event) => {
      // console.log(event)
      // console.log(menuSelectedData.value)
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

const tableFormData = ref({'values':{},'errors':{}})
const tableFormChanged = ref({})
const clonedData = ref()
const lockedFields = ref(['owner_id','created_at','updated_at','created_by','updated_by'])
// actions
const paginate = async (event, jump, per_page) => {
  const args = {
    event: event, 
    jump: jump,
    per_page: per_page
  }
  emit('paginate', args)
  // let page = 1
  // if (!jump) {
  //   page = event.page + 1
  //   pageOffset.value = event.page + 1
  // } else page = props.pagination.current_page

  // // re-fetch module & collection
  // fetchedModule.value = await _fetchModule(props.moduleName, page > 1 ? page : null, per_page)
  // clonedData.value = fetchedModule.value.data
}
const limitPage = async (e) => {
  emit('limit-page', e)
  // re-fetch module & collection
  // const limit = e.value
  // await paginate(null, true, limit)
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

const cellEditAction = (data,payload) => {
  cellEdit.value = true
  if(!_.has(tableFormData.value['values'],data['_id'])){
    tableFormData.value['values'][data['_id']] = _.cloneDeep(data)
    tableFormData.value['errors'][data['_id']] = {}
    tableFormData.value['errors'][data['_id']][payload.name] = []
  }
}

const onCellEditComplete = (event) => {
  console.log('complete',event)
  let { data, newValue, field } = event
  if(!_.isEmpty(tableFormData.value.errors[data['_id']][field])){
    cellEdit.value = true
    editingRows.value = data
  }else{
      if(newValue!=tableFormData.value['values'][data['_id']][field]){
        data[field] = tableFormData.value['values'][data['_id']][field]
        if(!_.has(tableFormChanged.value,data['_id'])){
          tableFormChanged.value[data['_id']] = [field]
        }else{
          if(!_.has(tableFormChanged.value[data['_id']],field)){
            tableFormChanged.value[data['_id']].push(field)
          }
        }
    }
  }
}

const onCellEditCancelled = (event) =>{
  console.log('cancelled',event)
}

const cellDBLClick = (event,field,columnIndex) =>{
  console.log(event)
  if(!_.includes(lockedFields.value,field.name)){
    cellEditing.value.rowId = event.data['_id']
    cellEditing.value.rowIndex = event.index
    cellEditing.value.columnIndex = columnIndex
    cellEditing.value.field = field
    if(!_.has(tableFormData.value['values'],event.data['_id'])){
      let tmpData = _.cloneDeep(event.data)
      if(field.field_type.name=='lookupModel'){
        tmpData[field.name] = transformLookupValue(tmpData[field.name],field)
      }
      tableFormData.value['values'][event.data['_id']] = _.cloneDeep(tmpData)
      tableFormData.value['errors'][event.data['_id']] = {}
      tableFormData.value['errors'][event.data['_id']][event.field] = []
    }
  }
  
}

const resetTableForm = () =>{
  tableFormChanged.value = {}
  tableFormData.value = {}
  clonedData.value = _.cloneDeep(props.data)
}

watch(() => props.data, (newVal, oldVal) => {
  clonedData.value = newVal
})

// life cycles
onMounted(async () => {
  clonedData.value = _.cloneDeep(props.data)
  console.log(clonedData.value)
})

onClickOutside(listViewFilterRef, (event) => {
  console.log(event.target && event.target.attributes.class.value)
  // console.log(event.target && event.target.attributes['data-pc-section'].value)
  if (event.target) {
    if (
      event.target.attributes.class &&
      (
        event.target.attributes.class.value === 'p-dropdown-item' ||
        event.target.attributes.class.value === 'p-dropdown-filter p-inputtext p-component' ||
        event.target.attributes.class.value === 'p-checkbox-box' ||
        event.target.attributes.class.value === 'p-checkbox-box p-focus' ||
        event.target.attributes.class.value === 'p-icon p-checkbox-icon undefined' ||
        event.target.attributes.class.value === 'p-multiselect-header' ||
        event.target.attributes.class.value === 'p-multiselect-empty-message' ||
        event.target.attributes.class.value === 'p-icon p-multiselect-close-icon' ||
        event.target.attributes.class.value === 'p-multiselect-close p-link' ||
        event.target.attributes.class.value === 'p-datepicker-other-month' ||
        event.target.attributes.class.value === 'p-datepicker-header' ||
        event.target.attributes.class.value === 'p-monthpicker-month' ||
        event.target.attributes.class.value === 'p-datepicker-month p-link' ||
        event.target.attributes.class.value === 'p-yearpicker-year' ||
        event.target.attributes.class.value === 'p-datepicker-year p-link' ||
        event.target.attributes.class.value === 'p-icon p-datepicker-prev-icon' ||
        event.target.attributes.class.value === 'p-icon p-datepicker-next-icon' ||
        event.target.attributes.class.value === 'p-datepicker-prev p-link' ||
        event.target.attributes.class.value === 'p-datepicker-next p-link' ||
        event.target.attributes.class.value === 'p-datepicker p-component p-ripple-disabled' ||
        event.target.attributes.class.value === 'p-datepicker-group' ||
        event.target.attributes.class.value === 'p-dialog-header' ||
        event.target.attributes.class.value === 'p-dialog-title' ||
        event.target.attributes.class.value === 'p-dialog-footer' ||
        event.target.attributes.class.value === 'p-confirm-dialog-message' ||
        event.target.attributes.class.value === 'p-icon p-dialog-header-close-icon' ||
        event.target.attributes.class.value === 'p-confirm-dialog-icon pi pi-exclamation-triangle' ||
        event.target.attributes.class.value === 'p-dialog-mask p-component-overlay p-component-overlay-enter' ||
        event.target.attributes.class.value === 'p-button-label' ||
        event.target.attributes.class.value === 'p-button p-component p-confirm-dialog-reject p-button-secondary p-button-outlined'
      ) ||
      (
        event.target.attributes['data-pc-section'] &&
        (
          event.target.attributes['data-pc-section'].value === 'item' ||
          event.target.attributes['data-pc-section'].value === 'filterinput' ||
          event.target.attributes['data-pc-section'].value === 'option' ||
          event.target.attributes['data-pc-section'].value === 'daylabel'
        )
      )
    ) {
      return // prevent to push through
    } else emit('toggle-sidebar', false)
  }
})

document.addEventListener('keydown', function(event) {
  if (event.key === "Escape") {
    // Handle the "Escape" key press
    console.log("Escape key pressed",event);
    onChangeField()
  }
});

onClickOutside(fieldEditingRef, (event) => {
  let targetClass = _.get(event,'target.classList',[])
  console.log(event.target.parentElement.className, targetClass)
  if(!_.includes(targetClass,'p-inputtext') && !_.includes(targetClass,'el-input__inner') && !_.includes(targetClass,'el-select-dropdown__ite') && !_.includes(targetClass,'fieldInputSelection') && !_.includes(targetClass,'lookupSelected') && !_.includes(targetClass,'lookupInput') && !_.includes(targetClass,'lookupRemoveBtn') && !_.includes(targetClass,'lookupSelection') && event.target.parentElement.className!='el-icon el-select__caret el-select__icon'){
    console.log('click outside')
    onChangeField()
  }else{
    console.log('clicked inside field')
  }
})

const onChangeField = () => {
  if(cellEditing.value.rowId!=null){
      let theField = _.find(getModule.value.fields,{'name':cellEditing.value.field.name})
      console.log(tableFormData.value.values[cellEditing.value.rowId][cellEditing.value.field.name])
      tableFormData.value.errors[cellEditing.value.rowId][cellEditing.value.field.name] = validateField(tableFormData.value.values[cellEditing.value.rowId],theField,getModule.value.fields)
      let noError = errorChecker(tableFormData.value.errors[cellEditing.value.rowId])

      if(noError){
        let index = _.findIndex(clonedData.value,{'_id':cellEditing.value.rowId})
        let valueEdited = tableFormData.value.values[cellEditing.value.rowId][cellEditing.value.field.name]
        let oldValue = clonedData.value[index][cellEditing.value.field.name]
        if(cellEditing.value.field.field_type.name=='picklist'){
          valueEdited = (_.isArray(tableFormData.value.values[cellEditing.value.rowId][cellEditing.value.field.name])) ? _.join(_.map(tableFormData.value.values[cellEditing.value.rowId][cellEditing.value.field.name],'value'),", ") : tableFormData.value.values[cellEditing.value.rowId][cellEditing.value.field.name]['value']
        }else if(cellEditing.value.field.field_type.name=='lookupModel'){
          valueEdited = transformLookupValue(tableFormData.value.values[cellEditing.value.rowId][cellEditing.value.field.name],cellEditing.value.field,true)
          oldValue = transformLookupValue(clonedData.value[index][cellEditing.value.field.name],cellEditing.value.field,true)
        }
        if(valueEdited!=oldValue){
          console.log(cellEditing.value.field, valueEdited, oldValue)
            if(cellEditing.value.field.field_type.name=='picklist'){
              console.log('picklist changed',tableFormData.value.values[cellEditing.value.rowId][cellEditing.value.field.name]['value'])
              clonedData.value[index][cellEditing.value.field.name] = tableFormData.value.values[cellEditing.value.rowId][cellEditing.value.field.name]['value']
            }              
            else
              clonedData.value[index][cellEditing.value.field.name] = tableFormData.value.values[cellEditing.value.rowId][cellEditing.value.field.name]
            if(!_.has(tableFormChanged.value,cellEditing.value.rowId)){
              tableFormChanged.value[cellEditing.value.rowId] = [cellEditing.value.field.name]
            }else{
              if(!_.has(tableFormChanged.value[cellEditing.value.rowId],cellEditing.value.field.name)){
                tableFormChanged.value[cellEditing.value.rowId].push(cellEditing.value.field.name)
              }
            }
        }
         cellEditing.value = {'rowId':null,'field':null,'rowIndex':null,'columnIndex':null}
      }     
    }
}
const savingRecords = ref(false)
const saveEditedRecords = async() => {
  savingRecords.value = true

  let forSaving = _.reduce(tableFormChanged.value, function(res,val,k){
    let tmp = {'_id':k}
    _.forEach(val, function(f){
      tmp[f] = transformFieldForSaving(tableFormData.value.values[k][f],_.find(props.fields,{'name':f}))
    })
    res.push(tmp)
    return res
  },[])
  let res = await massUpdateRecords(forSaving,getBaseModule.value.name)
  if(res.status==200){
    tableFormChanged.value = {}
    tableFormData.value = {'values':{},'errors':{}}
  }

}

provide('form', tableFormData)
</script>

<template>
  <!-- <pre>{{ viewFilter }}</pre> -->
  <DataTable
    v-model:selection="selectedData"
    v-model:contextMenuSelection="selectedContextData"
    v-model:multiSortMeta="multiSortMeta"
    @rowContextmenu="onRowContextMenu"
    tableClass="editable-cells-table module-table"
    :value="clonedData"
    :loading="collectionLoading"
    stripedRows
    resizableColumns
    columnResizeMode="fit"
    sortMode="multiple"
    removableSort
    scrollable
    scrollHeight="60vh"
    class="dynamic-tbl"
    style="min-height: 60vh !important;">
    <Column
      v-if="mode === 'edit'"
      frozen
      headerClass="custom-header bg-primary-100 text-color-secondary"
      :style="`min-width: 60px; ${rightShadowStyle}`"
      bodyClass="text-center py-1"
      selectionMode="multiple"></Column>
    <Column
      v-for="(col,coli) of fields"
      :key="col._id"
      :field="col.name"
      :header="col.label"
      sortable
      sorticon="check"
      style="min-width: 200px !important;"
      :bodyClass="`text-color-secondary ${col.field_type.name=='lookupModel' ? 'lookupColumn' : ''}`"
      headerClass="bg-primary-100 text-color-secondary">
      <template #body="slotProps">
        <div v-if="cellEditing.rowId==slotProps.data['_id'] && cellEditing.field.name==slotProps.field" style="white-space:normal;">
          <Field ref="fieldEditingRef" :config="col" :keyName="slotProps.data['_id']" :inline="true" type="tableForm" :module="getBaseModule.name" @changeValue="onChangeField"/>
        </div>
        <div v-else class="py-2" @dblclick="cellDBLClick(slotProps,col,coli)" :class="{'cell-edited':(_.find(tableFormChanged,function(f,k){ if(k==slotProps.data['_id'] && _.includes(f,col.name)){ return true}}))}">
          <div class="flex align-items-center px-2" :class="(slotProps.data[col.name]) ? 'justify-content-between' : 'justify-content-end'">
            <div v-if="slotProps.data[col.name]">
              <span v-if="col.relation">
                <span
                  v-for="(diplayFieldName, dfn) in col.relation.displayFieldName"
                  :key="dfn">
                  <span v-if="col.rules.ss_pop_up" class="mr-1">{{ slotProps.data[col.name][diplayFieldName] }}</span>
                  <span v-else-if="col.rules.ss_dropdown" class="mr-1">
                    <span>{{ slotProps.data[col.name][diplayFieldName] }}</span>
                  </span>
                  <span v-else class="mr-1">
                    <span>{{ slotProps.data[col.name][diplayFieldName] }}</span>
                  </span>
                </span>
              </span>
              <span v-else>{{ slotProps.data[col.name] }}</span>
            </div>
            <i v-if="!_.includes(lockedFields,col.name)" class="edit-icon cursor-pointer pi pi-pencil ml-3"></i>
            <i v-else class="edit-icon cursor-pointer pi pi-lock ml-3"></i>
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
              @change="limitPage($event)"
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
          @page="paginate($event, false, pagination.per_page)"
          template="JumpToPageDropdown PrevPageLink NextPageLink"
          :rows="pagination && pagination.per_page"
          :totalRecords="pagination && pagination.total"
          :rowsPerPageOptions="[5, 10, 15, 20, 25, 30]"
          class="custom-paginator">
        </Paginator>
      </div>
    </template>
    <template #empty>
      <div class="text-700">
        No records found
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
  <div v-if="!_.isEmpty(tableFormChanged)" style="width:100vw;position:fixed;bottom:0;left:0;height:54px;text-align:center;margin-left:90px;padding:12px" class="shadow-2 align-items-center">
    <el-button @click="resetTableForm">Cancel</el-button>
    <el-button type="primary" @click="saveEditedRecords">Save</el-button>
  </div>
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
.module-table td:hover .edit-icon {
  opacity: 1 !important;
  /* transform: translateX(0);
  transition: transform ease-in .2s; */
}
.cell-edited{
  background: #f9e3b6;
}
.module-table td{
  padding-bottom: 0px !important;
  padding-top: 0px !important;
}
.module-table .lookupColumn{
  overflow: visible !important;
}
</style>