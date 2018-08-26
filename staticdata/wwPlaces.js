var zGeoList = [];
const colors6 = ["dummy", "#A00", "#A07", "#0A0", "#CC0", "#088", "#00A", "#F80"];
(function main(who, lat, lng) {
  
   getData(who).then(function(response) { organizeData(response) })
               .catch(console.log("Damn"));
  
   function getData(who) {
     return new Promise((resolve, reject) => {
	   const xmlhttp = new XMLHttpRequest();
	   xmlhttp.open("GET","wwGetTasks.php" + "?id=" + who);
	   xmlhttp.onload = () => resolve(xmlhttp.responseXML);
	   xmlhttp.onerror = () => reject(xmlhttp.statusText);
	   xmlhttp.send();
     });
   }
  
   function organizeData(XML)  {
	   
     var zTasks = XML.documentElement.getElementsByTagName("task");

     for (var ix = 0; ix < zTasks.length; ix++) { 
       zGeoList.push(copyTask(zTasks[ix]));
     }	  

     groupTasks(); 
	  
     document.getElementById("wwTaskSpec").appendChild(showTaskDetails(1)); 
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
    
    function showTasks(group, no) {

      var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
      g.setAttribute("fill", "#FFF");
      g.setAttribute("font-size", 56);      
      g.setAttribute("font-weight", 300);
      g.setAttribute("text-anchor", "end");

      var rect =  document.createElementNS("http://www.w3.org/2000/svg", 'rect'); 
      rect.setAttribute("x", 0);
      rect.setAttribute("y", 0);
      rect.setAttribute("rx", 30);      
      rect.setAttribute("ry", 30);
      rect.setAttribute("width", 600);
      rect.setAttribute("height", 300); 
      rect.setAttribute("fill", colors6[group.id]); 
      rect.setAttribute("id", group.id); 
      rect.addEventListener("click", function (e) {document.getElementById("wwTaskSpec").appendChild(showTaskDetails(parseInt(e.target.id, 10) ) ) }, false);     

      g.appendChild(rect);

      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');    
      text.setAttribute("x",  30);     
      text.setAttribute("y",  270);                                              
      text.setAttribute("text-anchor", "end");                                                   
      text.setAttribute("font-weight",  900);
      text.textContent = "#" + group.id;
      text.setAttribute("transform", "rotate(90 30 270)");
      g.appendChild(text);
      
      var three = group.address.split(","); 
      
      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');     
      text.setAttribute("x",  590);     
      text.setAttribute("y",  86);
      text.setAttribute("font-size", 62);      
      text.setAttribute("font-weight", 600);
      text.textContent = three[0];
      g.appendChild(text);
      
      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');     
      text.setAttribute("x",  590);     
      text.setAttribute("y",  160);
      text.textContent = three[1];
      g.appendChild(text);
      
	    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');     
      text.setAttribute("x",  590);     
      text.setAttribute("y",  214);
      text.textContent = three[2];
      
      g.appendChild(text);  
      g.setAttribute("transform", "translate(30," + (no * 330) + ")");      

      return g;
    }

	
    function showTaskDetails(taskid) { 
      
      const oRadius = 500, iRadius = 400; 
      var zOffset = 0, zSum = 0, zMinutes = 0, jx=0, ix=0, kx=0, zh=0, arcSweep = 0;
      
      var execute = document.getElementById("toDie");    
// eliminate old tasklist
      if (execute) execute.parentNode.removeChild(execute); 
// die if exists

      var m = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
      m.setAttribute("text-anchor", "middle")      
      m.setAttribute("font-weight", 600);
	    m.setAttribute("id", "toDie");
      
      for (ix = 0 ; ix < zGeoList.length; ix++) { 
        
        if (zGeoList[ix].address !== zGeoList[taskid].address) continue; 
//                                                                                only want same address
        if (zGeoList[ix].id < 9999) continue; 
//                                                                                only want detail registration    
        zSum = zSum + zGeoList[ix].duration; 
//                                                                                all time accumulated in milli secs        
        var zTimestamp = new Date (parseFloat(zGeoList[ix].timestamp));
        zTimestamp.getHours() > 12 ? zh = zTimestamp.getHours() - 12 : zh = zTimestamp.getHours();
//                                                                                twelf hour circle 24 hour span
        zOffset = 450 - ((zh * 30) + (zTimestamp.getMinutes() / 2));
//                                                                                720 minutes per circle - 360 degrees - offset 90 degrees
        zMinutes = zGeoList[ix].duration / 60000 / 2; 
//                                                                                duration is recorded in milli
        (zMinutes > 180) ? arcSweep = 1 : arcSweep = 0; 
//                                                                                if more than half, then signal large arc
        g.appendChild(bCircle(500, "#212121"));   
        g.appendChild(pathPeriod(zOffset,zOffset - zMinutes,iRadius,oRadius,arcSweep,colors6[zGeoList[kx].id]));             
        g.appendChild(bCircle(400, "#000"));   
        g.appendChild(addText("Racing Sans One", 244, colors6[zGeoList[kx].id], 500, 360, parseInt(zGeoList[ix].duration / 60000)));
        g.appendChild(addText("Roboto", 80, "#888", 500, 492, timeStamp(zTimestamp));   
        g.setAttribute("transform", "translate(" + ((jx % 2) * 500) + ", " + parseInt((jx * 900) + 150, 10) + ")");
        jx++;
        m.appendChild(g);
      }             
      
      m.appendChild(addText("Racing Sans One", 80 , "#888", 80, 80, parseInt(zSum / 60000, 10));

      return m;   
  }        
                       
  function addText (fType, fSize = 80, color, x, y, title) {      
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text'); 
    if (fType) text.setAttribute("font-family",  fType);
    if (fSize) text.setAttribute("font-size",  fSize);  
    text.setAttribute("fill", color);      
    text.setAttribute("x",  x);     
    text.setAttribute("y",  y);           
    text.textContent = title;
    return text;
  }

  function pathPeriod (t0, t1, iRadius, oRadius, arcSweep, fill) {

    var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    path.setAttribute("fill", fill);      
    path.setAttribute("stroke-width", 0);  
    path.setAttribute("d",
      "M " + parseFloat(500 + (Math.cos(t1 * Math.PI/180) * iRadius)) 
    + ", " + parseFloat(500 - (Math.sin(t1 * Math.PI/180) * iRadius))
    + "L " + parseFloat(500 + (Math.cos(t1 * Math.PI/180) * oRadius)) 
    + ", " + parseFloat(500 - (Math.sin(t1 * Math.PI/180) * oRadius))
    + "A " + oRadius + "," + oRadius + " 0 " + arcSweep + " ,0 " 
           + parseFloat(500 + (Math.cos(t0 * Math.PI/180) * oRadius)) 
    +  "," + parseFloat(500 - (Math.sin(t0 * Math.PI/180) * oRadius))
    + "L " + parseFloat(500 + (Math.cos(t0 * Math.PI/180) * iRadius)) 
    + ", " + parseFloat(500 - (Math.sin(t0 * Math.PI/180) * iRadius))
    + "A " + iRadius + "," + iRadius + " 1 " + arcSweep + " ,1 " 
           + parseFloat(500 + (Math.cos(t1 * Math.PI/180) * iRadius)) 
    +  "," + parseFloat(500 - (Math.sin(t1 * Math.PI/180) * iRadius))
    + " Z");              
    return path;
  }

  function bCircle (radius, fill) {
    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
    var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');  // overlay
    circle.setAttribute("cx", 500);
    circle.setAttribute("cy", 500);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", fill);
    return circle;
  }  
	
  function timeStamp(iDate) {  
    var yyyymmddhhmm = 
    (iDate.getFullYear()*1.0E8)+((iDate.getMonth()+1)*1.0E6)+(iDate.getDate()*1.0E4)+(iDate.getHours()*1.0E2)+iDate.getMinutes();
    return yyyymmddhhmm.toString();
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
      
})("miketriticum@gmail.com", 55.6680607, 12.5811275);
