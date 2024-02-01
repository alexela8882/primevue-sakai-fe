import{C as U,_ as X,J as Y,u as Z,r as u,v as ee,s as P,z as te,c as p,o as s,j as l,f as d,i as o,e,F as h,k as g,n as se,t as a,m as _,w as v}from"./index-a038a467.js";import{R as le}from"./RdBreadCrumbs-aa3282a6.js";import{u as ae}from"./index-f1bfc54e.js";const oe={key:0,class:"flex align-items-center justify-content-center",style:{height:"60vh !important"}},ne={key:1},ie={style:{position:"sticky !important",top:"72px","z-index":"2 !important"},class:"bg-white px-5 py-3 mb-5 border-round-xl flex align-items-center justify-content-between shadow-2"},de={key:0,class:"flex"},ce={key:0,class:"flex flex-column text-xl mr-4"},re={key:0},ue={class:"flex"},_e={class:"font-bold"},ve={key:1},me={class:"font-bold"},pe={key:0,class:"flex flex-column text-xl mx-4"},he={class:"font-bold"},ge={class:"grid"},fe={class:"col-7"},xe={class:"p-3 bg-white border-round-xl shadow-2"},be={class:"flex flex-column gap-4"},ye=e("div",{class:"flex align-items-center gap-2"},[e("span",{class:"text-2xl font-bold"},"Inquiry details")],-1),ke={class:"mt-4"},we={key:0,class:"col flex align-items-center gap-4"},De={class:"white-space-nowrap"},Me={style:{width:"40% !important"},class:"white-space-nowrap overflow-hidden text-overflow-ellipsis"},Ie=e("div",{class:"flex align-items-center gap-2"},[e("span",{class:"text-2xl font-bold"},"Email Thread")],-1),Ce={key:0,class:"mt-4"},Le={style:{position:"sticky !important",top:"145px !important",height:"75vh !important"},class:"col-5"},Pe={key:0,class:"bg-white border-round-xl shadow-2"},Se={class:"p-3"},Be={class:"col flex align-items-center gap-4"},Re={class:"white-space-nowrap"},$e={__name:"ShowInquiryDetail",setup(Te){const S=U(()=>X(()=>import("./MailboxThreads-22b33336.js"),["assets/MailboxThreads-22b33336.js","assets/index-a038a467.js","assets/index-d1288d3d.css","assets/ShowInquiryDetail-d2b44956.css"])),c=Y(),B=Z(),R=u([{label:`${c.params.name}`,to:`/modules/${c.params.name}/${c.params.id}`},{label:`${c.params.name} details`,to:null}]),m=u(),n=u({}),w=u(),f=u(),y=u(),r=u(),D=ee(),M=ae(),{getEntity:T,getModule:E,getModules:V,getLinkedModuleData:N,getCollectionById:$,_getFieldDetails:I,getFieldDetails:C}=P(D),{getItemValueByName:x,moduleLoading:j}=P(M),{fetchModule:z,fetchLinkedModuleData:F,_fetchModule:q}=D,{fetchItem:O}=M,A=async()=>{r.value=T.value(n.value.type_id);let b={module:r.value.name,link_field:"_id",link_id:n.value.link_id};await F(b),y.value=N.value,f.value=await q(r.value.name),w.value=V.value.find(k=>k.name==r.value.name)};return te(async()=>{await z(c.params.name),await O(c.params),m.value=E.value,n.value=$.value(c.params.pageid),await A()}),(G,b)=>{const k=p("ProgressSpinner"),W=p("Button"),L=p("Panel"),J=p("TabPanel"),H=p("TabView");return s(),l("div",null,[d(le,{bcrumbs:R.value},null,8,["bcrumbs"]),o(j)?(s(),l("div",oe,[d(k)])):(s(),l("div",ne,[e("div",ie,[m.value?(s(),l("div",de,[(s(!0),l(h,null,g(m.value.fields,(t,i)=>(s(),l("div",{key:i},[e("div",{class:se(`${m.value.fields.length===i+1&&"mr-8"}`)},[t.title?(s(),l("div",ce,[t.groupWith?(s(),l("div",re,[e("div",null,a(t.groupLabel),1),e("div",ue,[(s(!0),l(h,null,g(t.groupWith,(K,Q)=>(s(),l("div",{key:Q},[e("div",_e,a(o(x)(K))+a(t.fieldGlue===" "?" ":t.fieldGlue),1)]))),128))])])):(s(),l("div",ve,[e("div",null,a(t.label),1),e("div",me,a(o(x)(t.name)),1)]))])):_("",!0)],2)]))),128)),(s(!0),l(h,null,g(m.value.fields,(t,i)=>(s(),l("div",{key:i},[t.header?(s(),l("div",pe,[e("div",null,a(t.label),1),e("div",he,a(o(x)(t.name)?o(x)(t.name):null),1)])):_("",!0)]))),128))])):_("",!0),e("div",null,[d(W,{label:"Edit",size:"large",class:"px-6 border-round-xl"})])]),e("div",ge,[e("div",fe,[e("div",xe,[d(H,null,{default:v(()=>[d(J,{header:"Details"},{default:v(()=>[e("div",be,[d(L,{class:"detail-page-panel"},{header:v(()=>[ye]),default:v(()=>[e("div",ke,[(s(!0),l(h,null,g(Object.keys(n.value),(t,i)=>(s(),l("div",{key:i,class:"grid"},[t!=="conversations"?(s(),l("div",we,[e("div",null,[e("p",De,a(o(C)(t)?o(C)(t).label:"ID"),1)]),e("div",Me,a(n.value[t]),1)])):_("",!0)]))),128))])]),_:1}),d(L,{class:"detail-page-panel"},{header:v(()=>[Ie]),default:v(()=>[n.value.conversations.length>0?(s(),l("div",Ce,[d(o(S),{threads:n.value.conversations.slice().reverse()},null,8,["threads"])])):_("",!0)]),_:1})])]),_:1})]),_:1})])]),e("div",Le,[r.value?(s(),l("div",Pe,[e("div",{onClick:b[0]||(b[0]=t=>o(B).push({name:"modules.pages.detail",params:{name:r.value.name,id:w.value._id,pageid:n.value.link_id}})),class:"cursor-pointer p-3 border-round-top-xl text-2xl bg-primary-300 text-50"},a(r.value.label),1),e("div",Se,[f.value?(s(!0),l(h,{key:0},g(Object.keys(y.value),(t,i)=>(s(),l("div",{key:i,class:"grid"},[e("div",Be,[e("div",null,[e("p",Re,a(o(I)({module:f.value,field:t})?o(I)({module:f.value,field:t}).label:"ID"),1)]),e("div",null,a(y.value[t]),1)])]))),128)):_("",!0)])])):_("",!0)])])]))])}}};export{$e as default};