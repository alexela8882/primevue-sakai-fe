import{D as v,x as g,r as a,c as l,o as S,j as C,e as o,n as b,i as D,f as e,w as p,g as A,E,G as T}from"./index-5d4b1b48.js";const I=n=>(E("data-v-5621c215"),n=n(),T(),n),P={class:"flex flex-column gap-3 mb-5 mt-5"},V={class:"flex justify-content-between"},Z={class:"flex flex-column"},z={class:"flex justify-content-between"},B={class:"flex gap-3"},N={class:"p-input-icon-left"},j=I(()=>o("i",{class:"pi pi-search"},null,-1)),k={__name:"index",setup(n){const{isDarkTheme:u}=g(),i=a(null),_=a([{name:"Philippines"},{name:"Singapore"},{name:"Indonesia"}]),r=a(),m=a([{country_name:"Philippines",region:"Africa",electrical_outlet:"Type D",plug_code:"D",power_supply_1:"ZESA",power_supply_2:"ZESA"},{country_name:"Singapore",region:"Africa",electrical_outlet:"Type D",plug_code:"D",power_supply_1:"ZESA",power_supply_2:"ZESA"},{country_name:"Indonesia",region:"Africa",electrical_outlet:"Type D",plug_code:"D",power_supply_1:"ZESA",power_supply_2:"ZESA"}]);return(L,s)=>{const f=l("font-awesome-icon"),y=l("Button"),d=l("Dropdown"),w=l("InputText"),t=l("Column"),h=l("DataTable"),x=l("Card");return S(),C("div",P,[o("div",null,[o("div",V,[o("div",Z,[o("span",{class:b(["text-xl font-bold",`${D(u)?"text-surface-50":"text-blue-800"}`])},"Country",2)]),o("div",null,[e(y,{class:"reddot-button-primary flex border-round-lg py-2 px-4",size:"small"},{default:p(()=>[e(f,{icon:"fa-solid fa-plus",size:"xs"}),A("  Add Country ")]),_:1})])])]),o("div",z,[o("div",B,[e(d,{modelValue:i.value,"onUpdate:modelValue":s[0]||(s[0]=c=>i.value=c),options:_.value,optionLabel:"name",placeholder:"All countries",size:"small",showClear:"",class:"w-full md:w-14rem"},null,8,["modelValue","options"]),e(d,{optionLabel:"name",placeholder:"Select fields",size:"small",showClear:"",class:"w-full md:w-14rem"})]),o("div",null,[o("span",N,[j,e(w,{placeholder:"Search"})])])]),o("div",null,[e(x,null,{content:p(()=>[e(h,{selection:r.value,"onUpdate:selection":s[1]||(s[1]=c=>r.value=c),value:m.value,dataKey:"country_name",paginator:"",rows:5,rowsPerPageOptions:[5,10,20,50],tableStyle:"min-width: 50rem"},{default:p(()=>[e(t,{selectionMode:"multiple",headerStyle:"width: 3rem"}),e(t,{field:"country_name",header:"Country Name"}),e(t,{field:"region",header:"Region"}),e(t,{field:"electrical_outlet",header:"Electrical Outlet"}),e(t,{field:"plug_code",header:"Plug Code"}),e(t,{field:"power_supply_1",header:"Power Supply 1"}),e(t,{field:"power_supply_2",header:"Power Supply 2"})]),_:1},8,["selection","value"])]),_:1})])])}}},U=v(k,[["__scopeId","data-v-5621c215"]]);export{U as default};
