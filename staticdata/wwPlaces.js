(function main(who, lat, lng) {
  
  var xmlhttp = new XMLHttpRequest(); 
  xmlhttp.overrideMimeType("application/xml");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      groupTasks(xmlhttp.responseXML.documentElement);      
    }
  };    
  xmlhttp.open("GET","wwGetTasks.php" + "?id=" + who);
  xmlhttp.send();    
    
  function groupTasks(root) {
    var oLatLng =  { lat: 0, lng: 0};	
    var oIcon =  { path: google.maps.SymbolPath.CIRCLE, strokeColor: '#FF6000', strokeOpacity: 1,strokeWeight: 2, fillColor: "#FF6000", fillOpacity: 0.3, scale: 12 };
    var oMap = { center: oLatLng, zoom: 12, styles: zStyles};
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
    oMap.center.lat = lat;
    oMap.center.lng = lng;
    var zMap = new google.maps.Map(document.getElementById("wwMap"), oMap);
    var zMarker = oMarker;
    zMarker.map = zMap;

    for (jx = 0; jx < grouped.length; jx++) {
      if (grouped[jx].id === "9999") continue; // skip 9999 elements
      zMarker.position.lat = parseFloat(grouped[jx].lat);
      zMarker.position.lng = parseFloat(grouped[jx].lng);    
      var temp = new google.maps.Marker(zMarker);
      document.getElementById("wwTaskMain").appendChild(showTasks(grouped[jx], jx));
      kx++;
    }  

    document.getElementById("wwTaskSpec").appendChild(showTaskDetails(grouped));

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
    function showTasks (group, ix) {

      var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
      g.setAttribute("fill", "#F60");
      g.setAttribute("font-size", 24);
      g.setAttribute("text-anchor", "middle");

      var rect =  document.createElementNS("http://www.w3.org/2000/svg", 'rect'); 
      rect.setAttribute("x", 0);
      rect.setAttribute("y", 0);
      rect.setAttribute("fill", "#212121");
      rect.setAttribute("stroke-width", 2);
      rect.setAttribute("width", 600);
      rect.setAttribute("height", 200);
      rect.setAttribute("x", 1);
      
      g.appendChild(rect);

      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');       
      text.setAttribute("font-size",  48);     
      text.setAttribute("x",  50);     
      text.setAttribute("y",  100);      
      text.setAttribute("font-weight", 900);
      text.textContent = "#" + group.id;
      text.setAttribute("transform", "rotate(90 50 100)");
      
      g.appendChild(text);
      
      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');     
      text.setAttribute("x",  350);     
      text.setAttribute("y",  46);      
      text.setAttribute("fill", "#666");
      text.textContent = "Location Address";
      
      g.appendChild(text);
      
      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');     
      text.setAttribute("x",  350);     
      text.setAttribute("y",  86);      
      text.setAttribute("font-weight", 900);
      text.textContent = group.address;
  
      g.appendChild(text);      
  
      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');           
      text.setAttribute("x",  350);     
      text.setAttribute("y",  122);      
      text.setAttribute("fill", "#666");
      text.textContent = "Geo Position";
      
      g.appendChild(text);
      
      g.setAttribute("transform", "translate(0," + parseInt(ix * 200, 10) + ")");      
      g.appendChild(text);     

      return g;

    }
    function showTaskDetails(slices) {

      const oRadius = 500; const iRadius = 400; const thisColor = "#ff8000"; 
      var zOffset = 0, zDegrees = 0, zMinutes = 0;   

      var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');  

      g.setAttribute("text-anchor", "middle");

      for (var ix = 0; ix < slices.length; ix++) {
        if (slices[ix].id < "9999") continue; // skip 9999 elements
        zMinutes = slices[ix].duration / 60000;
        zOffset = new Date (parseFloat(slices[ix].timestamp));
        zDegrees = ((zOffset.getHours() * 60) + parseInt(zOffset.getMinutes())) / 4;
        if (zDegrees > 720) ? zDegrees = zDeegress - 720;        
        var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');    
        path.setAttribute("id", ix);     
        path.setAttribute("ztimestamp", slices[ix].timestamp); 
        path.setAttribute("zduration", slices[ix].duration); 
        path.setAttribute("fill", "#F60");      
        path.setAttribute("stroke-width", 0);  
        path.setAttribute("d",
            "M " + parseFloat(500 + (Math.cos(zDegrees * Math.PI/180) * iRadius)) + ", " + parseFloat(500 - (Math.sin(zDegrees * Math.PI/180) * iRadius))
          + "L " + parseFloat(500 + (Math.cos(zDegrees * Math.PI/180) * oRadius)) + ", " + parseFloat(500 - (Math.sin(zDegrees * Math.PI/180) * oRadius))
          + "A " + oRadius + "," + oRadius + " 0 0,1 " +  parseFloat(500 + (Math.cos((zMinutes + zDegrees) * Math.PI/180) * oRadius)) +  "," + parseFloat(500 - (Math.sin((zMinutes + zDegrees) * Math.PI/180) * oRadius))
          + "L " + parseFloat(500 + (Math.cos((zMinutes + zDegrees) * Math.PI/180) * iRadius)) + ", " + parseFloat(500 - (Math.sin((zMinutes + zDegrees) * Math.PI/180) * iRadius))
          + "A " + iRadius + "," + iRadius + " 1 0,0 " +  parseFloat(500 + (Math.cos((zMinutes + zDegrees) * Math.PI/180) * iRadius)) +  "," + parseFloat(500 - (Math.sin((zMinutes + zDegrees) * Math.PI/180) * iRadius))
          + " Z");        
        // path.addEventListener("click", showInfo);
        //path.setAttribute("transform", "translate(0," + parseInt(ix * 1000, 10) + ")");
 
        g.appendChild(path);
      }      

      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');       
      text.setAttribute("font-size",  48);     
      text.setAttribute("fill", "#F60");      
      text.setAttribute("x",  500);     
      text.setAttribute("y",  500);           
      text.textContent = parseInt(zDegrees / 60000, 10);
      g.appendChild(text);

      return g;    
    }
  } 
})("miketriticum@gmail.com", 55.957513, 12.524859);
