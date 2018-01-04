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
      document.getElementById("zFlatTime").appendChild(flatTime(slices));
    }        
  };    
  
  xmlhttp.open("GET","wwGetTasks.php" + "?id=" + who,true);
  xmlhttp.send();

  function flatTime(slices) {
    
    var zOffset = 0, zMinutes = 0, max = new Date().getTime(), min = max - (1000*60*60*24*90), zSum = 0;    
    var zBand = max - min, zDate = new Date(), var xUnits = 1720 / 90, yUnits = zBand / 880;   
        
    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
    g.setAttribute("text-anchor", "middle");
    g.setAttribute("font-family", "sans-serif");
    g.setAttribute("font-size", 18);      
    g.setAttribute("fill", "white");

    for (var ix = 0; ix < slices.length; ix++) {      
      if (slices[ix].timestamp < min) continue;
      zDate = new Date(slices[ix].timestamp);
      zSum = zSum + parseInt(slices[ix].duration);
      x = (max - slices[ix].timestamp) / 86400000) / xUnits;
      y = (880 - (zDate.getHours() * 60) + zDate.getMinutes * 60)) / yUnits;
      var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');    
      rect.setAttribute("id", ix);     
      rect.setAttribute("ztimestamp", slices[ix].timestamp); 
      rect.setAttribute("zduration", slices[ix].duration); 
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", - xUnits);
      rect.setAttribute("height", (slices[ix].duration / yUnits));
      rect.addEventListener("click", showInfo);      
      g.appendChild(rect);     
    }      
    
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');       
    text.setAttribute("font-size",  48);     
    text.setAttribute("x",  500);     
    text.setAttribute("y",  500);           
    text.textContent = parseInt(zSum / 60000);
    g.appendChild(text);
    
    return(g);    
    
  }
  function showInfo(what) {
    var temp = new Date(parseFloat(what.target.getAttribute("ztimestamp")));    
    alert(temp.getUTCDate());    
  }
})("miketriticum@gmail.com"); 