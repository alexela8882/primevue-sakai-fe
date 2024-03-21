import{U as se,r as b,B as ie,a4 as ue,s as S,E as ne,G as re,c as m,o,d as p,w as M,g as ve,e as d,t as n,j as i,F as U,k as I,f as u,h as fe,i as g,m as V,a1 as P,I as ce,J as me,a2 as k}from"./index-dd487e2b.js";const pe={class:"relative flex flex-column gap-4 text-600"},ye=d("div",null,"Filter by",-1),be={class:"text-lg text-800"},_e=["onClick"],ge={class:"flex justify-content-between align-items-center"},xe={class:"text-lg text-800"},ke={key:0,class:"font-italic"},we={class:"flex flex-wrap mt-2 text-xs white-space-nowrap"},Ve={key:0},Ce={key:0},Fe={key:1,class:"flex flex-wrap"},Ne={key:1},he={class:"flex justify-content-between"},Oe={class:"filter-by-owner flex flex-column p-3 text-600 gap-3"},Me=d("div",{class:"text-xl text-color-secondary"},"Filter by",-1),je={class:"flex flex-column gap-3"},Be={class:"flex align-items-center"},Te=["for"],Ae={class:"flex align-items-center"},Le=["for"],De={class:"flex align-items-center justify-content-end"},qe={class:"filter-by-owner flex flex-column p-3 text-600 gap-3"},$e={class:"text-xl font-bold text-color-secondary"},Se={class:"flex flex-column gap-3"},Ue={key:0},Ie={for:"isBool",class:"ml-2"},Pe={key:2},Ee=d("label",{for:"isNull",class:"ml-2"}," Is Null ",-1),ze={class:"flex justify-content-end gap-2"},Re={class:"sticky top-0"},Je={__name:"ListViewFilterContent",props:{baseModule:Object,module:Object},emits:["apply-filters"],setup(r,{emit:E}){const z=ce(()=>me(()=>import("./LookupField-b20be82c.js"),["assets/LookupField-b20be82c.js","assets/index-dd487e2b.js","assets/index-40ff91a8.css","assets/LookupField-c7c583d6.css"])),v=r,R=E,G=se(),C=b(!1),f=b(!1),j=b(!1),x=b(!1),y=b(!1),F=b(v.module.viewFilters.find(t=>t.isDefault)),e=b({queryType:null,mode:"edit",queryType:F.value.queryType,filters:F.value.filters,data:{mode:"new",uuid:null,field:null,operator:null,value:null,isNull:!1},default:{uuid:null,field:null,operator:null,value:null,isNull:!1}}),B=ie(),T=ue(),{_getFieldDetailsById:N}=S(B),{addViewFilter:h}=B,{getPicklist:c}=S(T),{fetchPicklist:J}=T,H=(t,l)=>{G.require({message:"Are you sure you want to proceed?",header:"Confirmation",icon:"pi pi-exclamation-triangle",rejectClass:"p-button-secondary p-button-outlined",rejectLabel:"Cancel",acceptLabel:"Proceed",accept:()=>{K(l)},reject:()=>{console.log("Cancel deletion")}})},K=async t=>{const l=Object.assign({},{mode:"delete",baseModule:v.baseModule,viewFilter:v.module.viewFilters.find(s=>s.isDefault)._id,type:"filters",data:{mode:"delete",filters:[t.uuid]}});await h(l)},Q=()=>{e.value.data=Object.assign({},e.value.default),e.value.data.mode="new",x.value=!1,y.value=!0},W=(t,l)=>{let s=N.value({fields:v.module.fields,_id:t.field._id}),_=N.value({fields:c.value&&c.value.filter_operators.values,_id:t.operator._id});Object.assign(e.value.data,{uuid:t.uuid,field:s,operator:_,value:s.field_type.name=="picklist"&&k.isArray(t.values)?k.map(t.values,"_id"):t.values,isNull:t.isNull}),e.value.data.mode="edit",x.value=!1,y.value=!0},A=async()=>{f.value=!0;let t=Object.assign({},{uuid:e.value.data.uuid,field_id:e.value.data.field._id,operator_id:e.value.data.operator._id,values:k.isArray(e.value.data.value)&&k.has(e.value.data.value,"0._id")?k.map(e.value.data.value,"_id"):e.value.data.value,isNull:e.value.data.isNull});const l=Object.assign({},{mode:e.value.mode,baseModule:v.baseModule,viewFilter:v.module.viewFilters.find(_=>_.isDefault)._id,type:"filters",data:{mode:e.value.data.mode,queryType:e.value.queryType,filters:t}}),s=await h(l);s&&s.status===200&&(l.data.mode==="new"?X(s.data.filters[0]):l.data.mode==="edit"?Y(s.data.filters[0]):l.data.mode==="delete"&&console.log("delete filters"))},X=t=>{console.log(t),e.value.filters instanceof Array||(e.value.filters=[]),e.value.filters.push(t),y.value=!y.value,f.value=!1},Y=t=>{console.log(e.value.data.field),e.value.filters.map(l=>{l.uuid===t.uuid&&Object.assign(l,t)}),f.value=!1},Z=()=>{x.value=!0,y.value=!1},O=async t=>{await J(t)},ee=t=>{e.value.data.value=null},le=async()=>{C.value=!0;const t=Object.assign({},{mode:e.value.mode,baseModule:v.baseModule,viewFilter:v.module.viewFilters.find(s=>s.isDefault)._id,type:"filters",data:{queryType:e.value.queryType}}),l=await h(t);l&&l.status===200&&R("apply-filters",F.value),C.value=!1};return ne(async()=>{Object.keys(c.value).length===0&&(j.value=!0,O("filter_operators"),j.value=!1),e.value.filters instanceof Array&&e.value.filters.length>0&&e.value.filters.map(t=>{const l=N.value({fields:v.module.fields,_id:t.field._id});O(l.listName)})}),re(()=>e.value,(t,l)=>{t.data.field&&t.data.field.field_type.name==="picklist"&&O(t.data.field.listName)},{deep:!0}),(t,l)=>{const s=m("Button"),_=m("RadioButton"),L=m("Dropdown"),D=m("Checkbox"),ae=m("Calendar"),te=m("MultiSelect"),de=m("inputText"),oe=m("Card");return o(),p(oe,{style:{overflow:"hidden"},class:""},{title:M(()=>[ve("Filters")]),content:M(()=>[d("div",null,[d("div",pe,[d("div",{onClick:Z,class:"flex flex-column gap-2 p-3 border-1 border-400 hover:border-600 hover:surface-100 border-round-md cursor-pointer"},[ye,d("div",be,n(e.value.queryType),1)]),e.value.filters instanceof Array&&e.value.filters.length>=1?(o(!0),i(U,{key:0},I(e.value.filters,(a,q)=>(o(),i("div",{onClick:w=>W(a,q),key:q,class:"flex flex-column gap-2 p-3 border-1 border-400 hover:border-600 bg-orange-100 hover:bg-orange-200 border-round-md cursor-pointer"},[d("div",ge,[d("div",null,n(a.field.label),1),d("div",null,[u(s,{onClick:fe(w=>H(w,a),["stop"]),icon:"pi pi-trash",severity:"danger",text:"",rounded:""},null,8,["onClick"])])]),d("div",xe,[g(c).filter_operators?(o(),i("div",ke,n(a.operator.label),1)):V("",!0),d("div",we,[Array.isArray(a.values)?(o(),i("div",Ve,[a.isNull?(o(),i("div",Ce," Null ")):(o(),i("div",Fe,[(o(!0),i(U,null,I(a.values,(w,$)=>(o(),i("div",{key:$},n(w.label)+n(a.values.length-1!==$?", ":""),1))),128))]))])):(o(),i("div",Ne,n(a.isNull?"Null":a.values),1))])])],8,_e))),128)):V("",!0),d("div",he,[d("a",{onClick:l[0]||(l[0]=a=>Q()),href:"javascript:void(0);"},"add filter")])])]),(o(),p(P,{to:`${x.value?".ddt-div-1":".hidden-div"}`},[d("div",Oe,[Me,d("div",je,[d("div",Be,[u(_,{modelValue:e.value.queryType,"onUpdate:modelValue":l[1]||(l[1]=a=>e.value.queryType=a),inputId:`All ${r.baseModule.name}`,value:"all"},null,8,["modelValue","inputId"]),d("label",{for:`All ${r.baseModule.name}`,class:"ml-2"},"All "+n(r.baseModule.name),9,Te)]),d("div",Ae,[u(_,{modelValue:e.value.queryType,"onUpdate:modelValue":l[2]||(l[2]=a=>e.value.queryType=a),inputId:`My ${r.baseModule.name}`,value:"owned"},null,8,["modelValue","inputId"]),d("label",{for:`My ${r.baseModule.name}`,class:"ml-2"},"My "+n(r.baseModule.name),9,Le)]),d("div",De,[u(s,{onClick:l[3]||(l[3]=a=>x.value=!1),label:"DONE",outlined:"",size:"large"})])])])],8,["to"])),(o(),p(P,{to:`${y.value?".ddt-div-1":".hidden-div"}`},[d("div",qe,[d("div",$e,n(e.value.data.mode=="new"?"Add filter":"Edit filter"),1),d("div",Se,[u(L,{modelValue:e.value.data.field,"onUpdate:modelValue":l[4]||(l[4]=a=>e.value.data.field=a),onChange:l[5]||(l[5]=a=>ee(a)),options:r.module.fields,optionLabel:"label",placeholder:"Select a field",class:"w-full",filter:""},null,8,["modelValue","options"]),u(L,{modelValue:e.value.data.operator,"onUpdate:modelValue":l[6]||(l[6]=a=>e.value.data.operator=a),options:g(c).filter_operators&&g(c).filter_operators.values,optionLabel:"label",placeholder:"Select an operator",class:"w-full"},null,8,["modelValue","options"]),e.value.data.field&&e.value.data.field.field_type.name==="boolean"?(o(),i("div",Ue,[u(D,{modelValue:e.value.data.value,"onUpdate:modelValue":l[7]||(l[7]=a=>e.value.data.value=a),binary:"",variant:"filled",inputId:"isBool",disabled:e.value.data.isNull},null,8,["modelValue","disabled"]),d("label",Ie,n(e.value.data.value instanceof Array?e.value.data.value[0]:e.value.data.value),1)])):e.value.data.field&&e.value.data.field.field_type.name==="date"?(o(),p(ae,{key:1,modelValue:e.value.data.value,"onUpdate:modelValue":l[8]||(l[8]=a=>e.value.data.value=a),disabled:e.value.data.isNull},null,8,["modelValue","disabled"])):V("",!0),e.value.data.field&&e.value.data.field.field_type.name==="lookupModel"?(o(),i("div",Pe,[u(g(z),{modelValue:e.value.data.value,"onUpdate:modelValue":l[9]||(l[9]=a=>e.value.data.value=a),field:e.value.data.field,keyName:"",formField:!1,inline:!0,module:r.module.name,optionValue:"_id",onLoad:!0,entity:e.value.data.field.entity.name},null,8,["modelValue","field","module","entity"])])):e.value.data.field&&e.value.data.field.field_type.name==="picklist"?(o(),p(te,{key:3,modelValue:e.value.data.value,"onUpdate:modelValue":l[10]||(l[10]=a=>e.value.data.value=a),options:g(c)[e.value.data.field.listName]&&g(c)[e.value.data.field.listName].values,optionLabel:"value",optionValue:"_id",placeholder:"Select",maxSelectedLabels:3,disabled:e.value.data.isNull,class:"w-full"},null,8,["modelValue","options","disabled"])):e.value.data.field&&e.value.data.field.field_type.name==="text"?(o(),p(de,{key:4,modelValue:e.value.data.value,"onUpdate:modelValue":l[11]||(l[11]=a=>e.value.data.value=a),disabled:e.value.data.isNull},null,8,["modelValue","disabled"])):V("",!0),d("div",null,[u(D,{modelValue:e.value.data.isNull,"onUpdate:modelValue":l[12]||(l[12]=a=>e.value.data.isNull=a),binary:"",variant:"filled",inputId:"isNull"},null,8,["modelValue"]),Ee])]),d("div",ze,[u(s,{onClick:l[13]||(l[13]=a=>y.value=!1),disabled:f.value,outlined:"",label:"Cancel",severity:"secondary",size:"small"},null,8,["disabled"]),e.value.data.mode==="new"?(o(),p(s,{key:0,onClick:l[14]||(l[14]=a=>A()),disabled:!e.value.data.field||!e.value.data.operator||f.value,loading:f.value,outlined:"",label:"Done",size:"small"},null,8,["disabled","loading"])):(o(),p(s,{key:1,onClick:l[15]||(l[15]=a=>A()),disabled:!e.value.data.field||!e.value.data.operator||f.value,loading:f.value,outlined:"",label:"Update",size:"small"},null,8,["disabled","loading"]))])])],8,["to"]))]),footer:M(()=>[d("div",Re,[u(s,{onClick:l[16]||(l[16]=a=>le()),loading:C.value,label:"Apply filter",size:"small"},null,8,["loading"])])]),_:1})}}};export{Je as default};
