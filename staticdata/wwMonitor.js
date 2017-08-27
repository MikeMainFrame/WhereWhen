var id, zInterval, wwObject = {user: "Ø", id: 0, lat: 0, lng: 0, duration: 0, timestamp: 1, address: "Ø"};
var zDone = false, zMap, grouped = [];
function GetGPSCoords(latLng) {
  wwObject.address = showWhereWhenOnMap(latLng);
  getStoredData(latLng);
  navigator.geolocation.clearWatch(id);
}
function showWhereWhenOnMap(latLng) {
  wwObject.lat = latLng.coords.latitude;
  wwObject.lng = latLng.coords.longitude;
  wwObject.timestamp = latLng.timestamp;
  wwObject.id = 9999;
  zMap = new google.maps.Map(document.getElementById("wwMap"), {
    center: {lat: parseFloat(wwObject.lat), lng: parseFloat(wwObject.lng)},
    zoom: 12
  });
  var zGeocoder = new google.maps.Geocoder();
  zGeocoder.geocode({"location": {lat: parseFloat(wwObject.lat), lng: parseFloat(wwObject.lng)}}, function(results, status) {    
    if (status === google.maps.GeocoderStatus.OK) document.getElementById("zAddress").textContent = wwObject.address = results[0].formatted_address;
  });
  return wwObject.address;
}
function error(err) {
  alert("ERROR(" + err.code + "): " + err.message);
}
function getStoredData (latLng) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.overrideMimeType("application/xml");
  xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      groupTasks_ShowUI(xmlhttp.responseXML.documentElement, latLng, wwObject.user);
    }
  };
  wwObject.user = window.location.search.split("=")[1];
  xmlhttp.open("GET","wwGetTasks.php" + "?id=" + wwObject.user,true);
  xmlhttp.send();
}
function groupTasks_ShowUI(root, latLng, user) {
  var zTasks = root.getElementsByTagName("task");
  var match = false;
  const transform = ["translate(0,0)","translate(0,200)", "translate(600,200)", "translate(600,400)", 
                     "translate(0,600)", "translate(600,600)", "translate(800,200)"];
  
  grouped[0] = wwObject;
  
  for (var ix = 0; ix < zTasks.length; ix++) {
    task = zTasks[ix]; match = false;
    for (var jx = 0; jx < grouped.length; jx++) {
      if (task.getAttribute("address") == grouped[jx].address) {        
        match = true;
        if (task.id == "9999") {
          grouped[jx].duration = (parseInt(grouped[jx].duration) + parseInt(task.getAttribute("duration")));
        } else {
          grouped[jx].id = task.id;
        }  
      }      
    }
    if (match === false) grouped.push(copyTask(task));
  }
  
  for (var jx = 1; jx < grouped.length; jx++) {
    if (grouped[jx].id == "9999") continue; // skip 9999 elements
    var marker = new google.maps.Marker({
    position: {lat: parseFloat(grouped[jx].lat), lng: parseFloat(grouped[jx].lng)},
    map: zMap,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      strokeColor: '#0000FF',
      strokeOpacity: 0.8,
      strokeWeight: 0,
      fillColor: "#0000FF",
      fillOpacity: 0.5,
      scale: 16
      },
    animation: google.maps.Animation.DROP
    });
    showInfo(translate[jx],"rgba(0,0,255,0.8)", grouped[jx]);
  }  
  var zMarker = new google.maps.Marker({
  position: {lat: parseFloat(wwObject.lat), lng: parseFloat(wwObject.lng)},
  map: zMap,    
  icon: {
    path: google.maps.SymbolPath.CIRCLE,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 0,
    fillColor: "#FF0000",
    fillOpacity: 0.8,    
    scale: 16
    },
  animation: google.maps.Animation.DROP
  });
  showInfo("translate(0,0)","rgba(255,0,0,0.8)", grouped[0]);
  zMarker.addListener("click", taskClicked);
  /*
  document.getElementById("zId").textContent = user;
  document.getElementById("zTask").textContent = grouped[0].id;
  document.getElementById("zAddress").textContent = grouped[0].address;
  document.getElementById("zAccumulate").textContent = convertMiliToHoursMinutes(grouped[0].duration);
  var temp = new Date(grouped[0].timestamp);  
  document.getElementById("zTimestamp").textContent = convertDateToUTC(temp);
 */
  function copyTask (task) {
    var groupedItem = {};
    groupedItem.id = task.getAttribute("id");
    groupedItem.duration = task.getAttribute("duration");
    groupedItem.timestamp = task.getAttribute("timestamp");
    groupedItem.lat = task.getAttribute("lat");
    groupedItem.lng = task.getAttribute("lng");
    groupedItem.address = task.getAttribute("address");
    return groupedItem;
  }
}
function convertMiliToHoursMinutes(mili) { 
 var x = parseInt(mili / 1000); 
 var h = parseInt(x / 60);
 var m = parseInt(x - (60 * h));
 return h + "h" + m + "m";  
}  
function convertDateToUTC(date) { 
  return parseInt((date.getFullYear() * 1.0e+08) +
                  ((date.getMonth() + 1) * 1.0e+06) +
                  (date.getDate() * 1.0e+4) + 
                  (date.getHours() * 100) +
                  date.getMinutes());
}
function stopClock(what) {
  clearInterval(zInterval);
  wrapUp(wwObject);
}
function taskClicked() {
  if (zDone === false) {
    setupClock();
    zDone = true;
  }
}
function setupClock () {
  /* var svgdoc = document.getElementById("zControl");
  svgdoc.addEventListener("click", stopClock, false);
  var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("id", "todie");
  var jx = 0, X = 0, Y = 0;
  
  for (ix=1; ix<360; ix=ix+6) {
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    X = Math.cos(ix * Math.PI / 180);          Y = Math.sin(ix * Math.PI / 180);           d = "M"  + parseInt(1000 + (X * 700)) + ", "  + parseInt(1000 + (Y * 700));
    X = Math.cos(ix * Math.PI / 180);          Y = Math.sin(ix * Math.PI / 180);           d+= " L" + parseInt(1000 + (X * 900)) + ", " + parseInt(1000 + (Y * 900));
    X = Math.cos((ix + 2) * Math.PI / 180);    Y = Math.sin((ix + 2) * Math.PI / 180);     d+= " Q" + parseInt(1000 + (X * 903)) + ", " + parseInt(1000 + (Y * 903));
    X = Math.cos((ix + 4) * Math.PI / 180);    Y = Math.sin((ix + 4) * Math.PI / 180);     d+= "  " + parseInt(1000 + (X * 900)) + ", " + parseInt(1000 + (Y * 900));
    X = Math.cos((ix + 4) * Math.PI / 180);    Y = Math.sin((ix + 4) * Math.PI / 180);     d+= " L" + parseInt(1000 + (X * 700)) + ", "  + parseInt(1000 + (Y * 700));
    jx++;
    path.setAttribute("id", "s" + jx);
    path.setAttribute("fill", "#222");
    path.setAttribute("d", d + " Z");
    group.appendChild(path);
  }
  svgdoc.appendChild(group);
  */  
  zInterval = setInterval(motion, 1000);
  
  function motion() {
    var now = new Date();
    var elapsed = now.getTime() - wwObject.timestamp;
    var thisClock = document.getElementById("zClock");
    thisClock.textContent = (function (mili) {
      var seconds = parseInt(mili / 1000);
      var mm = parseInt(seconds / 60);
      var ss = seconds - (mm * 60);
      if (mm < 10) mm = "0" + mm;
      if (ss < 10) ss = "0" + ss;
      return mm + ":" + ss;
      })(elapsed);
  }
}
function showInfo(translate, color, wwObject) {
  var svgdoc = document.getElementById("zControl");   
  var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("transform", translate);
  
  var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", 10);rect.setAttribute("y", 10);
  rect.setAttribute("width", 600);rect.setAttribute("height", 200);
  rect.setAttribute("rx", 20);rect.setAttribute("ry", 20);
  rect.setAttribute("stroke-width", "0");rect.setAttribute("fill", color);
  rect.addEventListener("click", stopClock, false);
  group.appendChild(rect);
  
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", 35); text.setAttribute("y", 45); text.setAttribute("text-anchor", "start");
  text.textContent = wwObject.id; group.appendChild(text);
  
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", 590); text.setAttribute("y", 45); text.setAttribute("text-anchor", "end");
  text.textContent = wwObject.address; group.appendChild(text);
  
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  if (translate == "transform(0,0)" text.setAttribute("id","zClock"); // id on animated time elapse 
  text.setAttribute("x", 300); text.setAttribute("y", 120); text.setAttribute("text-anchor", "middle");
  text.textContent = ""; group.appendChild(text);
  
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", 35); text.setAttribute("y", 195); text.setAttribute("text-anchor", "start");
  text.textContent = wwObject.timestamp; group.appendChild(text);
  
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", 590); text.setAttribute("y", 195); text.setAttribute("text-anchor", "end");
  text.textContent = wwObject.duration; group.appendChild(text);
  
  svgdoc.appendChild(group);  
}
id = navigator.geolocation.watchPosition(GetGPSCoords, error, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
