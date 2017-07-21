var entryTime = new Date();            
setupClock("zCanvas");

function setupClock (anchor) {
  var svgdoc = document.getElementById(anchor); 
  var group = document.createElementNS("http://www.w3.org/2000/svg", 'g'); 
  var jx = 0;
  
  for (ix=1; ix<360; ix=ix+6) {        // ix is degree rotater
    var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');    
    X = Math.cos(ix * Math.PI / 180);          Y = Math.sin(ix * Math.PI / 180);           d = "M"  + parseInt(1000 + (X * 700)) + ', '  + parseInt(1000 + (Y * 700));                   
    X = Math.cos(ix * Math.PI / 180);          Y = Math.sin(ix * Math.PI / 180);           d+= " L" + parseInt(1000 + (X * 1000)) + ', ' + parseInt(1000 + (Y * 1000));                
    X = Math.cos((ix + 2) * Math.PI / 180);    Y = Math.sin((ix + 2) * Math.PI / 180);     d+= " Q" + parseInt(1000 + (X * 1003)) + ', ' + parseInt(1000 + (Y * 1003));            
    X = Math.cos((ix + 4) * Math.PI / 180);    Y = Math.sin((ix + 4) * Math.PI / 180);     d+= "  " + parseInt(1000 + (X * 1000)) + ', ' + parseInt(1000 + (Y * 1000));                
    X = Math.cos((ix + 4) * Math.PI / 180);    Y = Math.sin((ix + 4) * Math.PI / 180);     d+= " L" + parseInt(1000 + (X * 700)) + ', '  + parseInt(1000 + (Y * 700));                
    
    jx++;
    
    path.setAttribute("id", 's' + jx);
    path.setAttribute("fill", "url(#passive)");
    path.setAttribute("d", d + ' Z');    
    
    group.appendChild(path);  
  } 
  
  svgdoc.appendChild(group);  
  
  var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
  text.setAttribute("id", 'zdate');  
  text.setAttribute("fill", '#f80');  
  text.setAttribute("font-size", 144);  
  text.setAttribute("text-anchor", 'middle');  
  text.setAttribute("x", 1000);
  text.setAttribute("y", 1000);
  text.textContent = '00:00';    
  
  svgdoc.appendChild(text);  
  setInterval(motion, 1000);
  
  function motion() {
    var now = new Date();            
    var elapsed = now.getTime() - entryTime.getTime();
    var zGet = "s" + parseInt(now.getSeconds() + 1);
    var thisPath = document.getElementById(zGet);
    (thisPath.getAttribute("fill") === 'url(#active)') ? thisPath.setAttribute("fill", 'url(#passive)') : thisPath.setAttribute("fill", 'url(#active)');  
    var thisClock = document.getElementById("zdate");
    thisClock.textContent = function (mili) {
      var seconds = parseInt(mili / 1000);
      var mm = parseInt(seconds / 60);
      var ss = seconds - (mm * 60);
      if (mm < 10) mm = "0" + mm; 
      if (ss < 10) ss = "0" + ss; 
      return mm + ":" + ss;
      }(elapsed);
  }
} 
function convertDateToUTC(date) { return parseInt((date.getFullYear() * 1.0e+08) + ((date.getMonth() + 1) * 1.0e+06) + (date.getDate() * 1.0e+4) + (date.getHours() * 100)+ date.getMinutes());}
