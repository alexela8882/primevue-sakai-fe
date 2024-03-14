<script setup>
import { onMounted, onUnmounted, ref, inject,defineAsyncComponent, watch  } from "vue";
import { storeToRefs } from 'pinia'
import _ from 'lodash';

const emit = defineEmits(['mounted'])

const props = defineProps({
    selectedTemplate: Object,
    pageContent: Object
})

onMounted(()=>{
    emit('mounted')
})
</script>
<template>
    <div id="pdfContent" class="pdfPage flex-none shrink-0 shadow-2">
        <template v-for="(pageSection,pageSectionKey) in pageContent" :key="pageSectionKey">
            <div :class="pageSectionKey">
                <div v-for="(panel,panelIndex) in pageSection" :key="'panel_' + panelIndex">
                    <div v-if="pageSectionKey=='headerPanel' && panelIndex==0" class='pdf-panel' style="width:100%">
                        <img v-if="_.includes(selectedTemplate,'Sanjay') || _.includes(selectedTemplate,'Stasys Polimaitis') || _.includes(selectedTemplate,'Ludek Homola') || _.includes(selectedTemplate,'Ana Sousa Lopes') || _.includes(selectedTemplate,'Morten Kristensen') ||  _.includes(selectedTemplate,'Jesper') || _.includes(selectedTemplate,'Makky') || selectedTemplate=='ETI-Medical Quote'" src="/images/letterhead/esco-medical-letterhead.jpg" style="width: 100%; display: block;"/>
                        <img v-else-if="_.includes(selectedTemplate,'Vietnam - Hanoi') || _.includes(selectedTemplate,'Vietnam -  Hanoi Service Quote')" src="/images/letterhead/Esco Vietnam - Hanoi header.png" style="width: 98%; display: block; margin:0px;"/>
                        <img v-else-if="!_.includes(selectedTemplate,'Pradana Indah Cemerlang') && !_.includes(selectedTemplate,'Esco Farma Lab')" src="/images/letterhead/esco-quotation-template-header-01-01.png" style="width: 100%; display: block;"/>
                    </div>
                    <div class="panelLabel" v-if="panel.label">{{ panel.label }}</div>
                    <div class="flex flex-wrap m-2">
                        <div class="pdfColumn" v-for="(sec,secIndex) in panel.sections" :key="'sec_' + secIndex">
                            <div class="flex flex-column w-full" :style="{'text-align' : _.get(sec,'alignment','left')}">
                                <template v-for="(el,elIndex) in sec.elements" :key="'el' + elIndex">
                                    <template v-if="el.elemType=='label'">
                                        <p :style="el.style">{{ el.value }}</p>
                                    </template>
                                    <template v-else-if="el.elemType=='richTextbox'">
                                        <div v-html="el.value"></div>
                                    </template>
                                    <template v-else-if="el.elemType=='mutable'"></template>
                                    <div class="flex flex-row" v-else>
                                        <p class="pdfLabel" :style="{'width': ((panel.sections.length == 1) ? '20' : _.get(sec,'width.firstColumn','40')) + '%'}">{{ el.label }}</p>
                                        <p class="pdfValue" :style="{'width':((panel.sections.length == 1) ? '80' : _.get(sec,'width.secondColumn','60')) + '%'}" v-html="el.value"></p>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<style>
.pdfPreview{
    border-radius: 0;
    overflow: auto;
    height: calc(100vh - 300px);
    background:rgb(220, 220, 220);
}
.pdfPreview div.pdfPage{
    background: white;
    width: 65rem;
    padding:2rem 3rem;
    margin: auto;
}
.pdfPreview .panelLabel{
    background-color: rgba(0, 0, 0, 0.1);
    padding: 0px 5px;
    margin-top: 20px;
    font-weight: bold;
}
.pdfColumn{
    flex-basis:0;
    flex-grow: 1;
}
.pdfValue,.pdfLabel{
    word-wrap: break-word;
    margin-bottom: 0px;
}
</style>
