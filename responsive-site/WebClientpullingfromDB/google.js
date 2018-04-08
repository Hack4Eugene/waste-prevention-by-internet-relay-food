var mapManifest = null;
var mapMarkers = [];
var highlightedPost = null

function initMap() {
    var uluru = {lat: 44, lng: 123}; // the center for eugene
    var dac = new XMLHttpRequest();
    var getURL= 'https://maps.googleapis.com/maps/api/geocode/json?address='
    var addr = 'Eugene, OR';
    addr.replace(' ','+');
    getURL +=addr;
    getURL += '&key=AIzaSyCdFdbAfHSJHwfjRrnVtSHVtudd8x1benw';

    dac.open('GET', getURL);
    dac.addEventListener('load',function(event){
      var results = JSON.parse(event.target.response);

      mapManifest = new google.maps.Map(
        document.getElementById('map'),
        {
          zoom: 10,
          center: results['results'][0]['geometry']['location']
        });

    });
    dac.send();

  }
