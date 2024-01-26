import{C as be,_ as ge,r,v as ye,s as O,A as $,z as xe,c as V,o as s,j as d,e as t,f as m,w,t as c,i as n,m as _,F as I,k as q,Z as Me,n as Ve,d as T,S as G,a5 as we}from"./index-c7a3728c.js";import{u as he,a as E,c as H}from"./index.esm-0ed2c770.js";import{u as ke,T as J}from"./index-ed632c8b.js";import{u as Ce}from"./index-1f251677.js";const Ne={class:"flex flex-column gap-3 m-4"},Ie={class:"flex align-items-center"},qe=t("label",{class:"ml-2"},"Choose existing",-1),Ee={class:"flex align-items-center"},Se={key:0},Fe={class:"flex flex-column gap-3 m-4"},De={class:"flex align-items-center"},Be=t("label",{class:"ml-2"},"Create new",-1),je=t("h3",null,"Quick add",-1),Oe=t("div",{class:"text-l text-700 font-bold bg-primary-50 p-2 mb-4"},"All required fields",-1),$e={class:"grid"},Te={class:"p-float-label"},Re={key:0,class:"text-red-600"},Le=t("h3",null,"Detailed add",-1),Ue={key:0},ze={class:"text-l text-700 font-bold bg-primary-50 p-2"},Ae={class:"flex flex-column mt-4"},Pe={key:0},Qe={key:1},Ze={class:"p-2 border-top-1 border-200"},Ge={class:"flex align-items-center justify-content-end my-2 gap-2"},ol={__name:"ConvertMailboxMessage",props:{convertModule:Object,mailboxMessage:Object},emits:["update-timeout"],setup(K,{emit:W}){const p=K,R=be(()=>ge(()=>import("./SectionFields-d6b517e4.js"),["assets/SectionFields-d6b517e4.js","assets/index-c7a3728c.js","assets/index-d1288d3d.css","assets/index-ed632c8b.js"]));r({test:"initial value"}),r();const h=r({}),b=r({}),L=r(!0),U=r([]),S=r([]),X=r(0),g=r([]),u=r(null),v=r(),{values:He,errors:y,setErrors:Je,setFieldError:Y,ErrorBag:Ke,defineComponentBinds:F,isSubmitting:ee,setFieldValue:le,handleSubmit:te,meta:k}=he({});F("field0"),r({field_1:F("test_fields.field_1")});const z=ye(),oe=ke(),ae=Ce(),{getEntityByName:A,getFieldDetailsByUname:ne,getCollection:se,getModule:ie,convertMailboxLoading:D}=O(z),{getItemPanels:de,getRelatedListsByCname:We}=O(oe),{getMailFolderMessages:ue}=O(ae),{fetchModule:re,convertMailboxToInquiry:ce,insertModuleFromMailbox:me}=z,P=async()=>{D.value=!1,await re(p.convertModule.name),g.value=ie.value.fields,g.value.map(e=>Object.assign(e,{...e,data:{value:null}}));const l={};g.value.map(e=>{if(e.rules&&e.rules.required){l[e.uniqueName]=E().label(e.label).required();let a=Object.assign({},{[e.uniqueName]:E().label(e.label).required()});console.log(a)}else l[e.uniqueName]=E().label(e.label).nullable();b.value[e.uniqueName]=F(`${e.uniqueName}`),le(`${e.uniqueName}`,null)}),h.value=l,h.value=H(l),console.log(h.value),S.value=g.value.filter(e=>e.rules&&e.rules.required),X.value=S.value.length,H().shape({field_1:E().label("Field 1").required()}),U.value=de.value.filter(e=>e.controllerMethod.includes("@index")),setTimeout(()=>{L.value=!1,W("update-timeout")},100)},ve=async()=>{v.value==1?Q(null):_e()},Q=l=>{let e=null;l!==null?e=l:e=u.value;const a=A.value(p.convertModule.name);let i=null;i=Object.assign({},{source_id:"Email",dateRequested:Date.now(),dateResponded:Date.now(),dateResponded:Date.now(),assigned_to_id:e.owner_id,description:`This is a test - ${Date.now()}`,type:a.mainEntity,link_id:e._id,email_id:p.mailboxMessage.id,conversation_id:p.mailboxMessage.conversationId}),pe(i)},_e=async()=>{const l=await C();if(l.inner)console.log(moduleRes);else{let a={_id:Date.now()};Object.keys(l).forEach(M=>{if(l[M]!==null){const N=ne.value(M).name,o=l[M];a[N]=o}}),a.owner_id={_id:"5bb104ed678f71061f6451f8",firstName:"Ninoy",lastName:"Cahayon",email:"ninoy.cahayon@escolifesciences.com"};const i={module:p.convertModule,data:a},x=await me(i);x&&x.status===200&&Q(i.data)}},C=te((l,e)=>{Object.keys(b.value).forEach((a,i)=>{b.value[a].modelValue!==null&&Y(a,null)});try{return h.value.validateSync(l,{abortEarly:!1}),l}catch(a){return a.inner.map(i=>{i.path+"",i.message,e.setFieldError(i.path,i.message)}),a}}),pe=async l=>{const e=await ce(l);e&&e.status===200&&ue.value.value.find(a=>{if(a.id===l.email_id){let i={...a,convertedToInquiry:!0};Object.assign(a,i)}})};return $(()=>v.value,(l,e)=>{l==2&&(u.value=null)}),$(()=>u.value,(l,e)=>{l&&(v.value=1)}),$(()=>p.convertModule,(l,e)=>{console.log(l),P()}),xe(()=>{P(),console.log(A.value(p.convertModule.name))}),(l,e)=>{const a=V("RadioButton"),i=V("Dropdown"),x=V("Divider"),M=V("InputText"),N=V("Button");return s(),d("div",null,[t("div",Ne,[t("div",Ie,[m(a,{modelValue:v.value,"onUpdate:modelValue":e[0]||(e[0]=o=>v.value=o),inputId:"ingredient1",name:"1",value:1,disabled:""},null,8,["modelValue"]),qe]),m(i,{modelValue:u.value,"onUpdate:modelValue":e[1]||(e[1]=o=>u.value=o),options:n(se).data,optionLabel:"owner_id.email",optionvalue:"_id",filter:"",placeholder:"Select",class:"w-full"},{option:w(o=>[t("div",Ee,[t("div",null,c(o.option.owner_id.email)+" ("+c(o.option.company)+")",1)])]),_:1},8,["modelValue","options"]),u.value?(s(),d("div",Se,[t("div",null,c(u.value.firstName)+" "+c(u.value.lastName),1),t("div",null," Owner: "+c(u.value.owner_id.firstName)+" "+c(u.value.owner_id.lastName),1),t("div",null,"Company: "+c(u.value.company),1),t("div",null,"Status: "+c(u.value.status_id),1),t("div",null,"Country: "+c(u.value.country_id.name),1)])):_("",!0)]),m(x),t("div",Fe,[t("div",De,[m(a,{modelValue:v.value,"onUpdate:modelValue":e[2]||(e[2]=o=>v.value=o),name:"2",value:2},null,8,["modelValue"]),Be]),t("div",null,[je,Oe,t("div",$e,[(s(!0),d(I,null,q(S.value,(o,B)=>(s(),d("div",{key:B,class:"col-6"},[t("span",Te,[m(M,Me({"onUpdate:modelValue":e[3]||(e[3]=f=>n(C)())},b.value[o.uniqueName],{class:["w-full border-left-3",`${!n(y)[o.uniqueName]&&n(k).touched?"border-green-600":"border-red-600"}`]}),null,16,["class"]),t("label",null,c(o.label),1)]),n(y)[o.uniqueName]?(s(),d("small",Re,c(n(y)[o.uniqueName]),1)):_("",!0)]))),128))]),Le,(s(!0),d(I,null,q(U.value,(o,B)=>(s(),d("div",{key:B,class:"flex flex-column gap-1"},[(s(!0),d(I,null,q(o.sections,(f,Z)=>(s(),d("div",{key:Z,class:Ve(`${Z!==0&&"mt-4"}`)},[t("div",null,[t("div",null,[f.sectionLabel?(s(),d("div",Ue,[t("div",ze,c(f.sectionLabel),1)])):_("",!0)]),t("div",Ae,[o.controllerMethod.indexOf("@index")>-1?(s(),d("div",Pe,[f.field_ids.length>0?(s(),T(G,{key:0},{fallback:w(()=>[m(J)]),default:w(()=>[m(n(R),{mode:"edit",source:"Email",fieldIds:f.field_ids,newModuleFields:g.value,moduleValidationInputs:b.value,moduleValidationErrors:n(y),moduleValidationMeta:n(k),onValidateSyncFunc:e[4]||(e[4]=j=>n(C)())},null,8,["fieldIds","newModuleFields","moduleValidationInputs","moduleValidationErrors","moduleValidationMeta"])]),_:2},1024)):_("",!0),f.additional_fields.length>0?(s(),d("div",Qe,[(s(!0),d(I,null,q(f.additional_fields,(j,fe)=>(s(),d("div",{key:fe},[j.ids.length>0?(s(),T(G,{key:0},{fallback:w(()=>[m(J)]),default:w(()=>[m(n(R),{mode:"edit",source:"Email",fieldIds:j.ids,newModuleFields:g.value,moduleValidationInputs:b.value,moduleValidationErrors:n(y),moduleValidationMeta:n(k),onValidateSyncFunc:e[5]||(e[5]=Xe=>n(C)())},null,8,["fieldIds","newModuleFields","moduleValidationInputs","moduleValidationErrors","moduleValidationMeta"])]),_:2},1024)):_("",!0)]))),128))])):_("",!0)])):_("",!0)])])],2))),128))]))),128))])]),L.value?_("",!0):(s(),T(we,{key:0,to:".mailbox-dialog-footer"},[t("div",Ze,[t("div",Ge,[m(N,{onClick:e[6]||(e[6]=o=>l.$emit("trigger-dialog")),disabled:n(D),outlined:"",label:"Cancel",class:"border-round-3xl py-2 px-4 border-color-primary",size:"small"},null,8,["disabled"]),m(N,{onClick:e[7]||(e[7]=o=>ve()),disabled:!v.value||v.value==2&&!n(k).valid,loading:n(D)||n(ee),label:"Proceed",class:"border-round-3xl py-2 px-4"},null,8,["disabled","loading"])])])]))])}}};export{ol as default};
