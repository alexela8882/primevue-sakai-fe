import{C as b,_ as k,r as w,s as R,A,c as r,o,j as n,e,t as l,f as a,F as m,k as M,g as C,m as u,w as S,i as T}from"./index-165dc091.js";import{u as V}from"./index-92e611d9.js";const j={class:"w-full"},B={key:0,class:"flex flex-column gap-4"},L={class:"flex justify-content-between"},D={class:"font-bold text-2xl"},N={class:"flex align-items-center gap-3"},z={class:"flex align-items-center justify-content-between"},E={class:"flex align-items-center mb-5 gap-2"},O={key:0},F={class:"m-0"},H=["innerHTML"],P={class:"m-0"},Y={__name:"MailboxMessage",props:{token:String,message:Object},setup(s){const v=b(()=>k(()=>import("./mailboxReply-65e892fd.js"),["assets/mailboxReply-65e892fd.js","assets/index-165dc091.js","assets/index-d1288d3d.css","assets/index-92e611d9.js"])),i=w(!1),f=V(),{folderMessageReplyLoading:g}=R(f),_=async()=>{i.value=!0};return A(()=>g.value,(d,t)=>{d||(i.value=!1)}),(d,t)=>{const p=r("font-awesome-icon"),x=r("SplitButton"),y=r("Avatar"),h=r("Dialog");return o(),n(m,null,[e("div",j,[s.message?(o(),n("div",B,[e("div",L,[e("div",D,l(s.message.subject),1),e("div",N,[e("div",null,[a(p,{onClick:t[0]||(t[0]=c=>_()),icon:"fa-solid fa-reply",class:"cursor-pointer",style:{"font-size":"1.5rem",color:"var(--primary-300)"}})]),e("div",null,[a(x,{label:"Convert",outlined:""})])])]),e("div",null,[e("div",z,[e("div",E,[e("div",null,[a(y,{icon:"pi pi-user",class:"mr-2",shape:"circle",size:"xlarge"})]),e("div",null,[e("div",null,l(s.message.from.emailAddress.name)+" <"+l(s.message.from.emailAddress.address)+"> ",1),e("div",null,[(o(!0),n(m,null,M(s.message.toRecipients.slice(0,2),c=>(o(),n("div",null,[C(" To: "+l(c.emailAddress.address)+" ",1),s.message.toRecipients.length>2?(o(),n("span",O," and "+l(s.message.toRecipients.length-2)+" others ",1)):u("",!0)]))),256))])])])]),e("p",F,[e("div",{innerHTML:s.message.body.content},null,8,H)])])])):u("",!0)]),a(h,{visible:i.value,"onUpdate:visible":t[1]||(t[1]=c=>i.value=c),maximizable:"",modal:"",header:"You are replying to a mail",style:{width:"50rem"},breakpoints:{"1199px":"75vw","575px":"90vw"}},{default:S(()=>[e("p",P,[a(T(v),{mail:s.message,token:s.token},null,8,["mail","token"])])]),_:1},8,["visible"])],64)}}};export{Y as default};
