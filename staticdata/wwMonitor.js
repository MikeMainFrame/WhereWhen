var id, zInterval, wwObject = {user: "Ø", id: 0, lat: 0, lng: 0, duration: 0, timestamp: 1, address: "Ø"};
var zDone = false, zMap, grouped = [];
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
  zMap = new google.maps.Map(document.getElementById("wwMap"), {
      center: zWhere,
      zoom: 12
    });
  var zMarker = new google.maps.Marker({
     position: zWhere,
     map: zMap,
     icon: {
       path: google.maps.SymbolPath.CIRCLE,
       scale: 10,
       strokeColor: "#FF0000",
       strokeOpacity: 0.8,
       strokeWeight: 2,
       fillColor: "#FF0000",
       fillOpacity: 0.35
     },
     animation: google.maps.Animation.DROP
  });
  zMarker.addListener("click", taskClicked);
  
  var zGeocoder = new google.maps.Geocoder();
  zGeocoder.geocode({"location": zWhere}, function(results, status) {    
    if (status === google.maps.GeocoderStatus.OK) wwObject.address = results[0].formatted_address;
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
  var address = "Ø", match = false;
  
  grouped[0] = wwObject;
  
  for (var ix = 1; ix < zTasks.length; ix++) {
    task = zTasks[ix]; match = false;
    for (var jx = 0; jx < grouped.length; jx++) {
      if (grouped[jx].address === task.getAttribute("address")) {
        grouped[jx].duration = (parseInt(grouped[jx].duration) + parseInt(task.getAttribute("duration")));
        match = true;
      }
      if (match === false) grouped.push(copyTask(task));
    }
  }
  // the compressed tasks, is displayed on map ...
  for (var jx = 1; jx < grouped.length; jx++) {
    const where = {lat: grouped[jx].lat, lng: grouped[jx].lng};
    var marker = new google.maps.Marker({
    position: where,
    map: zMap,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      strokeColor: "#00FF00",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#00FF00",
      fillOpacity: 0.35
    },
    animation: google.maps.Animation.DROP
    });
  }  
  
  document.getElementById("zId").textContent = user;
  document.getElementById("zTask").textContent = grouped[0].id;
  document.getElementById("zAddress").textContent = grouped[0].address;
  document.getElementById("zAccumulate").textContent = grouped[0].duration;
  document.getElementById("zTimestamp").textContent = grouped[0].timestamp;

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
function stopClock(what) {
  var todie = document.getElementById("wwControl");
  var execute = todie.parentNode.removeChild(todie);
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
  var svgdoc = document.getElementById("zControl");
  svgdoc.addEventListener("click", stopClock, false);
  var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("id", "todie");
  var jx = 0, X = 0, Y = 0;
  
  for (ix=1; ix<360; ix=ix+6) {
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    X = Math.cos(ix * Math.PI / 180);          Y = Math.sin(ix * Math.PI / 180);           d = "M"  + parseInt(1000 + (X * 700)) + ", "  + parseInt(1000 + (Y * 700));
    X = Math.cos(ix * Math.PI / 180);          Y = Math.sin(ix * Math.PI / 180);           d+= " L" + parseInt(1000 + (X * 1000)) + ", " + parseInt(1000 + (Y * 1000));
    X = Math.cos((ix + 2) * Math.PI / 180);    Y = Math.sin((ix + 2) * Math.PI / 180);     d+= " Q" + parseInt(1000 + (X * 1003)) + ", " + parseInt(1000 + (Y * 1003));
    X = Math.cos((ix + 4) * Math.PI / 180);    Y = Math.sin((ix + 4) * Math.PI / 180);     d+= "  " + parseInt(1000 + (X * 1000)) + ", " + parseInt(1000 + (Y * 1000));
    X = Math.cos((ix + 4) * Math.PI / 180);    Y = Math.sin((ix + 4) * Math.PI / 180);     d+= " L" + parseInt(1000 + (X * 700)) + ", "  + parseInt(1000 + (Y * 700));
    jx++;
    path.setAttribute("id", "s" + jx);
    path.setAttribute("fill", "url(#passive)");
    path.setAttribute("d", d + " Z");
    group.appendChild(path);
  }
  svgdoc.appendChild(group);
  
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("id", "zdate");
  text.setAttribute("fill", "#f80");
  text.setAttribute("font-size", 144);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("x", 1000);
  text.setAttribute("y", 1000);
  text.textContent = "00:00";
  
  svgdoc.appendChild(text);
  
  zInterval = setInterval(motion, 1000);
  
  function motion() {
    var now = new Date();
    var elapsed = now.getTime() - wwObject.timestamp;
    var zGet = "s" + parseInt(now.getSeconds() + 1);
    var thisPath = document.getElementById(zGet);
    (thisPath.getAttribute("fill") === "url(#active)") ? thisPath.setAttribute("fill", "url(#passive)") : thisPath.setAttribute("fill", "url(#active)");
    var thisClock = document.getElementById("zdate");
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
id = navigator.geolocation.watchPosition(GetGPSCoords, error, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });
