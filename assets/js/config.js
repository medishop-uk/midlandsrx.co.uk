// Separate MidlandsRx Apps Script deployment ID or full /exec URL.
(function(){
  var value='';
  if(!value){window.MIDLANDSRX_DATA_API='';return;}
  window.MIDLANDSRX_DATA_API=/^https:\/\/script\.google\.com\/macros\/s\//.test(value)
    ? value
    : 'https://script.google.com/macros/s/'+value.replace(/^\/+|\/+$/g,'')+'/exec';
})();
