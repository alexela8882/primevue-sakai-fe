<script setup>
// imports
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
// components
import RdBreadCrumbs from '../../RdBreadCrumbs.vue'
const MailboxThreads = defineAsyncComponent(() =>
  import('@/components/outlookmails/MailboxThreads.vue')
)
// stores
import { useModuleStore } from '@/stores/modules'
import { useModuleDetailStore } from '@/stores/modules/detail'

// presets
const route = useRoute()
const router = useRouter()
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
const localLinkedModuleInfo = ref()
const localLinkedModule = ref()
const localLinkedModuleData = ref()
const localEntity = ref()
// stores
const moduleStore = useModuleStore()
const moduleDetailStore = useModuleDetailStore()
const {
  getEntity,
  getModule,
  getModules,
  getLinkedModuleData,
  getCollectionById,
  _getFieldDetails,
  getFieldDetails } = storeToRefs(moduleStore)
const { getItemValueByName, moduleLoading } = storeToRefs(moduleDetailStore)
const { fetchModule, fetchLinkedModuleData, _fetchModule } = moduleStore
const { fetchItem } = moduleDetailStore

// actions
const fetchRelatedRecord = async () => {
  localEntity.value = getEntity.value(localData.value.type_id)
  const entityName = localEntity.value.name

  let lmdParams = { module: entityName, link_field: '_id', link_id: localData.value.link_id }
  await fetchLinkedModuleData(lmdParams)
  localLinkedModuleData.value = getLinkedModuleData.value

  localLinkedModule.value = await _fetchModule(localEntity.value.name)
  localLinkedModuleInfo.value = getModules.value.find(m => m.name == localEntity.value.name)
}

// lifecycle
onMounted(async () => {
  await fetchModule(route.params.name)
  await fetchItem(route.params)

  localModule.value = getModule.value
  localData.value = getCollectionById.value(route.params.pageid)

  await fetchRelatedRecord()
})
</script>

<template>
  <div>
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
                <div class="flex flex-column gap-4">
                  <Panel class="detail-page-panel">
                    <template #header>
                      <div class="flex align-items-center gap-2">
                        <span class="text-2xl font-bold">Inquiry details</span>
                      </div>
                    </template>
                    <div class="mt-4">
                      <div
                        v-for="(key, kx) in Object.keys(localData)"
                        :key="kx"
                        class="grid">
                        <div v-if="key !== 'conversations'" class="col flex align-items-center gap-4">
                          <div>
                            <p class="white-space-nowrap">
                              {{ getFieldDetails(key) ? getFieldDetails(key).label : 'ID' }}
                            </p>
                          </div>
                          <div
                            style="width: 40% !important"
                            class="white-space-nowrap overflow-hidden text-overflow-ellipsis">
                            {{ localData[key] }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Panel>

                  <Panel class="detail-page-panel">
                    <template #header>
                      <div class="flex align-items-center gap-2">
                        <span class="text-2xl font-bold">Email Thread</span>
                      </div>
                    </template>
                    <div v-if="localData.conversations && localData.conversations.length > 0" class="mt-4">
                      <MailboxThreads :threads="localData.conversations.slice().reverse()" />
                    </div>
                  </Panel>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
        <div
          style="position: sticky !important; top: 145px !important; height: 75vh !important;"
          class="col-5">
          <div v-if="localEntity" class="bg-white border-round-xl shadow-2">
            <div
              @click="router.push({ name: 'modules.pages.detail', params: { name: localEntity.name, id: localLinkedModuleInfo._id, pageid: localData.link_id } })"
              class="cursor-pointer p-3 border-round-top-xl text-2xl bg-primary-300 text-50">
              {{ localEntity.label }}
            </div>
            <div class="p-3">
              <div
                v-if="localLinkedModule"
                v-for="(key, kx) in Object.keys(localLinkedModuleData)"
                :key="kx"
                class="grid">
                  <div class="col flex align-items-center gap-4">
                    <div>
                      <p class="white-space-nowrap">
                        {{ _getFieldDetails({ module: localLinkedModule, field: key }) ? _getFieldDetails({ module: localLinkedModule, field: key }).label : 'ID' }}
                      </p>
                    </div>
                    <div>
                      {{ localLinkedModuleData[key] }}
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.detail-page-panel .p-panel-header {
  background-color: var(--primary-color) !important;
  color: white !important;
}
</style>