var id, map, lat, lng, wwObject = {id: 0, lat: 0, lng: 0, duration: 0, timestamp: 1};
document.getElementById('wwTask').textContent ="MikeWasHere";
function showOnMap(latLng) { 
  var zCenter = {lat: latLng.coords.latitude, lng: latLng.coords.longitude};
  var map = new google.maps.Map(document.getElementById('wwMap'), { zoom: 4, center: zCenter });
  var marker = new google.maps.Marker({ position: zCenter, map: map });      
}
function GetGPSCoords(latLng) {
   document.getElementById('geolatlng').textContent = latLng.coords.latitude + ", " + latLng.coords.longitude;
   showOnMap(latLng);
   navigator.geolocation.clearWatch(id);
}
function error(err) {
  alert('ERROR(' + err.code + '): ' + err.message);
}
id = navigator.geolocation.watchPosition(GetGPSCoords, error, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
