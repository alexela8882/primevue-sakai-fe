import{I as F,J as B,r as i,E as S,c as x,o as j,j as C,e as s,f as c,i as l,F as I}from"./index-11690040.js";import{u as $,c as p,a as k}from"./index.esm-bc30f4f8.js";const O={class:"relative h-full px-3"},A={class:"sticky bottom-0 right-0 py-2 surface-50"},D={class:"flex justify-content-end gap-2 px-3 py-1"},J={__name:"DynamicForm",props:{form:Object},setup(u){const d=u,v=F(()=>B(()=>import("./DynamicFields-404d2990.js"),["assets/DynamicFields-404d2990.js","assets/index-11690040.js","assets/index-cb49da02.css"])),r=i({}),o=i({});i([]);const{values:M,errors:f,setErrors:q,setFieldError:_,ErrorBag:w,defineComponentBinds:y,isSubmitting:z,setFieldValue:b,handleSubmit:V,meta:E}=$({}),g=async()=>{(await m()).inner?console.log("error"):console.log("passed")},m=V((a,e)=>{Object.keys(o.value).forEach((t,n)=>{o.value[t].modelValue!==null&&_(t,null)});try{return r.value.validateSync(a,{abortEarly:!1}),a}catch(t){return t.inner.map(n=>{n.path+"",n.message,e.setFieldError(n.path,n.message)}),t}}),h=async()=>{d.form.fields.map(e=>Object.assign(e,{...e,data:{value:null}}));const a={};d.form.fields.map(e=>{e.rules&&e.rules.required?a[e.name]=p().label(e.label).required():a[e.name]=p().label(e.label).nullable(),o.value[e.name]=y(`${e.name}`),b(`${e.name}`,null)}),r.value=a,r.value=k(a)};return S(async()=>{await h()}),(a,e)=>{const t=x("Button");return j(),C(I,null,[s("div",O,[s("div",null,[c(l(v),{fields:u.form.fields,moduleValidationInputs:o.value,moduleValidationErrors:l(f),moduleValidationMeta:l(E),onValidateSyncFunc:e[0]||(e[0]=n=>l(m)())},null,8,["fields","moduleValidationInputs","moduleValidationErrors","moduleValidationMeta"])])]),s("div",A,[s("div",D,[c(t,{label:"Reset",outlined:""}),c(t,{onClick:g,label:"Save",size:"large"})])])],64)}}};export{J as default};