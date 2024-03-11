import{_ as $,r as m,a as E,C as L,u as B,v as P,c as i,o as p,j as v,e as l,f as n,l as x,n as b,t as w,m as y,w as j,q as T,z,A}from"./index-11690040.js";const r=d=>(z("data-v-5e09617b"),d=d(),A(),d),K={class:"surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden"},N={class:"flex flex-column align-items-center justify-content-center"},R={style:{"border-radius":"56px",padding:"0.3rem",background:"linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)"}},U={class:"w-full surface-card py-8 px-5 sm:px-8",style:{"border-radius":"53px"}},M=r(()=>l("div",{class:"text-center mb-5"},[l("div",{class:"text-900 text-3xl font-medium mb-3"},"Welcome to Reddot"),l("span",{class:"text-600 font-medium"},"Sign in to continue")],-1)),q={class:"flex flex-column gap-2 mb-5"},D=r(()=>l("label",{for:"email1",class:"block text-900 text-xl font-medium"},"Email",-1)),F={key:0,class:"text-red-600"},W={class:"flex flex-column gap-2 mb-5"},G=r(()=>l("label",{for:"email1",class:"block text-900 text-xl font-medium"},"Password",-1)),H={key:0,class:"text-red-600"},J={class:"flex align-items-center justify-content-between mb-5 gap-5"},O={class:"flex align-items-center"},Q=r(()=>l("label",{for:"rememberme1"},"Remember me",-1)),X=r(()=>l("a",{class:"font-medium no-underline ml-2 text-right cursor-pointer",style:{color:"var(--primary-color)"}},"Forgot password?",-1)),Y=r(()=>l("div",{class:"mr-2"},"Microsoft Login",-1)),Z={__name:"Login",setup(d){const o=m(!1),f=E(),{layoutConfig:h}=L(),k=B(),s=m({email:{value:null,error:null},password:{value:null,error:null}}),_=m(!1);localStorage.getItem("isAuthenticated");const c=async()=>{o.value=!0,s.value.email.error=null,s.value.password.error=null;const u=s.value.email.value,e=s.value.password.value;(u===""||u===null)&&(s.value.email.error="Enter your email"),(e===""||e===null)&&(s.value.password.error="Enter your password"),await T.post("/login",{email:u,password:e}).then(a=>{localStorage.clear(),localStorage.setItem("token",a.data.data.token),localStorage.setItem("auth_id",a.data.data._id),localStorage.setItem("isAuthenticated",!0),k.push({path:"/"}),o.value=!1,f.add({severity:"success",summary:"Success",detail:a.data.message,life:3e3})}).catch(a=>{a&&(console.log(a),f.add({severity:"error",summary:"Error",detail:a.response.data.message,life:3e3})),o.value=!1})},S=async()=>{window.location.href="https://api.reddotcrm.com/saml2/5e7cfe07-5de3-407d-9b26-0f42143d3ab7/login"};return P(()=>`layout/images/${h.darkTheme.value?"logo-white":"logo-dark"}.svg`),(u,e)=>{const a=i("InputText"),V=i("Password"),C=i("Checkbox"),g=i("Button"),I=i("font-awesome-icon");return p(),v("div",K,[l("div",N,[l("div",R,[l("div",U,[M,l("div",null,[l("div",q,[D,n(a,{onKeypress:e[0]||(e[0]=x(t=>c(),["enter"])),disabled:o.value,type:"text",placeholder:"Email address",class:b(["w-full md:w-30rem",`${s.value.email.error&&"p-invalid"}`]),style:{padding:"1rem"},modelValue:s.value.email.value,"onUpdate:modelValue":e[1]||(e[1]=t=>s.value.email.value=t)},null,8,["disabled","class","modelValue"]),s.value.email.error?(p(),v("small",F,w(s.value.email.error),1)):y("",!0)]),l("div",W,[G,n(V,{onKeypress:e[2]||(e[2]=x(t=>c(),["enter"])),disabled:o.value,modelValue:s.value.password.value,"onUpdate:modelValue":e[3]||(e[3]=t=>s.value.password.value=t),placeholder:"Password",toggleMask:!0,class:b(["w-full",`${s.value.password.error&&"p-invalid"}`]),inputClass:"w-full",inputStyle:{padding:"1rem"}},null,8,["disabled","modelValue","class"]),s.value.password.error?(p(),v("small",H,w(s.value.password.error),1)):y("",!0)]),l("div",J,[l("div",O,[n(C,{disabled:o.value,modelValue:_.value,"onUpdate:modelValue":e[4]||(e[4]=t=>_.value=t),id:"rememberme1",binary:"",class:"mr-2"},null,8,["disabled","modelValue"]),Q]),X]),n(g,{loading:o.value,onClick:e[5]||(e[5]=t=>c()),label:`${o.value?"Signing in...":"Sign In"}`,class:"w-full p-3 text-xl mb-5"},null,8,["loading","label"]),n(g,{onClick:e[6]||(e[6]=t=>S()),class:"w-full p-3 text-xl",severity:"success"},{icon:j(()=>[Y,n(I,{icon:"fa-brands fa-microsoft",style:{"font-size":"1.2rem"}})]),_:1})])])])])])}}},se=$(Z,[["__scopeId","data-v-5e09617b"]]);export{se as default};