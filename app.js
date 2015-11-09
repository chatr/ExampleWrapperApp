(function(){

  var options = INSTALL_OPTIONS;
  var isPreview = INSTALL_ID == "preview";

  if (!options.customerId) {
    return;
  }

  var script = document.createElement('script');
  document.head.appendChild(script);

  script.src = 'http://photon.photos/api/v1/' + options.customerId;

  if (isPreview){
    script.src += "?preview=true";
  }

})();
