<script setup>
    import { ref, onMounted, defineAsyncComponent, inject} from 'vue'
    import { useRouter } from 'vue-router'
    import { storeToRefs } from 'pinia'
    import { useToast } from "primevue/usetoast"
    import axios from 'axios'
    import _ from 'lodash'

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
    <template v-for="(section,sectioni) in panel.sections" :key="section._id">
        <div v-if="(quickAdd && section.quick) || !quickAdd"  class="flex flex-column px-3 py-2" :class="(sectioni > 1) ? 'mt-2' : ''">
            <h6 class="formSectionLabel" v-if="section.sectionLabel">{{ section.sectionLabel }}</h6>
            <div class="grid">
                <div  v-for="(col,colI) in section.field_ids" :key="colI" class="col flex flex-column gap-2">
                    <template v-for="field in col" :key="field" >
                        <Field v-if="(quickAdd && _.get(_.find(form.fields,{'_id':field}),'quick',false)) || !quickAdd" keyName="main" :config="_.find(form.fields,{'_id':field})"/>
                    </template>
                </div>
            </div>
        </div>
    </template>
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