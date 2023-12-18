import{H as ie,W as de,v as H,s as E,r as s,I as A,q as re,J as ue,a5 as ce,z as me,a6 as pe,c as v,o as a,d as N,w as _,j as l,e as r,g as ge,f as c,t as b,m as f,R as F,F as U,k as z,i as M,a7 as ve,a8 as ye}from"./index-0f359a5b.js";const be=ie("moduleDynamicTableStore",()=>{const n=de(),R=H(),{jsonDbUrl:u}=E(n);E(R);const x=s(!1),p=s([]),C=A(()=>p.value),L=A(()=>y=>{const m=p.value.find(k=>k.module===y);return m?m.content:null});return{getDropdownLists:C,getDropdown:L,fetchDropdownLists:async y=>{x.value=!0;const m=await re(`${u.value}/${y}`,{method:"GET",headers:{"Content-Type":"application/json"}});if(m.status===200&&m.data&&!p.value.find(g=>g.module===y)){let g=Object.assign({},{module:y,content:m.data});p.value.push(g)}x.value=!1}}});const fe={key:0},he={class:"flex align-items-center justify-content-between"},we={key:0},_e={key:0,class:"mr-1"},xe={key:1,class:"mr-1"},ke={href:"javascript:void(0);",style:{color:"red"}},Se={key:2,class:"mr-1"},Ce={href:"javascript:void(0);"},De={key:1},Ve={key:0},Me=["onClick"],Ee={key:0,style:{overflow:"scroll"}},Re={key:0},Le={key:0,class:"flex align-items-center justify-content-center"},Te={key:1,class:"my-1"},je={key:2,class:"my-1"},Ne={key:1},Ue={key:0,class:"md:flex justify-content-between font-light"},ze={class:"flex align-items-center px-3"},Be={class:"text-sm text-color-secondary"},$e={class:"text-sm text-color-secondary"},Oe={style:{overflow:"scroll","max-height":"100%"}},Ie=r("div",{class:"ddt-div-1 shadow-4 bg-white"},null,-1),Ke={__name:"DynamicDataTableMain",props:{mode:String,sidebar:Boolean,moduleId:String,moduleEntityName:String,moduleName:String,moduleLabel:String,data:Array,pagination:Object,pageItems:Array,rows:Number,pages:Number,fields:Array,collectionLoading:Boolean},emits:["toggle-sidebar"],setup(n,{emit:R}){const u=n,x=s(null),p=s(!1),C=s([]),L=ue(),B=s(),y=s(),m=s();s(),s();const k=s(),g=s(),h=s(),$=H(),O=be(),{getCollection:Pe,getBaseModule:T,getEntity:D}=E($),{fetchModule:J,fetchBaseModule:Ae,fetchCollection:Fe}=$,{getDropdownLists:He,getDropdown:I}=E(O),{fetchDropdownLists:K}=O;s([{label:"View",icon:"pi pi-fw pi-search",command:()=>console.log(g.value)},{label:"Delete",icon:"pi pi-fw pi-times",command:()=>console.log(g.value)}]);const q=s([{label:"View",icon:"pi pi-reply",command:t=>{console.log(t),console.log(h.value);const o=Object.assign({},{name:"modules.pages.detail",params:{name:u.moduleName,id:u.moduleId,pageid:h.value._id}});ce.push(o)}},{label:"Change Owner",icon:"pi pi-user",command:t=>{console.log(t),console.log(h.value)},visible:u.moduleEntityName===T.value.mainEntity},{label:"Update",icon:"pi pi-refresh",command:t=>{console.log(t),console.log(h.value)},visible:u.moduleEntityName===T.value.mainEntity},{label:"Delete",icon:"pi pi-times",command:t=>{console.log(t),console.log(h.value)},visible:u.moduleEntityName===T.value.mainEntity}]),G=s([{label:"10",value:10},{label:"15",value:15},{label:"20",value:20},{label:"25",value:25},{label:"30",value:30},{label:"35",value:35},{label:"40",value:40},{label:"45",value:45},{label:"50",value:50}]),W=t=>{const o=t.relation&&t.relation.entity_id.name;p.value=!0,console.log(D.value(o)),K(D.value(o).name)},Q=async(t,o)=>{let d=1;o?d=u.pagination.current_page:d=t.page+1,await J(u.moduleName,d>1?d:null)},X=t=>{},Y=t=>{let{newData:o,index:d}=t;u.data[d]=o},Z=(t,o)=>{m.value.toggle(t),h.value=o},ee=t=>{p.value=!1;let{data:o,newValue:d,field:V}=t;o[V]=d};return me(async()=>{console.log(L.params)}),pe(x,t=>{t.target&&t.target.attributes.class.value!=="p-dropdown-item"&&R("toggle-sidebar",!1)}),(t,o)=>{const d=v("Column"),V=v("inputText"),P=v("Dropdown"),te=v("Button"),oe=v("Menu"),ae=v("Divider"),ne=v("Paginator"),le=v("DataTable");return a(),N(le,{selection:k.value,"onUpdate:selection":o[2]||(o[2]=e=>k.value=e),contextMenuSelection:g.value,"onUpdate:contextMenuSelection":o[3]||(o[3]=e=>g.value=e),editingRows:C.value,"onUpdate:editingRows":o[4]||(o[4]=e=>C.value=e),editMode:p.value?"cell":null,onCellEditComplete:ee,onRowEditSave:Y,onRowContextmenu:X,tableClass:"editable-cells-table",value:n.data,loading:n.collectionLoading,stripedRows:"",stateStorage:"local",stateKey:`dt-state-${n.moduleLabel}`,resizableColumns:"",columnResizeMode:"fit",sortMode:"multiple",removableSort:"",scrollable:"",scrollHeight:"60vh",class:"dynamic-tbl"},{footer:_(()=>[n.pagination?(a(),l("div",Ue,[r("div",ze,[r("div",Be,[ge(" Items per page: "),c(P,{modelValue:n.pagination.per_page,"onUpdate:modelValue":o[0]||(o[0]=e=>n.pagination.per_page=e),options:G.value,optionLabel:"label",optionValue:"value",placeholder:"Select a page",class:"filled-dropdown"},null,8,["modelValue","options"])]),c(ae,{type:"solid",layout:"vertical"}),r("div",$e,b(n.pagination.current_page)+" - "+b(n.pagination.total_pages)+" of "+b(n.pagination.total)+" items ",1)]),c(ne,{onPage:o[1]||(o[1]=e=>Q(e,!1)),template:"JumpToPageDropdown PrevPageLink NextPageLink",rows:n.pagination&&n.pagination.per_page,totalRecords:n.pagination&&n.pagination.total,rowsPerPageOptions:[5,10,15,20,25,30],class:"custom-paginator"},null,8,["rows","totalRecords"])])):f("",!0)]),default:_(()=>[n.mode==="edit"?(a(),N(d,{key:0,frozen:"",headerClass:"custom-header bg-primary-100 text-color-secondary",style:F(`min-width: 60px; ${B.value}`),bodyClass:"text-center py-1",selectionMode:"multiple"},null,8,["style"])):f("",!0),(a(!0),l(U,null,z(n.fields,e=>(a(),N(d,{key:e._id,field:e.name,header:e.label,sortable:"",sorticon:"check",style:{"min-width":"200px !important"},bodyClass:`text-color-secondary ${n.mode==="edit"?"py-1":"py-2"}`,headerClass:"bg-primary-100 text-color-secondary"},{body:_(i=>[i.data[e.name]?(a(),l("div",fe,[r("div",he,[r("div",null,[e.relation?(a(),l("span",we,[(a(!0),l(U,null,z(e.relation.displayFieldName,(S,w)=>(a(),l("span",{key:w},[e.rules.ss_pop_up?(a(),l("span",_e,b(i.data[e.name][S]),1)):e.rules.ss_dropdown?(a(),l("span",xe,[r("a",ke,b(i.data[e.name][S]),1)])):(a(),l("span",Se,[r("a",Ce,b(i.data[e.name][S]),1)]))]))),128))])):(a(),l("span",De,b(i.data[e.name]),1))]),n.mode==="edit"?(a(),l("div",Ve,[r("i",{onClick:S=>W(e),class:"edit-icon cursor-pointer pi pi-pencil ml-3"},null,8,Me)])):f("",!0)])])):f("",!0)]),editor:_(({data:i,field:S})=>[i[e.name]?(a(),l("div",Ee,[e.relation?(a(),l("div",Re,[(a(!0),l(U,null,z(e.relation.displayFieldName,(w,se)=>(a(),l("div",{key:se},[e.rules.ss_pop_up?(a(),l("div",Le,[r("div",null,[c(V,{modelValue:i[e.name][w],"onUpdate:modelValue":j=>i[e.name][w]=j,style:{"box-sizing":"border-box","max-width":"100%"}},null,8,["modelValue","onUpdate:modelValue"])])])):f("",!0),e.rules.ss_dropdown?(a(),l("div",Te,[c(P,{modelValue:i[e.name]._id,"onUpdate:modelValue":j=>i[e.name]._id=j,options:M(I)(M(D)(e.relation.entity_id.name).name)&&M(I)(M(D)(e.relation.entity_id.name).name).collection.data,optionLabel:"name",optionValue:"_id",placeholder:`Select a ${e.relation.entity_id.name}`,class:"border-round-xl border-primary w-full md:w-12rem mr-2 mb-2 md:mb-0"},null,8,["modelValue","onUpdate:modelValue","options","placeholder"])])):(a(),l("div",je," Other edits here... "))]))),128))])):(a(),l("div",Ne,[c(V,{modelValue:i[e.name],"onUpdate:modelValue":w=>i[e.name]=w,style:{"box-sizing":"border-box","max-width":"100%"}},null,8,["modelValue","onUpdate:modelValue"])]))])):f("",!0)]),_:2},1032,["field","header","bodyClass"]))),128)),c(d,{frozen:"",alignFrozen:"right",exportable:!1,style:F(`min-width: 60px; ${y.value}`),bodyClass:"text-color-secondary text-center py-1",headerClass:"bg-primary-100 text-color-secondary"},{body:_(e=>[c(te,{class:"menu-btn",icon:"pi pi-ellipsis-v",text:"",size:"small",onClick:i=>Z(i,e.data),"aria-haspopup":"true","aria-controls":"overlay_menu",style:{"font-size":".3rem",padding:"2px 0","background-color":"transparent"}},null,8,["onClick"]),c(oe,{ref_key:"menu",ref:m,id:"overlay_menu","data-value":e,model:q.value,popup:!0},null,8,["data-value","model"])]),_:1},8,["style"]),c(ve,{name:"lvf-slide-fade"},{default:_(()=>[n.sidebar?(a(),l("div",{key:0,ref_key:"listViewFilterRef",ref:x,class:"ddt-slot-1 shadow-4 bg-white"},[r("div",Oe,[ye(t.$slots,"list-view-filter")]),Ie],512)):f("",!0)]),_:3})]),_:3},8,["selection","contextMenuSelection","editingRows","editMode","value","loading","stateKey"])}}};export{Ke as default};
