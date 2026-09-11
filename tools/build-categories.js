const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'shop', 'category');
const productImages = {
  'alprax-alprazolam-2-mg-mlx.html':'../../assets/img/medicine/alprax-xr2.jpg',
  'alprazolam-alprax-1-mg-mlx.html':'../../assets/img/medicine/alprax-xr2.jpg',
  'bromazepam-version-2.html':'../../assets/img/medicine/broze.jpg',
  'diazepam-martin-dow-10mg-mlx.html':'../../assets/img/medicine/valium.jpg',
  'easium-diazepam-10mg-mlx.html':'../../assets/img/medicine/valium.jpg',
  'lorazepam-ativan-2-mg.html':'../../assets/img/medicine/lorazepam.jpg',
  'noctin-nitrazepam-5-mg-mlx.html':'../../assets/img/medicine/noctin.jpg',
  'rivotril-clonazepam-2mg-mlx.html':'../../assets/img/medicine/rivotril-2.jpg',
  'sedil-diazepam-5-mg-mlx.html':'../../assets/img/medicine/sedil.jpg',
  'zopiclone-7-5mg-version-2.html':'../../assets/img/medicine/zopiclone-tablets.jpg'
};
const fallbackProductImage = '../../assets/img/medicine-product.svg';

const categories = [
  {
    slug: 'adhd-and-wakefulness', source: 'adhd-&-wakefulness.html',
    name: 'ADHD & Wakefulness Medicines', short: 'ADHD & Wakefulness',
    h1: 'ADHD & Wakefulness Medicines in the UK',
    fallback: 'Explore information about ADHD and wakefulness medicines, including available options for eligible patients who have completed the appropriate clinical checks.',
    products: ['modafinil-version-2.html']
  },
  {
    slug: 'anxiety-and-panic-disorders', source: 'anxiety-and-panic-disorders.html',
    name: 'Anxiety & Panic Disorder Medicines', short: 'Anxiety & Panic',
    h1: 'Anxiety & Panic Disorder Medicines in the UK',
    fallback: 'Explore medicine information for anxiety and panic disorders. Suitability depends on individual symptoms, medical history and professional assessment.',
    products: ['alprax-alprazolam-2-mg-mlx.html', 'alprazolam-alprax-1-mg-mlx.html', 'rlam-1-mg-alprazolam-mlx.html', 'lorazepam-ativan-2-mg.html', 'bromazepam-version-2.html', 'diazepam-martin-dow-10mg-mlx.html', 'easium-diazepam-10mg-mlx.html', 'sedil-diazepam-5-mg-mlx.html']
  },
  {
    slug: 'anxiety-and-seizure-disorders', source: 'anxiety-and-seizure-disorders.html',
    name: 'Anxiety & Seizure Disorder Medicines', short: 'Anxiety & Seizures',
    h1: 'Anxiety & Seizure Disorder Medicines in the UK',
    fallback: 'Review medicine information for selected anxiety and seizure disorders. Treatment choice and dosage must be determined through appropriate medical assessment.',
    products: ['pase-clonazepam-2mg-mlx.html', 'rivotril-clonazepam-2mg-mlx.html', 'diazepam-martin-dow-10mg-mlx.html', 'easium-diazepam-10mg-mlx.html']
  },
  {
    slug: 'moderate-severe-pain', source: 'moderate-severe-pain.html',
    name: 'Moderate to Severe Pain Medicines', short: 'Pain Management',
    h1: 'Moderate to Severe Pain Medicines in the UK',
    fallback: 'Review medicine information for moderate to severe pain. These medicines require careful suitability, interaction and prescription checks.',
    products: ['pregabalin-pregacare-nt-m.html']
  },
  {
    slug: 'nerve-pain-and-anxiety-related-medicines', source: 'nerve-pain-&-anxiety-related-medicines.html',
    name: 'Nerve Pain & Neuropathy Medicines', short: 'Nerve Pain & Neuropathy',
    h1: 'Nerve Pain & Neuropathy Medicines in the UK',
    fallback: 'Explore information about medicines used for neuropathic or nerve-related pain. A clinician should assess the cause of symptoms and treatment suitability.',
    products: ['pregabalin-pregacare-nt-m.html']
  },
  {
    slug: 'short-term-sedation', source: 'short-term-sedation.html',
    name: 'Short-term Sedation Medicines', short: 'Short-term Sedation',
    h1: 'Short-term Sedation Medicines in the UK',
    fallback: 'Review information about short-term sedation medicines. These treatments require professional assessment because they may cause drowsiness, interactions and dependence.',
    products: ['midolam-midazolam-7-5-mg.html', 'lorazepam-ativan-2-mg.html', 'diazepam-martin-dow-10mg-mlx.html', 'sedil-diazepam-5-mg-mlx.html', 'bromazepam-version-2.html']
  },
  {
    slug: 'sleep-and-insomnia-medication', source: 'sleep-&-insomnia-medication.html',
    name: 'Sleep & Insomnia Medication', short: 'Sleep & Insomnia',
    h1: 'Sleep & Insomnia Medication in the UK',
    fallback: 'Explore information about medicines used for short-term sleep difficulties and insomnia. Treatment should follow an assessment of symptoms, risks and other medicines.',
    products: ['noctin-nitrazepam-5-mg-mlx.html', 'zopiclone-7-5mg-version-2.html', 'midolam-midazolam-7-5-mg.html']
  }
];

