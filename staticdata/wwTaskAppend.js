function wrapUp(wwObject) { 
  
  var transaction = document.implementation.createDocument ("", "", null);  
  var temp = window.location.search.split("=");
  
  var zWho = transaction.createElement("who");  
  zWho.setAttribute("id", temp[1]);  
  
  var zTask = transaction.createElement("task");  
  zTask.setAttribute("id",wwObject.id);  
  zTask.setAttribute("lat",wwObject.lat);  
  zTask.setAttribute("lng",wwObject.lng);  
  zTask.setAttribute("timestamp",wwObject.timestamp);  
  zTask.setAttribute("address",wwObject.address);  
  zTask.setAttribute("duration",wwObject.duration);  
  zWho.appendChild(zTask);
  
  transaction.appendChild(zWho);
  
  var xmlhttp = new XMLHttpRequest();    
  
  xmlhttp.onreadystatechange=function() { 
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      document.getElementById("control").innerHTML = "<h1>Done</h1>";
    }
  };
  xmlhttp.open("POST","wwTransaction2.php",true);  
  xmlhttp.send(transaction);  
}
