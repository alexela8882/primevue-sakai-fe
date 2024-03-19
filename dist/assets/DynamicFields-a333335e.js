import{c,o as a,j as t,e as o,F as v,k,f as i,ab as u,t as s,m as d}from"./index-b43f83a8.js";const $={class:"grid"},h={key:0},E={class:"p-float-label"},g={key:0,class:"text-red-600"},I={key:1},w={class:"p-float-label"},q={key:0,class:"text-red-600"},x={key:2},U={class:"p-float-label"},j={key:0,class:"text-red-600"},B={key:3},C={class:"p-float-label"},D={key:0,class:"text-red-600"},O={key:4},F={class:"p-float-label"},L={key:0,class:"text-red-600"},T={__name:"DynamicFields",props:{fields:Array,moduleValidationInputs:Object,moduleValidationErrors:Object,moduleValidationMeta:Object,loading:Boolean},setup(l){return(r,n)=>{const y=c("InputText"),b=c("Calendar"),V=c("Dropdown");return a(),t("div",null,[o("div",$,[(a(!0),t(v,null,k(l.fields.filter(e=>!e.hide),(e,p)=>(a(),t("div",{key:p,class:"md:col-6"},[e.type==="text"?(a(),t("div",h,[o("span",E,[i(y,u(l.moduleValidationInputs[e.name],{"onUpdate:modelValue":n[0]||(n[0]=m=>r.$emit("validate-sync-func")),disabled:l.loading,class:["w-full",`${e.rules.required&&"border-left-3 border-red-600"}`]}),null,16,["disabled","class"]),o("label",null,s(e.label),1)]),l.moduleValidationErrors[e.name]?(a(),t("small",g,s(l.moduleValidationErrors[e.name]),1)):d("",!0)])):d("",!0),e.type==="date"?(a(),t("div",I,[o("span",w,[i(b,u(l.moduleValidationInputs[e.name],{"onUpdate:modelValue":n[1]||(n[1]=m=>r.$emit("validate-sync-func")),disabled:l.loading,class:"w-full",pt:{input:{class:`${e.rules.required&&"border-left-3 border-red-600"}`}}}),null,16,["disabled","pt"]),o("label",null,s(e.label),1)]),l.moduleValidationErrors[e.name]?(a(),t("small",q,s(l.moduleValidationErrors[e.name]),1)):d("",!0)])):d("",!0),e.type==="time"?(a(),t("div",x,[o("span",U,[i(b,u(l.moduleValidationInputs[e.name],{"onUpdate:modelValue":n[2]||(n[2]=m=>r.$emit("validate-sync-func")),disabled:l.loading,timeOnly:"",class:"w-full",pt:{input:{class:`${e.rules.required&&"border-left-3 border-red-600"}`}}}),null,16,["disabled","pt"]),o("label",null,s(e.label),1)]),l.moduleValidationErrors[e.name]?(a(),t("small",j,s(l.moduleValidationErrors[e.name]),1)):d("",!0)])):d("",!0),e.type==="picklist"?(a(),t("div",B,[o("span",C,[i(V,u(l.moduleValidationInputs[e.name],{"onUpdate:modelValue":n[3]||(n[3]=m=>r.$emit("validate-sync-func")),disabled:l.loading,options:e.items,optionLabel:"label",optionValue:"name",placeholder:e.label,class:["w-full",`${e.rules.required&&"border-left-3 border-red-600"}`]}),null,16,["disabled","options","placeholder","class"]),o("label",null,s(e.label),1)]),l.moduleValidationErrors[e.name]?(a(),t("small",D,s(l.moduleValidationErrors[e.name]),1)):d("",!0)])):d("",!0),e.type==="related"?(a(),t("div",O,[o("span",F,[i(V,u(l.moduleValidationInputs[e.name],{"onUpdate:modelValue":n[4]||(n[4]=m=>r.$emit("validate-sync-func")),disabled:l.loading,options:e.items,optionLabel:"label",optionValue:"name",placeholder:e.label,class:["w-full",`${e.rules.required&&"border-left-3 border-red-600"}`]}),null,16,["disabled","options","placeholder","class"]),o("label",null,s(e.label),1)]),l.moduleValidationErrors[e.name]?(a(),t("small",L,s(l.moduleValidationErrors[e.name]),1)):d("",!0)])):d("",!0)]))),128))])])}}};export{T as default};
