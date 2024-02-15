<script setup>
    import { ref, onMounted, defineAsyncComponent, inject} from 'vue'
    import { useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useToast } from "primevue/usetoast"
    import axios from 'axios'
    import { get, find } from 'lodash'

    import { useModuleStore } from '../../../stores/modules'

    const Field = defineAsyncComponent(() => import('@/components/modules/Form/Field.vue'))

    const props = defineProps({
        panel: Object,
        quickAdd: Boolean
    })

    const value = ref()
    const form = inject('form')

</script>
<template>
    <div>
        <div v-for="(section,sectioni) in panel.sections" :key="section._id" class="flex flex-column" :class="(sectioni > 1) ? 'mt-2' : ''">
            <h6 class="formSectionLabel">{{ section.sectionLabel }}</h6>
            <div class="grid">
                <div  v-for="(col,colI) in section.field_ids" :key="colI" class="col flex flex-column gap-2">
                    <Field v-for="field in col" :key="field" :config="find(form.fields,{'_id':field})"/>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.fieldInput.required input{
    border-left: 5px solid #f44336 !important;
}
.formSectionLabel{
    background: #80808029;
    padding:5px 2px;
}
</style>