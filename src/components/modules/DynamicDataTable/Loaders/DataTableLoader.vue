<script setup>

</script>

<template>
  <DataTable :value="[{ 'col1': 1 }, { 'col2': 2 }, { 'col3': 3 }, { 'col4': 4 }, { 'col5': 5 }]">
    <Column field="code 1" header="">
      <template #body>
        <Skeleton class="m-1 my-2"></Skeleton>
      </template>
    </Column>
    <Column field="code 2" header="">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
    <Column field="code 3" header="">
      <template #body>
        <Skeleton></Skeleton>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>

</style>