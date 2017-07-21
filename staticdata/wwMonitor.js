var id, zInterval, wwObject = {id: 0, lat: 0, lng: 0, duration: 0, timestamp: 1, address: 'Ø'};
var zDone = false, grouped = [];
function GetGPSCoords(latLng) {
  wwObject.address = showWhereWhenOnMap(latLng);
  getStoredData(latLng);
  navigator.geolocation.clearWatch(id);
}
function showWhereWhenOnMap(latLng) { 
  const zWhere = {lat: latLng.coords.latitude, lng: latLng.coords.longitude};  
  wwObject.lat = latLng.coords.latitude; 
  wwObject.lng = latLng.coords.longitude;
  wwObject.timestamp = latLng.timestamp;
  wwObject.id = 9999;
  var zMap = new google.maps.Map(document.getElementById('wwMap'), {
      center: zWhere,
      zoom: 12, 
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
  zMarker.addListener('click', taskClicked);   
  
  var zGeocoder = new google.maps.Geocoder;
  zGeocoder.geocode({'location': zWhere}, function(results, status) {
    if (status === 'OK') wwObject.address = results[0].formatted_address;     
  });
  return wwObject.address;
}
function error(err) {
  alert('ERROR(' + err.code + '): ' + err.message);
}
function getStoredData (latLng) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.overrideMimeType('application/xml');
  xmlhttp.onreadystatechange=function() { 
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {    
      groupTasks_ShowUI(xmlhttp.responseXML.documentElement, latLng);
    }
  };
  var temp = window.location.search.split("=");
  xmlhttp.open("GET","wwGetTasks.php" + "?id=" + temp[1],true);  
  xmlhttp.send();
}
function groupTasks_ShowUI(root, latLng) {
  var hook = document.getElementById('wwTasks');
  var zTasks = root.getElementsByTagName('task');
  var address = "Ø", match = false;
  
  grouped[0].id = 9999; grouped[0].duration = 0; grouped[0].timestamp = latLng.timestamp;
  grouped[0].lat = latLng.coords.latitude; grouped[0].lng = latLng.coords.lng ; grouped[0].address = wwObject.address;

  for (var ix = 1; ix < zTasks.length; ix++) {
    task = zTasks[ix]; match = false;
    for (var jx = 0; jx < grouped.length; jx++) { 
      if (grouped[jx].address === task.getAttribute("address")) {       
        grouped[jx].duration = (parseInt(grouped[jx].duration) + parseInt(task.getAttribute("duration")));
        grouped[jx].timestamp = grouped[jx].timestamp;
        match = true;
      }  
      if (match === false) grouped.push(copyTask(task)); 
    }    
  }
  scatterTasks(grouped);
  
  document.getElementById('zId').textContent = grouped[0].id;
  document.getElementById('zAddress').textContent = grouped[0].address;
  document.getElementById('zAccumulate').textContent = grouped[0].duration;
  document.getElementById('zTimestamp').textContent = grouped[0].timestamp;

  function copyTask (task) {
    var groupedItem = {};  
    groupedItem.id = task.getAttribute('id');
    groupedItem.duration = task.getAttribute('duration');
    groupedItem.timestamp = task.getAttribute('timestamp');
    groupedItem.lat = task.getAttribute('lat');
    groupedItem.lng = task.getAttribute('lng');
    groupedItem.address = task.getAttribute('address');
    return groupedItem;
  }
  function scatterTasks (grouped) {
    for (var jx = 1; jx < grouped.length; jx++) { 
      const zWhere = {lat: grouped[jx].lat, lng: lat: grouped[jx].lng};  
      var zMarker = new google.maps.Marker({
      position: zWhere,
      map: zMap,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        strokeColor: '#00FF00',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#00FF00',
        fillOpacity: 0.35
      },
      animation: google.maps.Animation.DROP
    });
  }
} 
function stopClock(what) {
  var todie = document.getElementById('todie');
  var execute = todie.parentNode.removeChild(todie);
  clearInterval(zInterval);
  wrapUp(wwObject); 
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
  var jx = 0;
  
  for (ix=1; ix<360; ix=ix+6) {        // ix is degree rotater
    var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');    
    X = Math.cos(ix * Math.PI / 180);          Y = Math.sin(ix * Math.PI / 180);           d = "M"  + parseInt(1000 + (X * 700)) + ', '  + parseInt(1000 + (Y * 700));                   
    X = Math.cos(ix * Math.PI / 180);          Y = Math.sin(ix * Math.PI / 180);           d+= " L" + parseInt(1000 + (X * 1000)) + ', ' + parseInt(1000 + (Y * 1000));                
    X = Math.cos((ix + 2) * Math.PI / 180);    Y = Math.sin((ix + 2) * Math.PI / 180);     d+= " Q" + parseInt(1000 + (X * 1003)) + ', ' + parseInt(1000 + (Y * 1003));            
    X = Math.cos((ix + 4) * Math.PI / 180);    Y = Math.sin((ix + 4) * Math.PI / 180);     d+= "  " + parseInt(1000 + (X * 1000)) + ', ' + parseInt(1000 + (Y * 1000));                
    X = Math.cos((ix + 4) * Math.PI / 180);    Y = Math.sin((ix + 4) * Math.PI / 180);     d+= " L" + parseInt(1000 + (X * 700)) + ', '  + parseInt(1000 + (Y * 700));                
    jx++;
    path.setAttribute("id", 's' + jx);
    path.setAttribute("fill", "url(#passive)");
    path.setAttribute("d", d + ' Z');    
    group.appendChild(path);  
  } 
  svgdoc.appendChild(group);  
  
  var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
  text.setAttribute("id", 'zdate');  
  text.setAttribute("fill", '#f80');  
  text.setAttribute("font-size", 144);  
  text.setAttribute("text-anchor", 'middle');  
  text.setAttribute("x", 1000);
  text.setAttribute("y", 1000);
  text.textContent = '00:00';    
  
  svgdoc.appendChild(text);  
  
  setInterval(motion, 1000);
  
  function motion() {
    var now = new Date();            
    var elapsed = now.getTime() - entryTime.getTime();
    var zGet = "s" + parseInt(now.getSeconds() + 1);
    var thisPath = document.getElementById(zGet);
    (thisPath.getAttribute("fill") === 'url(#active)') ? thisPath.setAttribute("fill", 'url(#passive)') : thisPath.setAttribute("fill", 'url(#active)');  
    var thisClock = document.getElementById("zdate");
    thisClock.textContent = function (mili) {
      var seconds = parseInt(mili / 1000);
      var mm = parseInt(seconds / 60);
      var ss = seconds - (mm * 60);
      if (mm < 10) mm = "0" + mm; 
      if (ss < 10) ss = "0" + ss; 
      return mm + ":" + ss;
      }(elapsed);
  }
} 
id = navigator.geolocation.watchPosition(GetGPSCoords, error, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
