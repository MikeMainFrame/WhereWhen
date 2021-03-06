var id, zInterval, wwObject = {user: "Ø", id: 0, lat: 0, lng: 0, duration: 0, timestamp: 1, address: "Ø"};
var zDone = false, zMap, grouped = [];
function GetGPSCoords(latLng) {
  showWhereWhenOnMap(latLng);
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
  // we use same canvas and same rect, but we offset them accordingly to the table value
  const transform = ["translate(0,0)","translate(0,400)", "translate(600,400)", "translate(0,600)", 
                     "translate(600,600)", "translate(0,800)", "translate(600,800)", "translate(0,999)"];
  
  // first element is where you are on the map right now ...
  grouped[0] = wwObject;
  // grouping on address
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
  // cascade the markers not equal to 9999
  var kx = 0;
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
    kx++;
    showInfo(transform[kx],"url(#blue)", grouped[jx]);
  }  
  // main marker - last, so it is on top ...
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
  showInfo("translate(0,0) scale(2)","rgba(255,0,0,0.8)", grouped[0]);
  zMarker.addListener("click", taskClicked);
  
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
 var h = parseInt(x / 3600);
 var m = parseInt((x - (h * 3600)) / 60);
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
  group.setAttribute("fill", "#FFF");
  group.setAttribute("font-size", 22);
  group.setAttribute("transform", translate);
  
  var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", 0);rect.setAttribute("y", 0);
  rect.setAttribute("width", 600);rect.setAttribute("height", 200);
  rect.setAttribute("stroke-width", "0");rect.setAttribute("fill", color);
  rect.addEventListener("click", stopClock, false);
  group.appendChild(rect);
  
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", 25); text.setAttribute("y", 25); text.setAttribute("text-anchor", "start");
  text.textContent = wwObject.id; group.appendChild(text);
  
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  if (translate == "translate(0,0) scale(2)") text.setAttribute("id","zAddress"); 
  text.setAttribute("x", 575); text.setAttribute("y", 25); text.setAttribute("text-anchor", "end");
  text.textContent = wwObject.address; group.appendChild(text);
  
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  if (translate == "translate(0,0) scale(2)") text.setAttribute("id","zClock"); 
  text.setAttribute("x", 300); text.setAttribute("y", 120); text.setAttribute("text-anchor", "middle");
  text.textContent = "00:00"; text.setAttribute("font-size", 64); group.appendChild(text);
  
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", 25); text.setAttribute("y", 185); text.setAttribute("text-anchor", "start");
  text.textContent = convertDateToUTC(new Date(parseInt(wwObject.timestamp))); group.appendChild(text);
  
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", 575); text.setAttribute("y", 185); text.setAttribute("text-anchor", "end");
  text.textContent = convertMiliToHoursMinutes(wwObject.duration); group.appendChild(text);
  
  svgdoc.appendChild(group);  
}
id = navigator.geolocation.watchPosition(GetGPSCoords, error => { console.log(error) }, { enableHighAccuracy: true, timeout: 9000, maximumAge: 0 });
