const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
class Cdp{constructor(url){this.id=0;this.pending=new Map();this.ws=new WebSocket(url)}async open(){await new Promise((ok,bad)=>{this.ws.addEventListener('open',ok,{once:true});this.ws.addEventListener('error',bad,{once:true})});this.ws.addEventListener('message',e=>{const m=JSON.parse(e.data),p=this.pending.get(m.id);if(p){this.pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result)}})}send(method,params={},sessionId){const id=++this.id;this.ws.send(JSON.stringify({id,method,params,sessionId}));return new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject}))}}
(async()=>{
const root=path.resolve(__dirname,'..'),profile=fs.mkdtempSync(path.join(require('os').tmpdir(),'midlands-prerender-'));
const child=spawn(chrome,['--headless=new','--remote-debugging-port=9343','--user-data-dir='+profile,'--disable-gpu'],{stdio:'ignore',windowsHide:true});let cdp;
try{
let endpoint;for(let i=0;i<50;i++){try{endpoint=(await(await fetch('http://127.0.0.1:9343/json/version')).json()).webSocketDebuggerUrl;break}catch(e){await sleep(200)}}
cdp=new Cdp(endpoint);await cdp.open();const {targetId}=await cdp.send('Target.createTarget',{url:'about:blank'});const {sessionId}=await cdp.send('Target.attachToTarget',{targetId,flatten:true});
await cdp.send('Network.enable',{},sessionId);await cdp.send('Network.setBlockedURLs',{urls:['*assets/js/commerce.js*','*assets/js/site.js*','https://*']},sessionId);
const files=fs.readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.html')&&!f.includes(path.sep+'.'));
let count=0;
for(const file of files){const full=path.join(root,file),source=fs.readFileSync(full,'utf8');if(!source.includes('assets/js/pages.js')||source.includes('data-prerendered'))continue;
await cdp.send('Page.navigate',{url:'http://localhost/midlandsrx.co.uk/'+file.replaceAll('\\','/').replace(/index\.html$/,'').replace(/\.html$/,'')},sessionId);
let data;
for(let i=0;i<60;i++){await sleep(100);const response=await cdp.send('Runtime.evaluate',{expression:`(()=>{if(document.readyState!=='complete'||!document.querySelector('.page-header')||!document.querySelector('main'))return null;document.querySelectorAll('a[id^="cmnt"],a[href^="#cmnt"]').forEach(a=>{const box=a.closest('div');if(box&&!box.className)box.remove();else a.remove();});return {body:document.body.innerHTML,title:document.title,description:document.querySelector('meta[name="description"]')?.content};})()`,returnByValue:true},sessionId);data=response.result.value;if(data)break;}
if(!data)throw Error('Render failed '+file);
let head=source.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)[1].replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'');
head=head.replace(/<title>[\s\S]*?<\/title>/i,'<title>'+data.title.replaceAll('&','&amp;').replaceAll('<','&lt;')+'</title>');
head=head.replace(/(<script\b[^>]*assets\/js\/pages\.js[^>]*data-kind="blog)-index"/,'$1-index"');
fs.writeFileSync(full,'<!doctype html>\n<html lang="en-GB" data-prerendered><head>'+head+'</head><body>'+data.body+'</body></html>\n');count++;
}
console.log('Saved '+count+' finished page layouts.');
}finally{if(cdp)cdp.ws.close();child.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
