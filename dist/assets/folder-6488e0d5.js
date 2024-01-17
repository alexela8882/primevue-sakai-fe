import{r as _,J as Q,s as W,I as B,A as F,z as X,c as g,o as f,j as h,e,t as n,f as a,w as b,d as Y,i as r,g as Z,k as ee,n as L,m as te,F as le,C as oe,_ as se}from"./index-f25c6ab6.js";import{u as ne,U as ae}from"./index-678329c4.js";const ie={key:0,class:"flex justify-content-center",style:{height:"60vh !important"}},re={class:"flex flex-column align-items-center justify-content-center text-center mt-n6"},ce={key:1,class:"flex justify-content-center",style:{height:"60vh !important"}},de={class:"flex flex-column align-items-center justify-content-center text-center mt-n6"},ue=e("div",null,"Please wait...",-1),ve={style:{height:"85vh !important","overflow-y":"scroll"}},pe={class:"flex flex-column gap-3 m-3"},fe={class:"flex align-items-center justify-content-between"},me={class:"flex align-items-center gap-1"},_e=e("div",{class:"text-2xl text-primary font-bold"},"Mailbox",-1),ge={class:"font-bold"},he={class:"p-input-icon-left w-full"},xe=e("i",{class:"pi pi-search"},null,-1),ke={class:"flex align-items-center gap-3 m-3"},ye=["onClick"],be={class:"flex align-items-center justify-content-between gap-6"},we={class:"flex flex-column gap-1"},Ce={class:"font-bold"},Me={class:"flex flex-column gap-2 align-self-start"},Le={key:0},Ie={key:1,class:"p-4 white-space-nowrap overflow-hidden text-overflow-ellipsis"},Pe={class:"flex align-items-center gap-3 m-3"},Te={style:{height:"85vh !important","overflow-y":"scroll"},class:"p-4 w-full"},je={__name:"folder",setup(Se){const q=oe(()=>se(()=>import("./MailboxMessage-63f007b3.js"),["assets/MailboxMessage-63f007b3.js","assets/index-f25c6ab6.js","assets/index-d1288d3d.css","assets/index-678329c4.js","assets/MailboxMessage-d1ba7033.css"])),u=_(),x=_(),w=_(),v=_(),k=_(),c=_(),z=Q(),I=ne(),{mailFolderLoading:O,getSkipValue:p,getPreviousLink:C,getMailFolder:m,getMailFolderMessages:d}=W(I),{fetchMailFolder:V,fetchMailFolderMessages:E,folderMailMessagesNavigate:P}=I,U={auth:{clientId:"393bd73e-ac09-4f31-a723-f4e981a027ce"}},y=new ae(U);y.handleRedirectCallback((l,t)=>{});const T=B(()=>Number(p.value)+1),S=B(()=>{const l=Number(p.value)+10;return l>m.value.totalItemCount?m.value.totalItemCount:l}),D=async()=>{u.value="Trying to sign you in";var l={scopes:["user.read","mail.send"]};await y.loginPopup(l).then(t=>{M()}).catch(t=>{x.value=t})},G=l=>{console.log(l),k.value=l},M=async()=>{if(u.value="Retrieving your messages",y.getAccount()){var l={scopes:["user.read","mail.send"]};await y.acquireTokenSilent(l).then(t=>{c.value=t.accessToken,$(),u.value=null,x.value=null}).catch(t=>{if(t.name==="InteractionRequiredAuthError")return y.acquireTokenPopup(l).then(o=>{c.value=o.accessToken}).catch(o=>{x.value=o})})}},$=async()=>{u.value="Retrieving your messages",await V(c.value,z.params.id),await E(c.value,m.value),v.value=d.value.value,u.value=null},A=()=>{console.log(d.value["@odata.nextLink"]),P(c.value,d.value["@odata.nextLink"])},R=()=>{if(console.log(p.value),p.value){console.log(C.value);let t=C.value.split("24").find(i=>i.toLowerCase().indexOf("skip=")>-1),o=C.value.replace(t,`skip=${p.value-10}`);P(c.value,o)}};return F(()=>w.value,(l,t)=>{if(l){let o=d.value.value.filter(i=>{if(i.subject.toLowerCase().indexOf(l)>-1||i.from.emailAddress.name.toLowerCase().indexOf(l)>-1||i.from.emailAddress.address.toLowerCase().indexOf(l)>-1)return i});v.value=o}else v.value=d.value.value}),F(()=>d.value,(l,t)=>{v.value=l.value,console.log(t.value),console.log(l.value),l.value.map((o,i)=>{i===0&&(k.value=o)})}),X(async()=>{await M(),c.value||await D(),$()}),(l,t)=>{const o=g("Button"),i=g("ProgressSpinner"),J=g("InputText"),j=g("SplitterPanel"),H=g("Splitter"),K=g("BlockUI");return x.value?(f(),h("div",ie,[e("div",re,[e("div",null,n(x.value),1),e("div",null,[a(o,{link:""},{default:b(()=>[Z("Refresh page to retry")]),_:1})])])])):u.value?(f(),h("div",ce,[e("div",de,[a(i),e("div",null,n(u.value),1),ue])])):(f(),Y(K,{key:2,blocked:r(O)},{default:b(()=>[a(H,null,{default:b(()=>[a(j,{class:"flex",size:5},{default:b(()=>[e("div",ve,[e("div",null,[e("div",pe,[e("div",fe,[e("div",me,[_e,e("div",ge,"("+n(r(m).displayName)+")",1)]),e("div",null,[e("i",{onClick:t[0]||(t[0]=s=>M()),class:"cursor-pointer pi pi-refresh"})])]),e("div",null,[e("div",null,[e("span",he,[xe,a(J,{modelValue:w.value,"onUpdate:modelValue":t[1]||(t[1]=s=>w.value=s),placeholder:"Search",class:"w-full"},null,8,["modelValue"])])])])]),e("div",ke,[e("div",null,n(T.value)+" - "+n(S.value)+" of ("+n(r(m).totalItemCount)+")",1),e("div",null,[a(o,{onClick:t[2]||(t[2]=s=>R()),disabled:r(p)==0,icon:"pi pi-chevron-left",text:"",rounded:""},null,8,["disabled"]),a(o,{onClick:t[3]||(t[3]=s=>A()),disabled:!r(d)["@odata.nextLink"],icon:"pi pi-chevron-right",text:"",rounded:""},null,8,["disabled"])])]),e("div",null,[v.value&&v.value.length>0?(f(!0),h(le,{key:0},ee(v.value,(s,N)=>(f(),h("div",{key:N,onClick:$e=>G(s),class:L(["p-4 cursor-pointer border-1 border-300 border-x-none white-space-nowrap overflow-hidden text-overflow-ellipsis",`${s.convertedToInquiry&&"bg-primary-50"} ${N!==0&&"border-top-none"} ${s.id===(k.value&&k.value.id)&&"bg-primary-100"}`])},[e("div",be,[e("div",we,[e("div",Ce,n(s.from.emailAddress.name),1),e("div",{class:L(["text-overflow-ellipsis w-14rem overflow-hidden",`${!s.isRead&&"font-bold"}`])},n(s.subject),3)]),e("div",Me,[e("div",{class:L(["text-xs text-700",`${!s.isRead&&"font-bold"}`])},n(s.receivedDateTime),3),s.convertedToInquiry?(f(),h("div",Le,[a(o,{label:"View inquiry",size:"small",outlined:""})])):te("",!0)])])],10,ye))),128)):(f(),h("div",Ie," No messages found "))]),e("div",Pe,[e("div",null,n(T.value)+" - "+n(S.value)+" of ("+n(r(m).totalItemCount)+")",1),e("div",null,[a(o,{onClick:t[4]||(t[4]=s=>R()),disabled:r(p)==0,icon:"pi pi-chevron-left",text:"",rounded:""},null,8,["disabled"]),a(o,{onClick:t[5]||(t[5]=s=>A()),disabled:!r(d)["@odata.nextLink"],icon:"pi pi-chevron-right",text:"",rounded:""},null,8,["disabled"])])])])])]),_:1}),a(j,{class:"flex",size:75},{default:b(()=>[e("div",Te,[a(r(q),{token:c.value,message:k.value},null,8,["token","message"])])]),_:1})]),_:1})]),_:1},8,["blocked"]))}}};export{je as default};
