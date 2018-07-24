(function main(who, lat, lng) {
  var slices = [];
  var xmlhttp = new XMLHttpRequest(); 
  xmlhttp.overrideMimeType("application/xml");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      groupTasks(xmlhttp.responseXML.documentElement, slices);      
    }
  };    
  xmlhttp.open("GET","wwGetTasks.php" + "?id=" + who);
  xmlhttp.send();    
    
  function groupTasks(root, grouped) {
    var oLatLng =  { lat: 0, lng: 0};	
    var oIcon =  { path: google.maps.SymbolPath.CIRCLE, strokeColor: '#FF6000', strokeOpacity: 1,strokeWeight: 2, fillColor: "#FF6000", fillOpacity: 0.3, scale: 12 };
    var oMap = { center: oLatLng, zoom: 12, styles: zStyles};
    var oMarker = { position: oLatLng, visible: true, map: oMap, icon: oIcon,animation: google.maps.Animation.DROP};

    var zTasks = root.getElementsByTagName("task");
    var match = false, kx = 0;
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
      zMarker.addListener("click", showTaskDetails);  
      var temp = new google.maps.Marker(zMarker);
      document.getElementById("wwTaskMain").appendChild(showTasks(grouped[jx]));
      kx++;
    }  

    document.getElementById("wwTaskSpec").appendChild(showTaskDetails("1"));

    return;

    function copyTask(task) {
      var groupedItem = {};
      groupedItem.id = task.getAttribute("id");
      groupedItem.duration = parseInt(task.getAttribute("duration"), 10);
      groupedItem.timestamp = task.getAttribute("timestamp");
      groupedItem.lat = parseFloat(task.getAttribute("lat"));
      groupedItem.lng = parseFloat(task.getAttribute("lng"));
      groupedItem.address = task.getAttribute("address");
      return groupedItem;
    }   
    
    function showTasks(group) {

      var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
      g.setAttribute("fill", "#F60");
      g.setAttribute("font-size", 24);
      g.setAttribute("text-anchor", "middle");

      var rect =  document.createElementNS("http://www.w3.org/2000/svg", 'rect'); 
      rect.setAttribute("x", 0);
      rect.setAttribute("y", 0);
      rect.setAttribute("fill", "#212121");
      rect.setAttribute("stroke-width", 0);
      rect.setAttribute("stroke", "#eee");
      rect.setAttribute("width", 600);
      rect.setAttribute("height", 200);      
      g.appendChild(rect);

      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');       
      text.setAttribute("font-size",  48);     
      text.setAttribute("x",  20);     
      text.setAttribute("y",  100);      
      text.textContent = "#" + group.id;
      text.setAttribute("transform", "rotate(90 20 100)");
      g.appendChild(text);
      
      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');     
      text.setAttribute("x",  350);     
      text.setAttribute("y",  86);
      text.setAttribute("fill", "#888");
      text.textContent = group.address;  
      g.appendChild(text);
      
      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');     
      text.setAttribute("x",  350);     
      text.setAttribute("y",  148);      
      text.textContent = group.lat + ", " + group.lng;  
      g.appendChild(text);
      
      g.setAttribute("transform", "translate(0," + ((parseInt(group.id, 10) - 1) * 200) + ")");      

      return g;

    }
    function showTaskDetails(key) { 
      
      const oRadius = 500; const iRadius = 400; const thisColor = "#ff8000"; 
      var zOffset = 0, zDegrees = 0, zMinutes = 0, jx=0;  
      var m = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
      m.setAttribute("text-anchor", "middle");
      
      for (var ix = 0; ix < slices.length; ix++) {
        if (slices[ix].id !== key) continue; 
        var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
        g.setAttribute("text-anchor", "middle");
       
        zOffset = new Date (parseFloat(slices[ix].timestamp));
        zDegrees = ((zOffset.getHours() * 60) + parseInt(zOffset.getMinutes())) / 4;
        if (zDegrees > 720) zDegrees = zDegrees - 720;
        zMinutes = slices[ix].duration / 240000;
        
        var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');  // overlay
        circle.setAttribute("cx", 500);
        circle.setAttribute("cy", 500);
        circle.setAttribute("r", 500);
        circle.setAttribute("fill", "#212121");
        g.appendChild(circle);
     
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
       
        g.appendChild(path);
        var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');  // overlay
        circle.setAttribute("cx", 500);
        circle.setAttribute("cy", 500);
        circle.setAttribute("r", 400);
        circle.setAttribute("fill", "#000");
        g.appendChild(circle);
        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');       
        text.setAttribute("font-size",  192);     
        text.setAttribute("fill", "#F60");      
        text.setAttribute("x",  500);     
        text.setAttribute("y",  500);           
        text.textContent = parseInt(slices[ix].duration / 60000, 10);
        g.appendChild(text);
         var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');       
        text.setAttribute("font-size",  48);     
        text.setAttribute("fill", "#888");      
        text.setAttribute("x",  500);     
        text.setAttribute("y",  200);           
        text.textContent = zOffset.getHours() * 60 + ":" + zOffset.getMinutes();
        g.appendChild(text);
        g.setAttribute("transform", "translate(0," + parseInt(jx * 1000, 10) + ")");
        jx++;
        m.appendChild(g);
      }            
      return m;    
    }
  } 
})("miketriticum@gmail.com", 55.957513, 12.524859);
