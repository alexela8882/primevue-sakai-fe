import{D as S,s as v,b as O,r as c,x as D,z as M,q as h,o as T,j as E,e as t,n as I,i as w,f as A,E as L,G as $}from"./index-c9a8d9f5.js";import{u as N}from"./branch-fcfc82ac.js";import{D as U}from"./DataTable-75a84734.js";const k=l=>(L("data-v-770e5cfc"),l=l(),$(),l),z={class:"flex flex-column gap-3 mb-5 mt-5"},C={class:"flex justify-content-between"},F={class:"flex flex-column"},G=k(()=>t("div",null,null,-1)),P={__name:"index",setup(l){const r=N();v(r);const{setBranches:b}=r,d=O(),{popUpModalOpen:u,formModalOpen:i,formModalTrigger:p,popUpModalTrigger:f}=v(d),{popUpModalDataFill:y,formModalDataFill:m}=d,o=c(!1),{isDarkTheme:x}=D(),s=c([]),_=c({}),g=()=>{let e={store:{name:"branchStore",action:"addBranch"},api:{uri:"branches/store",method:"POST"},fields:[{label:"Name",name:"name",type:"text",value:null},{label:"Address",name:"address",type:"text",value:null},{label:"Country",name:"country_id",type:"select",value:null,items:s.value}]},a={title:"Add Branch",type:"primary",data:Object.assign({},e)};m(a),i.value=!0,p.value=!0},B=e=>{let a={store:{name:"branchStore",action:"updateBranch"},api:{uri:`branches/${e._id}/update`,method:"PUT"},fields:[{label:"Name",name:"name",type:"text",value:e.name},{label:"Address",name:"address",type:"text",value:e.address},{label:"Country",name:"country_id",type:"select",value:e.country_id,items:s.value}]},n={title:`Edit "${e.name}" Branch`,type:"primary",data:Object.assign({},a)};m(n),i.value=!0,p.value=!0},j=e=>{console.log(e);let a={store:{name:"branchStore",action:"deleteBranch"},api:{uri:`branches/${e._id}/delete`,method:"DELETE"}};const n={title:`Are you sure you want to delete branch: "${e.name}"?`,type:"danger",data:Object.assign({},a)};y(n),u.value=!0,f.value=!0,console.log(u.value)};return M(async()=>{o.value=!0,await h.get("/branches").then(e=>{b(e.data.table),_.value=e.data,o.value=!1,console.log(e.data)}),await h.get("/countries").then(e=>{s.value=e.data,o.value=!1})}),(e,a)=>(T(),E("div",z,[t("div",null,[t("div",C,[t("div",F,[t("span",{class:I(["capitalize text-xl font-bold",`${w(x)?"text-surface-50":"text-blue-800"}`])},"Manage branch",2)]),G])]),A(U,{onAddItem:g,onEditItem:B,onDeleteItem:j,localLoading:o.value,data:_.value},null,8,["localLoading","data"])]))}},H=S(P,[["__scopeId","data-v-770e5cfc"]]);export{H as default};
