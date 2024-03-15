import{I as U,J as $,a3 as H,s as K,a4 as Q,r as M,aY as X,E as Z,a7 as i,c as r,o as u,j as m,f as I,i as l,n as f,x as o,F as y,k as b,t as s,m as F,d as c,w as x,e as Y}from"./index-73861dd0.js";import{v as p}from"./Validate-9c4b9c6e.js";import"./Editor-81b206c6.js";const _=["for"],ee=["for"],le=["for"],ne={class:"fieldInputSelection"},ae=Y("svg",{class:"circular",viewBox:"0 0 50 50"},[Y("circle",{class:"path",cx:"25",cy:"25",r:"20",fill:"none"})],-1),ie=["for"],de={__name:"MutableField",props:{config:Object,type:String,keyName:String,inline:Boolean,module:String,entity:String,mutableIndex:Number,inputWidth:String},emits:["changeValue"],setup(e,{emit:B}){const g=e,G=U(()=>$(()=>import("./LookupField-a17fd9b3.js"),["assets/LookupField-a17fd9b3.js","assets/index-73861dd0.js","assets/index-d5e7f8f7.css","assets/LookupField-373edde0.css"])),O=U(()=>$(()=>import("./FormulaField-7c520362.js"),["assets/FormulaField-7c520362.js","assets/index-73861dd0.js","assets/index-d5e7f8f7.css"])),C=H(),{fetchPicklist:z,fetchLookup:P}=C,{getPicklistByListName:E,getLookupOptions:N}=K(C),{checkFieldIfMultipleSelect:w}=Q(),{validateField:T}=p();M();const a=X("form"),V=M(!1),S=M(!1),k=v=>{g.inline||(a.value.errors[g.keyName][v.name]=T(a.value.values[g.keyName],v,a.value.fields)),B("changeValue",v.name,g.mutableIndex)};Z(async()=>{if(g.inline&&g.config.field_type.name=="picklist"){S.value=!0;let v=E.value(g.config.listName);i.isEmpty(v)&&await z([g.config.listName]),S.value=!1}});const W=async v=>{if(console.log("fetchLookupOptions"),v){let t=N.value(g.config.uniqueName,"group");i.isEmpty(t)&&(V.value=!0,await P(g.module,g.config),V.value=!1)}};return(v,t)=>{const L=r("InputText"),D=r("InputNumber"),j=r("el-date-picker"),A=r("InputSwitch"),R=r("Checkbox"),q=r("el-option"),h=r("el-select"),J=r("el-option-group");return e.config.field_type.name=="text"?(u(),m("div",{key:0,class:f(["fieldInput mutableField flex flex-column",{required:l(i).get(e.config.rules,"required",!1)}]),style:o("width:"+e.inputWidth[e.config.name])},[I(L,{modelValue:l(a).values[e.keyName][e.mutableIndex][e.config.name],"onUpdate:modelValue":t[0]||(t[0]=n=>l(a).values[e.keyName][e.mutableIndex][e.config.name]=n),id:e.config.name,size:"small",class:f({"p-invalid":!l(i).isEmpty(l(i).get(l(a).errors[e.keyName][e.mutableIndex],e.config.name,[]))}),disabled:l(a).formSaving,onChange:t[1]||(t[1]=n=>k(e.config)),style:o("width:"+e.inputWidth[e.config.name])},null,8,["modelValue","id","class","disabled","style"]),(u(!0),m(y,null,b(l(i).get(l(a).errors[e.keyName][e.mutableIndex],e.config.name,[]),(n,d)=>(u(),m("small",{class:"errMsg",key:d},s(n),1))),128))],6)):e.config.field_type.name=="number"||e.config.field_type.name=="percentage"?(u(),m("div",{key:1,class:f(["fieldInput mutableField flex flex-column w-auto",{required:l(i).get(e.config.rules,"required",!1)}])},[I(D,{modelValue:l(a).values[e.keyName][e.mutableIndex][e.config.name],"onUpdate:modelValue":[t[2]||(t[2]=n=>l(a).values[e.keyName][e.mutableIndex][e.config.name]=n),t[3]||(t[3]=n=>k(e.config))],inputId:"config.name",mode:"decimal",class:f(["w-auto",{invalid:!l(i).isEmpty(l(i).get(l(a).errors[e.keyName][e.mutableIndex],e.config.name,[]))}]),size:"small",useGrouping:l(i).get(e.config.rules,"comma_separated",!1),suffix:e.config.field_type.name=="percentage"?"%":"",minFractionDigits:l(i).get(e.config.rules,"decimal",null),maxFractionDigits:l(i).get(e.config.rules,"decimal",null)},null,8,["modelValue","class","useGrouping","suffix","minFractionDigits","maxFractionDigits"]),(u(!0),m(y,null,b(l(i).get(l(a).errors[e.keyName][e.mutableIndex],e.config.name,[]),(n,d)=>(u(),m("small",{class:"errMsg",key:d},s(n),1))),128))],2)):e.config.field_type.name=="currency"?(u(),m("div",{key:2,class:f(["fieldInput mutableField flex flex-column",{required:l(i).get(e.config.rules,"required",!1)}]),style:o("width:"+e.inputWidth[e.config.name])},[e.type!="tableForm"?(u(),m("label",{key:0,for:e.config.name},s(e.config.label),9,_)):F("",!0),l(i).get(l(a).values[e.keyName][e.mutableIndex],e.config.currencySource.field+".code","")==""?(u(),c(D,{key:1,disabled:l(a).formSaving,modelValue:l(a).values[e.keyName][e.mutableIndex][e.config.name],"onUpdate:modelValue":[t[4]||(t[4]=n=>l(a).values[e.keyName][e.mutableIndex][e.config.name]=n),t[5]||(t[5]=n=>k(e.config))],inputId:"config.name",mode:"decimal",style:o("width:"+e.inputWidth[e.config.name]),class:f({invalid:!l(i).isEmpty(l(i).get(l(a).errors[e.keyName][e.mutableIndex],e.config.name,[]))}),useGrouping:l(i).get(e.config.rules,"comma_separated",!1),minFractionDigits:l(i).get(e.config.rules,"decimal",null),maxFractionDigits:l(i).get(e.config.rules,"decimal",null)},null,8,["disabled","modelValue","style","class","useGrouping","minFractionDigits","maxFractionDigits"])):(u(),c(D,{key:2,modelValue:l(a).values[e.keyName][e.mutableIndex][e.config.name],"onUpdate:modelValue":[t[6]||(t[6]=n=>l(a).values[e.keyName][e.mutableIndex][e.config.name]=n),t[7]||(t[7]=n=>k(e.config))],disabled:l(a).formSaving,inputId:"config.name",style:o("width:"+e.inputWidth[e.config.name]),mode:"currency",class:f({invalid:!l(i).isEmpty(l(i).get(l(a).errors[e.keyName][e.mutableIndex],e.config.name,[]))}),useGrouping:l(i).get(e.config.rules,"comma_separated",!1),currency:e.config.field_type.name=="currency"?l(i).get(l(a).values[e.keyName][e.mutableIndex],e.config.currencySource.field+".code",""):"",currencyDisplay:l(i).get(e.config,"currencySource.concat",""),minFractionDigits:l(i).get(e.config.rules,"decimal",null),maxFractionDigits:l(i).get(e.config.rules,"decimal",null)},null,8,["modelValue","disabled","style","class","useGrouping","currency","currencyDisplay","minFractionDigits","maxFractionDigits"])),(u(!0),m(y,null,b(l(i).get(l(a).errors[e.keyName][e.mutableIndex],e.config.name,[]),(n,d)=>(u(),m("small",{class:"errMsg",key:d},s(n),1))),128))],6)):e.config.field_type.name=="formula"?(u(),c(l(O),{key:3,field:e.config,keyName:e.keyName,mutableIndex:e.mutableIndex,module:e.module,entity:e.entity,style:o("width:"+e.inputWidth[e.config.name])},null,8,["field","keyName","mutableIndex","module","entity","style"])):e.config.field_type.name=="date"?(u(),m("div",{key:4,class:"fieldInput mutableField flex flex-column",style:o("width:"+e.inputWidth[e.config.name])},[e.type!="tableForm"?(u(),m("label",{key:0,for:e.config.name},s(e.config.label),9,ee)):F("",!0),I(j,{class:f(["w-full",{invalid:!l(i).isEmpty(l(i).get(l(a).errors[e.keyName][e.mutableIndex],e.config.name,[])),required:l(i).get(e.config.rules,"required",!1)}]),disabled:l(a).formSaving,modelValue:l(a).values[e.keyName][e.mutableIndex][e.config.name],"onUpdate:modelValue":t[8]||(t[8]=n=>l(a).values[e.keyName][e.mutableIndex][e.config.name]=n),clearable:"",type:l(i).get(e.config.rules,"date_selection","date"),format:l(i).get(e.config.rules,"date_selection","date")=="month"?"MMM YYYY":l(i).get(e.config.rules,"date_selection","date")=="week"?"YYYY [w]ww":"MM/DD/YYYY","value-format":"YYYY-MM-DD",onChange:t[9]||(t[9]=n=>k(e.config))},null,8,["disabled","modelValue","class","type","format"]),(u(!0),m(y,null,b(l(i).get(l(a).errors[e.keyName][e.mutableIndex],e.config.name,[]),(n,d)=>(u(),m("small",{class:"errMsg",key:d},s(n),1))),128))],4)):e.config.field_type.name=="boolean"?(u(),m("div",{key:5,class:f(["fieldInput checkbox",{required:l(i).get(e.config.rules,"required",!1)}]),style:o("width:"+e.inputWidth[e.config.name])},[l(i).get(e.config.rules,"switch",!1)?(u(),c(A,{key:0,modelValue:l(a).values[e.keyName][e.mutableIndex][e.config.name],"onUpdate:modelValue":t[10]||(t[10]=n=>l(a).values[e.keyName][e.mutableIndex][e.config.name]=n),disabled:l(a).formSaving,inputId:e.config.name},null,8,["modelValue","disabled","inputId"])):(u(),c(R,{key:1,inputId:e.config.name,modelValue:l(a).values[e.keyName][e.mutableIndex][e.config.name],"onUpdate:modelValue":t[11]||(t[11]=n=>l(a).values[e.keyName][e.mutableIndex][e.config.name]=n),binary:!0,disabled:l(a).formSaving},null,8,["inputId","modelValue","disabled"])),e.type!="tableForm"?(u(),m("label",{key:2,for:e.config.name},s(e.config.label),9,le)):F("",!0)],6)):e.config.field_type.name=="picklist"?(u(),m("div",{key:6,class:f(["fieldInput mutableField flex flex-column",{required:l(i).get(e.config.rules,"required",!1)}]),style:o("width:"+e.inputWidth[e.config.name])},[I(h,{modelValue:l(a).values[e.keyName][e.mutableIndex][e.config.name],"onUpdate:modelValue":t[12]||(t[12]=n=>l(a).values[e.keyName][e.mutableIndex][e.config.name]=n),class:f([{invalid:!l(i).isEmpty(l(i).get(l(a).errors[e.keyName][e.mutableIndex],e.config.name,[]))},"w-full"]),multiple:l(w)(e.config.rules),"collapse-tags":l(w)(e.config.rules),"collapse-tags-tooltip":l(w)(e.config.rules),placeholder:"Select",clearable:"",filterable:"",disabled:l(a).formSaving,loading:S.value,onChange:t[13]||(t[13]=n=>k(e.config))},{loading:x(()=>[ae]),default:x(()=>[(u(!0),m(y,null,b(l(E)(e.config.listName),n=>(u(),c(q,{key:n._id,label:n.value,value:n},{default:x(()=>[Y("span",ne,s(n.value),1)]),_:2},1032,["label","value"]))),128))]),_:1},8,["modelValue","class","multiple","collapse-tags","collapse-tags-tooltip","disabled","loading"]),(u(!0),m(y,null,b(l(i).get(l(a).errors[e.keyName][e.mutableIndex],e.config.name,[]),(n,d)=>(u(),m("small",{class:"errMsg mt-1",key:d},s(n),1))),128))],6)):e.config.field_type.name=="lookupModel"?(u(),m("div",{key:7,class:f(["fieldInput mutableField flex flex-column",{required:l(i).get(e.config.rules,"required",!1)}]),style:o("width:"+e.inputWidth[e.config.name])},[l(i).get(e.config.rules,"ss_dropdown",!1)||l(i).get(e.config.rules,"ms_dropdown",!1)?(u(),m(y,{key:0},[l(N)(e.config.uniqueName,"group")?(u(),c(h,{key:0,modelValue:l(a).values[e.keyName][e.mutableIndex][e.config.name],"onUpdate:modelValue":t[14]||(t[14]=n=>l(a).values[e.keyName][e.mutableIndex][e.config.name]=n),disabled:l(a).formSaving,class:f([{invalid:!l(i).isEmpty(l(i).get(l(a).errors[e.keyName][e.mutableIndex],e.config.name,[]))},"w-full"]),placeholder:"Select",clearable:"",filterable:"",loading:V.value,onChange:t[15]||(t[15]=n=>k(e.config)),onVisibleChange:W},{default:x(()=>[(u(!0),m(y,null,b(l(N)(e.config.uniqueName,"options"),n=>(u(),c(J,{key:n.label,label:n.label},{default:x(()=>[(u(!0),m(y,null,b(n.options,d=>(u(),c(q,{key:d._id,label:d.value,value:d},null,8,["label","value"]))),128))]),_:2},1032,["label"]))),128))]),_:1},8,["modelValue","disabled","class","loading"])):(u(),c(h,{key:1,modelValue:l(a).values[e.keyName][e.mutableIndex][e.config.name],"onUpdate:modelValue":t[16]||(t[16]=n=>l(a).values[e.keyName][e.mutableIndex][e.config.name]=n),disabled:l(a).formSaving,class:f(["w-full",{invalid:!l(i).isEmpty(l(i).get(l(a).errors[e.keyName][e.mutableIndex],e.config.name,[]))}]),placeholder:"Select",clearable:"",filterable:"",size:"small",loading:V.value,onChange:t[17]||(t[17]=n=>k(e.config)),onVisibleChange:W},{default:x(()=>[(u(!0),m(y,null,b(l(N)(e.config.uniqueName,"options"),n=>(u(),c(q,{key:n._id,label:n.value,value:n},null,8,["label","value"]))),128))]),_:1},8,["modelValue","disabled","class","loading"]))],64)):(u(),c(l(G),{key:1,field:e.config,keyName:e.keyName,inline:e.inline,module:e.module,entity:e.entity,onChangeValue:t[18]||(t[18]=n=>k(e.config))},null,8,["field","keyName","inline","module","entity"])),(u(!0),m(y,null,b(l(i).get(l(a).errors[e.keyName][e.mutableIndex],e.config.name,[]),(n,d)=>(u(),m("small",{class:"errMsg",key:d},s(n),1))),128))],6)):(u(),m("div",{key:8,class:f(["fieldInput mutableField flex flex-column",{required:l(i).get(e.config.rules,"required",!1)}]),style:o("width:"+e.inputWidth[e.config.name])},[e.type!="tableForm"?(u(),m("label",{key:0,for:e.config.name},s(e.config.label),9,ie)):F("",!0),I(L,{id:e.config.name,modelValue:l(a).values[e.keyName][e.mutableIndex][e.config.name],"onUpdate:modelValue":t[19]||(t[19]=n=>l(a).values[e.keyName][e.mutableIndex][e.config.name]=n)},null,8,["id","modelValue"])],6))}}};export{de as default};