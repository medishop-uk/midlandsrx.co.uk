const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');

const productImages={
 'alprax-alprazolam-2-mg-mlx.html':'medicine/alprax-xr2.jpg','alprazolam-alprax-1-mg-mlx.html':'medicine/alprax-xr2.jpg',
 'bromazepam-version-2.html':'medicine/broze.jpg','diazepam-martin-dow-10mg-mlx.html':'medicine/valium.jpg',
 'easium-diazepam-10mg-mlx.html':'medicine/valium.jpg','lorazepam-ativan-2-mg.html':'medicine/lorazepam.jpg',
 'noctin-nitrazepam-5-mg-mlx.html':'medicine/noctin.jpg','rivotril-clonazepam-2mg-mlx.html':'medicine/rivotril-2.jpg',
 'sedil-diazepam-5-mg-mlx.html':'medicine/sedil.jpg','zopiclone-7-5mg-version-2.html':'medicine/zopiclone-tablets.jpg'
};
const homeProductImages={clonazepam:'medicine/rivotril-2.jpg',alprazolam:'medicine/alprax-xr2.jpg',diazepam:'medicine/valium.jpg',lorazepam:'medicine/lorazepam.jpg',nitrazepam:'medicine/noctin.jpg',zopiclone:'medicine/zopiclone-tablets.jpg',bromazepam:'medicine/broze.jpg'};
const blogImages={
 '10-signs-of-adhd-in-adults.html':'blog/post/midlandsrx-adhd-diagnosis-hero-image.webp',
 '10-reasons-of-sleep-disorder-and-how-to-treat-them.html':'blog/post/sleeping-pills-hero-image.webp',
 'how-to-buy-medicine-online-without-a-prescription-in-the-uk-midlandsrx.html':'blog/post/blog-image-1.webp',
 'how-to-get-prescription-medicines-online-safely-in-the-uk-mlx.html':'blog/post/safe-prescription-medicines-online-uk.jpg',
 'identify-genuine-medicines-midland.html':'blog/post/guide-to-identify-genuine-medicines-and-avoid-counterfeit-drugs-in-the-uk.jpg',
 'neuropathy-causes-symptoms-treatment-options.html':'blog/post/midland-neuropathy.jpg',
 'nhs-gphc-law-for-online-pharmacies-uk-midlandsrx.html':'blog/post/blog-image-2.jpg',
 'panic-attack-symptoms-causes-what-to-do.html':'blog/post/midland-panic-attack.jpg',
 'sleep-and-anxiety-medication.html':'blog/post/midland-insomnia.jpg'
};

function write(file,value){fs.writeFileSync(file,value,'utf8')}
function replaceOg(file,image){let html=fs.readFileSync(file,'utf8');html=html.replace(/<meta property="og:image" content="[^"]*">/,`<meta property="og:image" content="https://www.midlandsrx.co.uk/assets/img/${image}">`);write(file,html)}

let productJs=fs.readFileSync(path.join(root,'assets/js/product.js'),'utf8');
if(!productJs.includes("var image=productImages[pageSlug]"))productJs=productJs.replace(" var html='<main", " var image=productImages[pageSlug]||'medicine-product.svg';\n var html='<main");
productJs=productJs.replace("root+'/assets/img/medicine-product.svg\" alt=\"'+safe(defaults[0])", "root+'/assets/img/'+image+'\" alt=\"'+safe(defaults[0])");
write(path.join(root,'assets/js/product.js'),productJs);

let main=fs.readFileSync(path.join(root,'assets/js/main.js'),'utf8');
if(!main.includes('const homeProductImages='))main=main.replace('const listedMedicines=',`const homeProductImages=${JSON.stringify(homeProductImages)};\nconst listedMedicines=`);
main=main.replace('src="assets/img/medicine-product.svg" alt="\'+m.n+\'"','src="assets/img/\'+(homeProductImages[m.id]||\'medicine-product.svg\')+\'" alt="\'+m.n+\'"');
write(path.join(root,'assets/js/main.js'),main);

for(const [file,image] of Object.entries(productImages))replaceOg(path.join(root,'shop/medicine',file),image);
for(const [file,image] of Object.entries(blogImages))replaceOg(path.join(root,'blog/post',file),image);
replaceOg(path.join(root,'blog/index.html'),'blog/blog-breadcrumb-2.webp');
const services=fs.readdirSync(path.join(root,'service-area')).filter(file=>file.endsWith('.html'));
services.forEach((file,index)=>replaceOg(path.join(root,'service-area',file),`blog/blog-breadcrumb-${index%2+1}.webp`));
console.log(`Linked ${Object.keys(productImages).length} product images, ${Object.keys(blogImages).length} post images and ${services.length} service images.`);
