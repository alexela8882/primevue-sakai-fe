import{H as t,r,I as d}from"./index-c9a8d9f5.js";const l=t("branch",()=>{const a=r([]),s=d(()=>a.value);return{branches:a,getBranches:s,setBranches:e=>{a.value=e},addBranch:e=>{a.value.push(e)},updateBranch:e=>{s.value.map((n,c)=>{n._id===e._id&&(a.value[c]=Object.assign({},e))})},deleteBranch:e=>{const n=a.value.findIndex(c=>c._id===e._id);a.value.splice(n,1)}}});export{l as u};
