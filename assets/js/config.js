// Separate MidlandsRx Apps Script deployment ID or full /exec URL.
(function(){
  window.MIDLANDSRX_DATA_SPREADSHEET_ID='11neN9xtz5D22Iec9eDidDlL7ouBmswxFPaOHngLoPV8';
  var value='AKfycbys6vMU8JmLbBlCRX0AgpoQmN8b1ZYgVAaTV1qhKMpSSJRK056hfdxPN6GMFROMOrTPtQ';
  if(!value){window.MIDLANDSRX_DATA_API='';return;}
  window.MIDLANDSRX_DATA_API=/^https:\/\/script\.google\.com\/macros\/s\//.test(value)
    ? value
    : 'https://script.google.com/macros/s/'+value.replace(/^\/+|\/+$/g,'')+'/exec';
})();
