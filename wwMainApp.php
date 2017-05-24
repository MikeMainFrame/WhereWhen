<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>WhereWhen :: by Michael Kenneth Rasch :: TRITICUM</title>
    <style>
      div { float: left}
    </style>  
</head>
<body style='height: 100%; margin: 0; padding: 0'>
  <svg viewBox="0 0 600 300" style="width: 100%; font-family: 'Racing Sans One'"  id="zTasks" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <link xmlns="http://www.w3.org/1999/xhtml" href="https://fonts.googleapis.com/css?family=Racing+Sans+One|Six+Caps" type="text/css" rel="stylesheet" />
    </defs>
    <g text-anchor="right" fill="#fff" font-family="Racing Sans One" >
      <rect x=0 y=0 width=600 height=50 fill="rgba(59, 120, 231,1)" />
      <text x=10 y=0 text-anchor="left">ID</text>
      <text x=60 y=0 text-anchor="right">Duration seconds</text>
      <text x=200 y=0 text-anchor="right">Timestamp</text>
      <text x=300 y=0 text-anchor="right">Latitude</text>
      <text x=400 y=0 text-anchor="right">Lontitude</text>
    </g>
    <g  id="wwTasks" text-anchor="right" fill="#000" font-family="Racing Sans One" >
    </g>
  </svg>
  <!-- Top part is controls and info - below is google maps with current position marked in a circle -->
  <div id="wwMap" style='height: 100%; margin: 0; padding: 0'>wwMap</div>
</body>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDVV112FdOVJA4U5BSwImhPzEI73mgYUjQ" async defer></script>
<script type="text/javascript" src="staticdata/wwMonitor.js"></script>
<script type="text/javascript" src="staticdata/wwTaskAppend.js"></script>
</html>
