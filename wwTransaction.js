function wrapUp(wwObject) { 
  
  var transaction = document.implementation.createDocument ("", "", null);  
  
  var zTask = transaction.createElement("task");  
  zTask.setAttribute("timestamp",document.getElementById('zstatus').textContent);  
  
  for (ix = 0; ix < products.length; ix++) {     
    if (parseInt(values[ix]) > 0) {
      var zSlot = transaction.createElement("item");  
      zSlot.setAttribute("value",values[ix]);
      zSlot.setAttribute("product",products[ix]);    
      zDay.appendChild(zSlot);
    }          
  }          
  transaction.appendChild(zDay);
  
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
