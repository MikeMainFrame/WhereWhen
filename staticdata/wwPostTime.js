hook = document.querySelectorAll(".timestamp");
for (ix = 1; ix < hook.length; ix++) {  
  var aTime = new Date(parseInt(hook[ix].textContent));
  temp = new Date(parseInt(hook[ix].textContent))
  hook[ix].textContent = convertDateToUTC(temp);
}
function convertDateToUTC(date) { 
  return parseInt((date.getFullYear() * 1.0e+08) 
                  + ((date.getMonth() + 1) * 1.0e+06) 
                  + (date.getDate() * 1.0e+4) 
                  + (date.getHours() * 100)
                  + date.getMinutes());
}
