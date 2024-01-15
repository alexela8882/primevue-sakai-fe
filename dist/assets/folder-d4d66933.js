import{r as m,J as Q,s as W,I as F,A as N,z as X,c as _,o as g,j as y,e,t as n,f as a,w as b,d as Y,i as r,g as Z,k as ee,n as L,F as te,C as le,_ as se}from"./index-165dc091.js";import{u as oe,U as ne}from"./index-92e611d9.js";const ae={key:0,class:"flex justify-content-center",style:{height:"60vh !important"}},ie={class:"flex flex-column align-items-center justify-content-center text-center mt-n6"},re={key:1,class:"flex justify-content-center",style:{height:"60vh !important"}},ce={class:"flex flex-column align-items-center justify-content-center text-center mt-n6"},de=e("div",null,"Please wait...",-1),ue={style:{height:"85vh !important","overflow-y":"scroll"}},ve={class:"flex flex-column gap-3 m-3"},pe={class:"flex align-items-center justify-content-between"},fe={class:"flex align-items-center gap-1"},me=e("div",{class:"text-2xl text-primary font-bold"},"Mailbox",-1),_e={class:"font-bold"},ge={class:"p-input-icon-left w-full"},he=e("i",{class:"pi pi-search"},null,-1),xe={class:"flex align-items-center gap-3 m-3"},ke=["onClick"],ye={class:"flex align-items-start justify-content-between gap-6"},be={class:"flex flex-column gap-1"},we={class:"font-bold"},Ce={class:"flex flex-column gap-2"},Me={key:1,class:"p-4 white-space-nowrap overflow-hidden text-overflow-ellipsis"},Le={class:"flex align-items-center gap-3 m-3"},Pe={style:{height:"85vh !important","overflow-y":"scroll"},class:"p-4 w-full"},Ae={__name:"folder",setup(Ie){const O=le(()=>se(()=>import("./MailboxMessage-3ce04126.js"),["assets/MailboxMessage-3ce04126.js","assets/index-165dc091.js","assets/index-d1288d3d.css","assets/index-92e611d9.js"])),u=m(),h=m(),w=m(),v=m(),x=m(),c=m(),V=Q(),P=oe(),{mailFolderLoading:z,getSkipValue:p,getPreviousLink:C,getMailFolder:f,getMailFolderMessages:d}=W(P),{fetchMailFolder:E,fetchMailFolderMessages:U,folderMailMessagesNavigate:I}=P,q={auth:{clientId:"393bd73e-ac09-4f31-a723-f4e981a027ce"}},k=new ne(q);k.handleRedirectCallback((l,t)=>{});const S=F(()=>Number(p.value)+1),T=F(()=>{const l=Number(p.value)+10;return l>f.value.totalItemCount?f.value.totalItemCount:l}),D=async()=>{u.value="Trying to sign you in";var l={scopes:["user.read","mail.send"]};await k.loginPopup(l).then(t=>{M()}).catch(t=>{h.value=t})},G=l=>{console.log(l),x.value=l},M=async()=>{if(u.value="Retrieving your messages",k.getAccount()){var l={scopes:["user.read","mail.send"]};await k.acquireTokenSilent(l).then(t=>{c.value=t.accessToken,$(),u.value=null,h.value=null}).catch(t=>{if(t.name==="InteractionRequiredAuthError")return k.acquireTokenPopup(l).then(s=>{c.value=s.accessToken}).catch(s=>{h.value=s})})}},$=async()=>{u.value="Retrieving your messages",await E(c.value,V.params.id),await U(c.value,f.value),v.value=d.value.value,u.value=null},A=()=>{console.log(d.value["@odata.nextLink"]),I(c.value,d.value["@odata.nextLink"])},R=()=>{if(console.log(p.value),p.value){console.log(C.value);let t=C.value.split("24").find(i=>i.toLowerCase().indexOf("skip=")>-1),s=C.value.replace(t,`skip=${p.value-10}`);I(c.value,s)}};return N(()=>w.value,(l,t)=>{if(l){let s=d.value.value.filter(i=>{if(i.subject.toLowerCase().indexOf(l)>-1||i.from.emailAddress.name.toLowerCase().indexOf(l)>-1||i.from.emailAddress.address.toLowerCase().indexOf(l)>-1)return i});v.value=s}else v.value=d.value.value}),N(()=>d.value,(l,t)=>{v.value=l.value,l.value.map((s,i)=>{i===0&&(x.value=s)})}),X(async()=>{await M(),c.value||await D(),$()}),(l,t)=>{const s=_("Button"),i=_("ProgressSpinner"),J=_("InputText"),j=_("SplitterPanel"),H=_("Splitter"),K=_("BlockUI");return h.value?(g(),y("div",ae,[e("div",ie,[e("div",null,n(h.value),1),e("div",null,[a(s,{link:""},{default:b(()=>[Z("Refresh page to retry")]),_:1})])])])):u.value?(g(),y("div",re,[e("div",ce,[a(i),e("div",null,n(u.value),1),de])])):(g(),Y(K,{key:2,blocked:r(z)},{default:b(()=>[a(H,null,{default:b(()=>[a(j,{class:"flex",size:5},{default:b(()=>[e("div",ue,[e("div",null,[e("div",ve,[e("div",pe,[e("div",fe,[me,e("div",_e,"("+n(r(f).displayName)+")",1)]),e("div",null,[e("i",{onClick:t[0]||(t[0]=o=>M()),class:"cursor-pointer pi pi-refresh"})])]),e("div",null,[e("div",null,[e("span",ge,[he,a(J,{modelValue:w.value,"onUpdate:modelValue":t[1]||(t[1]=o=>w.value=o),placeholder:"Search",class:"w-full"},null,8,["modelValue"])])])])]),e("div",xe,[e("div",null,n(S.value)+" - "+n(T.value)+" of ("+n(r(f).totalItemCount)+")",1),e("div",null,[a(s,{onClick:t[2]||(t[2]=o=>R()),disabled:r(p)==0,icon:"pi pi-chevron-left",text:"",rounded:""},null,8,["disabled"]),a(s,{onClick:t[3]||(t[3]=o=>A()),disabled:!r(d)["@odata.nextLink"],icon:"pi pi-chevron-right",text:"",rounded:""},null,8,["disabled"])])]),e("div",null,[v.value&&v.value.length>0?(g(!0),y(te,{key:0},ee(v.value,(o,B)=>(g(),y("div",{key:B,onClick:Se=>G(o),class:L(["p-4 cursor-pointer border-1 border-300 border-x-none white-space-nowrap overflow-hidden text-overflow-ellipsis",`${B!==0&&"border-top-none"} ${o.id===(x.value&&x.value.id)&&"bg-primary-100"}`])},[e("div",ye,[e("div",be,[e("div",we,n(o.from.emailAddress.name),1),e("div",{class:L(["text-overflow-ellipsis w-14rem overflow-hidden",`${!o.isRead&&"font-bold"}`])},n(o.subject),3)]),e("div",Ce,[e("div",{class:L(["text-xs text-700",`${!o.isRead&&"font-bold"}`])},n(o.receivedDateTime),3)])])],10,ke))),128)):(g(),y("div",Me," No messages found "))]),e("div",Le,[e("div",null,n(S.value)+" - "+n(T.value)+" of ("+n(r(f).totalItemCount)+")",1),e("div",null,[a(s,{onClick:t[4]||(t[4]=o=>R()),disabled:r(p)==0,icon:"pi pi-chevron-left",text:"",rounded:""},null,8,["disabled"]),a(s,{onClick:t[5]||(t[5]=o=>A()),disabled:!r(d)["@odata.nextLink"],icon:"pi pi-chevron-right",text:"",rounded:""},null,8,["disabled"])])])])])]),_:1}),a(j,{class:"flex",size:75},{default:b(()=>[e("div",Pe,[a(r(O),{token:c.value,message:x.value},null,8,["token","message"])])]),_:1})]),_:1})]),_:1},8,["blocked"]))}}};export{Ae as default};
