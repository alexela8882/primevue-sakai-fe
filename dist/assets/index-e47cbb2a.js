import{u as M,r as c,s as P,E as R,c as h,o as r,j as u,e as n,f,t as m,w as S,g as A}from"./index-5970bb5d.js";import{u as B,U as b}from"./index-7af5d23d.js";const C={class:"flex justify-content-center",style:{height:"60vh !important"}},E={class:"flex flex-column align-items-center justify-content-center text-center mt-n6"},I={key:0},N=n("div",null,"Please wait...",-1),j={key:1},U={__name:"index",setup(q){const v=M(),t=c();c();const i=c(),l=c(),d=B(),{getMailFolders:_,mailFoldersLoading:F}=P(d),{fetchProfile:k,fetchMailFolders:y}=d,x={auth:{clientId:"393bd73e-ac09-4f31-a723-f4e981a027ce"}},s=new b(x);s.handleRedirectCallback((o,e)=>{});const w=async()=>{i.value="Trying to sign you in";var o={scopes:["user.read","mail.send"]};await s.loginPopup(o).then(e=>{p()}).catch(e=>{console.log(e),l.value=e})},p=async()=>{if(s.getAccount()){var o={scopes:["user.read","mail.send"]};await s.acquireTokenSilent(o).then(e=>{t.value=e.accessToken,console.log(e.accessToken),g()}).catch(e=>{if(e.name==="InteractionRequiredAuthError")return s.acquireTokenPopup(o).then(a=>{t.value=a.accessToken}).catch(a=>{console.log(a)});console.log(e)})}},g=async()=>{i.value="Redirecting to your inbox",await k(t.value),await y(t.value),_.value.map(o=>{o.displayName==="Inbox"&&v.push(`/outlook-mail/folder/${o.id}`)})};return R(async()=>{await p(),t.value||await w(),g()}),(o,e)=>{const a=h("ProgressSpinner"),T=h("Button");return r(),u("div",C,[n("div",E,[l.value?(r(),u("div",j,[n("div",null,m(l.value),1),n("div",null,[f(T,{link:""},{default:S(()=>[A("Refresh page to retry")]),_:1})])])):(r(),u("div",I,[f(a),n("div",null,m(i.value),1),N]))])])}}};export{U as default};
