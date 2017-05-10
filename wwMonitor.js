var id, map, lat, lng, wwObject = {id: 0, lat: 0, lng: 0, duration: 0, timestamp: 1};
document.getElementById('wwTask').textContent ="MikeWasHere";
function showOnMap(zpos) { 
  map = new google.maps.Map(document.getElementById('wwMap'), {
                             center: new google.maps.LatLng(zpos.coords.latitude, zpos.coords.longitude),
                             zoom: 15 });
                             var latlon = new google.maps.LatLng(zpos.coords.latitude, zpos.coords.longitude);
                             var marker = new google.maps.Marker({position: latlon, map:map,title: "boom"});
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
