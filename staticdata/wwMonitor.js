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
xmlhttp.overrideMimeType('application/xml');

xmlhttp.onreadystatechange=function() { 
  if (xmlhttp.readyState==4 && xmlhttp.status==200) {    
    buildTaskLines(xmlhttp.responseXML.documentElement);
  }
};

xmlhttp.open("GET","wwGetTasks.php",true);  
xmlhttp.send();

function buildTaskLines(root) {
  var hook = document.getElementById('wwTasks');
  var zTasks = root.getElementsByTagName('task');
  
  for (let task of zTasks) {
    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');            
    rect.setAttribute("x", 0);
    rect.setAttribute("y", 0);    
    rect.setAttribute("width", 600);    
    rect.setAttribute("height", 50);    
    rect.setAttribute("rx", 5);        
    rect.setAttribute("fill", '#000060');        
    rect.setAttribute("zid", task.getAttribute('id'));        
    hook.appendChild(rect); 
  
    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');            
    rect.setAttribute("x", 20);
    rect.setAttribute("y", 10);    
    rect.setAttribute("width", 00);    
    rect.setAttribute("height", 30);    
    rect.setAttribute("rx", 5);        
    rect.setAttribute("fill", '#0000f0');        
    hook.appendChild(rect); 
  
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');            
    text.setAttribute("x", 30);
    text.setAttribute("y", 30);    
    text.textContent = task.getAttribute('duration'))
    hook.appendChild(text); 
  }
}
