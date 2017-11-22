function RingOfTime(slices, g) {
    
    var zOffset = 0; zPercent = 0; zSum = 0; thisColor = "#F00";
      
    for (ix = 0; ix < slices.length; ix++) {
      zSum = zSum + parseInt(slices[ix].duration);
      if (slices[ix].duration < min) min = slices[ix].duration;
      elseif (slices[ix].duration > max) max = slices[ix].duration;
    }
        
    for (ix = 0; ix < slices.length; ix++) {
      zPercent = slices[ix].duration * 360 / zSum;        
      var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');    
      path.setAttribute("id", ix);     
      path.setAttribute("fill", thisColor); 
      path.setAttribute("stroke", thisColor); 
      path.setAttribute("stroke-width", 0);  
      path.setAttribute("d", 'M1000,1000 l'  
        + parseFloat(Math.cos(zOffset * Math.PI/180) * 500) 
        + ', '
        + parseFloat(Math.sin(zOffset * Math.PI/180) * 500)
        + ' a500,500 0 0,1 '
        + parseFloat((Math.cos((zOffset + zPercent) * Math.PI/180) * 500) - (Math.cos(zOffset * Math.PI/180) * 500))
        + ', '
        + parseFloat((Math.sin((zOffset + zPercent) * Math.PI/180) * 500) - (Math.sin(zOffset * Math.PI/180) * 500))
        + ' z');        
      
        g.appendChild(path);          
      
        zOffset = zOffset + zPercent;
    }   
  }  
