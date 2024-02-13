<script setup>
    import { ref,onMounted  } from 'vue'
    import { useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useToast } from "primevue/usetoast"
    import axios from 'axios'
    import { fill,find } from 'lodash'

    import { useModuleStore } from '../../../stores/modules'
    import { useFormDataStore } from '../../../stores/forms'

    const props = defineProps(['module'])
    const moduleStore = useModuleStore()
    const formDataStore = useFormDataStore()
    const { getModules } = storeToRefs(moduleStore)
    const { _fetchModule, fetchBaseModule } = moduleStore
    const { getForms } = storeToRefs(formDataStore)
    const { generateForm } = formDataStore

    const tempFields = ref(fill(Array(10),1))
    const fields = ref([])
    const panels = ref([])
    const formLoading = ref(true)
    
    onMounted(async () => {
        let module = await _fetchModule(props.module)
        fields.value = module.fields
        panels.value = module.panels
        formLoading.value = false
    })

</script>
<template>
    <template v-if="formLoading">
        <Skeleton v-for="(item,index) in tempFields" :key="index" height="1.5rem" class="mb-3" borderRadius="5px"></Skeleton>
    </template>
    <template v-else>
        form loaded
    </template>
</template>