<script setup>
    import { ref, onMounted   } from 'vue'
    import { useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useToast } from "primevue/usetoast"
    import axios from 'axios'
    import { fill,cloneDeep } from 'lodash'

    import { useModuleStore } from '../../../stores/modules'

    const props = defineProps({
        config: Object
    })

    const tempFields = ref(fill(Array(10),1))
    const formLoading = ref(true)
    
    onMounted(async () => {
        console.log(cloneDeep(props.config.module))
    })
</script>
<template>
    <Skeleton v-for="(item,index) in tempFields" :key="index" height="2rem" class="mb-2" borderRadius="16px"></Skeleton>
</template>