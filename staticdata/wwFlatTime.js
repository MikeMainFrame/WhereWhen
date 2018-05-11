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
    
    var zSum = 0, zDate = new Date(), xUnits = 4, yUnits = 1, x = 0, y = 0, max = new Date().getTime(), min = max - (1000*60*60*24*450);
        
    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
    g.setAttribute("text-anchor", "middle");
    g.setAttribute("font-family", "sans-serif");
    g.setAttribute("font-size", 18);      
    g.setAttribute("fill", "white");

    for (var ix = 0; ix < slices.length; ix++) {      
      if (slices[ix].timestamp < min) continue;
      zDate = new Date(parseInt(slices[ix].timestamp));
      zSum = zSum + parseInt(slices[ix].duration);
      x = (max - parseInt(slices[ix].timestamp)) / (24*60*60*1000) * xUnits; // what day ?
      y = (parseInt(zDate.getHours()) * 60) + parseInt(zDate.getMinutes()) * yUnits; // clock in minutes 0 - 1440
      var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');    
      rect.setAttribute("id", ix);     
      rect.setAttribute("ztimestamp", slices[ix].timestamp); 
      rect.setAttribute("zduration", slices[ix].duration); 
      rect.setAttribute("x", x);      
      rect.setAttribute("y", y);
      rect.setAttribute("fill", "#f00");
      rect.setAttribute("width", xUnits / 2);
      rect.setAttribute("height", (slices[ix].duration / 60000 / yUnits));
      rect.addEventListener("click", showInfo);      
      g.appendChild(rect);     
    }      
    
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');       
    text.setAttribute("font-size",  48);     
    text.setAttribute("x",  1000);     
    text.setAttribute("y",  820);           
    text.textContent = parseInt(zSum / 60000);
    g.appendChild(text);
    
    return(g);    
    
  }
  function showInfo(what) {
    var temp = new Date(parseFloat(what.target.getAttribute("ztimestamp")));    
    alert(temp.getUTCDate());    
  }
})("miketriticum@gmail.com"); 
