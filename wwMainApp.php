<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>WhereWhen :: by Michael Kenneth Rasch :: TRITICUM</title>
    <style>      
      #wwMap { width: 100%; height: 400px}
    </style>  
    <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet">
</head>
<body>
  <div>
    <svg viewBox="0 0 600 300" style="width: 70% ; float right"  
         id="zTasks" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <link xmlns="http://www.w3.org/1999/xhtml" 
              xlink:href="https://fonts.googleapis.com/css?family=Merriweather" type="text/css" rel="stylesheet" />
      </defs>
      <g text-anchor="end" font-family="Merriweather" >
        <rect x=000 y=00 width=600 height=50 fill="rgba(59, 120, 231,1)" rx=5 />
        <text x=060 y=30 fill="#fff">ID</text>
        <text x=240 y=30 fill="#fff">Duration seconds</text>
        <text x=400 y=30 fill="#fff">Timestamp</text>
        <text x=500 y=30 fill="#fff">Latitude</text>
        <text x=600 y=30 fill="#fff">Longitude</text>
      </g>
      <g  id="wwTasks" text-anchor="end" fill="#FFF" font-family="Merriweather" ></g>
    </svg>
    <svg viewBox="0 0 2000 2000" style="width: 30% ; float:left"  
         id="zTimer" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect x=000 y=00 width=2000 height=2000 fill="#FFF" />
    </svg>
  </div>
  <!-- Top part is controls and info - below is google maps with current position marked in a circle -->
  <div id="wwMap">wwMap</div>
</body>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDVV112FdOVJA4U5BSwImhPzEI73mgYUjQ" async defer></script>
<script type="text/javascript" src="staticdata/wwMonitor.js"></script>
<script type="text/javascript" src="staticdata/wwTaskAppend.js"></script>
</html>
