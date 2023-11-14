<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

console.log(route.fullPath)
</script>

<template>
  <router-view :key="route.fullPath"></router-view>
</template>

<style scoped></style>