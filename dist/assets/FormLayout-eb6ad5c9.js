import{r as i,c as o,o as m,j as h,e,f as s}from"./index-5d4b1b48.js";const p={class:"grid reddot-gutter"},f={class:"col-12 md:col-6"},u={class:"card p-fluid"},v=e("h5",null,"Vertical",-1),b={class:"field"},y=e("label",{for:"name1"},"Name",-1),x={class:"field"},g=e("label",{for:"email1"},"Email",-1),O={class:"field"},V=e("label",{for:"age1"},"Age",-1),w={class:"card p-fluid"},B=e("h5",null,"Vertical Grid",-1),E={class:"formgrid grid"},I={class:"field col"},L=e("label",{for:"name2"},"Name",-1),N={class:"field col"},T=e("label",{for:"email2"},"Email",-1),F={class:"col-12 md:col-6"},z={class:"card p-fluid"},A=e("h5",null,"Horizontal",-1),S={class:"field grid"},k=e("label",{for:"name3",class:"col-12 mb-2 md:col-2 md:mb-0"},"Name",-1),C={class:"col-12 md:col-10"},D={class:"field grid"},H=e("label",{for:"email3",class:"col-12 mb-2 md:col-2 md:mb-0"},"Email",-1),U={class:"col-12 md:col-10"},j={class:"card"},G=e("h5",null,"Inline",-1),Z={class:"formgroup-inline"},q={class:"field"},J=e("label",{for:"firstname1",class:"p-sr-only"},"Firstname",-1),K={class:"field"},M=e("label",{for:"lastname1",class:"p-sr-only"},"Lastname",-1),P={class:"card"},Q=e("h5",null,"Help Text",-1),R={class:"field p-fluid"},W=e("label",{for:"username"},"Username",-1),X=e("small",null,"Enter your username to reset your password.",-1),Y={class:"col-12"},$={class:"card"},ee=e("h5",null,"Advanced",-1),se={class:"p-fluid formgrid grid"},te={class:"field col-12 md:col-6"},oe=e("label",{for:"firstname2"},"Firstname",-1),de={class:"field col-12 md:col-6"},le=e("label",{for:"lastname2"},"Lastname",-1),ie={class:"field col-12"},ce=e("label",{for:"address"},"Address",-1),ae={class:"field col-12 md:col-6"},ne=e("label",{for:"city"},"City",-1),_e={class:"field col-12 md:col-3"},re=e("label",{for:"state"},"State",-1),me={class:"field col-12 md:col-3"},he=e("label",{for:"zip"},"Zip",-1),ve={__name:"FormLayout",setup(pe){const c=i([{name:"Option 1",code:"Option 1"},{name:"Option 2",code:"Option 2"},{name:"Option 3",code:"Option 3"}]),d=i(null);return(fe,l)=>{const t=o("InputText"),a=o("Button"),n=o("Textarea"),_=o("Dropdown");return m(),h("div",p,[e("div",f,[e("div",u,[v,e("div",b,[y,s(t,{id:"name1",type:"text"})]),e("div",x,[g,s(t,{id:"email1",type:"text"})]),e("div",O,[V,s(t,{id:"age1",type:"text"})])]),e("div",w,[B,e("div",E,[e("div",I,[L,s(t,{id:"name2",type:"text"})]),e("div",N,[T,s(t,{id:"email2",type:"text"})])])])]),e("div",F,[e("div",z,[A,e("div",S,[k,e("div",C,[s(t,{id:"name3",type:"text"})])]),e("div",D,[H,e("div",U,[s(t,{id:"email3",type:"text"})])])]),e("div",j,[G,e("div",Z,[e("div",q,[J,s(t,{id:"firstname1",type:"text",placeholder:"Firstname"})]),e("div",K,[M,s(t,{id:"lastname1",type:"text",placeholder:"Lastname"})]),s(a,{label:"Submit"})])]),e("div",P,[Q,e("div",R,[W,s(t,{id:"username",type:"text"}),X])])]),e("div",Y,[e("div",$,[ee,e("div",se,[e("div",te,[oe,s(t,{id:"firstname2",type:"text"})]),e("div",de,[le,s(t,{id:"lastname2",type:"text"})]),e("div",ie,[ce,s(n,{id:"address",rows:"4"})]),e("div",ae,[ne,s(t,{id:"city",type:"text"})]),e("div",_e,[re,s(_,{id:"state",modelValue:d.value,"onUpdate:modelValue":l[0]||(l[0]=r=>d.value=r),options:c.value,optionLabel:"name",placeholder:"Select One"},null,8,["modelValue","options"])]),e("div",me,[he,s(t,{id:"zip",type:"text"})])])])])])}}};export{ve as default};
