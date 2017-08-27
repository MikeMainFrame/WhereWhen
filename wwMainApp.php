<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name=viewport content="width=device-width, initial-scale=1">
    <title>WhereWhen :: by Michael Kenneth Rasch :: TRITICUM</title>
    <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Racing+Sans+One|Six+Caps" type="text/css" rel="stylesheet" />    
  </head>
  <body style="background: #000" ; margin: 5px ; color: #fff>
  <div id="wwControl">
    <svg viewBox="0 0 1200 1000"   
      id="zControl" 
      style="background: #000 ; color: #fff; font-family: 'Racing Sans One'"
      version="1.1" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      xmlns="http://www.w3.org/2000/svg">
    </svg>
  </div>
  <!-- Top part is controls and info - below is google maps with current position marked in a circle -->
  <div  id="wwMap" style="height: 500px ; width: 100%">wwMap</div>
</body>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDVV112FdOVJA4U5BSwImhPzEI73mgYUjQ&language=da" async defer></script>
<script type="text/javascript" src="staticdata/wwMonitor.js"></script>
<script type="text/javascript" src="staticdata/wwTaskAppend.js"></script>
</html>
