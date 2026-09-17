(function(){
'use strict';
var slugs={clonazepam:'clonazepam-pase-2mg',alprazolam:'alprazolam-alprax-2mg',midazolam:'midazolam-midolam-7-5mg',diazepam:'diazepam-martin-dow-10mg',lorazepam:'lorazepam-ativan-2mg',tapentadol:'tapentadol-100mg',tramadol:'tramadol-100mg',nitrazepam:'nitrazepam-noctin-5mg',zopiclone:'zopiclone-7-5mg',pregabalin:'pregabalin-pregacare-nt',ritalin:'ritalin-alaradate-10mg',etizolam:'etizolam',modifinal:'modafinil',cocodamol:'co-codamol',bromazepam:'bromazepam',benzit:'benzit',clobazam:'clobazam',mirtazapine:'mirtazapine-miramind',temazepam:'temazepam',zolpidem:'zolpidem'};
function analytics(name,url){if(typeof window.gtag==='function'){window.gtag('event',name,{link_url:url,transport_type:'beacon'})}else{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:name,link_url:url})}}
document.querySelectorAll('.medicine-card').forEach(function(card){var action=card.querySelector('[data-product]');if(!action)return;var product=action.getAttribute('data-product'),slug=slugs[product];if(!slug)return;var href='shop/medicine/'+slug,name=(card.querySelector('h3')||{}).textContent||'medicine';var top=card.querySelector('.medicine-icon');if(top){var image=document.createElement('a');image.className='medicine-image-link';image.href=href;image.setAttribute('aria-label','View '+name);image.innerHTML='<img src="assets/img/medicine-product.svg" alt="'+name+'">';top.replaceWith(image)}var heading=card.querySelector('h3');if(heading){var title=document.createElement('a');title.href=href;title.textContent=heading.textContent;heading.textContent='';heading.appendChild(title)}var button=document.createElement('a');button.className='medicine-action';button.href=href;button.setAttribute('aria-label','View '+name);button.textContent='→';action.replaceWith(button)});
document.querySelectorAll('.shop-card').forEach(function(card){var target=card.querySelector('.shop-card-footer a');if(!target)return;var href=target.getAttribute('href'),heading=card.querySelector('h2'),art=card.querySelector('.card-art');if(heading&&!heading.querySelector('a')){var title=document.createElement('a');title.href=href;title.textContent=heading.textContent;heading.textContent='';heading.appendChild(title)}if(art&&art.tagName!=='A'){var image=document.createElement('a');image.className='card-art product-card-art';image.href=href;image.setAttribute('aria-label','View '+(heading?heading.textContent:'medicine'));image.innerHTML='<img src="'+(location.pathname.indexOf('/shop/')>-1?'../':'')+'assets/img/medicine-product.svg" alt="'+(heading?heading.textContent:'Medicine')+'">';art.replaceWith(image)}});
document.querySelectorAll('.page-nav a,.page-mobile-nav a').forEach(function(link){if(link.textContent.trim()==='Health guides')link.textContent='Blog';if(link.textContent.trim()==='Treatments')link.textContent='Categories'});
document.addEventListener('click',function(event){var link=event.target.closest('a[href]');if(!link)return;if(link.href.indexOf('wa.me/')>-1)analytics('whatsapp_click',link.href);if(link.href.indexOf('t.me/')>-1)analytics('telegram_click',link.href)});
var dataApi=window.MIDLANDSRX_DATA_API||'',dataSpreadsheetId=window.MIDLANDSRX_DATA_SPREADSHEET_ID||'';
function homeMoney(value){return '£'+Number(value).toFixed(0)}
function homeOrderMessage(order){return 'Hello MidlandsRx, my request reference is '+order.orderId+'.\n\n'+order.items.map(function(item){return '• '+item.name+' — '+item.type+', '+item.pieces+' pcs × '+item.quantity+' ('+homeMoney(item.price*item.quantity)+')'}).join('\n')+'\n\nMedicine total: '+homeMoney(order.subtotal)+'\nPostage: '+homeMoney(order.postage)+'\nTotal: '+homeMoney(order.total)+'\n\nPlease confirm availability and next steps.'}
function enhanceHomeCart(){var footer=document.querySelector('#cart-footer'),buttons=footer&&footer.querySelector('.checkout-buttons');if(!buttons||footer.querySelector('#home-postage'))return;var label=document.createElement('label');label.className='home-postage-select';label.innerHTML='Postage<select id="home-postage"><option value="12">Regular — £12</option><option value="15">Saturday Special — from £15</option></select>';buttons.parentNode.insertBefore(label,buttons)}
async function saveOrderBestEffort(url,spreadsheetId,order){
 if(!url)return false;
 var controller=new AbortController(),timer;
 try{return await Promise.race([
  (async function(){var response=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'createOrder',order:order,userAgent:navigator.userAgent}),signal:controller.signal});var result=await response.json();return !!(response.ok&&result&&result.ok&&(!result.spreadsheetId||!spreadsheetId||result.spreadsheetId===spreadsheetId));})(),
  new Promise(function(resolve){timer=setTimeout(function(){resolve(false);controller.abort();},5000);})
 ]);}catch(error){return false;}finally{clearTimeout(timer);}
}
var homeCheckoutPending=false;
async function saveHomeCheckout(event,link){
 event.preventDefault();if(homeCheckoutPending)return;
 var status=document.querySelector('#home-checkout-status');if(!status){status=document.createElement('p');status.id='home-checkout-status';status.className='postage-note';link.closest('.checkout-buttons').after(status);}
 var items=[];try{items=JSON.parse(localStorage.getItem('midlandsCart')||'[]')}catch(error){}if(!items.length)return;var channel=link.href.indexOf('wa.me/')>-1?'whatsapp':'telegram',postage=Number((document.querySelector('#home-postage')||{value:12}).value),subtotal=items.reduce(function(sum,item){return sum+Number(item.price)*Number(item.quantity||1)},0),order={orderId:'MRX-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase(),timestamp:new Date().toISOString(),channel:channel,status:'New',items:items,subtotal:subtotal,postage:postage,total:subtotal+postage,currency:'GBP',pageUrl:location.href,utmSource:new URLSearchParams(location.search).get('utm_source')||'',utmMedium:new URLSearchParams(location.search).get('utm_medium')||'',utmCampaign:new URLSearchParams(location.search).get('utm_campaign')||''};
 homeCheckoutPending=true;
 var target=channel==='whatsapp'?'https://wa.me/447438135064?text='+encodeURIComponent(homeOrderMessage(order)):'https://t.me/BenzoAddy';
 status.textContent='Opening '+(channel==='whatsapp'?'WhatsApp':'Telegram')+'?';
 try{
  var saved=await saveOrderBestEffort(dataApi,dataSpreadsheetId,order);
  if(saved){
   try{localStorage.removeItem('midlandsCart');}catch(error){}
   try{if(typeof window.gtag==='function')window.gtag('event','purchase',{transaction_id:order.orderId,currency:'GBP',value:order.total,shipping:order.postage});}catch(error){}
  }
 }finally{location.href=target;homeCheckoutPending=false;}
}

enhanceHomeCart();var cartFooter=document.querySelector('#cart-footer');if(cartFooter)new MutationObserver(enhanceHomeCart).observe(cartFooter,{childList:true,subtree:true});
document.addEventListener('click',function(event){var link=event.target.closest('.checkout-buttons a');if(link)saveHomeCheckout(event,link)});
})();(function () {
 'use strict';
 var script = document.currentScript;
 var base = new URL('../../', script.src);
 var home = !!document.querySelector('.site-header');
 var desktop = document.querySelector('.desktop-nav,.page-nav');
 var mobile = document.querySelector('.mobile-nav,.page-mobile-nav');
 var wa = 'https://wa.me/447438135064', tg = 'https://t.me/BenzoAddy';
 function link(path, label) { return '<a href="' + new URL(path, base).href + '">' + label + '</a>'; }
 var basket = '<button type="button" class="nav-basket" '+(home?'data-cart-open':'data-commerce-open')+'>Basket <b '+(home?'data-cart-count':'data-commerce-count')+'>0</b></button>';
 var chat = '<a href="'+wa+'" target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="'+tg+'" target="_blank" rel="noopener noreferrer">Telegram</a>';
 var rest = link('shop/','Shop')+link('blog/','Blog')+link('about-us/','About Us')+link('contact-us/','Contact Us')+basket+chat;
 if(desktop){var categories=desktop.querySelector('.nav-categories');desktop.innerHTML=link('','Home')+(categories?categories.outerHTML:link('#categories','All Categories'))+rest;}
 if(mobile)mobile.innerHTML=link('','Home')+link('#categories','All Categories')+rest;
 document.querySelectorAll('.header-actions .basket-button,.page-actions .commerce-basket,.page-actions>.page-cta,.header-actions .search-jump').forEach(function(el){el.remove();});
 document.querySelectorAll('a[href]').forEach(function(a){if(a.textContent.trim()==='Contact Us')a.href=new URL('contact-us/',base).href;});
 var count=0;try{count=JSON.parse(localStorage.getItem('midlandsCart')||'[]').reduce(function(n,item){return n+Number(item.quantity||1);},0);}catch(e){}
 document.querySelectorAll('[data-cart-count],[data-commerce-count]').forEach(function(el){el.textContent=count;});
 var icons={whatsapp:'<path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 21l1.7-4.9a8.5 8.5 0 1 1 15.8-4.4Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 7c-1 1-1 3 1 5s4 4 6 3l1-2-3-1-1 1-2-2 1-1-1-3Z"/>',telegram:'<path d="m3 10 17-7c1-.4 1.5.2 1.2 1.5l-3 15c-.2 1-1 1.3-1.8.7l-5-3.7-2.4 2.3.4-4.4 8.2-7.5-10 6L3 12c-1-.3-1-1.5 0-2Z"/>'};
 var floating=document.createElement('div');floating.className='floating-chats';floating.setAttribute('aria-label','Contact MidlandsRx');
 floating.innerHTML=[['whatsapp',wa,'WhatsApp'],['telegram',tg,'Telegram']].map(function(x){return '<a class="floating-chat '+x[0]+'" href="'+x[1]+'" target="_blank" rel="noopener noreferrer" aria-label="Chat on '+x[2]+'" title="Chat on '+x[2]+'"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'+icons[x[0]]+'</svg></a>';}).join('');document.body.appendChild(floating);
 var slides=Array.from(document.querySelectorAll('.banner-slide'));
 if(slides.length){
 var index=0,timer,carousel=document.querySelector('.banner-carousel'),dots=Array.from(document.querySelectorAll('[data-banner-dot]'));
 function show(n){index=(n+slides.length)%slides.length;slides.forEach(function(s,i){s.classList.toggle('active',i===index);s.setAttribute('aria-hidden',String(i!==index));});dots.forEach(function(dot,i){dot.classList.toggle('active',i===index);dot.setAttribute('aria-current',String(i===index));});}
 function stop(){clearInterval(timer);}
 function start(){stop();if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!carousel.matches(':hover')&&!carousel.contains(document.activeElement)&&!document.hidden)timer=setInterval(function(){show(index+1);},6000);}
 dots.forEach(function(dot){dot.onclick=function(){show(Number(dot.dataset.bannerDot));start();};});
 carousel.addEventListener('mouseenter',stop);carousel.addEventListener('mouseleave',start);carousel.addEventListener('focusin',stop);carousel.addEventListener('focusout',function(){setTimeout(start,0);});document.addEventListener('visibilitychange',start);
 show(0);start();
 }
})();
