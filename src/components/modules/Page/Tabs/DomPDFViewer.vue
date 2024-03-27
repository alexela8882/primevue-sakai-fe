<script setup>
import { onMounted, onUnmounted, ref, computed, inject,defineAsyncComponent, watch  } from "vue";
import { storeToRefs } from 'pinia'
import _ from 'lodash';

const emit = defineEmits(['mounted'])

const props = defineProps({
    selectedTemplate: Object,
    pageContent: Object,
    pages: Array,
    numberofPages: Number
})

const vietHanoi = computed(() => '/images/letterhead/Esco Vietnam - Hanoi header.png')
const escoQuotation = computed(() => '/images/letterhead/esco-quotation-template-header-01-01.png')
const escoMedical = computed(() => '/images/letterhead/esco-medical-letterhead.jpg')
const panelStyle = ref({'headerPanel':'background:white;position:relative;padding-bottom:15px','bodyPanel':'overflow:hidden;position:relative;background:white','footerPanel':'padding-top:15px;position:relative;background:white'})
onMounted(()=>{


})

const getSectionStyle = (section,page) =>{
    let style = ''
    console.log(page)
    if(section=='headerPanel'){
        style = "background:white;position:relative;"
    }

    if(section=='bodyPanel'){
        style='overflow:hidden;position:relative'
        if(_.has(page,'height')){
            style += ";height"+page.height
        }
        if(_.has(page,'margin')){
            style += ";margin-top"+page.margin
        }
    }

    if(section=='footerPanel'){
        style='margin-top:15px'
    }

    return style
}

