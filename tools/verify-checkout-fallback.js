const fs=require('fs'),vm=require('vm'),assert=require('assert');
(async()=>{
let checked=0;
for(const home of [false,true])for(const channel of ['whatsapp','telegram'])for(const scenario of ['success','quota','network','invalid','timeout','body-timeout','missing','wrong-sheet','analytics-error','storage-error']){
 const source=fs.readFileSync('assets/js/'+(home?'site':'commerce')+'.js','utf8');
 const start=source.indexOf('async function saveOrderBestEffort');
 const end=source.indexOf(home?'\nenhanceHomeCart();':'\nfunction renderCart()',start);
 const item={name:'Example',type:'Test',pieces:10,price:20,quantity:1};let removed=false;
 const status={textContent:''},button={disabled:false};
 const context={AbortController,URLSearchParams,navigator:{userAgent:'test'},location:{href:'https://example.test/'},window:{gtag(){if(scenario==='analytics-error')throw Error('analytics');}},document:{querySelector(sel){return sel.includes('postage')?{value:12}:status;},querySelectorAll(){return [button];}},localStorage:{getItem(){return JSON.stringify([item]);},removeItem(){if(scenario==='storage-error')throw Error('storage');removed=true;}},setTimeout(fn,ms){assert.equal(ms,5000);return setTimeout(fn,5);},clearTimeout,cart:[item],whatsapp:'https://wa.me/447438135064',telegram:'https://t.me/BenzoAddy',DATA_API_URL:scenario==='missing'?'':'https://example.test/api',DATA_SPREADSHEET_ID:'sheet',dataApi:scenario==='missing'?'':'https://example.test/api',dataSpreadsheetId:'sheet',newOrder(){return {orderId:'test',items:[item],subtotal:20,postage:12,total:32};},orderMessage(){return 'Example 10 pieces total 32';},homeOrderMessage(){return 'Example 10 pieces total 32';},fetch:async()=>{
 if(scenario==='network')throw Error('network');
 if(scenario==='timeout')return new Promise(()=>{});
 return {ok:scenario!=='quota',json:async()=>{if(scenario==='invalid')throw Error('json');if(scenario==='body-timeout')return new Promise(()=>{});return {ok:scenario!=='quota',spreadsheetId:scenario==='wrong-sheet'?'other':'sheet'};}};
 }};
 vm.createContext(context);vm.runInContext(source.slice(start,end),context);
 if(home)await context.saveHomeCheckout({preventDefault(){}},{href:channel==='whatsapp'?context.whatsapp:context.telegram});else await context.checkout(channel);
 assert(context.location.href.startsWith(channel==='whatsapp'?context.whatsapp+'?text=':context.telegram),`${home} ${channel} ${scenario} redirect`);
 if(channel==='whatsapp')assert(decodeURIComponent(context.location.href).includes('Example 10 pieces total 32'));
 assert.equal(removed,['success','analytics-error'].includes(scenario),`${home} ${scenario} basket preservation`);
 checked++;
}
console.log(`${checked} checkout fallback checks passed`);
})().catch(e=>{console.error(e);process.exitCode=1;});
