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
	
    function timeStamp(iDate) {  
      var yyyymmddhhmm = 
      (iDate.getFullYear()*1.0E8)+((iDate.getMonth()+1)*1.0E6)+(iDate.getDate()*1.0E4)+(iDate.getHours()*1.0E2)+iDate.getMinutes();
      return yyyymmddhhmm.toString();
    }
	
    function showTaskDetails(taskid) { 
      
      const oRadius = 500, iRadius = 400; 
      var zOffset = 0, zSum = 0, zMinutes = 0, jx=0, ix=0, kx=0, zh=0, arcSweep = 0;
      
      var execute = document.getElementById("toDie");    // eliminate old tasklist
      if (execute) execute.parentNode.removeChild(execute); // die if exists

      var m = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
      m.setAttribute("text-anchor", "middle")      
      m.setAttribute("font-weight", 600);
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

        zSum = zSum + zGeoList[ix].duration; // all time accumulated in milli secs
        
        var zTimestamp = new Date (parseFloat(zGeoList[ix].timestamp));

        zh = zTimestamp.getHours();
        if (zh > 12) zh = zh - 12; // twelf hour circle 24 hour span
        zOffset = 450 - ((zh * 30) + (zTimestamp.getMinutes() / 2)); // 720 minutes per circle - 360 degrees - offset 90 degrees
        zMinutes = zGeoList[ix].duration / 60000 / 2; // duration is recorded in milli
        (zMinutes > 180) ? arcSweep = 1 : arcSweep = 0; // if more than half, then signal large arc
        var t1 = zOffset - zMinutes, t0 = zOffset; // readabillity
   
        var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        path.setAttribute("fill", colors6[zGeoList[kx].id]);      
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
       
        g.appendChild(path);
        
        var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');  // overlay
        circle.setAttribute("cx", 500);
        circle.setAttribute("cy", 500);
        circle.setAttribute("r", 400);
        circle.setAttribute("fill", "#000");
        g.appendChild(circle);
        
        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text'); 
        
        text.setAttribute("font-family",  "Racing Sans One");
        text.setAttribute("font-size",  244);  
        text.setAttribute("fill", colors6[zGeoList[kx].id]);      
        text.setAttribute("x",  500);     
        text.setAttribute("y",  360);           
        text.textContent = () => {const x=parseInt(zGeoList[ix].duration/1000);const h=parseInt(x/3600);const m=parseInt((x-(h*3600))/60); return h+"h"+m+"m";}
        
        }parseInt(zGeoList[ix].duration / 60000, 10);
        g.appendChild(text);
        
        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');       
        text.setAttribute("font-size",  80);   
        text.setAttribute("fill", "#888");      
        text.setAttribute("x",  500);     
        text.setAttribute("y",  492);           
        text.textContent =  timeStamp(zTimestamp);
        g.appendChild(text);
        g.setAttribute("transform", "translate(" + ((jx % 2) * 500) + ", " + parseInt((jx * 900) + 150, 10) + ")");
        jx++;
        m.appendChild(g);
      }                 
      
      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');       
      text.setAttribute("font-size",  80);   
      text.setAttribute("fill", "#888");      
      text.setAttribute("x",  40);     
      text.setAttribute("y",  80);           
      text.textContent =  zSum;
      m.appendChild(text)
      return m;   
    }
   
})("miketriticum@gmail.com", 55.6680607, 12.5811275);
