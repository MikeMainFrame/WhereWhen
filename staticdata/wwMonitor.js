var id, map, zLat, zLng, wwObject = {id: 0, lat: 0, lng: 0, duration: 0, timestamp: 1};

function showWhereWhenOnMap(latLng) { 
  const zWhere = {lat: latLng.coords.latitude, lng: latLng.coords.longitude};  
  var zMap = new google.maps.Map(document.getElementById('wwMap'), {
      center: zWhere,
      zoom: 18, 
    }); 
  var zMarker = new google.maps.Marker({
     position: zWhere,
     map: zMap,
     icon: {
       path: google.maps.SymbolPath.CIRCLE,
       scale: 10,
       strokeColor: '#FF0000',
       strokeOpacity: 0.8,
       strokeWeight: 2,
       fillColor: '#FF0000',
       fillOpacity: 0.35
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
  var x = 0, y = 60;
  
  for (let task of zTasks) {
    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');            
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);    
    rect.setAttribute("width", 600);    
    rect.setAttribute("height", 50);    
    rect.setAttribute("rx", 5);        
    rect.setAttribute("fill", "rgba(69, 130, 241,1)");        
    rect.setAttribute("zid", task.getAttribute('id'));        
    hook.appendChild(rect); 
  
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');            
    text.setAttribute("x", x + 10);
    text.setAttribute("y", y + 30);    
    text.setAttribute("fill", "#FFF");
    text.textContent = task.getAttribute('id');
    hook.appendChild(text); 
    
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');            
    text.setAttribute("x", x + 60);
    text.setAttribute("y", y + 30);    
    text.setAttribute("fill", "#FFF");
    text.textContent = task.getAttribute('duration');
    hook.appendChild(text); 
    
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');            
    text.setAttribute("x", x + 60);
    text.setAttribute("y", y + 200);    
    text.setAttribute("fill", "#FFF");
    text.textContent = task.getAttribute('timestamp');
    hook.appendChild(text); 
    
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');            
    text.setAttribute("x", x + 60);
    text.setAttribute("y", y + 350);    
    text.setAttribute("fill", "#FFF");
    text.textContent = task.getAttribute('latitude');
    hook.appendChild(text); 
    
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');            
    text.setAttribute("x", x + 60);
    text.setAttribute("y", y + 500);    
    text.setAttribute("fill", "#FFF");
    text.textContent = task.getAttribute('longitude');
    hook.appendChild(text); 
    
    y = y + 60;
  }
}
