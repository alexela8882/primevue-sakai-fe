<script setup>
    import { ref, onMounted, defineAsyncComponent, inject, watch, reactive} from 'vue'
    import { useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useToast } from "primevue/usetoast"
    import axios from 'axios'
    import _ from 'lodash'
    import helper from '@/mixins/Helper';

    import { useModuleStore } from '../../../stores/modules'
    import { useFormDataStore } from '../../../stores/forms'

    const MutableField = defineAsyncComponent(() => import('@/components/modules/Form/MutableField.vue'))

    const props = defineProps({
        module: String,
        panel: Object,
        formPage: String
    })

    const moduleStore = useModuleStore()
    const formDataStore = useFormDataStore()
    const { fetchModuleFields  } = moduleStore
    const { getEntityFields } = storeToRefs(moduleStore)
    const { fetchLookupPaginated } = formDataStore
    const { getDefaultValue } = helper();

    const fields = ref([])
    const form = inject('form')
    const toast = useToast();
    const selectedProducts = ref([])
    const hiddenFields = ref([])
    const displayFields = ref([])
    const defaultValue = ref({});
    const columnWidth = ref({
      "asServiceSales":"50px",
      "business_unit_ids":"130px",
      "unit_id":"200px",
      "itemCode":"100px",
      "modelCode":"100px",
      "product_id":"270px",
      "HSNCode":"80px",
      "quantity":"80px",
      "list_price_id":"50px",
      "salesPrice":"130px",
      "discount":"90px",
      "subTotal":"130px",
      "vat":"90px",
      "status_id":"100px",
      "commisionPercentSalesAgent":"130px",
      "commisionAmountSalesAgent":"130px"
    })
    const page = ref(1)
    const searchText = ref("")
    const fetching = ref(false)
    const items = ref([])
    const pagination = ref({})
    const modalVisible = ref(false)

    onMounted(async()=>{ 
        

        if(_.isEmpty(getEntityFields.value('SalesOpptItem')))
          await fetchModuleFields("SalesOpptItem")
  
        fields.value = getEntityFields.value('SalesOpptItem')
        if(props.formPage=='create'){
            displayFields.value = _.reduce(['asServiceSales','business_unit_ids','product_id','HSNCode','quantity','list_price_id','salesPrice','discount','vat','subTotal','unit_id'], function(res,v,i){
              res.push(_.find(fields.value,{'name':v}))
              return res
            },[])
            hiddenFields.value = _(fields.value).filter(function(f){ if(!_.includes(['product_id','list_price_id','salesPrice','vat','quantity','discount','subTotal','asServiceSales'],f.name)){ return true; } }).map('name').value()
        }else{
            displayFields.value = _.reduce(['status_id','asServiceSales','business_unit_ids','product_id','HSNCode','quantity','list_price_id','salesPrice','discount','vat','subTotal'], function(res,v,i){
              res.push(_.find(fields.value,{'name':v}))
              return res
            },[])
            hiddenFields.value = _(fields.value).filter(function(f){ if(!_.includes(['product_id','list_price_id','salesPrice','vat','quantity','discount','subTotal','asServiceSales','status_id'],f.name)){ return true; } }).map('name').value()
        }

        defaultValue.value = getDefaultValue(displayFields.value,false)
        form.value.values[props.panel.panelName] = []
    })

    const toggleProductSelection = (event) => {
         op.value.toggle(event);
        if(_.isEmpty(form.value.values.main['currency_id']) || _.isNull(form.value.values.main['currency_id'])){
            toast.add({ severity: 'error', summary: 'Error', detail: 'Please select currency first', position:"top-center", life: 3000 });
        }else if(_.isEmpty(form.value.values.main['pricebook_id']) || _.isNull(form.value.values.main['pricebook_id'])){
            toast.add({ severity: 'error', summary: 'Error', detail: 'Please select pricebook first', position:"top-center", life: 3000 });
        }else if(!_.isEmpty(form.value.values.main['account_id']) && !_.isNull(form.value.values.main['account_id']) && _.get(form.value.values.main,'branch_id.0._id','')=='5b344ae1678f711dfc04ec3c' && !_.isEmpty(form.value.values.main['sales_type_id']) && !_.isNull(form.value.values.main['sales_type_id'])){
            toast.add({ severity: 'error', summary: 'Error', detail: 'Please select sales type first', position:"top-center", life: 3000 });
        }else{
            op.value.toggle(event);
        }
        
    };

    const handleSelectionChange = (val) => {
        selectedProducts.value = val
    }

    const addProductsToTable = () =>{

        _.forEach(selectedProducts.value, function(p){
            let tmp = _.cloneDeep(defaultValue.value)
            tmp['product_id'] = p.product_id
            tmp['salesPrice'] = p.price
            tmp['listPriceCopied'] = true
            tmp['listPrice'] = p.price
            tmp['branch_id'] = form.value.values.main['branch_id']
            tmp['inclusive_service_ids'] = p.inclusiveServices
            form.value.values[props.panel.panelName].push(tmp)
        })
        selectedProducts.value = []
    }

    const fieldChange = (field,index) => {
        console.log(field,index)
        if(field=='salesPrice'){
            console.log(form.value.values[props.panel.panelName][index]['listPrice'],form.value.values[props.panel.panelName][index]['salesPrice'],form.value.values[props.panel.panelName][index]['listPrice']!=form.value.values[props.panel.panelName][index]['salesPrice'])
            if(form.value.values[props.panel.panelName][index]['listPrice']!=form.value.values[props.panel.panelName][index]['salesPrice']){
                form.value.values[props.panel.panelName][index]['listPriceCopied'] = false
            }else{
                form.value.values[props.panel.panelName][index]['listPriceCopied'] = true
            }
        }
    }

    const listPriceCopy = (index) => {
      form.value.values[props.panel.panelName][index]['salesPrice'] = form.value.values[props.panel.panelName][index]['listPrice'] 
    }

    const computeTotal = (data) =>{
      
      let branch = _.get(form.value.values.main,'branch_id._id','')
      let discount = data['discount']/100;
      let discountedPrice = data['salesPrice'] - (data['salesPrice'] * discount);
      if(branch=='5badf748678f7111186ba26e' || branch=='5f8510f0a6ebc7423b72d6f2'){
        //Esco US & US Pharma
        return _.round(discountedPrice,0) * data['quantity']
      }else if(branch=='5bfcf6c9678f71594d642a86' || branch =='5badf748678f7111186ba268'){
        // Bangladesh & Vietnam
        let vat = data['vat']/100;
        return (discountedPrice + (discountedPrice * vat)) * data['quantity']
      }else if(branch=='5c6a88e3a6ebc728735b9db2'){
        let commission = data['commisionPercentDistributor']/100
        discountedPrice = data['salesPrice'] - (data['salesPrice'] * (discount + commission));
        return discountedPrice * data['quantity']
      }else{
        return discountedPrice * data['quantity']
      }
    }

    let cancelToken = null; // Variable to store the cancel token
    const fetchProducts = async() =>{
        fetching.value = true
        // Cancel the previous request if it exists
        if (cancelToken) {
            cancelToken.cancel('Previous search canceled');
        }

        // // Create a new cancel token
        cancelToken = axios.CancelToken.source();
        try {
            let params = {"fieldId":"salesopptitem_list_price_id","page":page.value,"moduleName":'salesopportunities',"search":searchText.value}
            let err = []
            if(!_.isEmpty(form.value.values.main)){
                if(!_.isEmpty(form.value.values.main['currency_id']) && !_.isNull(form.value.values.main['currency_id'])){
                  params['SalesOpportunity::currency_id'] = form.value.values.main['currency_id']['_id']
                }else{
                  err.push("Currency")
                }

                if(!_.isEmpty(form.value.values.main['pricebook_id']) && !_.isNull(form.value.values.main['pricebook_id'])){
                  params['SalesOpportunity::pricebook_id'] = form.value.values.main['pricebook_id']['_id']
                }else{
                  err.push("Pricebook")
                }

                if(_.isEmpty(form.value.values.main['account_id']) || _.isNull(form.value.values.main['account_id'])){
                  err.push("Account Name")
                }
            }
            if(_.isEmpty(err)){
                modalVisible.value = true
                let records = await fetchLookupPaginated(params,cancelToken)

                items.value = records.data
                pagination.value = _.cloneDeep(_.get(records,'meta.pagination',{}))
                fetching.value = false
            }else{
                modalVisible.value = false
                toast.add({ severity: 'error', summary: 'Error', detail: 'Please select '+_.join(err,', '), position:"top-center", life: 3000 });
                fetching.value = false
            }
            
            
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
            } else {
                console.error('Error fetching data:', error);
            }
        } 
    }

    const changePage = async(p) => {
        page.value = p
        fetchProducts()
    }

    watch(form.value.values.main, (newV,oldV) =>{
        _.forEach(form.value.values[props.panel.panelName], function(d,i){
            if(!_.isEqual(d.branch_id,form.value.values.main.branch_id)){
                form.value.values[props.panel.panelName][i]['branch_id'] = form.value.values.main.branch_id
            }
        })
    })
