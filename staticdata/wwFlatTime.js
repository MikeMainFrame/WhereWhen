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
    
    var zSum = 0, zDate = new Date(), xUnits = 7, yUnits = 1, x = 0, y = 0, max = new Date().getTime(), min = max - (1000*60*60*24*450);
        
    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
    g.setAttribute("text-anchor", "middle");
    g.setAttribute("font-family", "sans-serif");
    g.setAttribute("font-size", 18);      
    g.setAttribute("fill", "white");

    for (var ix = 0; ix < slices.length; ix++) {      
      if (slices[ix].timestamp < min) continue;
      zDate = new Date(parseInt(slices[ix].timestamp));
      zSum = zSum + parseInt(slices[ix].duration);
      x = 100 + (max - parseInt(slices[ix].timestamp)) / (24*60*60*1000) * xUnits; // what day ?
      y = 100 + (parseInt(zDate.getHours()) * 60) + parseInt(zDate.getMinutes()) * yUnits; // clock in minutes 0 - 1440
      var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');    
      rect.setAttribute("id", ix);     
      rect.setAttribute("ztimestamp", slices[ix].timestamp); 
      rect.setAttribute("zduration", slices[ix].duration); 
      rect.setAttribute("x", x);      
      rect.setAttribute("y", y);
      rect.setAttribute("fill", "#FFF");
      rect.setAttribute("width", xUnits / 2);
      rect.setAttribute("height", (slices[ix].duration / 60000 / yUnits));
      rect.addEventListener("click", showInfo);      
      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
      text.setAttribute("x", x);
      text.setAttribute("y", (ix % 2) ? 1600 : 1648);
      text.setAttribute("transform", "rotate(90," + x + ",1600)");
      text.textContent = parseInt(zDate.getMonth() + 1)  + "/" + parseInt(zDate.getDay());   
      g.appendChild(rect);     
      g.appendChild(text);
    }      
    
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');       
    text.setAttribute("font-size",  144);     
    text.setAttribute("x",  1640);     
    text.setAttribute("y",  256);
    text.setAttribute("fill","#FFF");
    text.textContent = "NoOfMin: " + parseInt(zSum / 60000);
    g.appendChild(text);
    
    return(g);    
    
  }
  function showInfo(what) {
    alert(what.target.getAttribute("zduration"));    
  }
})("miketriticum@gmail.com"); 
