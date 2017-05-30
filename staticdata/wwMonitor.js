var id, zAddress, zDone = false ; var wwObject = {id: 0, lat: 0, lng: 0, duration: 0, timestamp: 1};

function showWhereWhenOnMap(latLng) { 
  const zWhere = {lat: latLng.coords.latitude, lng: latLng.coords.longitude};  
  var zMap = new google.maps.Map(document.getElementById('wwMap'), {
      center: zWhere,
      zoom: 16, 
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
  
  var zGeocoder = new google.maps.Geocoder;
  zGeocoder.geocode({'location': zWhere}, function(results, status) {
    if (status === 'OK') zAddress = results[1].formatted_address;     
  });
}

function GetGPSCoords(latLng) {
   showWhereWhenOnMap(latLng);
   getStoredData(latLng);
   navigator.geolocation.clearWatch(id);
}

function error(err) {
  alert('ERROR(' + err.code + '): ' + err.message);
}

function getStoredData (latLng) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.overrideMimeType('application/xml');
  xmlhttp.onreadystatechange=function() { 
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {    
      buildTaskLines(xmlhttp.responseXML.documentElement, latLng);
    }
  };
  xmlhttp.open("GET","wwGetTasks.php",true);  
  xmlhttp.send();
}
function buildTaskLines(root, latLng) {
  var hook = document.getElementById('wwTasks');
  var zTasks = root.getElementsByTagName('task');
  var x = 0, y = 60;
  
  doLine(9999, 0, latLng.timestamp, latLng.coords.latitude, latLng.coords.longitude);
  y = y + 60;
  
  for (let task of zTasks) {
    doLine(task.getAttribute('id'), 
           task.getAttribute('duration'),
           task.getAttribute('timestamp'),
           task.getAttribute('lat'),
           task.getAttribute('lng'));     
    y = y + 60;
  }
  
  function doLine(id, duration, timestamp, lat, lng) {
    
    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');            
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);    
    rect.setAttribute("width", 600);    
    rect.setAttribute("height", 50);    
    rect.setAttribute("rx", 5);        
    rect.setAttribute("fill", "rgba(79, 150, 255,1)");        
    rect.setAttribute("zid", id);        
    rect.addEventListener('click', taskClicked, false);  
    hook.appendChild(rect); 
  
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');            
    text.setAttribute("x", x + 60);
    text.setAttribute("y", y + 30);    
    text.textContent = id;
    hook.appendChild(text); 
    
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');            
    text.setAttribute("x", x + 240);
    text.setAttribute("y", y + 30);    
    text.textContent = duration;
    hook.appendChild(text); 
    
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');            
    text.setAttribute("x", x + 400);
    text.setAttribute("y", y + 30);    
    text.textContent = timestamp;
    hook.appendChild(text); 
    
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');            
    text.setAttribute("x", x + 500);
    text.setAttribute("y", y + 30);    
    text.textContent = lat;
    hook.appendChild(text); 
    
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');            
    text.setAttribute("x", x + 600);
    text.setAttribute("y", y + 30);    
    text.textContent = lng;
    hook.appendChild(text);
  }
}
function taskClicked(what) {
  if zDone = false {
    setupClock('zTimer');
    var temp = setInterval(progress, 1000);
    zDone = true;
  }
  function progress() {
    var now = new Date();        
    var zGet = "s" + parseInt(now.getSeconds() + 1);
    var thisPath = document.getElementById(zGet);
    thisPath.setAttribute("fill", "rgba(79, 150, 255,1)");
  }
}
function setupClock (anchor) {
  var svgdoc = document.getElementById(anchor); 
  var group = document.createElementNS("http://www.w3.org/2000/svg", 'g'); 
  var jx = 0;
  
  for (ix=1; ix<360; ix=ix+6) {        // ix is degree rotater
    var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');    
    X = Math.cos(ix * Math.PI / 180);          Y = Math.sin(ix * Math.PI / 180);           d = "M"  + parseInt(1000 + (X * 900)) + ', '  + parseInt(1000 + (Y * 900));                   
    X = Math.cos(ix * Math.PI / 180);          Y = Math.sin(ix * Math.PI / 180);           d+= " L" + parseInt(1000 + (X * 1000)) + ', ' + parseInt(1000 + (Y * 1000));                
    X = Math.cos((ix + 2.5) * Math.PI / 180);  Y = Math.sin((ix + 2.5) * Math.PI / 180);   d+= " Q" + parseInt(1000 + (X * 1003)) + ', ' + parseInt(1000 + (Y * 1003));            
    X = Math.cos((ix + 5) * Math.PI / 180);    Y = Math.sin((ix + 5) * Math.PI / 180);     d+= "  " + parseInt(1000 + (X * 1000)) + ', ' + parseInt(1000 + (Y * 1000));                
    X = Math.cos((ix + 5) * Math.PI / 180);    Y = Math.sin((ix + 5) * Math.PI / 180);     d+= " L" + parseInt(1000 + (X * 900)) + ', '  + parseInt(1000 + (Y * 900));               
    jx++;
    path.setAttribute("id", 's' + jx);
    path.setAttribute("fill", "#FFF");
    path.setAttribute("d", d + ' Z');    
    group.appendChild(path);             
  } 
  svgdoc.appendChild(group);  
}
id = navigator.geolocation.watchPosition(GetGPSCoords, error, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
