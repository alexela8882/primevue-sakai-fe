import{a as C,r as u,c as r,o as v,j as b,e,f as o,w as _,T as I,F as x,k as E,d as $,g as M,t as B}from"./index-a038a467.js";const S={class:"grid"},D={class:"col-12 lg:col-6"},U={class:"card"},W=e("h5",null,"Toast",-1),q={class:"col-12 lg:col-6"},N={class:"card"},F=e("h5",null,"Messages",-1),j={class:"col-12 lg:col-8"},G={class:"card"},H=e("h5",null,"Inline",-1),L={class:"field grid"},P=e("label",{for:"username1",class:"col-fixed w-9rem"},"Username",-1),z={class:"col"},A={class:"field grid"},J=e("label",{for:"email",class:"col-fixed w-9rem"},"Email",-1),K={class:"col"},O={class:"col-12 lg:col-4"},Q={class:"card"},R=e("h5",null,"Help Text",-1),X={class:"field p-fluid"},Y=e("label",{for:"username2"},"Username",-1),Z=e("small",{id:"username-help",class:"p-error"},"Enter your username to reset your password.",-1),te={__name:"Messages",setup(ee){const i=C(),a=u([]),f=u(null),g=u(null),d=u(0),c=n=>{n==="success"?a.value=[{severity:"success",detail:"Success Message",content:"Message sent",id:d.value++}]:n==="info"?a.value=[{severity:"info",detail:"Info Message",content:"PrimeVue rocks",id:d.value++}]:n==="warn"?a.value=[{severity:"warn",detail:"Warn Message",content:"There are unsaved changes",id:d.value++}]:n==="error"&&(a.value=[{severity:"error",detail:"Error Message",content:"Validation failed",id:d.value++}])},y=()=>{i.add({severity:"success",summary:"Success Message",detail:"Message Detail",life:3e3})},h=()=>{i.add({severity:"info",summary:"Info Message",detail:"Message Detail",life:3e3})},w=()=>{i.add({severity:"warn",summary:"Warn Message",detail:"Message Detail",life:3e3})},k=()=>{i.add({severity:"error",summary:"Error Message",detail:"Message Detail",life:3e3})};return(n,s)=>{const T=r("Toast"),l=r("Button"),V=r("Message"),m=r("InputText"),p=r("InlineMessage");return v(),b("div",S,[e("div",D,[e("div",U,[W,o(T),o(l,{onClick:s[0]||(s[0]=t=>y()),label:"Success",class:"p-button-success mr-2"}),o(l,{onClick:s[1]||(s[1]=t=>h()),label:"Info",class:"p-button-info mr-2"}),o(l,{onClick:s[2]||(s[2]=t=>w()),label:"Warn",class:"p-button-warning mr-2"}),o(l,{onClick:s[3]||(s[3]=t=>k()),label:"Error",class:"p-button-danger mr-2"})])]),e("div",q,[e("div",N,[F,o(l,{label:"Success",onClick:s[4]||(s[4]=t=>c("success")),class:"p-button-success mr-2"}),o(l,{label:"Info",onClick:s[5]||(s[5]=t=>c("info")),class:"p-button-info mr-2"}),o(l,{label:"Warn",onClick:s[6]||(s[6]=t=>c("warn")),class:"p-button-warning mr-2"}),o(l,{label:"Error",onClick:s[7]||(s[7]=t=>c("error")),class:"p-button-danger mr-2"}),o(I,{name:"p-message",tag:"div"},{default:_(()=>[(v(!0),b(x,null,E(a.value,t=>(v(),$(V,{severity:t.severity,key:t.content},{default:_(()=>[M(B(t.content),1)]),_:2},1032,["severity"]))),128))]),_:1})])]),e("div",j,[e("div",G,[H,e("div",L,[P,e("div",z,[o(m,{id:"username1",modelValue:f.value,"onUpdate:modelValue":s[8]||(s[8]=t=>f.value=t),required:!0,class:"p-invalid mr-2"},null,8,["modelValue"]),o(p,null,{default:_(()=>[M("Username is required")]),_:1})])]),e("div",A,[J,e("div",K,[o(m,{id:"email",modelValue:g.value,"onUpdate:modelValue":s[9]||(s[9]=t=>g.value=t),required:!0,class:"p-invalid mr-2"},null,8,["modelValue"]),o(p)])])])]),e("div",O,[e("div",Q,[R,e("div",X,[Y,o(m,{id:"username2",type:"username",class:"p-error","aria-describedby":"username-help"}),Z])])])])}}};export{te as default};