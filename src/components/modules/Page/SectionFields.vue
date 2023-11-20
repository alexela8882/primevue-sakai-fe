<script setup>
// imports
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useModuleStore } from '../../../stores/modules'
import { useModuleDetailStore } from '../../../stores/modules/detail'

// refs
// stores
const moduleStore = useModuleStore()
const moduleDetailStore = useModuleDetailStore()
const { getFieldDetailsById } = storeToRefs(moduleStore)
const { getItemValueByName } = storeToRefs(moduleDetailStore)

// defines
const props = defineProps({
  fieldIds: Array
})

</script>

<template>
  <div class="grid">
    <div
      v-for="(field, fx) in fieldIds"
      :key="fx"
      class="col flex flex-column gap-4">
      <div v-for="(id, idx) in field">
        <div v-if="getFieldDetailsById(id)" class="flex align-items-start gap-4 border-bottom-1 border-200">
          <div class="white-space-nowrap">{{ getFieldDetailsById(id).label }}</div>
          <div v-if="getFieldDetailsById(id).relation" class="flex gap-2">
            <div v-for="(displayField, dfx) in getFieldDetailsById(id).relation.displayFieldName" :key="dfx" class="font-bold">
              <div v-if="getItemValueByName(getFieldDetailsById(id).name)">
                <div v-if="typeof getItemValueByName(getFieldDetailsById(id).name) === 'object' &&
                            !Array.isArray(getItemValueByName(getFieldDetailsById(id).name)) &&
                            getItemValueByName(getFieldDetailsById(id).name) !== null">
                  {{ getItemValueByName(getFieldDetailsById(id).name)[displayField] }}
                </div>
                <div v-else-if="Array.isArray(getItemValueByName(getFieldDetailsById(id).name))">
                  <Tag
                    v-for="(relationArr, rax) in getItemValueByName(getFieldDetailsById(id).name)"
                    :key="rax"
                    rounded
                    :value="relationArr[displayField]"
                    class="white-space-nowrap px-3 m-1 cursor-pointer" severity="info"></Tag>
                </div>
              </div>
              <div v-else></div>
            </div>
          </div>
          <div v-else class="flex gap-4 font-bold">
            <div v-if="Array.isArray(getItemValueByName(getFieldDetailsById(id).name))">
              <Tag
                v-for="(item, itx) in getItemValueByName(getFieldDetailsById(id).name)"
                :key="itx"
                rounded
                :value="item"
                class="white-space-nowrap px-3 m-1 cursor-pointer my-1" severity="info"></Tag>
            </div>
            <div v-else>
              {{ getItemValueByName(getFieldDetailsById(id).name) ? getItemValueByName(getFieldDetailsById(id).name) : '' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>