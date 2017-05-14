var id, map, lat, lng, wwObject = {id: 0, lat: 0, lng: 0, duration: 0, timestamp: 1};

document.getElementById('wwTask').textContent ="MikeWasHere";

function gMap(latLng) { 
  const zWhere = {lat: latLng.coords.latitude, lng: latLng.coords.longitude};  
  zMap = new google.maps.Map(document.getElementById('wwMap'), {center: zWhere, zoom: 4}); 
  marker = new google.maps.LatLng( position: zWhere, map: zMap};
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