</script>
<template>
<div class="formSectionLabel flex align-items-center justify-content-between">
    <h6 class="mb-0" v-if="panel.sections[0].label">{{ panel.sections[0].label }}</h6>
    <el-popover :visible="modalVisible" placement="bottom-start" :width="880" trigger="click" @hide="addProductsToTable" >
      <template #reference>
        <el-button style="margin-right: 16px" :disabled="form.formSaving" @click="fetchProducts">Add Products</el-button>
      </template>
      <div
        v-if="fetching"
        class="flex align-items-center justify-content-center">
        <ProgressSpinner />
      </div>
      <template  v-else>
        <el-table :data="items" border stripe height="250" size="small" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="30" />
          <el-table-column width="100" label="Item Code" >
              <template #default="scope">
                  {{ scope.row.product_id.itemCode}}
              </template>
          </el-table-column>
          <el-table-column width="120" label="Model Code">
              <template #default="scope">
                  {{ scope.row.product_id.modelCode}}
              </template>
          </el-table-column>
          <el-table-column width="250" label="Product">
              <template #default="scope">
                  <div v-html="scope.row.product_id.name"></div>
              </template>
          </el-table-column>
          <el-table-column width="250" label="Description">
              <template #default="scope">
                  <div v-html="scope.row.product_id.description"></div>
              </template>
          </el-table-column>
          <el-table-column width="100" prop="price" label="Price" />
        </el-table>
        <div class="flex align-items-center justify-content-between mt-2">
          <el-pagination
                small
                background
                layout="prev, pager, next"
                :default-page-size="50"
                :current-page="page"
                :total="_.get(pagination,'total',0)"
                @current-change="changePage"/>
          <el-button stype="primary" size="small" @click="modalVisible=false">OK</el-button>
        </div>
      </template>
    </el-popover>
