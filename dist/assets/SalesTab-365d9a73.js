import{C as l,_ as i,J as u,u as d,r as _,s as c,z as m,o as p,d as f,i as L}from"./index-3e251bf1.js";import{u as R}from"./ShowDetail-5a0923d4.js";import"./DataTableLoader-4f25eebe.js";const B={__name:"SalesTab",setup(y){const o=l(()=>i(()=>import("./RelatedListPanel-c52bc339.js"),["assets/RelatedListPanel-c52bc339.js","assets/index-3e251bf1.js","assets/index-86c8a9da.css","assets/ShowDetail-5a0923d4.js","assets/DataTableLoader-4f25eebe.js","assets/ShowDetail-d7da18a9.css"])),r=u();d();const t=_(),s=R(),{relatedListLoading:v,_getRelatedListsByCname:S,_getRelatedOrderedLists:a}=c(s),{fetchItemRelatedLists:n}=s;return m(async()=>{a.value.length<=0&&await n(r.params),t.value=a.value.filter(e=>e.entityName==="SalesOpportunity"||e.entityName==="SalesOpportunity")}),(e,g)=>(p(),f(L(o),{fromTab:!0,relatedLists:t.value},null,8,["relatedLists"]))}};export{B as default};