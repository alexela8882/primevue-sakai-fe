import{c as o,o as t,j as a,e,f as c,t as n,F as r,k as d,g as m,m as g}from"./index-a038a467.js";const u={class:"flex align-items-center justify-content-between"},v={class:"flex align-items-center mb-5 gap-2"},h={key:0},f={class:"m-0"},p=["innerHTML"],y={__name:"MailboxMessageBody",props:{message:Object},setup(s){return(_,x)=>{const i=o("Avatar");return t(),a("div",null,[e("div",u,[e("div",v,[e("div",null,[c(i,{icon:"pi pi-user",class:"mr-2",shape:"circle",size:"xlarge"})]),e("div",null,[e("div",null,n(s.message.from.emailAddress.name)+" <"+n(s.message.from.emailAddress.address)+"> ",1),e("div",null,[(t(!0),a(r,null,d(s.message.toRecipients.slice(0,2),l=>(t(),a("div",null,[m(" To: "+n(l.emailAddress.address)+" ",1),s.message.toRecipients.length>2?(t(),a("span",h," and "+n(s.message.toRecipients.length-2)+" others ",1)):g("",!0)]))),256))])])])]),e("p",f,[e("div",{innerHTML:s.message.body.content},null,8,p)])])}}};export{y as default};