</div>
 <DataTable :value="form.values[panel.panelName]" size="small" stripedRows  columnResizeMode="expand" tableStyle="min-width: 50rem">

    <template v-for="field in displayFields" :key="field._id">
      <Column v-if="field.name=='product_id'" header="Item Code" :style="'width:' +columnWidth['itemCode']">
            <template #body="slotProps">
                {{ slotProps.data.product_id.itemCode }}
            </template>
      </Column>
      <Column v-if="field.name=='product_id'" header="Model Code" :style="'width:' +columnWidth['modelCode']">
            <template #body="slotProps">
                {{ slotProps.data.product_id.modelCode }}
            </template>
      </Column>
      <Column :field="field.name" :header="field.label" :style="'width:' +columnWidth[field.name]">
          <template #body="slotProps">
              <template v-if="field.name=='product_id'">
                  <div v-html="slotProps.data.product_id.name"></div>
              </template>
              <template v-else-if="field.name=='list_price_id'">
                  <el-checkbox v-model="form.values[panel.panelName][slotProps.index]['listPriceCopied']" :disabled="form.values[panel.panelName][slotProps.index]['listPrice']==form.values[panel.panelName][slotProps.index]['salesPrice']" @change="listPriceCopy(slotProps.index)" size="small" />
              </template>
              <template v-else-if="field.name=='subTotal'">
                  {{ computeTotal(slotProps.data) }}
              </template>
              <template v-else>
                  <MutableField  :config="field" :mutableIndex="slotProps.index" :keyName="panel.panelName" type="tableForm" :entity="panel.entityName" :module="module" :inputWidth="columnWidth[field.name]" @changeValue="fieldChange"/>
              </template>
          </template>
      </Column>
    </template>
    
</DataTable>

</template>