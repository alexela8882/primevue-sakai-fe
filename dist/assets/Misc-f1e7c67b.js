import{r as x,z as w,Q as z,c as t,O as B,o as P,j as S,e as s,f as e,P as u,w as h}from"./index-0f359a5b.js";const k={class:"grid"},q={class:"col-12"},A={class:"card"},T=s("h5",null,"ProgressBar",-1),C={class:"grid"},I={class:"col"},M={class:"col"},D={class:"col-12 lg:col-6"},E={class:"card"},V=s("h4",null,"Badge",-1),j=s("h5",null,"Numbers",-1),G={class:"badges"},N=s("h5",null,"Positioned Badge",-1),L={class:"pi pi-bell mr-4 p-text-secondary",style:{"font-size":"2rem"}},U={class:"pi pi-calendar mr-4 p-text-secondary",style:{"font-size":"2rem"}},W={class:"pi pi-envelope p-text-secondary",style:{"font-size":"2rem"}},F=s("h5",null,"Inline Button Badge",-1),O=s("h5",null,"Sizes",-1),J={class:"badges"},Q={class:"card"},H=s("h4",null,"Avatar",-1),K=s("h5",null,"Avatar Group",-1),R=s("h5",null,"Label - Circle",-1),X=s("h5",null,"Icon - Badge",-1),Y={class:"card"},Z=s("h4",null,"ScrollTop",-1),$=s("p",null," Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae et leo duis ut diam. Ultricies mi quis hendrerit dolor magna eget est lorem. Amet consectetur adipiscing elit ut. Nam libero justo laoreet sit amet. Pharetra massa massa ultricies mi quis hendrerit dolor magna. Est ultricies integer quis auctor elit sed vulputate. Consequat ac felis donec et. Tellus orci ac auctor augue mauris. Semper feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Tincidunt arcu non sodales neque sodales. Metus aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices. Sodales ut etiam sit amet nisl purus. Cursus sit amet dictum sit amet. Tristique senectus et netus et malesuada fames ac turpis egestas. Et tortor consequat id porta nibh venenatis cras sed. Diam maecenas ultricies mi eget mauris. Eget egestas purus viverra accumsan in nisl nisi. Suscipit adipiscing bibendum est ultricies integer. Mattis aliquam faucibus purus in massa tempor nec. ",-1),ee={class:"col-12 lg:col-6"},se={class:"card"},ae=s("h4",null,"Tag",-1),le=s("h5",null,"Tags",-1),ie=s("h5",null,"Pills",-1),te=s("h5",null,"Icons",-1),oe={class:"card"},re=s("h4",null,"Chip",-1),ne=s("h5",null,"Basic",-1),ce={class:"flex align-items-center flex-column sm:flex-row"},ue=s("h5",null,"Icon",-1),de={class:"flex align-items-center flex-column sm:flex-row"},me=s("h5",null,"Image",-1),ge={class:"flex align-items-center flex-column sm:flex-row"},_e={class:"card"},he=s("h4",null,"Skeleton",-1),ve={class:"border-round border-1 surface-border p-4"},pe={class:"flex mb-3"},be={class:"flex justify-content-between mt-3"},we={__name:"Misc",setup(fe){const d=x(0);let m=null;const v=()=>{m=setInterval(()=>{let n=d.value+Math.floor(Math.random()*10)+1;n>=100&&(n=100),d.value=n},2e3)},p=()=>{clearInterval(m),m=null};return w(()=>{v()}),z(()=>{p()}),(n,ye)=>{const g=t("ProgressBar"),o=t("Badge"),_=t("Button"),i=t("Avatar"),b=t("AvatarGroup"),f=t("ScrollTop"),y=t("ScrollPanel"),a=t("Tag"),l=t("Chip"),r=t("Skeleton"),c=B("badge");return P(),S("div",k,[s("div",q,[s("div",A,[T,s("div",C,[s("div",I,[e(g,{value:d.value},null,8,["value"])]),s("div",M,[e(g,{value:50,showValue:!1})])])])]),s("div",D,[s("div",E,[V,j,s("div",G,[e(o,{value:2,class:"mr-2"}),e(o,{value:8,severity:"success",class:"mr-2"}),e(o,{value:4,severity:"info",class:"mr-2"}),e(o,{value:12,severity:"warning",class:"mr-2"}),e(o,{value:3,severity:"danger"})]),N,u(s("i",L,null,512),[[c,2]]),u(s("i",U,null,512),[[c,"10+",void 0,{danger:!0}]]),u(s("i",W,null,512),[[c,void 0,void 0,{danger:!0}]]),F,e(_,{label:"Emails",badge:"8",class:"mr-2"}),e(_,{label:"Messages",icon:"pi pi-users",class:"p-button-warning",badge:"8",badgeClass:"p-badge-danger"}),O,s("div",J,[e(o,{value:2,class:"mr-2"}),e(o,{value:4,size:"large",severity:"warning",class:"mr-2"}),e(o,{value:6,size:"xlarge",severity:"success"})])]),s("div",Q,[H,K,e(b,{class:"mb-3"},{default:h(()=>[e(i,{image:"demo/images/avatar/amyelsner.png",size:"large",shape:"circle"},null,8,["image"]),e(i,{image:"demo/images/avatar/asiyajavayant.png",size:"large",shape:"circle"},null,8,["image"]),e(i,{image:"demo/images/avatar/onyamalimba.png",size:"large",shape:"circle"},null,8,["image"]),e(i,{image:"demo/images/avatar/ionibowcher.png",size:"large",shape:"circle"},null,8,["image"]),e(i,{image:"demo/images/avatar/xuxuefeng.png",size:"large",shape:"circle"},null,8,["image"]),e(i,{label:"+2",shape:"circle",size:"large",style:{"background-color":"#9c27b0",color:"#ffffff"}})]),_:1}),R,e(i,{label:"P",class:"mr-2",size:"xlarge",shape:"circle"}),e(i,{label:"V",class:"mr-2",size:"large",style:{"background-color":"#2196F3",color:"#ffffff"},shape:"circle"}),e(i,{label:"U",class:"mr-2",style:{"background-color":"#9c27b0",color:"#ffffff"},shape:"circle"}),X,u(e(i,{icon:"pi pi-user",class:"mr-2",size:"xlarge"},null,512),[[c,4,void 0,{success:!0}]])]),s("div",Y,[Z,e(y,{style:{width:"250px",height:"200px"}},{default:h(()=>[$,e(f,{target:"parent",threshold:100,icon:"pi pi-arrow-up"})]),_:1})])]),s("div",ee,[s("div",se,[ae,le,e(a,{class:"mr-2",value:"Primary"}),e(a,{class:"mr-2",severity:"success",value:"Success"}),e(a,{class:"mr-2",severity:"info",value:"Info"}),e(a,{class:"mr-2",severity:"warning",value:"Warning"}),e(a,{severity:"danger",value:"Danger"}),ie,e(a,{class:"mr-2",value:"Primary",rounded:!0}),e(a,{class:"mr-2",severity:"success",value:"Success",rounded:!0}),e(a,{class:"mr-2",severity:"info",value:"Info",rounded:!0}),e(a,{class:"mr-2",severity:"warning",value:"Warning",rounded:!0}),e(a,{severity:"danger",value:"Danger",rounded:!0}),te,e(a,{class:"mr-2",icon:"pi pi-user",value:"Primary"}),e(a,{class:"mr-2",icon:"pi pi-check",severity:"success",value:"Success"}),e(a,{class:"mr-2",icon:"pi pi-info-circle",severity:"info",value:"Info"}),e(a,{class:"mr-2",con:"pi pi-exclamation-triangle",severity:"warning",value:"Warning"}),e(a,{icon:"pi pi-times",severity:"danger",value:"Danger"})]),s("div",oe,[re,ne,s("div",ce,[e(l,{label:"Action",class:"mr-2 mb-2"}),e(l,{label:"Comedy",class:"mr-2 mb-2"}),e(l,{label:"Mystery",class:"mr-2 mb-2"}),e(l,{label:"Thriller",removable:!0,class:"mb-2"})]),ue,s("div",de,[e(l,{label:"Apple",icon:"pi pi-apple",class:"mr-2 mb-2"}),e(l,{label:"Facebook",icon:"pi pi-facebook",class:"mr-2 mb-2"}),e(l,{label:"Google",icon:"pi pi-google",class:"mr-2 mb-2"}),e(l,{label:"Microsoft",icon:"pi pi-microsoft",removable:!0,class:"mb-2"})]),me,s("div",ge,[e(l,{label:"Amy Elsner",image:"demo/images/avatar/amyelsner.png",class:"mr-2 mb-2"},null,8,["image"]),e(l,{label:"Asiya Javayant",image:"demo/images/avatar/asiyajavayant.png",class:"mr-2 mb-2"},null,8,["image"]),e(l,{label:"Onyama Limba",image:"demo/images/avatar/onyamalimba.png",class:"mr-2 mb-2"},null,8,["image"])])]),s("div",_e,[he,s("div",ve,[s("div",pe,[e(r,{shape:"circle",size:"4rem",class:"mr-2"}),s("div",null,[e(r,{width:"10rem",class:"mb-2"}),e(r,{width:"5rem",class:"mb-2"}),e(r,{height:".5rem"})])]),e(r,{width:"100%",height:"150px"}),s("div",be,[e(r,{width:"4rem",height:"2rem"}),e(r,{width:"4rem",height:"2rem"})])])])])])}}};export{we as default};
