var id, zInterval, wwObject = {id: 0, lat: 0, lng: 0, duration: 0, timestamp: 1, address: 'Ø'};
var zDone = false;

function showWhereWhenOnMap(latLng) { 
  const zWhere = {lat: latLng.coords.latitude, lng: latLng.coords.longitude};  
  wwObject.lat = latLng.coords.latitude; 
  wwObject.lng = latLng.coords.longitude;
  wwObject.timestamp = latLng.timestamp;
  wwObject.id = 9999;
  var zMap = new google.maps.Map(document.getElementById('wwMap'), {
      center: zWhere,
      scale: 2,
      gestureHandling: 'greedy',
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
    if (status === 'OK') wwObject.address = results[0].formatted_address;     
  });
  return wwObject.address;
}
function GetGPSCoords(latLng) {
   wwObject.address = showWhereWhenOnMap(latLng);
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
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {    
      buildTaskLines(xmlhttp.responseXML.documentElement, latLng);
    }
  };
  xmlhttp.open("GET","wwGetTasks.php",true);  
  xmlhttp.send();
}
function buildTaskLines(root, latLng) {
  var hook = document.getElementById('wwTasks');
  var zTasks = root.getElementsByTagName('task');
  var x = 0, y = 60, address = "Ø"
  
  doLine(9999, 0, latLng.timestamp, latLng.coords.latitude, latLng.coords.longitude, wwObject.address);
  y = y + 60;
  for (var ix = 0; ix < zTasks.length; ix++) {
    task = zTasks[ix];
    doLine(task.getAttribute('id'), 
           task.getAttribute('duration'),
           task.getAttribute('timestamp'),
           task.getAttribute('lat'),
           task.getAttribute('lng'),
           task.getAttribute('address'),
          );     
    y = y + 60;
  }

  function doLine(id, duration, timestamp, lat, lng, address) {  
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
    text.setAttribute("x", x + 160);
    text.setAttribute("y", y + 30);    
    text.textContent = parseInt(duration) / 60;
    hook.appendChild(text); 
    
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');            
    text.setAttribute("x", x + 290);
    text.setAttribute("y", y + 30);    
    var w = new Date(parseInt(timestamp));
    text.textContent =  parseInt((w.getFullYear() * 100000000) +
                                ((w.getMonth() + 1) * 1000000) + 
                                (w.getDate() * 10000) +
                                (w.getHours() * 100) +
                                 w.getSeconds());
    hook.appendChild(text); 
    /*
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
    */
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');            
    text.setAttribute("x", x + 300);
    text.setAttribute("y", y + 30);   
    text.setAttribute("text-anchor", 'start');        
    text.textContent = address;
    hook.appendChild(text); 
  }
}

function stopClock(what) {
  alert("clock stopped " + JSON.stringify(wwObject));
  var todie = document.getElementById('todie');
  var execute = todie.parentNode.removeChild(todie);
  clearInterval(zInterval);
  
}
function taskClicked(what) {  
  if (zDone === false) {
    setupClock('zTimer');
    zInterval = setInterval(progress, 1000);
    zDone = true;
  }
  function progress() {
    var now = new Date();            
    wwObject.duration = now.getTime() - wwObject.timestamp;
    var jx = parseInt(now.getSeconds() + 1);
    var thisPath = document.getElementById("s" + parseInt(now.getSeconds() + 1));
    thisPath.setAttribute("fill", "rgba(79, 150, 255,1)"); // change color during elapse ?
    document.getElementById("zdate").textContent = (function (mili) {
      var seconds = parseInt(mili / 1000);      
      var mm = parseInt(seconds / 60);
      var ss = seconds - (mm * 60); 
      if (mm < 10) mm = "0" + mm;
      if (ss < 10) ss = "0" + ss;
      return mm + ":" + ss;
    })(wwObject.duration);
  }
}
function setupClock (anchor) {
  var svgdoc = document.getElementById(anchor); 
  var group = document.createElementNS("http://www.w3.org/2000/svg", 'g'); 
  group.setAttribute("id", 'todie');
  
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
    path.setAttribute("fill", "#EEE");
    path.setAttribute("d", d + ' Z');    
    group.appendChild(path);             
  } 
  var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
  text.setAttribute("id", 'zdate');  
  text.setAttribute("fill", 'black');  
  text.setAttribute("font-size", 256);  
  text.setAttribute("stroke", 'black');      
  text.setAttribute("text-anchor", 'middle');  
  text.setAttribute("x", 1000);
  text.setAttribute("y", 1000);
  text.textContent = "000";
  group.appendChild(text);             
  svgdoc.appendChild(group);  
  svgdoc.addEventListener('click', stopClock, false);  
}
id = navigator.geolocation.watchPosition(GetGPSCoords, error, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
