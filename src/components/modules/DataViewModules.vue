<script setup>
// ---------
// imports
// ---------
import { defineProps, onMounted, ref } from 'vue'

// ------
// refs
// ------
const layout = ref('grid')
// props
const props = defineProps({
  data: Array,
  loading: Boolean,
  paginator: Boolean,
  rows: Number
})

onMounted(() => {

})

</script>

<template>
  <div>
    <DataView :value="data" :layout="layout" :paginator="paginator" :rows="rows">
      <template #header>
        <div class="flex align-items-center justify-content-between">
          <div>
            <div class="text-3xl">Modules</div>
          </div>
          <div>
            <!-- <DataViewLayoutOptions v-model="layout" /> -->
          </div>
        </div>
      </template>

      <template #list="slotProps">
        <div v-if="!modulesLoading" class="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
          <div
            @click="$router.push(`/modules/${slotProps.data._id}`)"
            class="p-4 border-1 surface-border surface-card border-round cursor-pointer">
            <div class="flex flex-column align-items-center gap-3 py-5">
              <div class="material-icons" style="font-size: 5rem;">{{ slotProps.data.icon }}</div>
              <div class="text-2xl font-bold">{{ slotProps.data.label }}</div>
            </div>
          </div>
        </div>
        <div v-else class="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
          <div class="p-4 border-1 surface-border surface-card border-round">
            <div class="flex flex-column align-items-center gap-3 py-5">
              <Skeleton class="w-9 shadow-2 border-round h-10rem" />
              <Skeleton class="w-8rem border-round h-2rem" />
              <Skeleton class="w-6rem border-round h-1rem" />
            </div>
          </div>
        </div>
      </template>

      <template #grid="slotProps">
        <div v-if="!modulesLoading" class="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
          <div
            @click="$router.push(`/modules/${slotProps.data._id}`)"
            class="p-4 border-1 surface-border surface-card border-round cursor-pointer">
            <div class="flex flex-column align-items-center gap-3 py-5">
              <div class="material-icons" style="font-size: 5rem;">{{ slotProps.data.icon }}</div>
              <div class="text-2xl font-bold">{{ slotProps.data.label }}</div>
            </div>
          </div>
        </div>
        <div v-else class="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
          <div class="p-4 border-1 surface-border surface-card border-round">
            <div class="flex flex-column align-items-center gap-3 py-5">
              <Skeleton class="w-9 shadow-2 border-round h-10rem" />
              <Skeleton class="w-8rem border-round h-2rem" />
              <Skeleton class="w-6rem border-round h-1rem" />
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>

<style scoped>

</style>