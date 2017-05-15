var id, map, lat, lng, wwObject = {id: 0, lat: 0, lng: 0, duration: 0, timestamp: 1};

document.getElementById('wwTask').textContent ="Mike Was Here";

function gMap(latLng) { 
  const zWhere = {lat: latLng.coords.latitude, lng: latLng.coords.longitude};  
  var zMap = new google.maps.Map(document.getElementById('wwMap'), {
      center: zWhere, zoom: 15, icon: {
        path: google.maps.SymbolPath.CIRCLE, scale: 10
      }
    }); 
  var zMarker = new google.maps.Marker({position: zWhere, map: zMap, animation: google.maps.Animation.DROP});
  
}
function GetGPSCoords(latLng) {
   document.getElementById('geolatlng').textContent = latLng.coords.latitude + ", " + latLng.coords.longitude;
   gMap(latLng);
   navigator.geolocation.clearWatch(id);
}
function error(err) {
  alert('ERROR(' + err.code + '): ' + err.message);
}
id = navigator.geolocation.watchPosition(GetGPSCoords, error, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
