import{C as n,_ as u,J as c,u as d,r as l,s as m,z as _,o as f,d as p,i as v}from"./index-ba7b65a1.js";import{u as L}from"./ShowDetail-21cb57c8.js";import"./DataTableLoader-b43e253e.js";const D={__name:"ServicesTab",setup(R){const r=n(()=>u(()=>import("./RelatedListPanel-82db60c3.js"),["assets/RelatedListPanel-82db60c3.js","assets/index-ba7b65a1.js","assets/index-75db8d00.css","assets/ShowDetail-21cb57c8.js","assets/DataTableLoader-b43e253e.js","assets/ShowDetail-d7da18a9.css"])),o=c();d();const t=l(),a=L(),{relatedListLoading:y,_getRelatedOrderedLists:s}=m(a),{fetchItemRelatedLists:i}=a;return _(async()=>{s.value.length<=0&&await i(o.params),t.value=s.value.filter(e=>{if(e.entityName==="DefectReport"||e.entityName==="ServiceJob"||e.entityName==="ServiceSchedule"||e.entityName==="BreakdownLog"||e.entityName==="ServiceReport")return e})}),(e,S)=>(f(),p(v(r),{fromTab:!0,relatedLists:t.value},null,8,["relatedLists"]))}};export{D as default};
