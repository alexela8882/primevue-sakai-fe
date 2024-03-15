import{I as D,J as P,a3 as ne,B as ue,K as re,a4 as de,s as E,a as ce,r as v,a7 as a,a9 as me,E as fe,Y as ve,G as ge,c as L,o as i,j as u,e as N,d as _,w as F,F as d,k,i as t,m as S,S as pe,f as T,g as w}from"./index-73861dd0.js";import{v as _e}from"./Validate-9c4b9c6e.js";import{u as ke}from"./index-99c8d323.js";const he={class:"relative min-h-full p-3"},ye={class:"sticky bottom-0 right-0 py-2 surface-50"},Fe={class:"flex justify-content-end gap-2 px-3 py-1"},Ce={__name:"Form",props:{config:Object},setup(r){const o=r,z=D(()=>P(()=>import("./Field-670a9f71.js"),["assets/Field-670a9f71.js","assets/index-73861dd0.js","assets/index-d5e7f8f7.css","assets/Validate-9c4b9c6e.js","assets/Editor-81b206c6.js","assets/Field-30426f23.css"])),B=D(()=>P(()=>import("./FormPanel-31d22ea1.js"),["assets/FormPanel-31d22ea1.js","assets/index-73861dd0.js","assets/index-d5e7f8f7.css","assets/FormPanel-d63a1f32.css"])),O=D(()=>P(()=>import("./QuoteLineItem-d8ed9473.js"),["assets/QuoteLineItem-d8ed9473.js","assets/index-73861dd0.js","assets/index-d5e7f8f7.css"])),V=ne(),I=ke(),A=ue(),j=re(),{formatLookupOptions:Se,getPicklistFields:be,getLookupFields:xe,transformFormValues:h,transformDate:De,transformForSaving:W,getAllHiddenFieldsAndPanels:G,controllingFieldChecker:Pe,getAllDisabledFields:H,checkSetValRule:J}=de(),{fetchPicklist:Ee,fetchLookup:Ne,saveForm:K,setFormReset:q,saveFormValues:Q}=V,{getCachedFormData:U,getFormReset:M}=E(V),{getItem:b}=E(I),{fetchModuleFields:Y,fetchModulePanels:X}=A,{removeTab:Z}=j,{getModuleByName:g}=E(A),{validateForm:$,errorChecker:Ve}=_e(),ee=ce(),ae=v(a.fill(Array(10),1)),c=v(!0);v(!1);const e=v({fields:[],panels:[],values:{main:{}},lookup:{},errors:{main:{}},hidden:{fields:[],panels:[]},disabled:[],formName:o.config.name,formSaving:!1}),n=v();v([]),me("form",e),fe(async()=>{console.log("mounted",c.value);let s=U.value(o.config.name);if(n.value=a.includes(o.config.name,"edit")?"edit":"create",console.log("tmpData",s),s)e.value=a.merge(e.value,a.cloneDeep(s)),o.config.name==M.value&&(e.value.values.main=h(e.value.fields,b.value,n.value),q(""));else{a.isEmpty(g.value(o.config._module).fields)&&await Y(g.value(o.config._module).mainEntity),a.isEmpty(g.value(o.config._module).panels)&&await X(o.config._module);let m=a.cloneDeep(g.value(o.config._module));e.value.fields=m.fields,e.value.panels=m.panels,le()}c.value=!1}),ve(()=>{console.log("before unmount"),K(e.value)}),ge(()=>M.value,(s,m)=>{s==o.config.name&&(e.value.values.main=h(o.config.module.fields),q(""))});const le=()=>{let s=a.chain(e.value.fields).filter({quick:!0}).map("_id").value(),m=n.value=="create"?null:b.value,p=h(e.value.fields,m,n.value),y=J(e.value.fields,p,g.value(o.config._module).mainEntity);e.value.values.main=a.merge(a.cloneDeep(p),a.cloneDeep(y)),e.value.hidden=G(e.value.panels,e.value.fields,e.value.values.main,n.value),e.value.disabled=H(e.value.fields,e.value.values.main,n.value),a.forEach(e.value.panels,function(l,f){e.value.panels[f].quick=!1,a.forEach(l.sections,function(x,R){e.value.panels[f].sections[R].quick=!1;let C=x.field_ids[0];x.field_ids.length>1&&C.concat(x.field_ids[1]),a.filter(C,function(ie){if(a.includes(s,ie))return!0}).length>0&&(e.value.panels[f].quick=!0,e.value.panels[f].sections[R].quick=!0)}),n.value=="create"&&(e.value.values[l.panelName]=[],e.value.errors[l.panelName]=[])}),console.log(c.value),console.log("done initialize")},te=()=>{c.value=!0;let s=a.includes(o.config.name,"edit")?"edit":"create";e.value.values.main=h(e.value.fields,b.value,s),c.value=!1},oe=async()=>{let s=a.get(o.config,"maximized",!1);e.value.formSaving=!0,e.value.errors.main=$(e.value.values.main,e.value.fields,s);{let m=W(e.value.values.main,e.value.fields,s);(await Q(m,o.config.base_module)).status==200&&(ee.add({severity:"success",summary:"Success Message",detail:"Record added",life:3e3}),e.value.formSaving=!1,se(o.config))}},se=async s=>{await Z(s)};return(s,m)=>{const p=L("Skeleton"),y=L("el-button");return i(),u(d,null,[N("div",he,[c.value?S("",!0):(i(),_(pe,{key:0},{fallback:F(()=>[(i(!0),u(d,null,k(ae.value,(l,f)=>(i(),_(p,{key:f,height:"2rem",class:"mb-2",borderRadius:"16px"}))),128))]),default:F(()=>[t(a).filter(e.value.panels,{quick:!0}).length==1&&t(a).get(r.config,"maximized",!1)==!1?(i(!0),u(d,{key:0},k(t(a).filter(e.value.fields,{quick:!0}),l=>(i(),u(d,{key:l._id},[t(a).includes(e.value.hidden.fields,l._id)?S("",!0):(i(),_(t(z),{key:0,keyName:"main",config:l,module:r.config._module,formPage:n.value},null,8,["config","module","formPage"]))],64))),128)):(i(),u(d,{key:1},[(i(!0),u(d,null,k(t(a).filter(e.value.panels,function(l){if(!t(a).includes(e.value.hidden.panels,l.panelName)&&t(a).endsWith(l.controllerMethod,"@index")&&(t(a).get(r.config,"maximized",!1)==!1&&l.quick||t(a).get(r.config,"maximized",!1)==!0))return!0}),l=>(i(),_(t(B),{key:l._id,panel:l,quickAdd:!t(a).get(r.config,"maximized",!1),module:r.config._module,formPage:n.value},null,8,["panel","quickAdd","module","formPage"]))),128)),(i(!0),u(d,null,k(t(a).filter(e.value.panels,function(l){if(!t(a).includes(e.value.hidden.panels,l.panelName)&&t(a).endsWith(l.controllerMethod,"@show")&&t(a).get(r.config,"maximized",!1)==!0)return!0}),l=>(i(),u(d,{key:l._id},[t(a).includes(["SalesOpptItem"],l.entityName)?(i(!0),u(d,{key:0},k(l.sections,f=>(i(),u("div",{key:f._id,class:"flex flex-column px-1 py-2 mt-2"},[l.entityName=="SalesOpptItem"?(i(),_(t(O),{key:0,panel:l,module:r.config._module,formPage:n.value},null,8,["panel","module","formPage"])):S("",!0)]))),128)):S("",!0)],64))),128))],64))]),_:1}))]),N("div",ye,[N("div",Fe,[T(y,{onClick:te,disabled:c.value||e.value.formSaving},{default:F(()=>[w("Reset")]),_:1},8,["disabled"]),T(y,{type:"primary",onClick:oe,disabled:c.value||e.value.formSaving,loading:e.value.formSaving},{default:F(()=>[w("Save")]),_:1},8,["disabled","loading"])])])],64)}}};export{Ce as default};