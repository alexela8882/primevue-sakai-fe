<script setup>
// imports
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import _ from 'lodash';
// stores
import { useModuleStore } from '@/stores/modules'
import { useModuleDetailStore } from '@/stores/modules/detail'
import helper from '@/mixins/Helper';


// refs
const fieldWithValues = ref([])
const op = ref();
const currentLookupValues = ref([]);
const currentLookupDisplay = ref([]);
// stores
const moduleStore = useModuleStore()
const moduleDetailStore = useModuleDetailStore()
const { _getFieldDetailsById, getFieldDetailsById } = storeToRefs(moduleStore)
const { getItemValueByName } = storeToRefs(moduleDetailStore)
const { transformLookupDisplay, checkFieldIfMultipleSelect,checkIfHasModule } = helper();

// defines
const props = defineProps({
  fieldIds: Array,
  newModuleFields: Array,
  moduleValidationInputs: Object,
  moduleValidationErrors: Object,
  moduleValidationMeta: Object,
  source: String,
  mode: {
    type: String,
    default: 'view'
  }
})

// actions
const fillFieldWithValues = (modelValue, id) => {
  let obj = { field_id: id, val: modelValue }

  if (fieldWithValues.value.length > 0) {
    const index = fieldWithValues.value.findIndex(fwv => fwv.field_id === obj.field_id)
    if (index !== -1) fieldWithValues.value[index].val = modelValue
    else fieldWithValues.value.push(obj)

    console.log(index)
  } else fieldWithValues.value.push(obj)
}

const toggleLookupPanel = (values,field) => {
  currentLookupValues.value = values
  currentLookupDisplay.value = field.relation.displayFieldName
  console.log(values)
  op.value.toggle(event);
}

// this is for p-float-label bug fix only
watch(() => getFieldDetailsById.value, (newVal, oldVal) => {
  console.log(newVal)
})

</script>

<template>
  <div class="grid">
    <div
      v-for="(field, fx) in fieldIds"
      :key="fx"
      class="col flex flex-column gap-4">
      <div v-for="(id, idx) in field">
        <div v-if="_getFieldDetailsById({ fields: newModuleFields, _id: id })" :class="`${mode === 'view' && 'border-bottom-1 border-200'}`">
          <div v-if="mode === 'view'" class="flex align-items-start gap-4">
            <div class="white-space-nowrap">{{ _getFieldDetailsById({ fields: newModuleFields, _id: id }).label }}</div>
            <div v-if="_getFieldDetailsById({ fields: newModuleFields, _id: id }).field_type.name=='lookupModel'">
                  <template v-if="checkFieldIfMultipleSelect(_getFieldDetailsById({ fields: newModuleFields, _id: id }).rules)">
                    <template v-for="(val,index) in transformLookupDisplay(getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name),_getFieldDetailsById({ fields: newModuleFields, _id: id }))" :key="index">
                      <a v-if="checkIfHasModule(_getFieldDetailsById({ fields: newModuleFields, _id: id })) && index < 10" :href="val.link" target="_blank">
                        <Tag rounded  class="white-space-nowrap px-3 m-1" severity="info" :value="val.label"></Tag>
                      </a>
                      <Tag v-else-if="index < 10" rounded class="white-space-nowrap px-3 m-1" severity="info" :value="val.label"></Tag>
                    </template>
                    <Tag v-if="transformLookupDisplay(getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name),_getFieldDetailsById({ fields: newModuleFields, _id: id })).length > 10"
                      rounded class="white-space-nowrap px-3 m-1 cursor-pointer" severity="info" @click="toggleLookupPanel(getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name),_getFieldDetailsById({ fields: newModuleFields, _id: id }))" aria-haspopup="true" aria-controls="overlay_panel">
                      + {{ transformLookupDisplay(getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name),_getFieldDetailsById({ fields: newModuleFields, _id: id })).length - 10 }}
                    </Tag>
                  </template>
                  <template v-else>
                    <a v-if="checkIfHasModule(_getFieldDetailsById({ fields: newModuleFields, _id: id }))"  :href="transformLookupDisplay(getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name),_getFieldDetailsById({ fields: newModuleFields, _id: id })).link" target="_blank">
                        {{ transformLookupDisplay(getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name),_getFieldDetailsById({ fields: newModuleFields, _id: id })).label }}
                    </a>
                    <span v-else>{{ transformLookupDisplay(getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name),_getFieldDetailsById({ fields: newModuleFields, _id: id })).label }}</span>
                  </template>
            </div>
            <!-- <div v-if="_getFieldDetailsById({ fields: newModuleFields, _id: id }).relation" class="flex gap-2">
              <div  v-for="(displayField, dfx) in _getFieldDetailsById({ fields: newModuleFields, _id: id }).relation.displayFieldName" :key="dfx" class="font-bold">
                <div v-if="getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name)">
                  <div v-if="typeof getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name) === 'object' &&
                              !Array.isArray(getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name)) &&
                              getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name) !== null">
                    {{ getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name)[displayField] }}
                  </div>
                  <div v-else-if="Array.isArray(getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name))">
                    <Tag
                      v-for="(relationArr, rax) in getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name)"
                      :key="rax"
                      rounded
                      :value="relationArr[displayField]"
                      class="white-space-nowrap px-3 m-1 cursor-pointer" severity="info"></Tag>
                  </div>
                </div>
                <div v-else></div>
              </div>
            </div> -->
            <div v-else class="flex gap-4 font-bold">
              <div v-if="Array.isArray(getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name))">
                <Tag
                  v-for="(item, itx) in getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name)"
                  :key="itx"
                  rounded
                  :value="item"
                  class="white-space-nowrap px-3 m-1 cursor-pointer my-1" severity="info"></Tag>
              </div>
              <div v-else>
                {{ getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name) ? getItemValueByName(_getFieldDetailsById({ fields: newModuleFields, _id: id }).name) : '' }}
              </div>
            </div>
          </div>
          <div v-else>
            <div v-for="(nmField, nmf) in newModuleFields.filter(nmi => nmi._id === id)" :key="nmf">
              <span class="p-float-label">
                <InputText
                  v-bind="moduleValidationInputs[nmField.uniqueName]"
                  @update:modelValue="$emit('validate-sync-func')"
                  class="w-full"
                  :class="`${(nmField.rules && nmField.rules.required) && 'border-left-3'} ${!moduleValidationErrors[nmField.uniqueName] && moduleValidationMeta.touched ? 'border-green-600' : 'border-red-600'}`"
                />
                <label>{{ nmField.label }}</label>
              </span>
              <small v-if="moduleValidationErrors[nmField.uniqueName]" class="text-red-600">
                {{ moduleValidationErrors[nmField.uniqueName] }}
              </small>
            </div>
          </div>
        </div>
        <div v-else>
          <code>undefined {{ id }}</code>
        </div>
      </div>
    </div>
    <OverlayPanel ref="op" appendTo="body">
      <DataTable :value="currentLookupValues" stripedRows  :paginator="true" :rows="10">
          <Column v-for="f in currentLookupDisplay" :key="f" :field="f" :header="_.startCase(f)" sortable></Column>
      </DataTable>
  </OverlayPanel>
  </div>
</template>

<style scoped>

</style>