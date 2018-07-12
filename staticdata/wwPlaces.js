(function main(who, lat, lng) {
  
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.overrideMimeType("application/xml");
  xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      groupTasks_ShowUI(xmlhttp.responseXML.documentElement);
    }
  };
  xmlhttp.open("GET","wwGetTasks.php" + "?id=" + who);
  xmlhttp.send();
  
  return;

function groupTasks_ShowUI(root) {
  var oLatLng =  { lat: 0, lng: 0};	
  var oIcon =  { path: google.maps.SymbolPath.CIRCLE, strokeColor: '#FF6000', strokeOpacity: 1,strokeWeight: 0, fillColor: "#FF6000", fillOpacity: 0.3, scale: 16 };
  var oMap = { center: oLatLng, zoom: 12};
  var oMarker = { position: oLatLng, visible: true, map: oMap, icon: oIcon,animation: google.maps.Animation.DROP};
  
  var zTasks = root.getElementsByTagName("task");
  var match = false, grouped = [], kx = 0;
  for (var ix = 0; ix < zTasks.length; ix++) {
    var task = zTasks[ix];
    match = false;
    for (var jx = 0; jx < grouped.length; jx++) {
      if (task.getAttribute("address") === grouped[jx].address) {        
        match = true;
        if (task.id === "9999") {
          grouped[jx].duration = parseInt(grouped[jx].duration, 10) + parseInt(task.getAttribute("duration"), 10);
        } else {
          grouped[jx].id = task.id;
        }  
      }      
    }
    if (match === false) grouped.push(copyTask(task));
  }
  oMap.center.lat = lat; oMap.center.lng = lng;
  var zMap = new google.maps.Map(document.getElementById("wwMap"), oMap);
  var zMarker = oMarker; zMarker.map = zMap;
  
  // cascade the markers not equal to 9999
  
  for (jx = 0; jx < grouped.length; jx++) {
    if (grouped[jx].id === "9999") continue; // skip 9999 elements
    zMarker.position.lat = parseFloat(grouped[jx].lat);
    zMarker.position.lng = parseFloat(grouped[jx].lng);    
    var temp = new google.maps.Marker(zMarker);
    kx++;
  }  
  
  return;
  
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
})("miketriticum@gmail.com", 55.905442, 12.315357);
