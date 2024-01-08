import{D as ue,r as c,c as y,o as s,j as a,f as t,w as d,e,n as re,U as Ae,t as p,E as qe,G as Ge,H as we,a as me,K as ke,v as _e,s as B,I as x,q as ce,C as U,_ as A,J as We,u as He,A as Je,z as Ke,F as j,k as C,i as u,m as h,d as z,S as K,g as Qe}from"./index-5d4b1b48.js";import{D as Xe}from"./DataTableLoader-638347c7.js";const Ye=b=>(qe("data-v-6bc92a60"),b=b(),Ge(),b),Ze={class:"px-4 lg:px-0"},et=Ye(()=>e("span",{class:"font-bold text-blue-800"},"/",-1)),tt=["onClick"],st={__name:"RdBreadCrumbs",props:{bcrumbs:Array},setup(b){return c({icon:"pi pi-home",to:"/dashboard"}),(w,r)=>{const E=y("Breadcrumb");return s(),a("div",Ze,[t(E,{class:"whitespace-nowrap capitalize text-blue-800 text-xl",model:b.bcrumbs},{separator:d(({item:v})=>[et]),item:d(({item:v})=>[e("a",{class:re(v.class),onClick:M=>v.to&&w.$router.push(`${v.to}`),style:Ae(`cursor: ${v.to!==null&&"pointer"}`)},[e("span",{class:re(`${v.to&&"font-bold"}`)},p(v.label),3)],14,tt)]),_:1},8,["model"])])}}},lt=ue(st,[["__scopeId","data-v-6bc92a60"]]),at={};function ot(b,w){const r=y("Skeleton");return s(),a("div",null,[t(r,{class:"mb-2",borderRadius:"16px"}),t(r,{width:"10rem",class:"mb-2",borderRadius:"16px"}),t(r,{width:"5rem",borderRadius:"16px",class:"mb-2"}),t(r,{height:"2rem",class:"mb-2",borderRadius:"16px"}),t(r,{width:"10rem",height:"4rem",borderRadius:"16px"})])}const ye=ue(at,[["render",ot]]),it={},nt={class:"grid"},dt={class:"col"},ct={class:"col"};function rt(b,w){const r=y("Skeleton");return s(),a("div",nt,[e("div",dt,[t(r,{class:"mb-2",borderRadius:"16px"}),t(r,{width:"10rem",class:"mb-2",borderRadius:"16px"}),t(r,{width:"5rem",borderRadius:"16px",class:"mb-2"}),t(r,{height:"2rem",class:"mb-2",borderRadius:"16px"}),t(r,{class:"w-6",height:"4rem",borderRadius:"16px"})]),e("div",ct,[t(r,{class:"mb-2",borderRadius:"16px"}),t(r,{width:"10rem",class:"mb-2",borderRadius:"16px"}),t(r,{width:"5rem",borderRadius:"16px",class:"mb-2"}),t(r,{height:"2rem",class:"mb-2",borderRadius:"16px"}),t(r,{class:"w-6",height:"4rem",borderRadius:"16px"})])])}const xe=ue(it,[["render",rt]]),ut=we("moduleDetailStore",()=>{me();const b=c(!0),w=c(!0),r=ke(),E=_e(),{jsonDbUrl:v}=B(r),{getBaseModule:M,getModule:q}=B(E),S=c({}),I=c([]),k=c([]),g=x(()=>S.value),G=x(()=>{const m=q.value.panels,o=m.map((n,Z)=>Object.assign({},{_id:n._id,controllerMethod:n.controllerMethod,entityName:n.entityName,highlight:n.highlight,label:n.label,mutable:n.mutable,panelName:n.panelName,sections:[],tabKey:n.tabKey}));return m.map((n,Z)=>{n.sections.filter(($,Le)=>{if($.sectionLabel){let ee=Object.assign({},{sectionLabel:$.sectionLabel,row:$.row,field_ids:$.field_ids,additional_fields:[]});o[Z].sections.push(ee)}else{const ee=o[Z].sections.slice(-1).pop();let te=Object.assign({},{ids:$.field_ids});ee.additional_fields.push(te)}})}),console.log(o),o}),T=x(()=>m=>S.value[m]),L=x(()=>I.value),ae=x(()=>I.value.sort((o,n)=>o.panelOrder-n.panelOrder)),Q=x(()=>m=>L.value.find(n=>n.cname===m)),W=x(()=>k.value),X=x(()=>k.value.sort((o,n)=>o.panelOrder-n.panelOrder)),Y=x(()=>m=>W.value.find(n=>n.cname===m));return{itemLoading:b,relatedListLoading:w,item:S,getItem:g,_getRelatedLists:L,_getRelatedOrderedLists:ae,_getRelatedListsByCname:Q,getRelatedLists:W,getRelatedOrderedLists:X,getRelatedListsByCname:Y,getItemPanels:G,getItemValueByName:T,fetchItem:async m=>{b.value=!0;const o=await ce(`${v.value}/${m.name}-item?_id=${m.pageid}`,{method:"GET",headers:{"Content-Type":"application/json"}});o.status===200&&(S.value=o.data&&o.data.length>0?o.data[0]:o.data),b.value=!1},fetchItemRelatedList:async m=>{const o=await ce(`${v.value}/${m.moduleName}-related?cname=${m.panelName}`,{method:"GET",headers:{"Content-Type":"application/json"}}).catch(n=>{console.log(n)});o&&o.status===200?o.data&&k.value.push(o.data[0]):k.value=[]},fetchItemRelatedLists:async m=>{w.value=!0;const o=await ce(`${v.value}/${m.name}-related`,{method:"GET",headers:{"Content-Type":"application/json"}}).catch(n=>{console.log(n)});o&&o.status===200?I.value=o.data:(console.log("err"),I.value=[]),console.log(I.value),w.value=!1}}}),mt=we("moduleFileStore",()=>{me();const b=ke(),w=_e();B(b),B(w);const r=c(!1),E=c(!1),v=c(!1),M=c([]),q=c([{categoryValue:0,items:[{id:1,label:"Test 1",date:"Jan 23, 2023",size:"55kb",type:"jpg",selected:!1},{id:2,label:"Test 2",date:"Aug 01, 2023",size:"45kb",type:"jpg",selected:!1},{id:3,label:"Test 3",date:"Nov 23, 2023",size:"100kb",type:"jpg",selected:!1},{id:4,label:"Test 4",date:"Sept 23, 2023",size:"1mb",type:"png",selected:!1},{id:5,label:"Test 5",date:"Jan 06, 2023",size:"2.3mb",type:"jpg",selected:!1},{id:6,label:"Test 6",date:"March 24, 2023",size:"50kb",type:"jpeg",selected:!1},{id:7,label:"Test 7",date:"Nov 23, 2023",size:"1kb",type:"jpeg",selected:!1},{id:8,label:"Test 8",date:"Nov 23, 2023",size:"0kb",type:"png",selected:!1},{id:9,label:"Test 9",date:"Nov 23, 2023",size:"90kb",type:"png",selected:!1},{id:10,label:"Test 10",date:"Nov 23, 2023",size:"1.1mb",type:"jpg",selected:!1},{id:11,label:"Test 11",date:"Nov 23, 2023",size:"1.1mb",type:"jpg",selected:!1},{id:12,label:"Test 12",date:"Dec 23, 2023",size:"1.1mb",type:"jpg",selected:!1}]},{categoryValue:2,items:[{label:"Test 1",date:"Nov 23, 2023",size:"55kb",file_type:"jpg"}]}]),S=c({}),I=x(()=>M.value),k=x(()=>q.value),g=x(()=>S.value);return{fileLoading:r,fileDialog:E,fileDialogSwitch:v,getModuleFiles:I,getFiles:k,getFile:g,addModuleFiles:async T=>{T.map(L=>M.value.push(L))}}});const _t={key:0,class:"flex align-items-center justify-content-center",style:{height:"60vh !important"}},pt={key:1},vt={style:{position:"sticky !important",top:"72px","z-index":"2 !important"},class:"bg-white px-5 py-3 mb-5 border-round-xl flex align-items-center justify-content-between shadow-2"},ht={class:"flex"},bt={key:0,class:"flex flex-column text-xl mr-4"},gt={key:0},ft={class:"flex"},yt={class:"font-bold"},xt={key:1},wt={class:"font-bold"},kt={key:0,class:"flex flex-column text-xl mx-4"},Lt={class:"font-bold"},Rt={class:"grid"},St={class:"col-7"},It={class:"p-3 bg-white border-round-xl shadow-2"},Tt={class:"flex flex-column gap-3"},Nt={key:0},jt={class:"text-2xl font-bold"},Ct={key:0},$t=e("div",{class:"material-icons cursor-pointer"},"playlist_add",-1),Dt=[$t],Et={class:"flex flex-column px-3 mt-4"},Mt={key:0},zt={key:0},Bt=["id"],Ot=["onClick"],Ft=e("i",{class:"pi pi-eye"},null,-1),Pt={key:1},Vt={key:1},Ut={class:"col-5"},At={style:{position:"sticky !important",top:"145px !important",height:"75vh !important"},class:"flex flex-column gap-4 overflow-scroll p-1"},qt={class:"bg-white border-round-xl shadow-2"},Gt={class:"p-3"},Wt={class:"flex align-items-center justify-content-between"},Ht=e("div",{class:"text-xl font-bold text-primary"},"Activity",-1),Jt={class:"p-inputgroup"},Kt={class:"flex flex-column gap-1 mb-6"},Qt={class:"text-sm text-900"},Xt={key:0},Yt={class:"text-sm text-900 ml-2"},Zt=e("p",{class:"m-0 mt-3"}," Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",-1),es={class:"bg-white border-round-xl shadow-2"},ts={class:"p-3"},ss={class:"flex justify-content-between align-items-center text-xl font-bold text-primary"},ls=e("div",null,"Files",-1),as={class:"mt-5 flex flex-column gap-2 text-700"},os=e("div",{class:"text-lg font-bold"},"Upload files",-1),is=e("div",{class:""},"only .jpg and .png files. 5 MB max file size.",-1),ns={key:0},ds={key:0},cs={class:"border-round border-1 border-orange-300 p-2 flex align-items-center justify-content-between"},rs={class:"flex align-items-center gap-3"},us={href:"javascript: void(0);"},ms={class:"text-700"},_s=e("div",{class:"text-orange-500"},"Pending",-1),ps=["onClick"],vs={class:"border-round border-1 border-300 p-2 flex align-items-center justify-content-between"},hs={class:"flex align-items-center gap-3"},bs={href:"javascript: void(0);"},gs={class:"text-700"},fs=["onClick"],ys=e("div",{class:"bg-white border-round-xl shadow-2"},[e("div",{class:"p-3 h-15rem"},[e("div",{class:"text-xl font-bold text-primary"},"Reminders")])],-1),xs={__name:"ShowDetail",setup(b){const w=U(()=>A(()=>import("./DynamicDataTableMain-31d70b1b.js"),["assets/DynamicDataTableMain-31d70b1b.js","assets/index-5d4b1b48.js","assets/index-86c8a9da.css","assets/DynamicDataTableMain-e7a754e3.css"])),r=U(()=>A(()=>import("./SalesTab-96664a9e.js"),["assets/SalesTab-96664a9e.js","assets/index-5d4b1b48.js","assets/index-86c8a9da.css","assets/DataTableLoader-638347c7.js"])),E=U(()=>A(()=>import("./ServicesTab-aee92742.js"),["assets/ServicesTab-aee92742.js","assets/index-5d4b1b48.js","assets/index-86c8a9da.css","assets/DataTableLoader-638347c7.js"])),v=U(()=>A(()=>import("./RelatedListPanel-1e36df52.js"),["assets/RelatedListPanel-1e36df52.js","assets/index-5d4b1b48.js","assets/index-86c8a9da.css","assets/DataTableLoader-638347c7.js"])),M=U(()=>A(()=>import("./SectionFields-295449b4.js"),["assets/SectionFields-295449b4.js","assets/index-5d4b1b48.js","assets/index-86c8a9da.css","assets/DataTableLoader-638347c7.js"])),q=U(()=>A(()=>import("./UploadFileContent-aec0b978.js"),["assets/UploadFileContent-aec0b978.js","assets/index-5d4b1b48.js","assets/index-86c8a9da.css","assets/DataTableLoader-638347c7.js","assets/UploadFileContent-bb5410c6.css"])),S=c(),I=me(),k=c(0),g=We();He();const G=c(!0),T=c(),L=c(),ae=c();c();const Q=c(),W=c(),X=c(),Y=_e(),oe=ut(),ie=mt(),{fetchModule:pe,fetchBaseModule:m}=Y,{getModule:o,getBaseModule:n,getFieldDetailsById:Z}=B(Y),{itemLoading:$,relatedListLoading:Le,getItem:ee,getRelatedLists:te,_getRelatedOrderedLists:Re,getRelatedListsByCname:D,getItemPanels:ne,getItemValueByName:se}=B(oe),{fetchItem:Se,fetchItemRelatedList:Ie,fetchItemRelatedLists:Te}=oe,{fileLoading:ws,fileDialogSwitch:Ne,fileDialog:ve,getFiles:de,getModuleFiles:le}=B(ie),{addModuleFiles:je}=ie,Ce=c([{label:`${g.params.name}`,to:`/modules/${g.params.name}/${g.params.id}`},{label:`${g.params.name} details`,to:null}]),$e=c([{label:"Options",items:[{label:"Add files",icon:"pi pi-plus",command:()=>{Ne.value=!0,ve.value=!0,console.log(ve.value)}}]}]),De=i=>{k.value=i.index},he=async i=>{const _={moduleName:g.params.name,panelName:i.panelName};await Ie(_)},Ee=i=>{if(i){const _=i.getBoundingClientRect();return _.top>=0&&_.left>=0&&_.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&_.right<=(window.innerWidth||document.documentElement.clientWidth)}},be=()=>{ne.value.map(i=>{const _=document.getElementById(`rl-panel-${i._id}`);Ee(_)&&(console.log(`Element with ${i._id} id is visible`),he(i))})},Me=async i=>{const _=i.files,O=[],F=de.value.length>0?de.value[de.value.length-1]:0;_.map(P=>{let H=Object.assign({},{id:F+1,label:P.name,date:Date.now(),size:P.size,type:P.type,selected:!1});O.push(H)}),je(O),I.add({severity:"info",summary:"Success",detail:"File Uploaded",life:3e3})},ze=i=>{console.log(i)},Be=i=>{const _=le.value.findIndex(O=>O.id===i.id);le.value.splice(_,1)};return Je(te,(i,_)=>{i&&(Q.value=i)}),Ke(async()=>{await m(g.params.id),await pe(g.params.name),await Se(g.params),await Te(g.params),G.value=$.value,T.value=n.value,L.value=o.value,ae.value=ne.value,Q.value=te.value,W.value=ne.value.filter(i=>i.controllerMethod.includes("@index")),X.value=Re.value.filter(i=>i.entityName==="Contact"||i.entityName==="Unit"),window.addEventListener("scroll",be),be()}),(i,_)=>{const O=y("ProgressSpinner"),F=y("Button"),P=y("Panel"),H=y("TabPanel"),Oe=y("TabView"),Fe=y("Dropdown"),ge=y("font-awesome-icon"),Pe=y("Menu"),fe=y("Image"),Ve=y("FileUpload");return s(),a("div",null,[t(lt,{bcrumbs:Ce.value},null,8,["bcrumbs"]),G.value?(s(),a("div",_t,[t(O)])):(s(),a("div",pt,[e("div",vt,[e("div",ht,[(s(!0),a(j,null,C(L.value.fields,(l,R)=>(s(),a("div",{key:R},[e("div",{class:re(`${L.value.fields.length===R+1&&"mr-8"}`)},[l.title?(s(),a("div",bt,[l.groupWith?(s(),a("div",gt,[e("div",null,p(l.groupLabel),1),e("div",ft,[(s(!0),a(j,null,C(l.groupWith,(N,J)=>(s(),a("div",{key:J},[e("div",yt,p(u(se)(N))+p(l.fieldGlue===" "?" ":l.fieldGlue),1)]))),128))])])):(s(),a("div",xt,[e("div",null,p(l.label),1),e("div",wt,p(u(se)(l.name)),1)]))])):h("",!0)],2)]))),128)),(s(!0),a(j,null,C(L.value.fields,(l,R)=>(s(),a("div",{key:R},[l.header?(s(),a("div",kt,[e("div",null,p(l.label),1),e("div",Lt,p(u(se)(l.name)?u(se)(l.name):null),1)])):h("",!0)]))),128))]),e("div",null,[t(F,{label:"Edit",size:"large",class:"px-6 border-round-xl"})])]),e("div",Rt,[e("div",St,[e("div",It,[t(Oe,{onTabChange:De},{default:d(()=>[t(H,{header:"Details"},{default:d(()=>[e("div",null,[e("div",Tt,[(s(!0),a(j,null,C(W.value,(l,R)=>(s(),a("div",{key:R,class:"flex flex-column gap-1"},[(s(!0),a(j,null,C(l.sections,(N,J)=>(s(),a("div",{key:J,class:"shadow-1 mt-4"},[t(P,{class:"detail-page-panel"},{header:d(()=>[N.sectionLabel?(s(),a("div",Nt,[e("div",jt,p(N.sectionLabel),1),u(D)(l.panelName)?(s(),a("div",Ct,Dt)):h("",!0)])):h("",!0)]),default:d(()=>[e("div",Et,[l.controllerMethod.indexOf("@show")>-1?(s(),a("div",Mt,[u(D)(l.panelName)?(s(),a("div",zt,[u(D)(l.panelName)?(s(),z(K,{key:0},{fallback:d(()=>[t(Xe)]),default:d(()=>[t(u(w),{moduleId:l._id,moduleEntityName:l.entityName,moduleName:u(D)(l.panelName).link,moduleLabel:u(D)(l.panelName).label,fields:u(D)(l.panelName).fields.data,data:u(D)(l.panelName).collection.data,pagination:u(D)(l.panelName).collection.meta,collectionLoading:!1},null,8,["moduleId","moduleEntityName","moduleName","moduleLabel","fields","data","pagination"])]),_:2},1024)):h("",!0)])):(s(),a("div",{key:1,id:`rl-panel-${l._id}`},[e("div",{onClick:f=>he(l),class:"flex align-items-center gap-2 cursor-pointer text-700"},[Ft,Qe(" View data ")],8,Ot)],8,Bt))])):(s(),a("div",Pt,[N.field_ids.length>0?(s(),z(K,{key:0},{fallback:d(()=>[t(xe)]),default:d(()=>[t(u(M),{fieldIds:N.field_ids},null,8,["fieldIds"])]),_:2},1024)):h("",!0),N.additional_fields.length>0?(s(),a("div",Vt,[(s(!0),a(j,null,C(N.additional_fields,(f,V)=>(s(),a("div",{key:V},[f.ids.length>0?(s(),z(K,{key:0},{fallback:d(()=>[t(xe)]),default:d(()=>[t(u(M),{fieldIds:f.ids},null,8,["fieldIds"])]),_:2},1024)):h("",!0)]))),128))])):h("",!0)]))])]),_:2},1024)]))),128))]))),128)),t(u(v),{relatedLists:X.value},null,8,["relatedLists"])])])]),_:1}),T.value&&T.value.name==="accounts"?(s(),z(H,{key:0,header:"Sales"},{default:d(()=>[e("div",null,[k.value===1?(s(),z(K,{key:0},{fallback:d(()=>[t(ye,{class:"mt-4"})]),default:d(()=>[t(u(r))]),_:1})):h("",!0)])]),_:1})):h("",!0),T.value&&T.value.name==="accounts"?(s(),z(H,{key:1,header:"Services"},{default:d(()=>[e("div",null,[k.value===2?(s(),z(K,{key:0},{fallback:d(()=>[t(ye,{class:"mt-4"})]),default:d(()=>[t(u(E))]),_:1})):h("",!0)])]),_:1})):h("",!0)]),_:1})])]),e("div",Ut,[e("div",At,[e("div",qt,[e("div",Gt,[e("div",Wt,[Ht,e("div",null,[e("div",Jt,[t(Fe,{placeholder:"Filters",class:"border-round-xl border-primary w-full md:w-12rem"}),t(F,{label:"add activity",class:"ml-3 border-round-xl px-4"})])])])]),e("div",Kt,[(s(),a(j,null,C(["October 2023","November 2023","December 2023"],(l,R)=>t(P,{key:R,toggleable:"",collapsed:"",class:"activity-panel"},{header:d(()=>[e("div",Qt,[R===0?(s(),a("span",Xt,"This months")):h("",!0)])]),togglericon:d(()=>[t(ge,{icon:"fa-solid fa-caret-down",style:{"font-size":"1.5rem"}})]),icons:d(()=>[e("div",Yt,p(l),1)]),default:d(()=>[Zt]),_:2},1024)),64))])]),e("div",es,[e("div",ts,[e("div",ss,[ls,e("div",null,[e("div",{onClick:_[0]||(_[0]=l=>S.value.toggle(l)),class:"cursor-pointer"},[t(ge,{icon:"fa-regular fa-square-caret-down",style:{"font-size":"1.5rem"}})]),t(Pe,{ref_key:"fileMenu",ref:S,id:"overlay_menu",model:$e.value,popup:!0},null,8,["model"])])]),e("div",as,[os,is,e("div",null,[t(Ve,{name:"demo[]",url:"/api/upload",customUpload:"",onUploader:_[1]||(_[1]=l=>Me(l)),onError:_[2]||(_[2]=l=>ze(l)),multiple:!0,accept:"image/*",maxFileSize:5e6},{empty:d(()=>[u(le).length<=0?(s(),a("p",ns,"Drag and drop files to here to upload.")):h("",!0)]),content:d(({files:l,uploadedFiles:R,removeUploadedFileCallback:N,removeFileCallback:J})=>[l.length>0?(s(),a("div",ds,[(s(!0),a(j,null,C(l,(f,V)=>(s(),a("div",{key:V,class:"mb-2"},[e("div",cs,[e("div",rs,[t(fe,{src:"/demo/images/galleria/galleria6s.jpg",alt:"dummy-img",width:"50",class:"cursor-pointer"}),e("div",null,[e("a",us,p(f.name),1),e("div",ms,p(Date.now())+" • "+p(f.size)+" • "+p(f.type),1),_s])]),e("div",{onClick:Ue=>J(V),class:"cursor-pointer mr-2"},[t(F,{icon:"pi pi-times",severity:"danger",text:"",rounded:"","aria-label":"Cancel"})],8,ps)])]))),128))])):h("",!0),(s(!0),a(j,null,C(u(le),(f,V)=>(s(),a("div",{key:V,class:"mb-2"},[e("div",vs,[e("div",hs,[t(fe,{src:"/demo/images/galleria/galleria6s.jpg",alt:"dummy-img",width:"50",class:"cursor-pointer"}),e("div",null,[e("a",bs,p(f.label),1),e("div",gs,p(f.date)+" • "+p(f.size)+" • "+p(f.type),1)])]),e("div",{onClick:Ue=>Be(f),class:"cursor-pointer mr-2"},[t(F,{icon:"pi pi-times",severity:"danger",text:"",rounded:"","aria-label":"Cancel"})],8,fs)])]))),128))]),_:1})])])])]),ys])])])])),t(u(q),{module:L.value},null,8,["module"])])}}},Rs=Object.freeze(Object.defineProperty({__proto__:null,default:xs},Symbol.toStringTag,{value:"Module"}));export{Rs as S,mt as a,ut as u};
