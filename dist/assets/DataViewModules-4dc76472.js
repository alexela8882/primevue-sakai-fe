import{r as h,z as f,c as i,o as r,d as v,w as d,j as c,e,t as l,f as a}from"./index-3e251bf1.js";const b=e("div",{class:"flex align-items-center justify-content-between"},[e("div",null,[e("div",{class:"text-3xl"},"Modules")]),e("div")],-1),g={key:0,class:"col-12 sm:col-6 lg:col-12 xl:col-4 p-2"},p=["onClick"],x={class:"flex flex-column align-items-center gap-3 py-5"},w={class:"material-icons",style:{"font-size":"5rem"}},y={class:"text-2xl font-bold"},k={key:1,class:"col-12 sm:col-6 lg:col-12 xl:col-4 p-2"},$={class:"p-4 border-1 surface-border surface-card border-round"},B={class:"flex flex-column align-items-center gap-3 py-5"},C={key:0,class:"col-12 sm:col-6 lg:col-12 xl:col-4 p-2"},V=["onClick"],D={class:"flex flex-column align-items-center gap-3 py-5"},z={class:"material-icons",style:{"font-size":"5rem"}},M={class:"text-2xl font-bold"},N={key:1,class:"col-12 sm:col-6 lg:col-12 xl:col-4 p-2"},S={class:"p-4 border-1 surface-border surface-card border-round"},j={class:"flex flex-column align-items-center gap-3 py-5"},q={__name:"DataViewModules",props:{data:Array,loading:Boolean,paginator:Boolean,rows:Number},setup(t){const u=h("grid");return f(()=>{}),(n,A)=>{const s=i("Skeleton"),m=i("DataView");return r(),v(m,{value:t.data,layout:u.value,paginator:t.paginator,rows:t.rows},{header:d(()=>[b]),list:d(o=>[t.loading?(r(),c("div",k,[e("div",$,[e("div",B,[a(s,{class:"w-9 shadow-2 border-round h-10rem"}),a(s,{class:"w-8rem border-round h-2rem"}),a(s,{class:"w-6rem border-round h-1rem"})])])])):(r(),c("div",g,[e("div",{onClick:_=>n.$router.push(`/modules/${o.data.name}/${o.data._id}`),class:"p-4 border-1 surface-border surface-card border-round cursor-pointer"},[e("div",x,[e("div",w,l(o.data.icon),1),e("div",y,l(o.data.label),1)])],8,p)]))]),grid:d(o=>[t.loading?(r(),c("div",N,[e("div",S,[e("div",j,[a(s,{class:"w-9 shadow-2 border-round h-10rem"}),a(s,{class:"w-8rem border-round h-2rem"}),a(s,{class:"w-6rem border-round h-1rem"})])])])):(r(),c("div",C,[e("div",{onClick:_=>n.$router.push(`/modules/${o.data.name}/${o.data._id}`),class:"p-4 border-1 surface-border surface-card border-round cursor-pointer"},[e("div",D,[e("div",z,l(o.data.icon),1),e("div",M,l(o.data.label),1)])],8,V)]))]),_:1},8,["value","layout","paginator","rows"])}}};export{q as default};