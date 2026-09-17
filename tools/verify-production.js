const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
class Cdp{constructor(url){this.id=0;this.pending=new Map();this.ws=new WebSocket(url)}async open(){await new Promise((ok,bad)=>{this.ws.addEventListener('open',ok,{once:true});this.ws.addEventListener('error',bad,{once:true})});this.ws.addEventListener('message',e=>{const m=JSON.parse(e.data),p=this.pending.get(m.id);if(p){this.pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result)}})}send(method,params={},sessionId){const id=++this.id;this.ws.send(JSON.stringify({id,method,params,sessionId}));return new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject}))}}
(async()=>{
const root=path.resolve(__dirname,'..'),profile=fs.mkdtempSync(path.join(require('os').tmpdir(),'midlands-audit-'));
const child=spawn(chrome,['--headless=new','--remote-debugging-port=9344','--user-data-dir='+profile,'--disable-gpu'],{stdio:'ignore',windowsHide:true});let cdp;const failures=[],links=new Set(),errors=[];let pageCount=0;
try{
let endpoint;for(let i=0;i<50;i++){try{endpoint=(await(await fetch('http://127.0.0.1:9344/json/version')).json()).webSocketDebuggerUrl;break}catch(e){await sleep(200)}}
cdp=new Cdp(endpoint);await cdp.open();const {targetId}=await cdp.send('Target.createTarget',{url:'about:blank'});const {sessionId}=await cdp.send('Target.attachToTarget',{targetId,flatten:true});
await cdp.send('Network.enable',{},sessionId);await cdp.send('Network.setBlockedURLs',{urls:['https://*']},sessionId);await cdp.send('Runtime.enable',{},sessionId);
cdp.ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text)});
const files=fs.readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.html')&&!f.includes('&'));
for(const file of files){const route=file.replaceAll('\\','/').replace(/index\.html$/,'').replace(/\.html$/,'');const url='http://localhost/midlandsrx.co.uk/'+route;
const response=await fetch(url);if(response.status!==200)failures.push(route+' HTTP '+response.status);
const legacy=await fetch('http://localhost/midlandsrx.co.uk/'+file.replaceAll('\\','/'),{redirect:'manual'});if(legacy.status!==301||legacy.headers.get('location')!==url)failures.push(route+' legacy redirect '+legacy.headers.get('location'));
const html=await response.text();if(/doc-content|Meta Title:|Meta Description:|id="cmnt/.test(html))failures.push(route+' raw document residue');
await cdp.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true},sessionId);await cdp.send('Page.navigate',{url},sessionId);
let data;for(let i=0;i<40;i++){await sleep(100);const r=await cdp.send('Runtime.evaluate',{expression:`(()=>{if(document.readyState!=='complete')return null;return {h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth,links:[...document.querySelectorAll('a[href],link[href],img[src],script[src]')].map(a=>a.href||a.src),product:!!document.querySelector('.product-page'),chooser:!!document.querySelector('[data-price-chooser]'),text:document.body.innerText};})()`,returnByValue:true},sessionId);data=r.result.value;if(data)break;}
if(!data){failures.push(route+' render timeout');continue;}if(data.h1!==1)failures.push(route+' H1 count '+data.h1);if(data.overflow)failures.push(route+' mobile overflow');if(data.product&&!data.chooser)failures.push(route+' missing pack chooser');
if(data.product){const r=await cdp.send('Runtime.evaluate',{expression:`(()=>{document.querySelector('[data-product-tab="specifications"]').click();const tab=document.querySelector('[data-product-panel="specifications"]').classList.contains('active');document.querySelector('[data-add-basket]').click();return {tab,items:JSON.parse(localStorage.getItem('midlandsCart')||'[]').length};})()`,returnByValue:true},sessionId);if(!r.result.value?.tab||!r.result.value?.items)failures.push(route+' product interaction');await cdp.send('Runtime.evaluate',{expression:"localStorage.removeItem('midlandsCart')"},sessionId);}

for(let href of data.links){if(href.startsWith('https://www.midlandsrx.co.uk/'))href=href.replace('https://www.midlandsrx.co.uk/','http://localhost/midlandsrx.co.uk/');if(href.startsWith('http://localhost/'))links.add(href.split('#')[0]);}
pageCount++;
}
for(const href of links){const r=await fetch(href,{redirect:'manual'});if(r.status>=400)failures.push('Broken link '+r.status+' '+href);else if(r.status>=300)failures.push('Internal redirect '+href+' -> '+r.headers.get('location'));}
for(const resource of ['.git/config','tools/verify-checkout-fallback.js','google-apps-script/reviews.gs']){const r=await fetch('http://localhost/midlandsrx.co.uk/'+resource);if(r.status!==403)failures.push('Exposed '+resource);}
console.log(JSON.stringify({pageCount,links:links.size,errors:[...new Set(errors)],failures},null,2));process.exitCode=failures.length||errors.length?1:0;
}finally{if(cdp)cdp.ws.close();child.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
