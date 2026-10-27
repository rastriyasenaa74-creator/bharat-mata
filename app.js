
const SCHOOL_API_URL = ""; // After deploying Google Apps Script, paste its Web App URL here.
const $=s=>document.querySelector(s);
function esc(x){return String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function showMsg(el,text,error=false){if(!el)return;el.textContent=text;el.className="alert"+(error?" error":"");el.hidden=false}
function menuInit(){const b=$(".menu"),n=$(".links");if(b&&n)b.onclick=null;if(b&&n)b.addEventListener("click",()=>n.classList.toggle("open"))}
function demoOnly(){return !SCHOOL_API_URL}
async function api(action,data={}){if(!SCHOOL_API_URL)throw new Error("यह लोकल डेमो है। Google Sheets backend चालू करने के लिए setup guide के अनुसार Apps Script deploy करके app.js में Web App URL डालें।");const r=await fetch(SCHOOL_API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action,...data})});const j=await r.json();if(!j.success)throw new Error(j.error||"Request failed");return j.data}
document.addEventListener("DOMContentLoaded",()=>{
 menuInit();
 const adm=$("#admission-form");if(adm)adm.addEventListener("submit",async e=>{e.preventDefault();const out=$("#form-message");try{const data=Object.fromEntries(new FormData(adm));if(demoOnly()){showMsg(out,"फॉर्म का डिज़ाइन तैयार है। वास्तविक Google Sheets सेविंग के लिए Apps Script backend deploy करना बाकी है।",true);return}const r=await api("submitAdmission",{form:data});showMsg(out,"आवेदन सफलतापूर्वक जमा हुआ। आवेदन संख्या: "+r.applicationNo);adm.reset()}catch(err){showMsg(out,err.message,true)}});
 const login=$("#login-form");if(login)login.addEventListener("submit",async e=>{e.preventDefault();const out=$("#login-message");try{if(demoOnly()){showMsg(out,"Login screen तैयार है, लेकिन वास्तविक login के लिए Apps Script backend URL configure करना बाकी है।",true);return}const d=Object.fromEntries(new FormData(login));const r=await api("login",d);sessionStorage.setItem("bmic_token",r.token);sessionStorage.setItem("bmic_user",JSON.stringify(r.user));location.href="index.html"}catch(err){showMsg(out,err.message,true)}});
 const y=$("#year");if(y)y.textContent=new Date().getFullYear();
});
