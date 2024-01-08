import{v as D,s as A,x as M,r as n,y as E,z as B,A as N,c as o,o as p,j as P,e,n as m,i as s,f as l,w as x,d as $,S as R,F as V,B as c,g as J,C as O,_ as F}from"./index-5d4b1b48.js";import{P as L}from"./ProductService-c3f21ab6.js";const Y={class:"mb-5 mt-5"},q={class:"flex justify-content-between"},z={class:"flex flex-column"},K={class:"grid reddot-gutter"},G=c('<div class="col-12 lg:col-6 xl:col-3"><div class="card mb-0"><div class="flex justify-content-between"><div><span class="block text-500 font-medium">Orders</span><div class="text-900 font-medium text-xl">152</div></div><div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem;"><i class="pi pi-shopping-cart text-blue-500 text-xl"></i></div></div><span class="text-green-500 font-medium">24 new </span><span class="text-500">since last visit</span></div></div><div class="col-12 lg:col-6 xl:col-3"><div class="card mb-0"><div class="flex justify-content-between"><div><span class="block text-500 font-medium">Revenue</span><div class="text-900 font-medium text-xl">$2.100</div></div><div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem;"><i class="pi pi-map-marker text-orange-500 text-xl"></i></div></div><span class="text-green-500 font-medium">%52+ </span><span class="text-500">since last week</span></div></div><div class="col-12 lg:col-6 xl:col-3"><div class="card mb-0"><div class="flex justify-content-between"><div><span class="block text-500 font-medium">Customers</span><div class="text-900 font-medium text-xl">28441</div></div><div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width:2.5rem;height:2.5rem;"><i class="pi pi-inbox text-cyan-500 text-xl"></i></div></div><span class="text-green-500 font-medium">520 </span><span class="text-500">newly registered</span></div></div><div class="col-12 lg:col-6 xl:col-3"><div class="card mb-0"><div class="flex justify-content-between"><div><span class="block text-500 font-medium">Comments</span><div class="text-900 font-medium text-xl">152 Unread</div></div><div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width:2.5rem;height:2.5rem;"><i class="pi pi-comment text-purple-500 text-xl"></i></div></div><span class="text-green-500 font-medium">85 </span><span class="text-500">responded</span></div></div>',4),H={class:"col-12 xl:col-6"},I={class:"col-12 xl:col-6"},U={class:"card"},W=e("h5",null,"Sales Overview",-1),X={class:"card"},Q={class:"flex align-items-center justify-content-between mb-4"},Z=e("h5",null,"Notifications",-1),ee=c('<span class="block text-600 font-medium">TODAY</span><ul class="p-0 mx-0 mt-0 mb-4 list-none"><li class="flex align-items-center py-2 border-bottom-1 surface-border"><div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0"><i class="pi pi-dollar text-xl text-blue-500"></i></div><span class="text-900 line-height-3">Richard Jones <span class="text-700">has purchased a blue t-shirt for <span class="text-blue-500">79$</span></span></span></li><li class="flex align-items-center py-2"><div class="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0"><i class="pi pi-download text-xl text-orange-500"></i></div><span class="text-700 line-height-3">Your request for withdrawal of <span class="text-blue-500 font-medium">2500$</span> has been initiated.</span></li></ul><span class="block text-600 font-medium">YESTERDAY</span><ul class="p-0 m-0 list-none"><li class="flex align-items-center py-2 border-bottom-1 surface-border"><div class="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0"><i class="pi pi-dollar text-xl text-blue-500"></i></div><span class="text-900 line-height-3">Keyser Wick <span class="text-700">has purchased a black jacket for <span class="text-blue-500">59$</span></span></span></li><li class="flex align-items-center py-2 border-bottom-1 surface-border"><div class="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0"><i class="pi pi-question text-xl text-pink-500"></i></div><span class="text-900 line-height-3">Jane Davis <span class="text-700">has posted a new questions about your product.</span></span></li></ul>',4),te=c('<div class="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between" style="border-radius:1rem;background:linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1c80cf 47.88%, #ffffff 100.01%);"><div><div class="text-blue-100 font-medium text-xl mt-2">TAKE THE NEXT STEP</div><div class="text-white font-medium text-5xl">Try PrimeBlocks</div></div><div class="mt-4 mr-auto md:mt-0 md:mr-0"><a href="https://www.primefaces.org/primeblocks-vue" class="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised"> Get Started </a></div></div>',1),ie={__name:"Dashboard",setup(se){const r=D(),{modulesLoading:f,getModules:b}=A(r),{fetchModules:v}=r,g=O({loader:()=>F(()=>import("./DataViewModules-e7d98513.js"),["assets/DataViewModules-e7d98513.js","assets/index-5d4b1b48.js","assets/index-86c8a9da.css"]),delay:200,timeout:3e3}),{isDarkTheme:a}=M(),h=n(null),_=E({labels:["January","February","March","April","May","June","July"],datasets:[{label:"First Dataset",data:[65,59,80,81,56,55,40],fill:!1,backgroundColor:"#2f4860",borderColor:"#2f4860",tension:.4},{label:"Second Dataset",data:[28,48,40,19,86,27,90],fill:!1,backgroundColor:"#00bb7e",borderColor:"#00bb7e",tension:.4}]}),y=n([{label:"Add New",icon:"pi pi-fw pi-plus"},{label:"Remove",icon:"pi pi-fw pi-minus"}]),i=n(null),w=new L;B(()=>{v(),w.getProductsSmall().then(t=>h.value=t)});const k=()=>{i.value={plugins:{legend:{labels:{color:"#495057"}}},scales:{x:{ticks:{color:"#495057"},grid:{color:"#ebedef"}},y:{ticks:{color:"#495057"},grid:{color:"#ebedef"}}}}},j=()=>{i.value={plugins:{legend:{labels:{color:"#ebedef"}}},scales:{x:{ticks:{color:"#ebedef"},grid:{color:"rgba(160, 167, 181, .3)"}},y:{ticks:{color:"#ebedef"},grid:{color:"rgba(160, 167, 181, .3)"}}}}};return N(a,t=>{t?j():k()},{immediate:!0}),(t,d)=>{const u=o("Button"),C=o("Chart"),S=o("Menu");return p(),P(V,null,[e("div",Y,[e("div",q,[e("div",z,[e("span",{class:m(["font-semibold",`${s(a)?"text-surface-50":"text-blue-800"}`])},"Dashboard",2),e("span",{class:m(["text-xl font-bold",`${s(a)?"text-surface-50":"text-blue-800"}`])},"Analytic Module",2)]),e("div",null,[l(u,{class:"reddot-primary border-round-3xl py-2 px-4 text-surface-50",size:"small"},{default:x(()=>[J("Add reports")]),_:1})])])]),e("div",K,[G,e("div",H,[(p(),$(R,null,{default:x(()=>[l(s(g),{data:s(b),loading:s(f),paginator:!0,rows:5},null,8,["data","loading"])]),_:1}))]),e("div",I,[e("div",U,[W,l(C,{type:"line",data:_,options:i.value},null,8,["data","options"])]),e("div",X,[e("div",Q,[Z,e("div",null,[l(u,{icon:"pi pi-ellipsis-v",class:"p-button-text p-button-plain p-button-rounded",onClick:d[0]||(d[0]=T=>t.$refs.menu1.toggle(T))}),l(S,{ref:"menu1",popup:!0,model:y.value},null,8,["model"])])]),ee]),te])])],64)}}};export{ie as default};
