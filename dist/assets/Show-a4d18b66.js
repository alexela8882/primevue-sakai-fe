import{D as j,c as m,o as d,j as v,e as t,F as z,k as re,f as e,C as D,_ as F,r as c,J as de,v as ue,s as ce,A as me,z as _e,i as l,t as b,w as n,d as g,S as L,m as O}from"./index-8c3d7919.js";import{D as ve}from"./DataTableLoader-e4141bdc.js";const pe={},be={class:"p-4"},he={class:"flex flex-column gap-6"};function ge(B,M){const o=m("Skeleton");return d(),v("div",be,[t("div",he,[(d(),v(z,null,re(2,(N,T)=>t("div",{key:T},[e(o,{class:"mb-2",borderRadius:"16px"}),e(o,{width:"10rem",class:"mb-2",borderRadius:"16px"}),e(o,{width:"5rem",borderRadius:"16px",class:"mb-2"}),e(o,{height:"2rem",class:"mb-2",borderRadius:"16px"}),e(o,{width:"10rem",height:"4rem",borderRadius:"16px"})])),64))])])}const P=j(pe,[["render",ge]]),fe={},we={class:"flex gap-2"},ye={class:"flex flex-column gap-2 w-full"},xe={class:"flex flex-column gap-2 w-full"},ke={class:"flex flex-column gap-2 w-full"},Se={class:"flex flex-column gap-2 w-full"},Ve={class:"flex flex-column gap-2 w-full"};function De(B,M){const o=m("Skeleton");return d(),v("div",null,[e(o,{height:"3rem",class:"mb-2"}),t("div",we,[t("div",ye,[e(o,{height:"10rem"}),e(o,{height:"10rem"}),e(o,{height:"10rem"})]),t("div",xe,[e(o,{height:"10rem"})]),t("div",ke,[e(o,{height:"10rem"}),e(o,{height:"10rem"})]),t("div",Se,[e(o,{height:"10rem"}),e(o,{height:"10rem"}),e(o,{height:"10rem"}),e(o,{height:"10rem"})]),t("div",Ve,[e(o,{height:"10rem"}),e(o,{height:"10rem"})])])])}const Fe=j(fe,[["render",De]]),Le={class:"mt-3"},Me={key:0,class:"flex align-items-center justify-content-center",style:{height:"60vh !important"}},Te={key:1},Ee={class:"text-primary-700"},Ie={key:0,class:"my-4"},$e={class:"flex flex-column md:flex-row justify-content-between mt-3 gap-2"},Be={class:"flex align-items-center gap-2"},Ne={class:"flex align-items-center gap-2"},Ce={key:1,class:"mt-2 mb-4"},Re={class:"md:flex justify-content-between"},Ae={class:"md:flex align-items-center"},Ke={class:"p-input-icon-left mr-2 w-full md:w-auto"},Oe=t("i",{class:"pi pi-search"},null,-1),Pe={class:"p-inputgroup flex-1 mb-2 md:mb-0"},je={class:"material-icons"},ze=t("div",{class:"text-color-secondary p-2"},"VIEW SETTINGS",-1),Ue={class:"flex align-items-center text-color-secondary p-2 cursor-pointer"},We={class:"material-icons mr-2"},Ge=t("div",{class:"text-color-secondary p-2"},"LIST VIEW CONTROLS",-1),Je={class:"flex align-items-center text-color-secondary p-2 cursor-pointer"},qe={class:"material-icons mr-2"},Ye={__name:"Show",setup(B){const M=D(()=>F(()=>import("./ViewFiltersDialogMain-b99b1e82.js"),["assets/ViewFiltersDialogMain-b99b1e82.js","assets/index-8c3d7919.js","assets/index-d1288d3d.css","assets/index.esm-fc3e8baa.js","assets/ViewFiltersDialogMain-bbe8a5f0.css"])),o=D(()=>F(()=>import("./ListViewFilterContent-bbf81c7f.js"),["assets/ListViewFilterContent-bbf81c7f.js","assets/index-8c3d7919.js","assets/index-d1288d3d.css"])),N=D(()=>F(()=>import("./DynamicDataTableMain-1f912377.js"),["assets/DynamicDataTableMain-1f912377.js","assets/index-8c3d7919.js","assets/index-d1288d3d.css","assets/DynamicDataTableMain-e7a754e3.css"])),T=D(()=>F(()=>import("./DynamicKanban-aa996e8e.js"),["assets/DynamicKanban-aa996e8e.js","assets/index-8c3d7919.js","assets/index-d1288d3d.css","assets/DynamicKanban-1a0fa8fb.css"])),f=c("new"),_=c(!1),w=c(0),U=de(),r=c([]),h=c(),W=c(),E=c(),C=ue(),{listViewFilterOverlay:He,viewFiltersDialogLoading:y,viewFiltersDialogSwitch:x,viewFiltersDialog:I,moduleLoading:G,collectionLoading:$,getModule:k,getBaseModule:u,getCollection:S,getViewFilters:J,getDefaultViewFilter:q,getViewFilterIds:H,getViewFilter:Q,getSearchKeyFieldIds:X}=ce(C),{fetchModule:Y,fetchBaseModule:Z}=C,R=c(!1),A=c(!1),ee=c([{label:"New",icon:"add",command:i=>{console.log(i),f.value="new",w.value+=1,y.value=!0,x.value=!0,I.value=!0}},{label:"Edit table settings",icon:"table_chart",command:i=>{console.log(i),f.value="edit-table",w.value+=1,y.value=!0,x.value=!0,I.value=!0}},{label:"Edit kanban settings",icon:"view_kanban",command:i=>{console.log(i),f.value="edit-kanban",w.value+=1,y.value=!0,x.value=!0,I.value=!0}}]),le=c([{label:"Table view",icon:"table_chart",command:i=>{console.log(i),r.value.currentDisplay="table"}},{label:"Kanban view",icon:"view_kanban",command:i=>{console.log(i),r.value.currentDisplay="kanban"}},{label:"Split view",icon:"vertical_split",command:i=>{console.log(i)}}]);return me(h,(i,s)=>{i&&(r.value=Q.value(i))}),_e(async()=>{await Z(U.params.id),await Y(u.value.name),r.value=q.value,h.value=r.value._id,W.value=H.value,E.value=X.value}),(i,s)=>{const te=m("ProgressSpinner"),p=m("Skeleton"),oe=m("Dropdown"),ae=m("MultiSelect"),ie=m("InputText"),V=m("Button"),K=m("Menu");return d(),v(z,null,[t("div",Le,[l(G)?(d(),v("div",Me,[e(te)])):(d(),v("div",Te,[t("h4",Ee,b(l(u).label),1),t("div",null,[l($)?(d(),v("div",Ie,[t("div",$e,[t("div",Be,[e(p,{width:"10rem",height:"2.5rem"}),e(p,{width:"10rem",height:"2.5rem"})]),t("div",Ne,[e(p,{width:"10rem",height:"2.5rem"}),e(p,{width:"3rem",height:"2.5rem"}),e(p,{width:"3rem",height:"2.5rem"}),e(p,{width:"3rem",height:"2.5rem"}),e(p,{width:"8rem",height:"2.5rem"})])])])):(d(),v("div",Ce,[t("div",Re,[t("div",null,[e(oe,{modelValue:h.value,"onUpdate:modelValue":s[0]||(s[0]=a=>h.value=a),options:l(J),optionLabel:"filterName",optionValue:"_id",placeholder:"Select View Filters",class:"border-round-xl border-primary w-full md:w-12rem mr-2 mb-2 md:mb-0"},null,8,["modelValue","options"]),e(ae,{modelValue:E.value,"onUpdate:modelValue":s[1]||(s[1]=a=>E.value=a),options:l(k).fields,filter:"",showToggleAll:!1,optionLabel:"label",optionValue:"_id",dataKey:"_id",placeholder:"Select Fields",class:"border-round-xl border-primary w-full md:w-12rem mb-2 md:mb-0"},null,8,["modelValue","options"])]),t("div",Ae,[t("div",Ke,[Oe,e(ie,{type:"text",class:"border-round-xl border-primary w-full mb-2 md:mb-0",placeholder:"Search The List..."})]),t("div",Pe,[e(V,{onClick:s[2]||(s[2]=a=>A.value.toggle(a)),type:"button","aria-haspopup":"true","aria-controls":"tbl_overlay_menu2",class:"material-icon border-round-md mr-2"},{icon:n(()=>[t("div",je,b(r.value.currentDisplay==="table"?"table_chart":"view_kanban"),1)]),_:1}),e(K,{ref_key:"tblMenu2",ref:A,id:"tbl_overlay_menu2",class:"mt-2",model:le.value,popup:!0},{start:n(()=>[ze]),item:n(({item:a,label:se,props:ne})=>[t("div",Ue,[t("div",We,b(a.icon),1),t("div",null,b(a.label),1)])]),_:1},8,["model"]),e(V,{onClick:s[3]||(s[3]=a=>R.value.toggle(a)),loading:l(y),type:"button",icon:"pi pi-cog","aria-haspopup":"true","aria-controls":"tbl_overlay_menu",class:"border-round-md mr-2"},null,8,["loading"]),e(K,{ref_key:"tblMenu",ref:R,id:"tbl_overlay_menu",class:"mt-2",model:ee.value,popup:!0},{start:n(()=>[Ge]),item:n(({item:a,label:se,props:ne})=>[t("div",Je,[t("div",qe,b(a.icon),1),t("div",null,b(a.label),1)])]),_:1},8,["model"]),e(V,{onClick:s[4]||(s[4]=a=>_.value=!0),disabled:_.value,icon:"pi pi-filter","aria-label":"Submit",class:"list-view-filter-btn border-round-md mr-2"},null,8,["disabled"]),e(V,{class:"border-round-md mr-2",icon:"pi pi-plus",label:`New ${l(u).label}`},null,8,["label"])])])])]))]),r.value.currentDisplay==="table"?(d(),g(L,{key:0},{fallback:n(()=>[e(ve)]),default:n(()=>[e(l(N),{mode:"edit",moduleId:l(u)._id,moduleEntityName:l(u).mainEntity,moduleName:l(u).name,moduleLabel:l(u).label,fields:r.value.fields,data:l(S).data,pagination:l(S).meta&&l(S).meta.pagination,collectionLoading:l($),sidebar:_.value,onToggleSidebar:s[5]||(s[5]=a=>_.value=!_.value)},{"list-view-filter":n(()=>[(d(),g(L,null,{fallback:n(()=>[e(P)]),default:n(()=>[e(l(o),{baseModule:l(u),module:l(k)},null,8,["baseModule","module"])]),_:1}))]),_:1},8,["moduleId","moduleEntityName","moduleName","moduleLabel","fields","data","pagination","collectionLoading","sidebar"])]),_:1})):r.value.currentDisplay==="kanban"?(d(),g(L,{key:1},{fallback:n(()=>[e(Fe)]),default:n(()=>[e(l(T),{viewFilterId:r.value._id,groupBy:r.value.group_by,summarizeBy:r.value.summarize_by,moduleName:l(u).name,moduleLabel:l(u).label,fields:r.value.fields,data:l(S).data,collectionLoading:l($),sidebar:_.value,onToggleSidebar:s[6]||(s[6]=a=>_.value=!_.value)},{"list-view-filter":n(()=>[(d(),g(L,null,{fallback:n(()=>[e(P)]),default:n(()=>[e(l(o),{baseModule:l(u),module:l(k)},null,8,["baseModule","module"])]),_:1}))]),_:1},8,["viewFilterId","groupBy","summarizeBy","moduleName","moduleLabel","fields","data","collectionLoading","sidebar"])]),_:1})):O("",!0)]))]),l(x)?(d(),g(l(M),{key:w.value,mode:f.value,selectedViewFilter:h.value,module:l(k)},null,8,["mode","selectedViewFilter","module"])):O("",!0)],64)}}};export{Ye as default};
