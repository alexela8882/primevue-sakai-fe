<script setup>

</script>

<template>
  <div class="p-4">
    <div class="flex flex-column gap-6">
      <div v-for="(skel, skx) in 2" :key="skx">
        <Skeleton class="mb-2" borderRadius="16px"></Skeleton>
        <Skeleton width="10rem" class="mb-2" borderRadius="16px"></Skeleton>
        <Skeleton width="5rem" borderRadius="16px" class="mb-2"></Skeleton>
        <Skeleton height="2rem" class="mb-2" borderRadius="16px"></Skeleton>
        <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>