<script setup>
    import { ref  } from 'vue'
    import { useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useToast } from "primevue/usetoast"
    import axios from 'axios'
    import { fill } from 'lodash'

    import { useModuleStore } from '../../../stores/modules'

    const tempFields = ref(fill(Array(10),1))
    
    onMounted(async () => {
    })
</script>
<template>
    <Skeleton v-for="(item,index) in tempFields" :key="index" height="2rem" class="mb-2" borderRadius="16px"></Skeleton>
</template>