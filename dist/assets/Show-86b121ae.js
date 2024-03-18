import{_ as Ke,c as w,o as r,j as g,f as t,e as i,r as d,N as ze,B as Ae,K as Re,a3 as Ue,U as We,s as oe,E as qe,G as C,i as o,t as S,w as v,F as B,k as W,d as h,x as Ge,l as Je,m as q,S as O,I as P,J as K,v as He}from"./index-5970bb5d.js";import{L as ne}from"./ListViewLoader-67573f63.js";import{D as Qe}from"./DataTableLoader-c8431f6b.js";const Xe={},Ye={class:"flex gap-2"},Ze={class:"flex flex-column gap-2 w-full"},el={class:"flex flex-column gap-2 w-full"},ll={class:"flex flex-column gap-2 w-full"},al={class:"flex flex-column gap-2 w-full"},tl={class:"flex flex-column gap-2 w-full"};function il(ue,G){const p=w("Skeleton");return r(),g("div",null,[t(p,{height:"3rem",class:"mb-2"}),i("div",Ye,[i("div",Ze,[t(p,{height:"10rem"}),t(p,{height:"10rem"}),t(p,{height:"10rem"})]),i("div",el,[t(p,{height:"10rem"})]),i("div",ll,[t(p,{height:"10rem"}),t(p,{height:"10rem"})]),i("div",al,[t(p,{height:"10rem"}),t(p,{height:"10rem"}),t(p,{height:"10rem"}),t(p,{height:"10rem"})]),i("div",tl,[t(p,{height:"10rem"}),t(p,{height:"10rem"})])])])}const sl=Ke(Xe,[["render",il]]),ol={class:"mt-3"},nl={key:0,class:"flex align-items-center justify-content-center",style:{height:"60vh !important"}},ul={key:1},dl={class:"text-primary-700"},rl={key:0,class:"my-4"},cl={class:"flex flex-column md:flex-row justify-content-between mt-3 gap-2"},vl={class:"flex align-items-center gap-2"},ml={class:"flex align-items-center gap-2"},pl={key:1,class:"mt-2 mb-4"},_l={class:"md:flex align-items-center justify-content-between gap-1"},gl={class:"w-7"},bl=i("div",{class:"text-xl mb-2"},"Will search through:",-1),fl={class:"text-sm"},hl={class:"p-inputgroup flex-1 mb-2 md:mb-0"},wl={class:"material-icons"},yl=i("div",{class:"text-color-secondary p-2"},"VIEW SETTINGS",-1),xl={class:"flex align-items-center text-color-secondary p-2 cursor-pointer"},Fl={class:"material-icons mr-2"},Sl=i("div",{class:"text-color-secondary p-2"},"LIST VIEW CONTROLS",-1),kl={class:"flex align-items-center text-color-secondary p-2 cursor-pointer"},Vl={class:"material-icons mr-2"},Dl={key:0,class:"flex align-items-center justify-content-center",style:{height:"60vh !important"}},Ll={key:1},Al={__name:"Show",setup(ue){const G=P(()=>K(()=>import("./ViewFiltersDialogMain-ac65cef5.js"),["assets/ViewFiltersDialogMain-ac65cef5.js","assets/index-5970bb5d.js","assets/index-40ff91a8.css","assets/index.esm-9a9478d9.js","assets/ViewFiltersDialogMain-bbe8a5f0.css"])),p=P(()=>K(()=>import("./ListViewFilterContent-68c739ab.js"),["assets/ListViewFilterContent-68c739ab.js","assets/index-5970bb5d.js","assets/index-40ff91a8.css"])),de=P(()=>K(()=>import("./DynamicDataTableMain-ff9db146.js"),["assets/DynamicDataTableMain-ff9db146.js","assets/index-5970bb5d.js","assets/index-40ff91a8.css","assets/Validate-13f2271e.js","assets/DynamicDataTableMain-5df8962c.css"])),re=P(()=>K(()=>import("./DynamicKanban-9fce2486.js"),["assets/DynamicKanban-9fce2486.js","assets/index-5970bb5d.js","assets/index-40ff91a8.css","assets/DynamicKanban-13545c00.css"])),ce=d(0),E=d(!1),T=d(null),_=d(!1),k=d(!1),s=d(),y=d("new"),x=d(!1),D=d(0),ve=ze(),c=d({}),V=d(),b=d(),z=d(),J=d(),A=d(),f=d(),H=Ae(),Q=Re(),me=Ue(),pe=We(),{listViewFilterOverlay:Ml,viewFiltersDialogLoading:L,viewFiltersDialogSwitch:M,viewFiltersDialog:$,moduleLoading:_e,collectionLoading:ge,getModule:Il,getModules:be,getBaseModule:m,getCollection:El,_getViewFilters:fe,getViewFilters:Tl,_getDefaultViewFilter:he,getDefaultViewFilter:$l,_getViewFilterIds:we,__getViewFilter:X,getViewFilter:jl,_getSearchFields:ye,_getSearchKeyFields:Nl,_getSearchKeyFieldIds:xe,_getFieldDetailsById:Fe}=oe(H),{searchModule:Se,_fetchModule:Y,fetchModule:Cl,fetchModules:Bl,fetchBaseModule:ke}=H,{getTabs:I}=oe(Q),{addTab:Ve,toggleWindows:Z,maximizeTab:Ol}=Q,{setFormReset:De}=me,ee=d(!1),le=d(!1),Le=d([{label:"New",icon:"add",command:e=>{console.log(e),y.value="new",D.value+=1,L.value=!0,M.value=!0,$.value=!0}},{label:"Edit table settings",icon:"table_chart",command:e=>{console.log(e),y.value="edit-table",D.value+=1,L.value=!0,M.value=!0,$.value=!0}},{label:"Edit kanban settings",icon:"view_kanban",command:e=>{console.log(e),y.value="edit-kanban",D.value+=1,L.value=!0,M.value=!0,$.value=!0}}]),Me=d([{label:"Table view",icon:"table_chart",command:e=>{console.log(e),c.value.currentDisplay="table"}},{label:"Kanban view",icon:"view_kanban",disabled:!1,command:e=>{console.log(e),c.value.group_by!==null?c.value.currentDisplay="kanban":(y.value="edit-kanban",D.value+=1,L.value=!0,M.value=!0,$.value=!0)}},{label:"Split view",icon:"vertical_split",disabled:!0,command:e=>{console.log(e)}}]),R=d(!1),Ie=async e=>{await j(e)},ae=async e=>{_.value=!0;let l=1;e.jump?l=s.meta&&s.meta.pagination:l=e.event.page+1;let n=Object.assign({},{moduleName:m.value.name,viewFilter:b.value,page:l>1?l:null,limit:e.per_page,search:T.value,searchFields:te(),reuse:!0});s.value=await Y(n),_.value=!1},Ee=async e=>{const l=e.value;await ae({event:e,jump:!0,per_page:l})},Te=async e=>{let l=Object.assign({},{type:"module-form",style:"window",name:`${e.name}-window-create-form`,label:`${e.label} Form`,_module:e.name,expanded:!1,opened:!1,mode:"modal",opened_order:null});I.value.findIndex((u,F)=>u.name===l.name)==-1?await Ve(l,!0):$e(e)},$e=(e,l)=>{pe.require({group:"templating",header:"Unsaved "+e.mainEntity+" Alert",message:e.mainEntity,icon:"pi pi-exclamation-triangle",rejectClass:"p-button-outlined",rejectLabel:"Continue",acceptLabel:"Create New "+e.mainEntity,accept:()=>{let n=I.value.findIndex(u=>u.name===`${e.name}-window-create-form`);De(`${e.name}-window-create-form`),Z(I.value[n])},reject:()=>{let n=I.value.findIndex(u=>u.name===`${e.name}-window-create-form`);Z(I.value[n])}})},j=async e=>{k.value=!0,_.value=!0,await ke(ve.params.id);let l=Object.assign({},{moduleName:m.value.name,viewFilter:e?e._id:b.value&&b.value,page:null,limit:e?e.pageSize:V.value&&V.value.pageSize,reuse:!0});const n=await Y(l);s.value=n,ce.value=s.value.viewFilters&&s.value.viewFilters.length,e?c.value=X.value(e._id,s.value):c.value=he.value(s.value),V.value=c.value&&c.value,b.value=V.value._id,z.value=He(()=>we.value(s.value)),J.value=ye.value(s.value);let u=s.value.viewFilters.find(F=>F.isDefault);u&&u.search_fields&&u.search_fields.length>0?f.value=u.search_fields:f.value=xe.value(s.value),k.value=!1,_.value=!1},je=e=>e.find(n=>n._id===m.value._id),Ne=async()=>{k.value=!0;let e=Object.assign({},{module:m.value.name,search:T.value,viewFilter:b.value,searchFields:te(),selectedSearchKeyIds:f.value});const l=await Se(e);l&&(s.value=l),k.value=!1,E.value=!1},te=()=>{let e=[];return f.value.map(l=>{let n=Object.assign({},{"searchFields[]":l});e.push(n)}),e},Ce=async e=>{await j(e)};return qe(async()=>{await j(null)}),C(b,async(e,l)=>{console.log(l),console.log(e),l&&(console.log("change view filter"),c.value=X.value(e,s.value),await j(c.value))}),C(z,(e,l)=>{e&&(z.value=e.value)}),C(()=>be.value,async(e,l)=>{let n=je(e);y.value!==null&&(y.value==="new"?V.value=n.viewFilters[n.viewFilters&&n.viewFilters.length-1]:(console.log("re-initialize"),V.value=n.viewFilters.find(u=>u._id===b.value))),y.value=null},{deep:!0}),C(()=>f.value,async(e,l)=>{A.value=[],e.map(n=>{let u=Object.assign({},{fields:s.value.fields,_id:n}),F=Fe.value(u);A.value.push(F.label)})}),(e,l)=>{const n=w("ProgressSpinner"),u=w("Skeleton"),F=w("el-option"),ie=w("el-select"),Be=w("el-popover"),Oe=w("el-input"),N=w("Button"),se=w("Menu");return r(),g(B,null,[i("div",ol,[o(_e)?(r(),g("div",nl,[t(n)])):(r(),g("div",ul,[i("h4",dl,S(o(m).label),1),i("div",null,[o(ge)?(r(),g("div",rl,[i("div",cl,[i("div",vl,[t(u,{width:"10rem",height:"2.5rem"}),t(u,{width:"10rem",height:"2.5rem"})]),i("div",ml,[t(u,{width:"10rem",height:"2.5rem"}),t(u,{width:"3rem",height:"2.5rem"}),t(u,{width:"3rem",height:"2.5rem"}),t(u,{width:"3rem",height:"2.5rem"}),t(u,{width:"8rem",height:"2.5rem"})])])])):(r(),g("div",pl,[i("div",_l,[i("div",gl,[t(ie,{modelValue:b.value,"onUpdate:modelValue":l[0]||(l[0]=a=>b.value=a),disabled:_.value,"collapse-tags":"",placeholder:"Select View Filters",style:{"max-width":"150px"},class:"mr-2"},{default:v(()=>[(r(!0),g(B,null,W(o(fe)(s.value),a=>(r(),h(F,{key:a._id,label:a.filterName,value:a._id},null,8,["label","value"]))),128))]),_:1},8,["modelValue","disabled"]),t(Oe,{onKeypress:l[3]||(l[3]=Je(a=>Ne(),["enter"])),onBlur:l[4]||(l[4]=a=>E.value=!1),onFocus:l[5]||(l[5]=a=>E.value=!0),modelValue:T.value,"onUpdate:modelValue":l[6]||(l[6]=a=>T.value=a),disabled:_.value,placeholder:"Search The List...",style:{"max-width":"500px"}},{prepend:v(()=>[t(Be,{visible:E.value,placement:"bottom",width:400},{reference:v(()=>[t(ie,{modelValue:f.value,"onUpdate:modelValue":l[1]||(l[1]=a=>f.value=a),disabled:_.value,multiple:"","collapse-tags":"","max-collapse-tags":0,filterable:!!R.value,placeholder:"Select Fields",style:Ge([{"max-width":"150px"},R.value?"width:150px":"width:75px"]),onVisibleChange:l[2]||(l[2]=function(a){R.value=a})},{default:v(()=>[(r(!0),g(B,null,W(J.value,a=>(r(),h(F,{key:a._id,label:a.label,value:a._id,disabled:f.value.length>=3&&!f.value.includes(a._id)},null,8,["label","value","disabled"]))),128))]),_:1},8,["modelValue","disabled","filterable","style"])]),default:v(()=>[i("div",null,[bl,(r(!0),g(B,null,W(A.value,(a,U)=>(r(),g("div",{key:U},[i("div",fl,S(a),1)]))),128))])]),_:1},8,["visible"])]),_:1},8,["modelValue","disabled"])]),i("div",null,[i("div",hl,[t(N,{onClick:l[7]||(l[7]=a=>le.value.toggle(a)),disabled:_.value,type:"button","aria-haspopup":"true","aria-controls":"tbl_overlay_menu2",class:"material-icon border-round-md mr-2"},{icon:v(()=>[i("div",wl,S(c.value.currentDisplay===null||c.value.currentDisplay==="table"?"table_chart":"view_kanban"),1)]),_:1},8,["disabled"]),t(se,{ref_key:"tblMenu2",ref:le,id:"tbl_overlay_menu2",class:"mt-2",model:Me.value,popup:!0},{start:v(()=>[yl]),item:v(({item:a,label:U,props:Pe})=>[i("div",xl,[i("div",Fl,S(a.icon),1),i("div",null,S(a.label),1)])]),_:1},8,["model"]),t(N,{onClick:l[8]||(l[8]=a=>ee.value.toggle(a)),loading:o(L),disabled:_.value,type:"button",icon:"pi pi-cog","aria-haspopup":"true","aria-controls":"tbl_overlay_menu",class:"border-round-md mr-2"},null,8,["loading","disabled"]),t(se,{ref_key:"tblMenu",ref:ee,id:"tbl_overlay_menu",class:"mt-2",model:Le.value,popup:!0},{start:v(()=>[Sl]),item:v(({item:a,label:U,props:Pe})=>[i("div",kl,[i("div",Vl,S(a.icon),1),i("div",null,S(a.label),1)])]),_:1},8,["model"]),t(N,{onClick:l[9]||(l[9]=a=>x.value=!0),disabled:x.value||_.value,icon:"pi pi-filter","aria-label":"Submit",class:"list-view-filter-btn border-round-md mr-2"},null,8,["disabled"]),o(m).name!="salesquotes"?(r(),h(N,{key:0,class:"border-round-md mr-2",disabled:_.value,icon:"pi pi-plus",onClick:l[10]||(l[10]=a=>Te(o(m))),label:`New ${o(m).label}`},null,8,["disabled","label"])):q("",!0)])])])]))]),k.value?(r(),g("div",Dl,[t(n)])):(r(),g("div",Ll,[c.value.currentDisplay===null||c.value.currentDisplay==="table"?(r(),h(O,{key:0},{fallback:v(()=>[t(Qe)]),default:v(()=>[(r(),h(o(de),{key:o(m)._id,mode:"edit",moduleId:o(m)._id,moduleEntityName:o(m).mainEntity,moduleName:o(m).name,modulePermissions:o(m).permissions,moduleLabel:o(m).label,viewFilter:c.value,fields:c.value.fields,data:s.value.data,pagination:s.value.meta&&s.value.meta.pagination,collectionLoading:_.value,sidebar:x.value,onToggleSidebar:l[12]||(l[12]=a=>x.value=!x.value),onPaginate:ae,onLimitPage:Ee},{"list-view-filter":v(()=>[(r(),h(O,null,{fallback:v(()=>[t(ne)]),default:v(()=>[t(o(p),{onApplyFilters:l[11]||(l[11]=a=>Ce(a)),baseModule:o(m),module:s.value},null,8,["baseModule","module"])]),_:1}))]),_:1},8,["moduleId","moduleEntityName","moduleName","modulePermissions","moduleLabel","viewFilter","fields","data","pagination","collectionLoading","sidebar"]))]),_:1})):c.value.currentDisplay==="kanban"?(r(),h(O,{key:1},{fallback:v(()=>[t(sl)]),default:v(()=>[t(o(re),{viewFilterId:c.value._id,groupBy:c.value.group_by,summarizeBy:c.value.summarize_by,moduleName:o(m).name,moduleLabel:o(m).label,fields:c.value.fields,module:s.value,data:s.value.data,collectionLoading:k.value,sidebar:x.value,onToggleSidebar:l[13]||(l[13]=a=>x.value=!x.value)},{"list-view-filter":v(()=>[(r(),h(O,null,{fallback:v(()=>[t(ne)]),default:v(()=>[t(o(p),{baseModule:o(m),module:s.value},null,8,["baseModule","module"])]),_:1}))]),_:1},8,["viewFilterId","groupBy","summarizeBy","moduleName","moduleLabel","fields","module","data","collectionLoading","sidebar"])]),_:1})):q("",!0)]))]))]),o(M)?(r(),h(o(G),{key:D.value,mode:y.value,selectedViewFilter:b.value,module:s.value,onSavedViewfilter:l[14]||(l[14]=a=>Ie(a))},null,8,["mode","selectedViewFilter","module"])):q("",!0)],64)}}};export{Al as default};
