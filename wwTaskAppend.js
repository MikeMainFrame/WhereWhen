function wrapUp(wwObject) { 
  
  var transaction = document.implementation.createDocument ("", "", null);  
  
  var zTask = transaction.createElement("task");  
  zTask.setAttribute("id",wwObject.id);  
  zTask.setAttribute("lat",wwObject.lat);  
  zTask.setAttribute("lng",wwObject.lng);  
  zTask.setAttribute("timestamp",wwObject.timestamp);  
  zTask.setAttribute("duration",wwObject.duration);  
  transaction.appendChild(zTask);
  
  var xmlhttp = new XMLHttpRequest();    
  
  xmlhttp.onreadystatechange=function() { 
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      var zstatus = document.getElementById('zstatus');
      zstatus.textContent = xmlhttp.responseText;
    }
  } ;
  xmlhttp.open("POST","wwTransaction.php",true);  
  xmlhttp.send(transaction);  
}
