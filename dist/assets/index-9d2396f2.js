import{u as M,r as c,s as P,z as A,c as g,o as r,j as u,e as s,f as h,t as f,w as C,g as R,C as S,_ as B}from"./index-5e94b731.js";import{u as E,U as I}from"./index-08ef3f55.js";const b={class:"flex justify-content-center",style:{height:"60vh !important"}},N={class:"flex flex-column align-items-center justify-content-center text-center mt-n6"},V={key:0},j=s("div",null,"Please wait...",-1),F={key:1},O={__name:"index",setup(L){S(()=>B(()=>import("./mailbox-4a92a70d.js"),["assets/mailbox-4a92a70d.js","assets/index-5e94b731.js","assets/index-86c8a9da.css","assets/index-08ef3f55.js"]));const m=M(),t=c();c();const i=c(),l=c(),d=E(),{getMailFolders:v,mailFoldersLoading:q}=P(d),{fetchProfile:y,fetchMailFolders:k}=d,x={auth:{clientId:"393bd73e-ac09-4f31-a723-f4e981a027ce"}},n=new I(x);n.handleRedirectCallback((e,o)=>{});const w=async()=>{i.value="Trying to sign you in",await n.loginPopup().then(e=>{p()}).catch(e=>{console.log(e),l.value=e})},p=async()=>{if(n.getAccount()){var e={scopes:["user.read","mail.send"]};await n.acquireTokenSilent(e).then(o=>{t.value=o.accessToken,console.log(o.accessToken),_()}).catch(o=>{if(o.name==="InteractionRequiredAuthError")return n.acquireTokenPopup(e).then(a=>{t.value=a.accessToken}).catch(a=>{console.log(a)});console.log(o)})}},_=async()=>{i.value="Redirecting to your inbox",await y(t.value),await k(t.value),v.value.map(e=>{e.displayName==="Inbox"&&m.push(`/outlook-mail/folder/${e.id}`)})};return A(async()=>{await p(),t.value||await w(),_()}),(e,o)=>{const a=g("ProgressSpinner"),T=g("Button");return r(),u("div",b,[s("div",N,[l.value?(r(),u("div",F,[s("div",null,f(l.value),1),s("div",null,[h(T,{link:""},{default:C(()=>[R("Refresh page to retry")]),_:1})])])):(r(),u("div",V,[h(a),s("div",null,f(i.value),1),j]))])])}}};export{O as default};