const categoryOrder = ['anxiety-and-panic-disorders','anxiety-and-seizure-disorders','sleep-and-insomnia-medication','short-term-sedation','nerve-pain-and-anxiety-related-medicines','moderate-severe-pain','adhd-and-wakefulness'];
categories.sort((a,b) => categoryOrder.indexOf(a.slug) - categoryOrder.indexOf(b.slug));

const products = {
  'alprax-alprazolam-2-mg-mlx.html': ['Alprax Alprazolam 2mg', 'Anxiety & panic', 20],
  'alprazolam-alprax-1-mg-mlx.html': ['Alprazolam Alprax 1mg', 'Anxiety & panic', 20],
  'bromazepam-version-2.html': ['Bromazepam', 'Short-term anxiety', 25],
  'diazepam-martin-dow-10mg-mlx.html': ['Diazepam Martin Dow 10mg', 'Anxiety & sedative', 20],
  'easium-diazepam-10mg-mlx.html': ['Easium Diazepam', 'Anxiety & sedative', 50],
  'lorazepam-ativan-2-mg.html': ['Lorazepam Ativan 2mg', 'Short-term anxiety', 20],
  'midolam-midazolam-7-5-mg.html': ['Midolam Midazolam 7.5mg', 'Sedation', 20],
  'modafinil-version-2.html': ['Modafinil', 'Wakefulness', 25],
  'noctin-nitrazepam-5-mg-mlx.html': ['Noctin Nitrazepam 5mg', 'Sleep & insomnia', 20],
  'pase-clonazepam-2mg-mlx.html': ['Pase Clonazepam 2mg', 'Anxiety & seizures', 20],
  'pregabalin-pregacare-nt-m.html': ['Pregabalin Pregacare', 'Nerve pain', 30],
  'rivotril-clonazepam-2mg-mlx.html': ['Rivotril Clonazepam 2mg', 'Anxiety & seizures', 20],
  'rlam-1-mg-alprazolam-mlx.html': ['Rlam Alprazolam 1mg', 'Anxiety & panic', 20],
  'sedil-diazepam-5-mg-mlx.html': ['Sedil Diazepam 5mg', 'Anxiety & sedative', 30],
  'zopiclone-7-5mg-version-2.html': ['Zopiclone 7.5mg', 'Sleep & insomnia', 20]
};

function text(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&rsquo;/gi, "'").replace(/\s+/g, ' ').replace(/\s+([.,!?;:])/g, '$1').trim();
}

function neutral(value) {
  return value.replace(/MidlansRx/g, 'MidlandsRx');
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function sourceMeta(html, label) {
  const paragraphs = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(match => text(match[1]));
  const value = paragraphs.find(item => item.toLowerCase().startsWith(label.toLowerCase()));
  return value ? neutral(value.slice(label.length).trim()) : '';
}

function cleanSource(html) {
  let body = (html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i) || [])[1] || '';
  body = neutral(body);
  body = body.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (all, inner) => /^(?:type|meta title|meta description)\s*:|^=+$/i.test(text(inner)) || !text(inner) ? '' : all);
  body = body.replace(/<span\b([^>]*)>([\s\S]*?)<\/span>/gi, (_, attrs, inner) => /font-weight\s*:\s*700/i.test(attrs) ? `<strong>${inner}</strong>` : inner);
  body = body.replace(/\s(?:style|class|id)=(?:"[^"]*"|'[^']*')/gi, '');
  body = body.replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, '');
  body = body.replace(/<h3>(\s*<strong>)?(Why[^<]+)(<\/strong>\s*)?<\/h3>/gi, '<h2>$1$2$3</h2>');
  return body.trim();
}

