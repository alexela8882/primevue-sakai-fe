import{I as h,J as w,r as s,N as B,u as E,s as T,G as V,o as c,d as j,w as _,f as N,e as x,j as b,i as C,S as I,m as S}from"./index-2f40471b.js";import{u as A}from"./index-82b5396b.js";import{D as O}from"./DataTableLoader-a929a2da.js";const q={key:0},G={key:1,class:"mb-2 text-600"},H={__name:"RelatedListPanelData",props:{fromTab:{type:Boolean,required:!1,default:!1},relatedList:Object},setup(n){const t=n,y=h(()=>w(()=>import("./DynamicDataTableMain-02ec36b0.js"),["assets/DynamicDataTableMain-02ec36b0.js","assets/index-2f40471b.js","assets/index-d5e7f8f7.css","assets/Validate-1e200014.js","assets/DynamicDataTableMain-5df8962c.css"])),i=s(!1),m=B();E();const r=A(),{_getRelatedList:J,_getRelatedLists:R,_getRelatedListsByCname:e}=T(r),{paginateRelatedList:k}=r,v=s(e.value(t.relatedList.cname)),p=s(e.value(t.relatedList.cname).link),f=s(e.value(t.relatedList.cname).label),g=s(e.value(t.relatedList.cname).fields),d=s(e.value(t.relatedList.cname).collection.data),u=s(e.value(t.relatedList.cname).collection.meta.pagination),L=async a=>{i.value=!0;let l=1;a.jump?l=u.value.current_page:l=a.event.page+1,await k({moduleName:m.params.name,base:m.params.pageid,panel:t.relatedList._id,page:l,limit:a.per_page}),i.value=!1},D=async a=>{const l=a.value;await L({event:a,jump:!0,per_page:l})};return V(()=>R.value,(a,l)=>{let o=a.find(P=>P._id===t.relatedList._id);v.value=e.value(o.cname),p.value=e.value(o.cname).link,f.value=e.value(o.cname).label,g.value=e.value(o.cname).fields,d.value=e.value(o.cname).collection.data,u.value=e.value(o.cname).collection.meta.pagination},{deep:!0}),(a,l)=>v.value?(c(),j(I,{key:0},{fallback:_(()=>[N(O)]),default:_(()=>[x("div",null,[d.value.length>0?(c(),b("div",q,[N(C(y),{mode:"view",moduleId:n.relatedList._id,moduleEntityName:n.relatedList.entityName,moduleName:p.value,moduleLabel:f.value,modulePermissions:[],fields:g.value,data:d.value,pagination:u.value,collectionLoading:i.value,onPaginate:L,onLimitPage:D},null,8,["moduleId","moduleEntityName","moduleName","moduleLabel","fields","data","pagination","collectionLoading"])])):(c(),b("div",G,"No records found"))])]),_:1})):S("",!0)}};export{H as default};