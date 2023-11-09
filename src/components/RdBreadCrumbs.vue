<script setup>
// --------
// imports
// --------
import { ref, onMounted, onBeforeMount } from 'vue'

const props = defineProps({
  bcrumbs: Array
})

const home = ref({
  icon: 'pi pi-home',
  to: "/dashboard"
})

</script>

<template>
  <div class="px-4 lg:px-0">
    <Breadcrumb
      class="whitespace-nowrap capitalize text-blue-800 text-xl"
      :model="bcrumbs">
      <template #separator="{item}">
        <span class="font-bold text-blue-800">/</span>
      </template>
      <template #item="{item}">
        <a
          :class="item.class"
          @click="item.to && $router.push(`${item.to}`)"
          :style="`cursor: ${item.to !== null && 'pointer'}`">
          <span :class="`${item.to && 'font-bold'}`">{{ item.label }}</span>
        </a>
      </template>
    </Breadcrumb>
  </div>
</template>

<style scoped>

.p-breadcrumb {
  border: transparent;
  background-color: transparent;
  padding: 0;
  padding-left: 3px;
  padding-top: 3px;
  padding-bottom: 20px;
  margin: 20px 0 10px 0;
}

.p-breadcrumb-list {
  border: 1px solid #000 !important;
  text-overflow: ellipsis;
}

.p-menu {
  border: 2px solid #000 !important;
  background-color: #000;
}

.p-menuitem:first-child span:before {
  font-family: 'primeicons';
  content: "\e900";
  margin-right: 3px;
  font-size: 15px;
}

</style>