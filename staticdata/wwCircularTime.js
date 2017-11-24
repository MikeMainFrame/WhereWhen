function RingOfTime(slices) {
    
    var zBand = 0, zOffset = 0, zMinutes = 0, min = 0, max = 0; const oRadius = 500, iRadius = 400, thisColor = "#F00";
      
    for (ix = 0; ix < slices.length; ix++) {      
      if (slices[ix].timestamp < min) min = slices[ix].timestamp;
      else if (slices[ix].timestamp > max) max = slices[ix].timestamp;
    }    
    
    zBand = max - min;
    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');    
    
    for (ix = 0; ix < slices.length; ix++) {
      zMinutes = slices[ix].duration * 360 / zBand;        
      zOffset = slices[ix].timestamp - min;
      var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');    
      path.setAttribute("id", ix);     
      path.setAttribute("fill", thisColor); 
      path.setAttribute("stroke", thisColor); 
      path.setAttribute("stroke-width", 0);  
      path.setAttribute("d", "M " + parseFloat(Math.cos(zOffset * Math.PI/180) * iRadius) + ", " + parseFloat(Math.sin(zOffset * Math.PI/180) * iRadius)
        + "L " + parseFloat(Math.cos(zOffset * Math.PI/180) * oRadius) + ", " + parseFloat(Math.sin(zOffset * Math.PI/180) * oRadius)
        + "A " + oRadius + "," + oRadius + " 0 0,1 " +  parseFloat(Math.cos((zMinutes + zOffset) * Math.PI/180) * oRadius) +  "," + parseFloat(Math.sin((zMinutes + zOffset) * Math.PI/180) * oRadius)
        + "L " + parseFloat(Math.cos((zMinutes + zOffset) * Math.PI/180) * iRadius) + ", " + parseFloat(Math.sin((zMinutes + zOffset) * Math.PI/180) * iRadius)
        + "A " + iRadius + "," + iRadius + " 1 0,0 " +  parseFloat(Math.cos((zMinutes + zOffset) * Math.PI/180) * iRadius) +  "," + parseFloat(Math.sin((zMinutes + zOffset) * Math.PI/180) * iRadius)
        + " Z");        
      g.appendChild(path);                  
    }        
    return(g);
  } 
