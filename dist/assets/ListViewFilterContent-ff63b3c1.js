import{r as b,E as C,c as v,o as i,j as p,e as l,f as s,t as d,F as _,k as j,m as F,d as c,a1 as g}from"./index-11690040.js";const A=l("div",{class:"p-3"},[l("div",{class:"text-3xl text-color-secondary"},"Filters")],-1),U={class:"flex flex-column gap-4 p-3 text-600 cursor-pointer"},I=l("div",null,"Filter by Owner",-1),D={class:"text-lg text-800"},z=["onClick"],E={class:"text-lg text-800"},L={class:"flex justify-content-between"},N={class:"filter-by-owner flex flex-column p-3 text-600 gap-3"},S=l("div",{class:"text-xl text-color-secondary"},"Filter by Owner",-1),T={class:"flex flex-column gap-3"},R={class:"flex align-items-center"},q=["for"],G={class:"flex align-items-center"},H=["for"],J={class:"flex align-items-center"},K=["for"],P={class:"flex align-items-center justify-content-end"},Q={class:"filter-by-owner flex flex-column p-3 text-600 gap-3"},W={class:"text-xl text-color-secondary"},X={class:"flex flex-column gap-3"},Y={class:"flex justify-content-end gap-2"},le={__name:"ListViewFilterContent",props:{baseModule:Object,module:Object},setup(o){const M=o,u=b(!1),n=b(!1),e=b({name:null,filters:[],fields:{mode:"new",field:null,operator:null,value:null},default:{field:null,operator:null,value:null}}),w=()=>{e.value.fields=Object.assign({},e.value.default),e.value.fields.mode="new",u.value=!1,n.value=!0},V=(r,a)=>{e.value.fields=Object.assign({},r),e.value.fields.index=a,e.value.fields.mode="edit",u.value=!1,n.value=!0},O=()=>{n.value=!n.value,e.value.filters.push(e.value.fields)},k=r=>{n.value=!n.value,e.value.filters[r.index]=Object.assign({},r)},$=()=>{u.value=!0,n.value=!1};return C(()=>{e.value.name=`All ${M.baseModule.name}`}),(r,a)=>{const h=v("divider"),m=v("RadioButton"),f=v("Button"),x=v("Dropdown"),B=v("inputText");return i(),p("div",null,[l("div",null,[A,s(h,{class:"py-0 my-0"}),l("div",U,[l("div",{onClick:$,class:"flex flex-column gap-2 p-3 border-1 border-400 hover:border-600 hover:surface-100 border-round-md"},[I,l("div",D,d(e.value.name),1)]),e.value.filters.length>=1?(i(!0),p(_,{key:0},j(e.value.filters,(t,y)=>(i(),p("div",{onClick:Z=>V(t,y),key:y,class:"flex flex-column gap-2 p-3 border-1 border-400 hover:border-600 bg-orange-100 hover:bg-orange-200 border-round-md"},[l("div",null,d(t.field.label),1),l("div",E,d(t.operator.label)+' "'+d(t.value)+'"',1)],8,z))),128)):F("",!0),l("div",L,[l("a",{onClick:w,href:"javascript:void(0);"},"add filter"),l("a",{onClick:a[0]||(a[0]=t=>e.value.filters=[]),href:"javascript:void(0);"},"remove all")])])]),(i(),c(g,{to:`${u.value?".ddt-div-1":".hidden-div"}`},[l("div",N,[S,l("div",T,[l("div",R,[s(m,{modelValue:e.value.name,"onUpdate:modelValue":a[1]||(a[1]=t=>e.value.name=t),inputId:`All ${o.baseModule.name}`,value:`All ${o.baseModule.name}`},null,8,["modelValue","inputId","value"]),l("label",{for:`All ${o.baseModule.name}`,class:"ml-2"},"All "+d(o.baseModule.name),9,q)]),l("div",G,[s(m,{modelValue:e.value.name,"onUpdate:modelValue":a[2]||(a[2]=t=>e.value.name=t),inputId:`My ${o.baseModule.name}`,value:`My ${o.baseModule.name}`},null,8,["modelValue","inputId","value"]),l("label",{for:`My ${o.baseModule.name}`,class:"ml-2"},"My "+d(o.baseModule.name),9,H)]),l("div",J,[s(m,{modelValue:e.value.name,"onUpdate:modelValue":a[3]||(a[3]=t=>e.value.name=t),inputId:`My team's ${o.baseModule.name}`,value:`My team's ${o.baseModule.name}`},null,8,["modelValue","inputId","value"]),l("label",{for:`My team's ${o.baseModule.name}`,class:"ml-2"},"My team's "+d(o.baseModule.name),9,K)]),l("div",P,[s(f,{onClick:a[4]||(a[4]=t=>u.value=!1),label:"DONE",outlined:"",size:"large"})])])])],8,["to"])),(i(),c(g,{to:`${n.value?".ddt-div-1":".hidden-div"}`},[l("div",Q,[l("div",W,d(e.value.fields.mode=="new"?"Add filter":"Edit filter"),1),l("div",X,[s(x,{modelValue:e.value.fields.field,"onUpdate:modelValue":a[5]||(a[5]=t=>e.value.fields.field=t),options:o.module.fields,optionLabel:"label",placeholder:"Select a field",class:"w-full"},null,8,["modelValue","options"]),s(x,{modelValue:e.value.fields.operator,"onUpdate:modelValue":a[6]||(a[6]=t=>e.value.fields.operator=t),options:[{label:"equals",value:"="},{label:"greater than",value:">"},{label:"less than",value:"<"},{label:"contains",value:"contains"},{label:"not contains",value:"not_contains"}],optionLabel:"label",placeholder:"Select an operator",class:"w-full"},null,8,["modelValue"]),s(B,{modelValue:e.value.fields.value,"onUpdate:modelValue":a[7]||(a[7]=t=>e.value.fields.value=t)},null,8,["modelValue"])]),l("div",Y,[s(f,{onClick:a[8]||(a[8]=t=>n.value=!1),outlined:"",label:"Cancel",severity:"secondary",size:"large"}),e.value.fields.mode==="new"?(i(),c(f,{key:0,onClick:O,disabled:!e.value.fields.field||!e.value.fields.operator||!e.value.fields.value,outlined:"",label:"Done",size:"large"},null,8,["disabled"])):(i(),c(f,{key:1,onClick:a[9]||(a[9]=t=>k(e.value.fields)),disabled:!e.value.fields.field||!e.value.fields.operator||!e.value.fields.value,outlined:"",label:"Update",size:"large"},null,8,["disabled"]))])])],8,["to"]))])}}};export{le as default};