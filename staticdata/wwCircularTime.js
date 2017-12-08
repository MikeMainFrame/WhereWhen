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
        if (slice.duration > 0 && slice.timestamp > 0) slices.push(slice);
      }
      document.getElementById("zCircularTime").appendChild(ringOfTime(slices));
    }        
  };    
  
  xmlhttp.open("GET","wwGetTasks.php" + "?id=" + who,true);
  xmlhttp.send();

  function ringOfTime(slices) {

    const oRadius = 500; const iRadius = 400; const thisColor = "#222";
    var zOffset = 0, zMinutes = 0, max = new Date().getTime(), min = max - (1000*60*60*24*90);
    
    var zBand = max - min;
    var zUnits = zBand / 360;   
        
    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
    g.setAttribute("text-anchor", "middle");
    g.setAttribute("font-family", "sans-serif");
    g.setAttribute("font-size", 18);      
    g.setAttribute("fill", "white");
    g.setAttribute("transform", "translate(100,100)");
    

    for (var ix = 0; ix < slices.length; ix++) {      
      if (slices[ix].timestamp < min) continue;
      zMinutes = slices[ix].duration / zUnits;
      zOffset = (slices[ix].timestamp - min) / zUnits;
      var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');    
      path.setAttribute("id", ix);     
      path.setAttribute("ztimestamp", slices[ix].timestamp); 
      path.setAttribute("zduration", slices[ix].duration); 
      path.setAttribute("fill", thisColor);      
      path.setAttribute("stroke-width", 0);  
      path.setAttribute("d",
          "M " + parseFloat(500 + (Math.cos(zOffset * Math.PI/180) * iRadius)) + ", " + parseFloat(500 - (Math.sin(zOffset * Math.PI/180) * iRadius))
        + "L " + parseFloat(500 + (Math.cos(zOffset * Math.PI/180) * oRadius)) + ", " + parseFloat(500 - (Math.sin(zOffset * Math.PI/180) * oRadius))
        + "A " + oRadius + "," + oRadius + " 0 0,1 " +  parseFloat(500 + (Math.cos((zMinutes + zOffset) * Math.PI/180) * oRadius)) +  "," + parseFloat(500 - (Math.sin((zMinutes + zOffset) * Math.PI/180) * oRadius))
        + "L " + parseFloat(500 + (Math.cos((zMinutes + zOffset) * Math.PI/180) * iRadius)) + ", " + parseFloat(500 - (Math.sin((zMinutes + zOffset) * Math.PI/180) * iRadius))
        + "A " + iRadius + "," + iRadius + " 1 0,0 " +  parseFloat(500 + (Math.cos((zMinutes + zOffset) * Math.PI/180) * iRadius)) +  "," + parseFloat(500 - (Math.sin((zMinutes + zOffset) * Math.PI/180) * iRadius))
        + " Z");        
      path.addEventListener("click", showInfo);
      g.appendChild(path);
      
      var today = new Date(parseFloat(slices[ix].timestamp)); 
      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');    
      X = parseFloat(oRadius + (Math.cos(zOffset * Math.PI/180) * oRadius));
      Y = parseFloat(oRadius - (Math.sin(zOffset * Math.PI/180) * oRadius));           
      text.setAttribute("x",  X);     
      text.setAttribute("y",  Y);           
      text.textContent = parseInt(slices[ix].duration / 60000);
      g.appendChild(text);
    }      
    
    for (var ix = 0; ix < 360; ix = ix + 4) {    
      var thatDay = new Date(parseFloat(max - (0.25 * ix * (1000*60*60*24))));
      X = parseFloat(oRadius + (Math.cos(ix * Math.PI/180) * (iRadius - 20)));
      Y = parseFloat(oRadius - (Math.sin(ix * Math.PI/180) * (iRadius - 20)));     
      if (thatDay.getDate() === 1) {
        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');    
        text.setAttribute("text-anchor", "end");
        text.setAttribute("font-size",  14);     
        text.setAttribute("fill", "#FFF");      
        text.setAttribute("x",  X);     
        text.setAttribute("y",  Y);                     
        text.setAttribute("transform", "rotate(" + (360 - ix) + " " + X + " " + Y + ")");
        var temp = thatDay.toUTCString().split(" ");
        text.textContent = temp[0] + " " + temp[1] + " " + temp[2] + " " + temp[3];
        g.appendChild(text)
      } else if (thatDay.getDay() === 6) {
          var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');            
          circle.setAttribute("fill", "#F00");
          circle.setAttribute("cx",  X);
          circle.setAttribute("cy",  Y);                     
          circle.setAttribute("r",  3);                     
        } else if (thatDay.getDay() === 0) {
          g.appendChild(fiveDays(ix));          
        }  
    } 
    
    return(g);
    
  }
  function fiveDays(degree) {
    
    var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');        
    path.setAttribute("stroke-width", 0);  
    path.setAttribute("d",
          "M " + parseFloat(500 + (Math.cos(degree * Math.PI/180) * 380)) + ", " + parseFloat(500 - (Math.sin(degree * Math.PI/180) * 380))    
        + "A 500,500 0 0,1 " +  parseFloat(500 + (Math.cos((degree + 20) * Math.PI/180) * 380)) +  "," + parseFloat(500 - (Math.sin((degree + 20) * Math.PI/180) * 380))
        + "Z");        
    
    return(path);
    
  }
  function showInfo(what) {
    var temp = new Date(parseFloat(what.target.getAttribute("ztimestamp")));    
    alert(temp.getUTCDate());    
  }
})("miketriticum@gmail.com"); 