function contentParts(category) {
  const raw = fs.readFileSync(path.join(sourceDir, category.source), 'utf8');
  if (/class=\"[^\"]*category-layout/.test(raw)) {
    const heading=raw.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    let lead=category.fallback;
    if(heading){const after=raw.slice(heading.index+heading[0].length),match=after.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);if(match)lead=neutral(text(match[1]))}
    const reading=raw.match(/<section class="category-reading">[\s\S]*?<article\b[^>]*>([\s\S]*?)<\/article>[\s\S]*?<\/section>/i);
    if(reading)return{h1:heading?neutral(text(heading[1])):category.h1,lead,content:reading[1].trim(),title:neutral(text((raw.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]||'')),description:neutral(text((raw.match(/<meta name="description" content="([^"]*)"/i)||[])[1]||''))};
    const genericContent='<h2>Why review '+category.short.toLowerCase()+' options carefully?</h2><p>Medicine suitability depends on your symptoms, health history, current treatments and potential interactions. Review the medicine information and speak with an appropriate healthcare professional before making a request.</p><h2>Frequently asked questions</h2><h3>How do I choose a suitable medicine?</h3><p>Use the category list to compare relevant medicine information. A qualified professional should confirm whether a treatment is appropriate for you.</p><h3>Are these medicines suitable for long-term use?</h3><p>That depends on the medicine and your circumstances. Some treatments are intended only for short-term use and should not be stopped suddenly without medical advice.</p><h3>Where can I find prices and pack options?</h3><p>Open an individual medicine page to review its available price tiers and further product information.</p>';
    return {h1:category.h1,lead,content:genericContent};
  }
  const heading=raw.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const h1=heading?neutral(text(heading[1])):category.h1;
  const title=sourceMeta(raw,'Meta Title:')||`${category.name} UK | MidlandsRx`;
  const description=sourceMeta(raw,'Meta Description:')||category.fallback;
  let content = cleanSource(raw);
  content = content.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');
  let lead = '';
  content = content.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/i, (all, inner) => { lead = text(inner); return ''; });
  lead = neutral(lead || category.fallback);
  if (!/<h2\b/i.test(content)) {
    content += `<h2>Why review ${category.short.toLowerCase()} options carefully?</h2><p>Medicine suitability depends on your symptoms, health history, current treatments and potential interactions. Review the medicine information and speak with an appropriate healthcare professional before making a request.</p><h2>Frequently asked questions</h2><h3>How do I choose a suitable medicine?</h3><p>Use the category list to compare relevant medicine information. A qualified professional should confirm whether a treatment is appropriate for you.</p><h3>Are these medicines suitable for long-term use?</h3><p>That depends on the medicine and your circumstances. Some treatments are intended only for short-term use and should not be stopped suddenly without medical advice.</p><h3>Where can I find prices and pack options?</h3><p>Open an individual medicine page to review its available price tiers and further product information.</p>`;
  }
  return { h1, lead, content, title, description };
}

function categoryLinks(active) {
  return categories.map(item => `<a${item.slug === active ? ' class="active" aria-current="page"' : ''} href="${item.slug}.html">${item.name}</a>`).join('');
}

function cards(category) {
  return category.products.map(slug => {
    const item = products[slug];
    if (!item) throw new Error(`Unknown product ${slug}`);
    const productImage = productImages[slug] || fallbackProductImage;
    return `<article class="category-product-card"><a class="category-product-image" href="../medicine/${slug}" aria-label="View ${item[0]}"><img src="${productImage}" alt="${item[0]}" loading="lazy" width="555" height="555"></a><div class="category-product-body"><p class="category-product-label">${item[1]}</p><h2><a href="../medicine/${slug}">${item[0]}</a></h2><p>Review medicine information, available pack options and important safety guidance.</p><div class="category-product-footer"><span><small>Prices from</small><strong>Â£${item[2]}</strong></span><a class="page-cta" href="../medicine/${slug}">View medicine</a></div></div></article>`;
  }).join('');
}

function navDropdown(prefix, active) {
  const links = categories.map(item => `<a${item.slug === active ? ' class="active"' : ''} href="${prefix}shop/category/${item.slug}.html">${item.name}</a>`).join('');
  return `<details class="nav-categories"><summary>All Categories <span aria-hidden="true">âŒ„</span></summary><div class="nav-category-menu">${links}</div></details>`;
}

function page(category) {
  const parts = contentParts(category);
  const title = parts.title || `${category.name} UK | MidlandsRx`;
  const description = parts.description || `Browse ${category.name.toLowerCase()}, relevant product information, available prices and safety guidance from MidlandsRx in the UK.`;
  const canonical = `https://www.midlandsrx.co.uk/shop/category/${category.slug}.html`;
  const schema = JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:category.name,description,url:canonical});
  const options = categories.map(item => `<option value="${item.slug}.html"${item.slug === category.slug ? ' selected' : ''}>${item.name}</option>`).join('');
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website"><meta property="og:site_name" content="MidlandsRx"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}"><meta name="twitter:card" content="summary">
<meta name="google-site-verification" content="k_HuLCcCK5LlQr4KeCU8K_fJ2Y1Q9Gb09m3f5h78khE">
<script type="application/ld+json">${schema}</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YCFH5LJPKK"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-YCFH5LJPKK');</script>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','GTM-WZ77TJFH');</script>
<link rel="stylesheet" href="../../assets/css/pages.css"><link rel="stylesheet" href="../../assets/css/category.css">
<script defer src="../../assets/js/category.js"></script><script defer src="../../assets/js/site.js"></script>
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WZ77TJFH" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<a class="page-skip" href="#page-content">Skip to content</a><div class="page-notice"><div class="page-container"><p>Private UK-wide delivery</p><p><a href="../../#how-it-works">How requests work</a></p></div></div>
<header class="page-header"><div class="page-container page-header-inner"><a class="page-brand" href="../../"><img src="../../assets/img/logo.svg" alt="MidlandsRx"></a><nav class="page-nav">${navDropdown('../../', category.slug)}<a class="active" href="../">Shop</a><a href="../../blog/">Blog</a><a href="../../about-us/">About Us</a><a href="../../#contact">Contact Us</a></nav><div class="page-actions"><button class="page-menu" aria-label="Open menu" aria-expanded="false"><i></i><i></i><i></i></button></div></div><nav class="page-mobile-nav"><a href="../../#categories">All Categories</a><a href="../">Shop</a><a href="../../blog/">Blog</a><a href="../../about-us/">About Us</a><a href="../../#contact">Contact Us</a></nav></header>
<main id="page-content"><section class="category-hero"><div class="page-container"><nav class="category-breadcrumb" aria-label="Breadcrumb"><a href="../../">Home</a><span>â€º</span><a href="../">Shop</a><span>â€º</span><span>${category.name}</span></nav><p class="page-kicker">MEDICINE CATEGORY</p><h1>${escapeHtml(parts.h1 || category.h1)}</h1><p>${escapeHtml(parts.lead)}</p></div></section>
<section class="category-catalogue"><div class="page-container category-layout"><aside class="category-sidebar"><label for="category-select">Browse categories</label><select id="category-select">${options}</select><nav aria-label="Medicine categories">${categoryLinks(category.slug)}</nav></aside><div class="category-results"><div class="category-results-head"><div><p class="page-kicker">RELEVANT MEDICINES</p><h2>${category.name}</h2></div><span>${category.products.length} option${category.products.length === 1 ? '' : 's'}</span></div><div class="category-product-grid">${cards(category)}</div></div></div></section>
<section class="category-reading"><article class="page-container article-content">${parts.content}</article></section></main>
<footer class="page-footer"><div class="page-container footer-grid"><div class="footer-brand"><img src="../../assets/img/logo.svg" alt="MidlandsRx"><p>Private, convenient access to healthcare support across the United Kingdom.</p></div><div><h2>EXPLORE</h2><a href="../">Medicines</a><a href="../../blog/">Blog</a><a href="../../about-us/">About Us</a></div><div><h2>SUPPORT</h2><a href="../../#contact">Contact Us</a><a href="https://wa.me/447438135064">WhatsApp</a><a href="https://t.me/BenzoAddy">Telegram</a></div><div><h2>IMPORTANT</h2><p class="footer-note">Always read the patient information leaflet and follow professional medical advice.</p></div></div><div class="page-container footer-bottom"><span>Â© ${new Date().getFullYear()} MidlandsRx. All rights reserved.</span><span>Keep medicines out of reach of children.</span></div></footer>
</body></html>`;
}

for (const category of categories) fs.writeFileSync(path.join(sourceDir, `${category.slug}.html`), page(category), 'utf8');
console.log(`Built ${categories.length} consistent category pages.`);