const loadImage = () =>{
    if(!_.has(props.pages,'0.height')){
        emit('mounted')
    }
}
</script>
<template>
    <!-- <div id="pdfContent" class="flex-none shrink-0">
        <div  style="height:1305px;overflow:hidden"  class="pdfPage shadow-2" >
            <template v-for="(pageSection,pageSectionKey) in pageContent" :key="pageSectionKey">
                <div :class="pageSectionKey" :id="pageSectionKey" >
                    <div v-for="(panel,panelIndex) in pageSection" :key="'panel_' + panelIndex">
                        <div v-if="pageSectionKey=='headerPanel' && panelIndex==0" class='pdf-panel' style="width:100%">
                            <img v-if="_.includes(selectedTemplate,'Sanjay') || _.includes(selectedTemplate,'Stasys Polimaitis') || _.includes(selectedTemplate,'Ludek Homola') || _.includes(selectedTemplate,'Ana Sousa Lopes') || _.includes(selectedTemplate,'Morten Kristensen') ||  _.includes(selectedTemplate,'Jesper') || _.includes(selectedTemplate,'Makky') || selectedTemplate=='ETI-Medical Quote'" :src="escoMedical" style="width: 100%; display: block;" @load="loadImage"/>
                            <img v-else-if="_.includes(selectedTemplate,'Vietnam - Hanoi') || _.includes(selectedTemplate,'Vietnam -  Hanoi Service Quote')" :src="vietHanoi" style="width: 98%; display: block; margin:0px;" @load="loadImage"/>
                            <img v-else-if="!_.includes(selectedTemplate,'Pradana Indah Cemerlang') && !_.includes(selectedTemplate,'Esco Farma Lab')" :src="escoQuotation" style="width: 100%; display: block;" @load="loadImage"/>
                        </div>
                        <div class="panelLabel" style="background-color: #dfdede;padding: 3px 5px;margin-top: 20px; font-weight:bold; font-family:sans-serif;" v-if="panel.label">{{ panel.label }}</div>
                        <div class="flex flex-wrap m-2">
                            <div class="pdfColumn" style="flex-basis:0; flex-grow: 1;" v-for="(sec,secIndex) in panel.sections" :key="'sec_' + secIndex">
                                <div class="flex flex-column w-full" :style="{'text-align' : _.get(sec,'alignment','left')}">
                                    <template v-for="(el,elIndex) in sec.elements" :key="'el' + elIndex">
                                        <template v-if="el.elemType=='label'">
                                            <p :style="el.style">{{ el.value }}</p>
                                        </template>
                                        <template v-else-if="el.elemType=='richTextbox'">
                                            <div v-html="el.value"></div>
                                        </template>
                                        <template v-else-if="el.elemType=='mutable'">
                                            <table class="mutableTable" style="border-spacing: 0; border-collapse: collapse; font-size:11px;">
                                                <thead>
                                                    <tr>
                                                        <th style="background-color: #00467f; color: #fff; border:1px solid; text-align: center; padding:2px; vertical-align: middle; margin:0; word-wrap: break-word;">Item No</th>
                                                        <th v-for="field in el.fields" :key="field.field" style="background-color: #00467f; color: #fff; border:1px solid; text-align: center; padding:2px; vertical-align: middle; margin:0; word-wrap: break-word;" :style="{'width': field.width + '%'}">{{ field.label }}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(item,itemIndex) in el.values" :key="itemIndex" :class="{ 'odd' : itemIndex % 2 == 1 }" :style="(itemIndex % 2 == 1) ? 'background-color: rgba(0, 0, 0, 0.1);' : ''">
                                                        <td style="text-align:center word-wrap: break-word; hyphens: auto; border-right: 1px solid rgba(0, 0, 0, 0.30); padding: 0 5px;">{{ itemIndex+1 }}</td>
                                                        <td v-for="field in el.fields" :key="field.field" style="word-wrap: break-word; hyphens: auto; border-right: 1px solid rgba(0, 0, 0, 0.30); padding: 0 5px;" :style="{'text-align':((_.includes(['percentage','number'],field.field.field_type.name)) ? 'center': ((_.includes(['formula','rollUpSummary','currency'],field.field.field_type.name)) ? 'right' : 'left'))}"><div v-html="item[field.displayFieldName]"></div></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </template>
                                        <div class="flex flex-row" v-else>
                                            <p class="pdfLabel" style="word-wrap: break-word; margin-bottom: 0px;" :style="{'width': ((panel.sections.length == 1) ? ((_.get(sec,'width.firstColumn','40')==40) ? '20' : _.get(sec,'width.firstColumn','40')) : _.get(sec,'width.firstColumn','40')) + '%'}">{{ el.label }}</p>
                                            <p class="pdfValue" style="word-wrap: break-word; margin-bottom: 0px;" :style="{'width':((panel.sections.length == 1) ? ((_.get(sec,'width.secondColumn','60')==60) ? '80' : _.get(sec,'width.secondColumn','60') ) : _.get(sec,'width.secondColumn','60')) + '%'}" v-html="el.value"></p>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="page-break"></div>
                    </div>
                </div>
            </template>
        </div>
    </div> -->
    <div id="pdfContent" class="flex-none shrink-0">
        <!-- <div v-for="(p,i) in pages" :key="i" style="height:1125px;overflow:hidden" :style="{'z-index':pages.length - p.page}" class="pdfPage shadow-2" > -->
        <div v-for="(p,i) in pages" :key="i" class="pdfPage shadow-2" >
            <template v-for="(pageSection,pageSectionKey) in pageContent" :key="pageSectionKey">
                <div :class="pageSectionKey" :id="(p.page==1) ? pageSectionKey : ''" :style="((pageSectionKey=='bodyPanel') ? panelStyle[pageSectionKey] + ';height:' + p.height+ ';margin-top:' + p.margin + ';z-index:1' + (pages.length - p.page) : ((pageSectionKey=='headerPanel') ? panelStyle[pageSectionKey] + ';z-index:2' + (pages.length - p.page) : panelStyle[pageSectionKey] + ';z-index:3' + (pages.length - p.page)))">
                    <div v-for="(panel,panelIndex) in pageSection" :key="'panel_' + panelIndex">
                        <div v-if="pageSectionKey=='headerPanel' && panelIndex==0" class='pdf-panel' style="width:100%">
                            <img v-if="_.includes(selectedTemplate,'Sanjay') || _.includes(selectedTemplate,'Stasys Polimaitis') || _.includes(selectedTemplate,'Ludek Homola') || _.includes(selectedTemplate,'Ana Sousa Lopes') || _.includes(selectedTemplate,'Morten Kristensen') ||  _.includes(selectedTemplate,'Jesper') || _.includes(selectedTemplate,'Makky') || selectedTemplate=='ETI-Medical Quote'" :src="escoMedical" style="width: 100%; display: block;" @load="loadImage"/>
                            <img v-else-if="_.includes(selectedTemplate,'Vietnam - Hanoi') || _.includes(selectedTemplate,'Vietnam -  Hanoi Service Quote')" :src="vietHanoi" style="width: 98%; display: block; margin:0px;" @load="loadImage"/>
                            <img v-else-if="!_.includes(selectedTemplate,'Pradana Indah Cemerlang') && !_.includes(selectedTemplate,'Esco Farma Lab')" :src="escoQuotation" style="width: 100%; display: block;" @load="loadImage"/>
                        </div>
                        <div class="panelLabel" style="background-color: #dfdede;padding: 3px 5px;margin-top: 20px; font-weight:bold; font-family:sans-serif;" v-if="panel.label">{{ panel.label }}</div>
                        <div class="flex flex-wrap m-2">
                            <div class="pdfColumn" style="flex-basis:0; flex-grow: 1;" v-for="(sec,secIndex) in panel.sections" :key="'sec_' + secIndex">
                                <div class="flex flex-column w-full" :style="{'text-align' : _.get(sec,'alignment','left')}">
                                    <template v-for="(el,elIndex) in sec.elements" :key="'el' + elIndex">
                                        <template v-if="el.elemType=='label'">
                                            <p :style="el.style">{{ el.value }}</p>
                                        </template>
                                        <template v-else-if="el.elemType=='richTextbox'">
                                            <div v-html="el.value"></div>
                                        </template>
                                        <template v-else-if="el.elemType=='mutable'">
                                            <table class="mutableTable" style="border-spacing: 0; border-collapse: collapse; font-size:11px;">
                                                <thead>
                                                    <tr>
                                                        <th style="background-color: #00467f; color: #fff; border:1px solid; text-align: center; padding:2px; vertical-align: middle; margin:0; word-wrap: break-word;">Item No</th>
                                                        <th v-for="field in el.fields" :key="field.field" style="background-color: #00467f; color: #fff; border:1px solid; text-align: center; padding:2px; vertical-align: middle; margin:0; word-wrap: break-word;" :style="{'width': field.width + '%'}">{{ field.label }}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(item,itemIndex) in el.values" :key="itemIndex" :class="{ 'odd' : itemIndex % 2 == 1 }" :style="(itemIndex % 2 == 1) ? 'background-color: rgba(0, 0, 0, 0.1);' : ''">
                                                        <td style="text-align:center word-wrap: break-word; hyphens: auto; border-right: 1px solid rgba(0, 0, 0, 0.30); padding: 0 5px;">{{ itemIndex+1 }}</td>
                                                        <td v-for="field in el.fields" :key="field.field" style="word-wrap: break-word; hyphens: auto; border-right: 1px solid rgba(0, 0, 0, 0.30); padding: 0 5px;" :style="{'text-align':((_.includes(['percentage','number'],field.field.field_type.name)) ? 'center': ((_.includes(['formula','rollUpSummary','currency'],field.field.field_type.name)) ? 'right' : 'left'))}"><div v-html="item[field.displayFieldName]"></div></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </template>
                                        <div class="flex flex-row" v-else>
                                            <p class="pdfLabel" style="word-wrap: break-word; margin-bottom: 0px;" :style="{'width': ((panel.sections.length == 1) ? ((_.get(sec,'width.firstColumn','40')==40) ? '20' : _.get(sec,'width.firstColumn','40')) : _.get(sec,'width.firstColumn','40')) + '%'}">{{ el.label }}</p>
                                            <p class="pdfValue" style="word-wrap: break-word; margin-bottom: 0px;" :style="{'width':((panel.sections.length == 1) ? ((_.get(sec,'width.secondColumn','60')==60) ? '80' : _.get(sec,'width.secondColumn','60') ) : _.get(sec,'width.secondColumn','60')) + '%'}" v-html="el.value"></p>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <div class="page-break"></div>
                    </div>
                    <p class="pageNo" v-if="pageSectionKey=='footerPanel'">{{ p.page }}</p>
                </div>
            </template>
        </div>
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
    /* padding:2rem 3rem; */
    padding:0px 60px;
    margin: auto;
    overflow: hidden;
    margin-top:15px;
    border-top:40px solid white;
    border-bottom:40px solid white;
    /* padding-top: 0px !important; */
}
.pdfPreview div.pdfPage .headerPanel{
    background: white;
    position:relative;
}
.pdfPreview .panelLabel{
    background-color: #dfdede;
    padding: 3px 5px;
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
.pdfPreview .mutableTable{
    border-spacing: 0;
    border-collapse: collapse;
    font-size:11px;
}
.pdfPreview .mutableTable th{
    background-color: #00467f;
    color: #fff;
    border:1px solid;
    text-align: center;
    padding:2px;
    vertical-align: middle;
    margin:0;
    word-wrap: break-word;
}
.pdfPreview .mutableTable td{
    word-wrap: break-word;
    hyphens: auto;
    border-right: 1px solid rgba(0, 0, 0, 0.30);
    padding: 0 5px;
}
.pdfPreview .mutableTable .odd{
    background-color: rgba(0, 0, 0, 0.1);
}
</style>
