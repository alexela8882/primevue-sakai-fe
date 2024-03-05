<script setup>
// -----------
// imports
// -----------
import draggable from 'vuedraggable'
import { onMounted, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
// stores
import { useModuleStore } from '../../stores/modules/index'

// defines
const props = defineProps({
  sidebar: Boolean,
  viewFilterId: String,
  module: Object,
  moduleName: String,
  moduleLabel: String,
  data: Array,
  fields: Array,
  groupBy: String,
  summarizeBy: String,
  collectionLoading: Boolean
})
const emit = defineEmits(['toggle-sidebar'])

// refs
const listViewFilterRef = ref(null)
const route = useRoute()
const router = useRouter()
const drag = ref(false)
const kanbanData = ref([])
const moduleStore = useModuleStore()
const { getCollection, _getKanbanData, getKanbanData, getFieldDetails } = storeToRefs(moduleStore)
const { fetchModule, fetchBaseModule, fetchCollection } = moduleStore

// actions
const log = (evt) => {
  window.console.log(evt)
}
const navigateDetailPage = (data) => {
  const routerObj = Object.assign({},
    {
      name: 'modules.pages.detail',
      params: {
        name: route.params.name,
        id: route.params.id,
        pageid: data._id
      }
    }
  )
  router.push(routerObj)
}

onMounted(() => {
  kanbanData.value = getKanbanData.value({ _id: props.viewFilterId, module: props.module })
})

onClickOutside(listViewFilterRef, (event) => {
  if (event.target && event.target.attributes.class.value !== 'p-dropdown-item') {
    emit('toggle-sidebar', false)
  }
})

</script>

<template>
  <div style="position: relative;">
    <div class="ddt-slot-1-parent">
      <Transition name="lvf-slide-fade">
        <div v-if="sidebar" ref="listViewFilterRef" class="ddt-slot-1 shadow-4 bg-white">
          <div style="overflow: scroll; max-height: 100%;">
            <slot name="list-view-filter"></slot>
          </div>
          <div class="ddt-div-1 shadow-4 bg-white"></div>
        </div>
      </Transition>
    </div>
    <div class="grid grid-nogutter">
      <div
        v-for="(field, fx) in kanbanData"
        :key="fx"
        class="col">
        <div
          style="position: sticky; top: 70px; z-index: 2;"
          class="bg-white py-4 px-4 text-primary font-bold text-xl shadow-1">{{ field.label }}</div>
        <draggable
          :list="field.data"
          :group="viewFilterId"
          :animation="300"
          @change="log"
          @start="drag = true"
          @end="drag = false"
          :component-data="{
            tag: 'div',
            type: 'transition-group',
            name: !drag ? 'flip-list' : null
          }"
          itemKey="_id"
          handle=".handle"
          class="h-full">
          <template #item="{ element, index }">
            <div class="draggable-div p-4 m-4 border-1 border-primary-300 border-round-xl bg-white hover:shadow-4">
              <div class="flex gap-3 card-icons">
                <i @click="navigateDetailPage(element)" class="pi pi-eye cursor-pointer" style="font-size: 1rem"></i>
                <i class="handle pi pi-arrows-alt cursor-move" style="font-size: 1rem"></i>
              </div>
              <!-- Loop through the first 4 key-value pairs in the object -->
              <div v-for="(value, key) in Object.entries(element).slice(0, 4)" :key="key" class="my-2">
                <strong v-if="getFieldDetails(value[0])">{{ getFieldDetails(value[0]).label }}:</strong> {{ value[1] }}
              </div>
              <div class="flex justify-content-end">
                <Button class="bg-green" label="Manage" severity="success" />
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-icons {
  position: absolute;
  opacity: 0;
  right: 15px;
  top: 15px;
}

.draggable-div {
  position: relative;
}

.draggable-div:hover .card-icons {
  opacity: 1;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ddt-slot-1-parent {
  position: absolute !important;
  right: 0 !important;
  height: 100%;
}

.ddt-slot-1 {
  position: sticky;
  top: 73px;
  height: 85vh !important;
  z-index: 3 !important;
}

.grid-nogutter {
  transition: all .3s;
}

</style>