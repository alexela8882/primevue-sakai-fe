import{C as l,_ as i,J as u,u as d,r as _,s as c,z as m,o as p,d as f,i as L}from"./index-c9a8d9f5.js";import{u as R}from"./ShowDetail-f8c0b1f0.js";import"./DataTableLoader-8b0c1ffd.js";const B={__name:"SalesTab",setup(y){const o=l(()=>i(()=>import("./RelatedListPanel-5da2c1d3.js"),["assets/RelatedListPanel-5da2c1d3.js","assets/index-c9a8d9f5.js","assets/index-75db8d00.css","assets/ShowDetail-f8c0b1f0.js","assets/DataTableLoader-8b0c1ffd.js","assets/ShowDetail-d7da18a9.css"])),r=u();d();const t=_(),s=R(),{relatedListLoading:v,_getRelatedListsByCname:S,_getRelatedOrderedLists:a}=c(s),{fetchItemRelatedLists:n}=s;return m(async()=>{a.value.length<=0&&await n(r.params),t.value=a.value.filter(e=>e.entityName==="SalesOpportunity"||e.entityName==="SalesOpportunity")}),(e,g)=>(p(),f(L(o),{fromTab:!0,relatedLists:t.value},null,8,["relatedLists"]))}};export{B as default};
