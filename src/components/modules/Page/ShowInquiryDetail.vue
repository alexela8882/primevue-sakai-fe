<script setup>
// imports
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
// components
import RdBreadCrumbs from '../../RdBreadCrumbs.vue'
// stores
import { useModuleStore } from '@/stores/modules'
import { useModuleDetailStore } from '@/stores/modules/detail'

// presets
const route = useRoute()
const bcrumbs = ref([
  {
    label: `${route.params.name}`,
    to: `/modules/${route.params.name}/${route.params.id}`
  }, {
    label: `${route.params.name} details`,
    to: null
  }
])

// refs
const localModule = ref()
const localData = ref({})
// stores
const moduleStore = useModuleStore()
const moduleDetailStore = useModuleDetailStore()
const { getModule, getCollectionById, getFieldDetails } = storeToRefs(moduleStore)
const { getItemValueByName, moduleLoading } = storeToRefs(moduleDetailStore)
const { fetchModule } = moduleStore

// lifecycle
onMounted(async () => {
  await fetchModule(route.params.name)

  localModule.value = getModule.value
  localData.value = getCollectionById.value(route.params.pageid)
})
</script>

<template>
  <div>
    <pre>{{ getModule.value }}</pre>
    <RdBreadCrumbs :bcrumbs="bcrumbs" />

    <div
      v-if="moduleLoading"
      class="flex align-items-center justify-content-center"
      style="height: 60vh !important;">
      <ProgressSpinner />
    </div>
    <div v-else>
      <div
        style="position: sticky !important; top: 72px; z-index: 2 !important;"
        class="bg-white px-5 py-3 mb-5 border-round-xl flex align-items-center justify-content-between shadow-2">
        <div class="flex" v-if="localModule">
          <div v-for="(field, fx) in localModule.fields" :key="fx">
            <div :class="`${localModule.fields.length === fx + 1 && 'mr-8'}`">
              <div v-if="field.title" class="flex flex-column text-xl mr-4">
                <div v-if="field.groupWith">
                  <div>{{ field.groupLabel }}</div>
                  <div class="flex">
                    <div v-for="(groupField, gfx) in field.groupWith" :key="gfx">
                      <div class="font-bold">{{ getItemValueByName(groupField) }}{{ field.fieldGlue === ' ' ? '&nbsp;' : field.fieldGlue }}</div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div>{{ field.label }}</div>
                  <div class="font-bold">{{ getItemValueByName(field.name) }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-for="(field, fx) in localModule.fields" :key="fx">
            <div v-if="field.header" class="flex flex-column text-xl mx-4">
              <div>{{ field.label }}</div>
              <div class="font-bold">{{ getItemValueByName(field.name) ? getItemValueByName(field.name) : null }}</div>
            </div>
          </div>
        </div>

        <div>
          <Button label="Edit" size="large" class="px-6 border-round-xl"></Button>
        </div>
      </div>

      <div class="grid">
        <div class="col-7">
          <div class="p-3 bg-white border-round-xl shadow-2">
            <TabView>
              <TabPanel header="Details">
                <div>
                  <div>
                    <div
                      v-for="(key, kx) in Object.keys(localData)"
                      :key="kx"
                      class="grid">
                        <div class="col-6">{{ getFieldDetails(key) && getFieldDetails(key).label }}</div>
                        <div class="col-6 overflow-auto">
                          <p class="white-space-normal">{{ localData[key] }}</p>
                        </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
        <div class="col-5">
          <div class="p-3 bg-white border-round-xl shadow-2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>