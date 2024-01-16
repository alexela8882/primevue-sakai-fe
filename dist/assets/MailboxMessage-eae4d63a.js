import{C as x,_,r as u,s as V,A as j,c as v,o as i,j as d,e,t as n,f as a,F as p,k as S,g as E,m as M,w as f,i as y}from"./index-ed3b8c92.js";import{u as z}from"./index-f2931d81.js";const N={class:"w-full"},O={key:0,class:"flex flex-column gap-4"},I={class:"flex justify-content-between"},P={class:"font-bold text-2xl"},q={class:"flex align-items-center gap-3"},F={class:"flex align-items-center justify-content-between"},H={class:"flex align-items-center mb-5 gap-2"},U={key:0},$={class:"m-0"},J=["innerHTML"],Y={class:"m-0"},G={class:"flex align-items-center text-2xl"},W={__name:"MailboxMessage",props:{token:String,message:Object},setup(s){const k=s,h=x(()=>_(()=>import("./mailboxReply-9f66b32f.js"),["assets/mailboxReply-9f66b32f.js","assets/index-ed3b8c92.js","assets/index-d1288d3d.css","assets/index-f2931d81.js"])),w=x(()=>_(()=>import("./ConvertMailboxMessage-5afe114a.js"),["assets/ConvertMailboxMessage-5afe114a.js","assets/index-ed3b8c92.js","assets/index-d1288d3d.css"])),r=u(!1),c=u(!1),g=u(),R=u([{label:"Leads",name:"leads",command:t=>{m(t.item)}},{label:"Defect Reports",name:"defectreports",command:t=>{m(t.item)}},{label:"Breakdown Log",name:"breakdownlogs",command:t=>{m(t.item)}},{label:"Job Request",name:"servicejobs",command:t=>{m(t.item)}}]),T=z(),{folderMessageReplyLoading:A}=V(T),C=async()=>{c.value=!0},m=t=>{console.log(k.message),r.value=!0,g.value=t};return j(()=>A.value,(t,o)=>{t||(c.value=!1)}),(t,o)=>{const D=v("font-awesome-icon"),L=v("SplitButton"),B=v("Avatar"),b=v("Dialog");return i(),d(p,null,[e("div",N,[s.message?(i(),d("div",O,[e("div",I,[e("div",P,n(s.message.subject),1),e("div",q,[e("div",null,[a(D,{onClick:o[0]||(o[0]=l=>C()),icon:"fa-solid fa-reply",class:"cursor-pointer",style:{"font-size":"1.5rem",color:"var(--primary-300)"}})]),e("div",null,[a(L,{model:R.value,label:"Convert",outlined:""},null,8,["model"])])])]),e("div",null,[e("div",F,[e("div",H,[e("div",null,[a(B,{icon:"pi pi-user",class:"mr-2",shape:"circle",size:"xlarge"})]),e("div",null,[e("div",null,n(s.message.from.emailAddress.name)+" <"+n(s.message.from.emailAddress.address)+"> ",1),e("div",null,[(i(!0),d(p,null,S(s.message.toRecipients.slice(0,2),l=>(i(),d("div",null,[E(" To: "+n(l.emailAddress.address)+" ",1),s.message.toRecipients.length>2?(i(),d("span",U," and "+n(s.message.toRecipients.length-2)+" others ",1)):M("",!0)]))),256))])])])]),e("p",$,[e("div",{innerHTML:s.message.body.content},null,8,J)])])])):M("",!0)]),a(b,{visible:c.value,"onUpdate:visible":o[1]||(o[1]=l=>c.value=l),maximizable:"",modal:"",header:"You are replying to a mail",style:{width:"50rem"},breakpoints:{"1199px":"75vw","575px":"90vw"}},{default:f(()=>[e("p",Y,[a(y(h),{mail:s.message,token:s.token},null,8,["mail","token"])])]),_:1},8,["visible"]),a(b,{visible:r.value,"onUpdate:visible":o[3]||(o[3]=l=>r.value=l),modal:"",maximizable:"",style:{width:"60vw"},class:"convert-mailbox-dialog"},{header:f(()=>[e("div",G,[e("div",null,"Convert to Inquiry — "+n(g.value.label),1)])]),default:f(()=>[a(y(w),{mailboxMessage:s.message,convertModule:g.value,onTriggerDialog:o[2]||(o[2]=l=>r.value=!1)},null,8,["mailboxMessage","convertModule"])]),_:1},8,["visible"])],64)}}};export{W as default};