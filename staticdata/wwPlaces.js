 var grouped = [];
(function main(who, lat, lng) {
 
  var xmlhttp = new XMLHttpRequest(); 
  xmlhttp.overrideMimeType("application/xml");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      organizeData(xmlhttp.responseXML.documentElement);      
    }
  };    
  xmlhttp.open("GET","wwGetTasks.php" + "?id=" + who);
  xmlhttp.send();    
  
  function organizeData(root)  {
	
    var zTasks = root.getElementsByTagName("task");
    var kx = 0, ix = 0;

    for (ix = 0; ix < zTasks.length; ix++) { // from DOM to ARRAY
      grouped.push(copyTask(zTasks[ix]));
    }	  
	  
    for (ix = 0; ix < grouped.length; ix++) { // sum up
      if (grouped[ix].id < 9999) kx = ix;
      grouped[kx].duration = grouped[kx].duration + grouped[ix].duration;
    }
    
    groupTasks(); // map + groups
	  
    document.getElementById("wwTaskSpec").appendChild(showTaskDetails(1)); // group details
    
  } 
   
  function groupTasks() {
     var oLatLng =  { lat: 0, lng: 0};	
     var oIcon =  { path: google.maps.SymbolPath.CIRCLE, strokeColor: '#FF6000', strokeOpacity: 1,strokeWeight: 2, fillColor: "#FF6000", fillOpacity: 0.3, scale: 12 };
     var oMap = { center: oLatLng, zoom: 10, styles: zStyles};
     var oMarker = { position: oLatLng, visible: true, map: oMap, icon: oIcon,animation: google.maps.Animation.DROP};
     oMap.center.lat = lat;
     oMap.center.lng = lng;
     var zMap = new google.maps.Map(document.getElementById("wwMap"), oMap);
     var zMarker = oMarker;
     zMarker.map = zMap;
     
     for (jx = 0; jx < grouped.length ; jx++) {
       if (grouped[jx].id  === 9999) continue; // skip 9999 elements
       zMarker.position.lat = parseFloat(grouped[jx].lat);
       zMarker.position.lng = parseFloat(grouped[jx].lng);   
       var temp = new google.maps.Marker(zMarker);
       document.getElementById("wwTaskMain").appendChild(showTasks(grouped[jx]));
     }
   }
  
   function copyTask(task) {
      var groupedItem = {};
      groupedItem.id = parseInt(task.getAttribute("id"), 10);      
      groupedItem.duration = parseInt(task.getAttribute("duration"), 10);
      groupedItem.timestamp = parseInt(task.getAttribute("timestamp"), 10);
      groupedItem.lat = parseFloat(task.getAttribute("lat"));
      groupedItem.lng = parseFloat(task.getAttribute("lng"));
      groupedItem.address = task.getAttribute("address");
      return groupedItem;
    }   
    
    function showTasks(group) {

      var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
      g.setAttribute("fill", "#888");
      g.setAttribute("font-size", 64);      
      g.setAttribute("font-weight", 300);
      g.setAttribute("text-anchor", "middle");

      var rect =  document.createElementNS("http://www.w3.org/2000/svg", 'rect'); 
      rect.setAttribute("x", 0);
      rect.setAttribute("y", 0);
      rect.setAttribute("id", group.id);
      rect.setAttribute("fill", "#212121");
      rect.setAttribute("width", 600);
      rect.setAttribute("height", 300); 
      rect.addEventListener("click", function (e) {document.getElementById("wwTaskSpec").appendChild(showTaskDetails(parseInt(e.target.id, 10) ) ) }, false);     
      g.appendChild(rect);

      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');    
      text.setAttribute("x",  0);     
      text.setAttribute("y",  300);          
      text.setAttribute("fill", "#F60");                                                  
      text.setAttribute("text-anchor", "end");                                                   
      text.setAttribute("font-weight",  900);
      text.textContent = "#" + group.id;
      text.setAttribute("transform", "rotate(90 0 300)");
      g.appendChild(text);
      
      var three = group.address.split(","); 
      
      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');     
      text.setAttribute("x",  300);     
      text.setAttribute("y",  106);
      text.textContent = three[0];
      g.appendChild(text);
      
      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');     
      text.setAttribute("x",  300);     
      text.setAttribute("y",  160);
      text.textContent = three[1];
      g.appendChild(text);
  
	    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');     
      text.setAttribute("x",  300);     
      text.setAttribute("y",  214);
      text.textContent = three[2];
      g.appendChild(text);  
      g.setAttribute("transform", "translate(0," + ((parseInt(group.id, 10) - 1) * 302) + ")");      

      return g;
    }
  
    function showTaskDetails(taskid) { 
      
      const oRadius = 500; const iRadius = 400; const thisColor = "#ff8000"; 
      var zOffset = 0, zDegrees = 0, zMinutes = 0, jx=0, ix=0, kx=0, zh=0;
      
      var execute = document.getElementById('toDie');    // eliminate old tasklist
      if (execute) execute.parentNode.removeChild(execute); // die if exists

      var m = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
      m.setAttribute("text-anchor", "middle")
	    m.setAttribute("id", "toDie");
         
      for (ix = 0; ix < grouped.length; ix++) { // move pointer to task id
        if (grouped[ix].id === taskid) break;
      } 
      kx=ix;
      for (ix++ ; ix < grouped.length; ix++) { 
        if (grouped[ix].address !== grouped[kx].address) continue; // only want same address
        if (grouped[ix].id < 9999) continue; // only want detail registration
        var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
        var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');  // overlay
        circle.setAttribute("cx", 500);
        circle.setAttribute("cy", 500);
        circle.setAttribute("r", 500);
        circle.setAttribute("fill", "#212121");
        g.appendChild(circle);
      
        zOffset = new Date (parseFloat(grouped[ix].timestamp));
        zh = zOffset.getHours();
        if (zh > 12) zh = zh - 12; 
        zDegrees = (((zh * 60) + zOffset.getMinutes()) / 2); // 720 minutes per circle - 360 degrees
        zMinutes = grouped[ix].duration / 120000;
   
        var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');    
        path.setAttribute("id", ix);     
        path.setAttribute("ztimestamp", grouped[ix].timestamp); 
        path.setAttribute("zduration", grouped[ix].duration); 
        path.setAttribute("fill", "#F60");      
        path.setAttribute("stroke-width", 0);  
        path.setAttribute("d",
            "M " + parseFloat(500 + (Math.cos(zDegrees * Math.PI/180) * iRadius)) + ", " + parseFloat(500 - (Math.sin(zDegrees * Math.PI/180) * iRadius))
          + "L " + parseFloat(500 + (Math.cos(zDegrees * Math.PI/180) * oRadius)) + ", " + parseFloat(500 - (Math.sin(zDegrees * Math.PI/180) * oRadius))
          + "A " + oRadius + "," + oRadius + " 1 0,0 " +  parseFloat(500 + (Math.cos((zMinutes + zDegrees) * Math.PI/180) * oRadius)) +  "," + parseFloat(500 - (Math.sin((zMinutes + zDegrees) * Math.PI/180) * oRadius))
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
        text.setAttribute("y",  400);           
        text.textContent = parseInt(grouped[ix].duration / 60000, 10);
        g.appendChild(text);
        
        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');       
        text.setAttribute("font-size",  72);     
        text.setAttribute("fill", "#888");      
        text.setAttribute("x",  500);     
        text.setAttribute("y",  600);           
        text.textContent = zOffset.toUTCString();
        g.appendChild(text);
        g.setAttribute("transform", "translate(0," + parseInt(jx * 1000, 10) + ")");
        jx++;
        m.appendChild(g);
      }            
      return m;    
    }
   
})("miketriticum@gmail.com", 55.6680607, 12.5811275);
