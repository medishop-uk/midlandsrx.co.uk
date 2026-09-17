const fs=require('fs');
const path=require('path');
const slugs=['anxiety-and-panic-disorders','anxiety-and-seizure-disorders','sleep-and-insomnia-medication','short-term-sedation','nerve-pain-and-anxiety-related-medicines','moderate-severe-pain','adhd-and-wakefulness'];
const base='http://localhost/midlandsrx.co.uk/';
const failures=[];

async function request(path,redirect='follow'){
  try{return await fetch(new URL(path,base),{redirect})}catch(error){failures.push(`${path}: ${error.message}`);return null}
}

(async()=>{
  for(const slug of slugs){
    const route=`shop/category/${slug}`;
    const response=await request(route);
    if(!response||response.status!==200){failures.push(`${route}: expected 200, got ${response&&response.status}`);continue}
    const html=await response.text();
    for(const tag of ['header','main','footer'])if((html.match(new RegExp(`<${tag}\\b`,'gi'))||[]).length!==1)failures.push(`${route}: expected one ${tag}`);
    if((html.match(/<h1\b/gi)||[]).length!==1)failures.push(`${route}: expected one H1`);
    if(/doc-content|Meta Title:|Meta Description:/.test(html))failures.push(`${route}: contains Google Docs export residue`);
    for(const match of html.matchAll(/href="\.\.\/medicine\/([^"]+)"/g))if(!fs.existsSync(path.join('shop','medicine',match[1]+'.html')))failures.push(`${route}: missing medicine target ${match[1]}`);
    const checks=[
      [/<h1\b[^>]*>[^<]+<\/h1>/i,'H1'],
      [/class="[^"]*\bcategory-layout\b[^"]*"/,'two-column layout'],
      [/id="category-select"/,'category dropdown'],
      [/class="category-product-grid"/,'medicine grid'],
      [/\.\.\/medicine\/[^"']+/,'portable medicine links'],
      [/class="category-reading"/,'supporting content'],
      [new RegExp(`<link rel="canonical" href="https://www\\.midlandsrx\\.co\\.uk/shop/category/${slug}\">`),'canonical']
    ];
    for(const [pattern,label] of checks)if(!pattern.test(html))failures.push(`${route}: missing ${label}`);
  }
  const legacy=[
    ['shop/category/adhd-%26-wakefulness','adhd-and-wakefulness'],
    ['shop/category/sleep-%26-insomnia-medication','sleep-and-insomnia-medication'],
    ['shop/category/nerve-pain-%26-anxiety-related-medicines','nerve-pain-and-anxiety-related-medicines']
  ];
  for(const [oldPath,newSlug] of legacy){
    const response=await request(oldPath,'manual'),location=response&&response.headers.get('location');
    if(!response||response.status!==301||!location?.includes('/midlandsrx.co.uk/shop/category/'+newSlug))failures.push(`${oldPath}: incorrect legacy redirect (${response&&response.status} ${location})`);
  }
  const sitemap=fs.readFileSync('sitemap.xml','utf8');
  for(const slug of slugs)if(!sitemap.includes(`<loc>https://www.midlandsrx.co.uk/shop/category/${slug}</loc>`))failures.push(`sitemap missing ${slug}`);
  console.log(JSON.stringify({categoryRoutes:slugs.length,passed:failures.length===0,failures},null,2));
  process.exitCode=failures.length?1:0;
})().catch(error=>{console.error(error);process.exitCode=1});
