function wrapUp(wwObject) { 
  
  var transaction = document.implementation.createDocument ("", "", null);  
  var temp = window.location.search.split("=");
  
  var zWho = transaction.createElement("who");  
  zWho.setAttribute("id", temp);  
  
  var zTask = transaction.createElement("task");  
  zTask.setAttribute("id",wwObject.id);  
  zTask.setAttribute("lat",wwObject.lat);  
  zTask.setAttribute("lng",wwObject.lng);  
  zTask.setAttribute("timestamp",wwObject.timestamp);  
  zTask.setAttribute("duration",wwObject.duration);  
  zWho.appendChild(zTask);
  
  transaction.appendChild(zWho);
  
  var xmlhttp = new XMLHttpRequest();    
  
  xmlhttp.onreadystatechange=function() { 
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      alert(xmlhttp.responseText);
    }
  };
  xmlhttp.open("POST","wwTransaction.php",true);  
  xmlhttp.send(transaction);  
}
