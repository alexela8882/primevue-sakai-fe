import{I as d,J as _,c,o as a,j as s,F as i,k as m,f as o,w as p,e as u,i as f}from"./index-2f40471b.js";const g={class:"my-3"},x={__name:"MailboxThreads",props:{threads:Array},setup(t){const r=d(()=>_(()=>import("./MailboxMessageBody-336a75ca.js"),["assets/MailboxMessageBody-336a75ca.js","assets/index-2f40471b.js","assets/index-d5e7f8f7.css"]));return(y,h)=>{const n=c("Panel");return a(),s("div",null,[(a(!0),s(i,null,m(t.threads,(e,l)=>(a(),s("div",{key:l},[o(n,{header:`${e.from.emailAddress.name} (${e.from.emailAddress.address})`,toggleable:"",collapsed:"",class:"my-2 detail-page-panel"},{default:p(()=>[u("p",g,[o(f(r),{message:e},null,8,["message"])])]),_:2},1032,["header"])]))),128))])}}};export{x as default};