hook = document.querySelectorAll(".timestamp");
for (ix = 1; ix < hook.length; ix++) {  
  var aTime = new Date(parseInt(hook[ix].textContent));
  temp = new Date(parseInt(hook[ix].textContent))
  hook[ix].textContent = temp.toUTCString();
}
