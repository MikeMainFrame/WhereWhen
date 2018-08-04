 var zGeoList = [];  const colors6 = ["dummy", "#F60", "#F08", "#0F8", "#8F0", "#80F", "#08F", "#00F"];
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
      zGeoList.push(copyTask(zTasks[ix]));
    }	  
	  
    for (ix = 0; ix < zGeoList.length; ix++) { // sum up
      if (zGeoList[ix].id < 9999) kx = ix;
      zGeoList[kx].duration = zGeoList[kx].duration + zGeoList[ix].duration;
    }
    
    groupTasks(); // map + groups
	  
    document.getElementById("wwTaskSpec").appendChild(showTaskDetails(1)); // group details
    
  } 
   
  function groupTasks() {
     var oLatLng =  { lat: 0, lng: 0};	
     var oIcon =  { path: google.maps.SymbolPath.CIRCLE, strokeColor: "#F60", strokeOpacity: 1,strokeWeight: 2, fillColor: "#F60", fillOpacity: 0.3, scale: 12 };
     var oMap = { center: oLatLng, zoom: 10, styles: zStyles,  disableDefaultUI: true};
     var oMarker = { position: oLatLng, visible: true, map: oMap, icon: oIcon,animation: google.maps.Animation.DROP};
     oMap.center.lat = lat;
     oMap.center.lng = lng;
     var zMap = new google.maps.Map(document.getElementById("wwMap"), oMap);
     var zMarker = oMarker;
     zMarker.map = zMap;
	   var kx = 0;
     
     for (jx = 0; jx < zGeoList.length ; jx++) {
       if (zGeoList[jx].id  === 9999) continue; // skip 9999 elements
       zMarker.icon.strokeColor = colors6[zGeoList[jx].id];
       zMarker.icon.fillColor = colors6[zGeoList[jx].id];
       zMarker.position.lat = parseFloat(zGeoList[jx].lat);
       zMarker.position.lng = parseFloat(zGeoList[jx].lng);   
       var temp = new google.maps.Marker(zMarker);
       document.getElementById("wwTaskMain").appendChild(showTasks(zGeoList[jx], kx++));
     }
   }
  
   function copyTask(task) {
      var zGeoListItem = {};
      zGeoListItem.id = parseInt(task.getAttribute("id"), 10);      
      zGeoListItem.duration = parseInt(task.getAttribute("duration"), 10);
      zGeoListItem.timestamp = parseInt(task.getAttribute("timestamp"), 10);
      zGeoListItem.lat = parseFloat(task.getAttribute("lat"));
      zGeoListItem.lng = parseFloat(task.getAttribute("lng"));
      zGeoListItem.address = task.getAttribute("address");
      return zGeoListItem;
    }   
    
    function showTasks(group, no) {

      var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
      g.setAttribute("fill", "#FFF");
      g.setAttribute("font-size", 56);      
      g.setAttribute("font-weight", 300);
      g.setAttribute("text-anchor", "end");
  

      var rect =  document.createElementNS("http://www.w3.org/2000/svg", 'rect'); 
      rect.setAttribute("x", 0);
      rect.setAttribute("y", 0);
      rect.setAttribute("rx", 3);      
      rect.setAttribute("ry", 3);
      rect.setAttribute("width", 600);
      rect.setAttribute("height", 300); 
      rect.setAttribute("fill", colors6[group.id]); 
      rect.setAttribute("id", group.id); 
	    rect.addEventListener("click", function (e) {document.getElementById("wwTaskSpec").appendChild(showTaskDetails(parseInt(e.target.id, 10) ) ) }, false);     

      g.appendChild(rect);

      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');    
      text.setAttribute("x",  0);     
      text.setAttribute("y",  300);                                              
      text.setAttribute("text-anchor", "end");                                                   
      text.setAttribute("font-weight",  900);
      text.textContent = "#" + group.id;
      text.setAttribute("transform", "rotate(90 0 300)");
      g.appendChild(text);
      
      var three = group.address.split(","); 
      
      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');     
      text.setAttribute("x",  590);     
      text.setAttribute("y",  86);
      text.setAttribute("font-size", 64);      
      text.setAttribute("font-weight", 700);
      text.textContent = three[0];
      g.appendChild(text);
      
      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');     
      text.setAttribute("x",  590);     
      text.setAttribute("y",  170);
      text.textContent = three[1];
      g.appendChild(text);
  
	    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');     
      text.setAttribute("x",  590);     
      text.setAttribute("y",  214);
      text.textContent = three[2];
      g.appendChild(text);  
      g.setAttribute("transform", "translate(3," + (no * 303) + ")");      

      return g;
    }
	
    function timeStamp(iDate) {  
      var yyyymmdd = parseInt((iDate.getFullYear() * 10000) + ((iDate.getMonth() + 1) * 100) + iDate.getDate());  
      var hhmm = parseInt((iDate.getHours() * 10000) + (iDate.getMinutes() * 100));
      return yyyymmdd.toString() + " " + hhmm.toString();
    }
	
    function showTaskDetails(taskid) { 
      
      const oRadius = 500, iRadius = 400; 
      var zOffset = 0, zDegrees = 0, zMinutes = 0, jx=0, ix=0, kx=0, zh=0, arcSweep = 0;
      
      var execute = document.getElementById("toDie");    // eliminate old tasklist
      if (execute) execute.parentNode.removeChild(execute); // die if exists

      var m = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
      m.setAttribute("text-anchor", "middle")
	    m.setAttribute("id", "toDie");
         
      for (ix = 0; ix < zGeoList.length; ix++) { // move pointer to task id
        if (zGeoList[ix].id === taskid) break;
      } 
      kx=ix; // points to mother task slot
      for (ix = 0 ; ix < zGeoList.length; ix++) { 
        if (zGeoList[ix].address !== zGeoList[kx].address) continue; // only want same address
        if (zGeoList[ix].id < 9999) continue; // only want detail registration
        var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
        var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');  // overlay
        circle.setAttribute("cx", 500);
        circle.setAttribute("cy", 500);
        circle.setAttribute("r", 500);
        circle.setAttribute("fill", "#212121");
        g.appendChild(circle);
      
        var zTimestamp = new Date (parseFloat(zGeoList[ix].timestamp));
        zh = zTimestamp.getHours();
        if (zh > 12) zh = zh - 12; // twelf hour circle 24 hour span
        zOffset = 450 - (zh * 30) + (zTimestamp.getMinutes() / 2); // 720 minutes per circle - 360 degrees - offset 90 degrees
        zMinutes = zGeoList[ix].duration / 60000 / 2; // duration is recorded in milli
        (zMinutes > 180) ? arcSweep = 1 : arcSweep = 0; // if more than half, then signal large arc
        var t1 = zOffset - zMinutes, t0 = zOffset; // readabillity
   
        var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');    
        path.setAttribute("id", ix);     
        path.setAttribute("ztimestamp", zGeoList[ix].timestamp); 
        path.setAttribute("zduration", zGeoList[ix].duration); 
        path.setAttribute("t0", t0);
        path.setAttribute("t1", t1); 
        path.setAttribute("fill", colors6[zGeoList[kx].id]);      
        path.setAttribute("stroke-width", 0);  
        path.setAttribute("d",
          "M " + parseFloat(500 - (Math.cos(t1 * Math.PI/180) * iRadius)) 
			  + ", " + parseFloat(500 - (Math.sin(t1 * Math.PI/180) * iRadius))
        + "L " + parseFloat(500 - (Math.cos(t1 * Math.PI/180) * oRadius)) 
        + ", " + parseFloat(500 - (Math.sin(t1 * Math.PI/180) * oRadius))
        + "A " + oRadius + "," + oRadius + " 0 " + arcSweep + " ,0 " 
               + parseFloat(500 - (Math.cos(t0 * Math.PI/180) * oRadius)) 
        +  "," + parseFloat(500 - (Math.sin(t0 * Math.PI/180) * oRadius))
        + "L " + parseFloat(500 - (Math.cos(t0 * Math.PI/180) * iRadius)) 
        + ", " + parseFloat(500 - (Math.sin(t0 * Math.PI/180) * iRadius))
        + "A " + iRadius + "," + iRadius + " 1 " + arcSweep + " ,0 " 
               + parseFloat(500 - (Math.cos(t1 * Math.PI/180) * iRadius)) 
        +  "," + parseFloat(500 - (Math.sin(t1 * Math.PI/180) * iRadius))
        + " Z");              
       
        g.appendChild(path);
        
        var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');  // overlay
        circle.setAttribute("cx", 500);
        circle.setAttribute("cy", 500);
        circle.setAttribute("r", 400);
        circle.setAttribute("fill", "#000");
        g.appendChild(circle);
        
        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');       
        text.setAttribute("font-size",  244);  
        text.setAttribute("fill", colors6[zGeoList[kx].id]);      
        text.setAttribute("x",  500);     
        text.setAttribute("y",  360);           
        text.textContent = parseInt(zGeoList[ix].duration / 60000, 10);
        g.appendChild(text);
        
        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');       
        text.setAttribute("font-size",  72);   
        text.setAttribute("fill", "#888");      
        text.setAttribute("x",  500);     
        text.setAttribute("y",  492);           
        text.textContent =  timeStamp(zTimestamp);
        g.appendChild(text);
        g.setAttribute("transform", "translate(" + ((jx % 2) * 500) + ", " + parseInt(jx * 850, 10) + ")");
        jx++;
        m.appendChild(g);
      }            
      return m;    
    }
   
})("miketriticum@gmail.com", 55.6680607, 12.5811275);
