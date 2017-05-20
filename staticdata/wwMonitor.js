var id, map, zLat, zLng, wwObject = {id: 0, lat: 0, lng: 0, duration: 0, timestamp: 1};

function showWhereWhenOnMap(latLng) { 
  const zWhere = {lat: latLng.coords.latitude, lng: latLng.coords.longitude};  
  var zMap = new google.maps.Map(document.getElementById('wwMap'), {
      center: zWhere,
      zoom: 20, 
    }); 
  var zMarker = new google.maps.Marker({
     position: zWhere,
     map: zMap,
     icon: {
       path: google.maps.SymbolPath.CIRCLE, scale: 10
     },
     animation: google.maps.Animation.DROP
  });
}
function GetGPSCoords(latLng) {
   zLat = latLng.coords.latitude;
   zLng = latLng.coords.longitude;
   showWhereWhenOnMap(latLng);
   navigator.geolocation.clearWatch(id);
}
function error(err) {
  alert('ERROR(' + err.code + '): ' + err.message);
}
id = navigator.geolocation.watchPosition(GetGPSCoords, error, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });

var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange=function() { 
  if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    var zstatus = document.getElementById('pre'); zstatus.textContent = xmlhttp.responseText;
  }
};

xmlhttp.open("GET","wwGetTasks.php",true);  
xmlhttp.send();
