import{r as g,B as ee,a3 as le,s as D,E as ae,G as te,c as y,o,d as b,w as C,g as de,e as d,t as f,j as c,F as L,k as A,i,m as h,a1 as U,f as m}from"./index-2f40471b.js";const ie={class:"relative flex flex-column gap-4 text-600"},se=d("div",null,"Filter by",-1),oe={class:"text-lg text-800"},ue=["onClick"],ne={class:"text-lg text-800"},re={key:0,class:"font-italic"},ve={class:"flex flex-wrap mt-2 text-xs white-space-nowrap"},fe={key:0},ce={key:1},me={key:0},pe={class:"flex justify-content-between"},ye={class:"filter-by-owner flex flex-column p-3 text-600 gap-3"},be=d("div",{class:"text-xl text-color-secondary"},"Filter by",-1),_e={class:"flex flex-column gap-3"},xe={class:"flex align-items-center"},ge=["for"],ke={class:"flex align-items-center"},we=["for"],Ve={class:"flex align-items-center justify-content-end"},Ne={class:"filter-by-owner flex flex-column p-3 text-600 gap-3"},Fe={class:"text-xl font-bold text-color-secondary"},Ce={class:"flex flex-column gap-3"},he={key:0},Oe={for:"isBool",class:"ml-2"},Me=d("label",{for:"isNull",class:"ml-2"}," Is Null ",-1),Be={class:"flex justify-content-end gap-2"},Te={class:"sticky top-0"},$e={__name:"ListViewFilterContent",props:{baseModule:Object,module:Object},emits:["apply-filters"],setup(s,{emit:I}){const _=s,V=g(!1),p=g(!1),O=g(!1),k=g(!1),x=g(!1),N=g(_.module.viewFilters.find(t=>t.isDefault)),e=g({queryType:null,mode:"edit",queryType:N.value.queryType,filters:N.value.filters,data:{mode:"new",uuid:null,field:null,operator:null,value:null,isNull:!1},default:{uuid:null,field:null,operator:null,value:null,isNull:!1}}),M=ee(),B=le(),{_getFieldDetailsById:u}=D(M),{addViewFilter:T}=M,{getPicklist:n}=D(B),{fetchPicklist:z}=B,E=()=>{e.value.data=Object.assign({},e.value.default),e.value.data.mode="new",k.value=!1,x.value=!0},P=(t,l)=>{let r=u.value({fields:_.module.fields,_id:t.field_id}),v=u.value({fields:n.value&&n.value.filter_operators.values,_id:t.operator_id});Object.assign(e.value.data,{uuid:t.uuid,field:r,operator:v,value:t.values,isNull:t.isNull}),e.value.data.mode="edit",k.value=!1,x.value=!0},j=async()=>{p.value=!0;let t=Object.assign({},{uuid:e.value.data.uuid,field_id:e.value.data.field._id,operator_id:e.value.data.operator._id,values:e.value.data.value,isNull:e.value.data.isNull});const l=Object.assign({},{mode:e.value.mode,baseModule:_.baseModule,viewFilter:_.module.viewFilters.find(v=>v.isDefault)._id,type:"filters",data:{mode:e.value.data.mode,queryType:e.value.queryType,filters:t}}),r=await T(l);r&&r.status===200&&(l.data.mode==="new"?R(r.data):G(r.data.filters[0]))},R=t=>{e.value.filters instanceof Array||(e.value.filters=[]),e.value.filters.push(t),x.value=!x.value,p.value=!1},G=t=>{e.value.filters.map(l=>{l.uuid===t.uuid&&Object.assign(l,t)}),p.value=!1},H=()=>{k.value=!0,x.value=!1},F=async t=>{await z(t)},J=t=>{e.value.data.value=null},K=async()=>{V.value=!0;const t=Object.assign({},{mode:e.value.mode,baseModule:_.baseModule,viewFilter:_.module.viewFilters.find(r=>r.isDefault)._id,type:"filters",data:{queryType:e.value.queryType}}),l=await T(t);l&&l.status===200&&I("apply-filters",N.value),V.value=!1};return ae(async()=>{Object.keys(n.value).length===0&&(O.value=!0,F("filter_operators"),O.value=!1),e.value.filters instanceof Array&&e.value.filters.length>0&&e.value.filters.map(t=>{const l=u.value({fields:_.module.fields,_id:t.field_id});F(l.listName)})}),te(()=>e.value,(t,l)=>{t.data.field&&t.data.field.field_type.name==="picklist"&&F(t.data.field.listName)},{deep:!0}),(t,l)=>{const r=y("RadioButton"),v=y("Button"),$=y("Dropdown"),q=y("Checkbox"),Q=y("Calendar"),W=y("MultiSelect"),X=y("inputText"),Y=y("Card");return o(),b(Y,{style:{overflow:"hidden"},class:""},{title:C(()=>[de("Filters")]),content:C(()=>[d("div",null,[d("div",ie,[d("div",{onClick:H,class:"flex flex-column gap-2 p-3 border-1 border-400 hover:border-600 hover:surface-100 border-round-md cursor-pointer"},[se,d("div",oe,f(e.value.queryType),1)]),e.value.filters instanceof Array&&e.value.filters.length>=1?(o(!0),c(L,{key:0},A(e.value.filters,(a,S)=>(o(),c("div",{onClick:w=>P(a,S),key:S,class:"flex flex-column gap-2 p-3 border-1 border-400 hover:border-600 bg-orange-100 hover:bg-orange-200 border-round-md cursor-pointer"},[d("div",null,f(i(u)({fields:s.module.fields,_id:a.field_id}).label),1),d("div",ne,[i(n).filter_operators?(o(),c("div",re,f(i(n).filter_operators.values.find(w=>w._id===a.operator_id).label),1)):h("",!0),d("div",ve,[a.isNull?(o(),c("div",fe," Null ")):(o(),c("div",ce,[i(u)({fields:s.module.fields,_id:a.field_id}).field_type.name==="text"||i(u)({fields:s.module.fields,_id:a.field_id}).field_type.name==="boolean"||i(u)({fields:s.module.fields,_id:a.field_id}).field_type.name==="date"?(o(),c("div",me,f(a.values),1)):i(u)({fields:s.module.fields,_id:a.field_id}).field_type.name==="picklist"||i(u)({fields:s.module.fields,_id:a.field_id}).field_type.name==="lookupModel"?(o(!0),c(L,{key:1},A(a.values,(w,Z)=>(o(),c("div",{key:Z,severity:"secondary"},[d("div",null,f(i(u)({fields:i(n)[i(u)({fields:s.module.fields,_id:a.field_id}).listName]&&i(n)[i(u)({fields:s.module.fields,_id:a.field_id}).listName].values,_id:w})&&i(u)({fields:i(n)[i(u)({fields:s.module.fields,_id:a.field_id}).listName]&&i(n)[i(u)({fields:s.module.fields,_id:a.field_id}).listName].values,_id:w}).value)+",  ",1)]))),128)):h("",!0)]))])])],8,ue))),128)):h("",!0),d("div",pe,[d("a",{onClick:l[0]||(l[0]=a=>E()),href:"javascript:void(0);"},"add filter")])])]),(o(),b(U,{to:`${k.value?".ddt-div-1":".hidden-div"}`},[d("div",ye,[be,d("div",_e,[d("div",xe,[m(r,{modelValue:e.value.queryType,"onUpdate:modelValue":l[1]||(l[1]=a=>e.value.queryType=a),inputId:`All ${s.baseModule.name}`,value:"all"},null,8,["modelValue","inputId"]),d("label",{for:`All ${s.baseModule.name}`,class:"ml-2"},"All "+f(s.baseModule.name),9,ge)]),d("div",ke,[m(r,{modelValue:e.value.queryType,"onUpdate:modelValue":l[2]||(l[2]=a=>e.value.queryType=a),inputId:`My ${s.baseModule.name}`,value:"owned"},null,8,["modelValue","inputId"]),d("label",{for:`My ${s.baseModule.name}`,class:"ml-2"},"My "+f(s.baseModule.name),9,we)]),d("div",Ve,[m(v,{onClick:l[3]||(l[3]=a=>k.value=!1),label:"DONE",outlined:"",size:"large"})])])])],8,["to"])),(o(),b(U,{to:`${x.value?".ddt-div-1":".hidden-div"}`},[d("div",Ne,[d("div",Fe,f(e.value.data.mode=="new"?"Add filter":"Edit filter"),1),d("div",Ce,[m($,{modelValue:e.value.data.field,"onUpdate:modelValue":l[4]||(l[4]=a=>e.value.data.field=a),onChange:l[5]||(l[5]=a=>J(a)),options:s.module.fields,optionLabel:"label",placeholder:"Select a field",class:"w-full",filter:""},null,8,["modelValue","options"]),m($,{modelValue:e.value.data.operator,"onUpdate:modelValue":l[6]||(l[6]=a=>e.value.data.operator=a),options:i(n).filter_operators&&i(n).filter_operators.values,optionLabel:"label",placeholder:"Select an operator",class:"w-full"},null,8,["modelValue","options"]),e.value.data.field&&e.value.data.field.field_type.name==="boolean"?(o(),c("div",he,[m(q,{modelValue:e.value.data.value,"onUpdate:modelValue":l[7]||(l[7]=a=>e.value.data.value=a),binary:"",variant:"filled",inputId:"isBool",disabled:e.value.data.isNull},null,8,["modelValue","disabled"]),d("label",Oe,f(e.value.data.value instanceof Array?e.value.data.value[0]:e.value.data.value),1)])):e.value.data.field&&e.value.data.field.field_type.name==="date"?(o(),b(Q,{key:1,modelValue:e.value.data.value,"onUpdate:modelValue":l[8]||(l[8]=a=>e.value.data.value=a),disabled:e.value.data.isNull},null,8,["modelValue","disabled"])):e.value.data.field&&(e.value.data.field.field_type.name==="lookupModel"||e.value.data.field.field_type.name==="picklist")?(o(),b(W,{key:2,modelValue:e.value.data.value,"onUpdate:modelValue":l[9]||(l[9]=a=>e.value.data.value=a),options:i(n)[e.value.data.field.listName]&&i(n)[e.value.data.field.listName].values,optionLabel:"value",optionValue:"_id",placeholder:"Select",maxSelectedLabels:3,disabled:e.value.data.isNull,class:"w-full"},null,8,["modelValue","options","disabled"])):(o(),b(X,{key:3,modelValue:e.value.data.value,"onUpdate:modelValue":l[10]||(l[10]=a=>e.value.data.value=a),disabled:e.value.data.isNull},null,8,["modelValue","disabled"])),d("div",null,[m(q,{modelValue:e.value.data.isNull,"onUpdate:modelValue":l[11]||(l[11]=a=>e.value.data.isNull=a),binary:"",variant:"filled",inputId:"isNull"},null,8,["modelValue"]),Me])]),d("div",Be,[m(v,{onClick:l[12]||(l[12]=a=>x.value=!1),disabled:p.value,outlined:"",label:"Cancel",severity:"secondary",size:"small"},null,8,["disabled"]),e.value.data.mode==="new"?(o(),b(v,{key:0,onClick:l[13]||(l[13]=a=>j()),disabled:!e.value.data.field||!e.value.data.operator||p.value,loading:p.value,outlined:"",label:"Done",size:"small"},null,8,["disabled","loading"])):(o(),b(v,{key:1,onClick:l[14]||(l[14]=a=>j()),disabled:!e.value.data.field||!e.value.data.operator||p.value,loading:p.value,outlined:"",label:"Update",size:"small"},null,8,["disabled","loading"]))])])],8,["to"]))]),footer:C(()=>[d("div",Te,[m(v,{onClick:l[15]||(l[15]=a=>K()),loading:V.value,label:"Apply filter",size:"small"},null,8,["loading"])])]),_:1})}}};export{$e as default};