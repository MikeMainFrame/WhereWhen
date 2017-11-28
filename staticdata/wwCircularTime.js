(function getStoredData (who) {
  var xmlhttp = new XMLHttpRequest();
  var slices = [];
  xmlhttp.overrideMimeType("application/xml");
  xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {         
      var zTasks = xmlhttp.responseXML.documentElement.getElementsByTagName("task");
      for (var ix = 0; ix < zTasks.length; ix++) {
        var slice = {};
        slice.duration = zTasks[ix].getAttribute("duration");
        slice.timestamp = zTasks[ix].getAttribute("timestamp");
        if (slice.duration > 0) slices.push(slice)  ;
      }  
    }    
    document.getElementById("zCircularTime").appendChild(ringOfTime(slices));
  };    
  
  xmlhttp.open("GET","wwGetTasks.php" + "?id=" + who,true);
  xmlhttp.send();

  function ringOfTime(slices) {

    var zOffset = 0, zMinutes = 0, min = 0, max = 0; const oRadius = 500; const iRadius = 400; const thisColor = "#F00";

    for (ix = 0; ix < slices.length; ix++) {      
      if (slices[ix].timestamp < min) min = slices[ix].timestamp;
      else if (slices[ix].timestamp > max) max = slices[ix].timestamp;
    }    

    var zBand = max - min;
    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');    

    for (ix = 0; ix < slices.length; ix++) {
      zMinutes = slices[ix].duration * 360 / zBand;        
      zOffset = slices[ix].timestamp - min;
      var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');    
      path.setAttribute("id", ix);     
      path.setAttribute("fill", thisColor); 
      path.setAttribute("stroke", thisColor); 
      path.setAttribute("stroke-width", 0);  
      		path.setAttribute("d",
          "M " + parseFloat(500 - (Math.cos(zOffset * Math.PI/180) * iRadius)) + ", " + parseFloat(500 - (Math.sin(zOffset * Math.PI/180) * iRadius))
        + "L " + parseFloat(500 - (Math.cos(zOffset * Math.PI/180) * oRadius)) + ", " + parseFloat(500 - (Math.sin(zOffset * Math.PI/180) * oRadius))
        + "A " + oRadius + "," + oRadius + " 0 0,1 " +  parseFloat(500 - (Math.cos((zMinutes + zOffset) * Math.PI/180) * oRadius)) +  "," + parseFloat(500 - (Math.sin((zMinutes + zOffset) * Math.PI/180) * oRadius))
        + "L " + parseFloat(Math.cos(500 - ((zMinutes + zOffset) * Math.PI/180) * iRadius)) + ", " + parseFloat(500 - (Math.sin((zMinutes + zOffset) * Math.PI/180) * iRadius))
        + "A " + iRadius + "," + iRadius + " 1 0,0 " +  parseFloat(500 - (Math.cos((zMinutes + zOffset) * Math.PI/180) * iRadius)) +  "," + parseFloat(500 - (Math.sin((zMinutes + zOffset) * Math.PI/180) * iRadius))
        + " Z");        
      g.appendChild(path);                  
    }        
    return(g);
  }
})("miketriticum@gmail.com"); 
