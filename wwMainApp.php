<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name=viewport content="width=device-width, initial-scale=1">
    <title>WhereWhen :: by Michael Kenneth Rasch :: TRITICUM</title>
    <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet">
</head>
<body>
  <div id="control">
    <!--svg viewBox="0 0 600 300" style="width: 100% ; float: right"  
         id="zTasks" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <link xmlns="http://www.w3.org/1999/xhtml" 
              xlink:href="https://fonts.googleapis.com/css?family=Merriweather" type="text/css" rel="stylesheet" />
       <radialGradient id="blue"  fx="1000" fy="1000" cx="1000" cy="1000" r="1000" gradientUnits="userSpaceOnUse">
         <stop offset="90%"   stop-color="#0000a0" />
         <stop offset="95%"   stop-color="#8080ff" />
         <stop offset="100%"   stop-color="#0000a0" />
       </radialGradient>    
     </defs>      
     <g text-anchor="end" font-family="Merriweather" >
        <rect x=000 y=00 width=600 height=50 fill="#000" rx=5 />
        <text x=060 y=30 fill="#fff">ID</text>
        <text x=160 y=20 fill="#fff">Duration</text>
        <text x=160 y=40 fill="#fff">Minutes</text>
        <text x=290 y=30 fill="#fff">Timestamp</text>
        <text x=300 y=30 fill="#fff" text-anchor="start">Address</text>
      </g>
      <g id="wwTasks" text-anchor="end" fill="#FFF" font-family="Merriweather" ></g>
    </svg-->
    <svg viewBox="0 0 2000 2000"   
      id="zCanvas" 
      style="background: #000 ; font-family: 'Racing Sans One'"
      version="1.1" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      xmlns="http://www.w3.org/2000/svg">
       <defs>
         <link xmlns="http://www.w3.org/1999/xhtml" href="http://fonts.googleapis.com/css?family=Racing+Sans+One|Six+Caps" type="text/css" rel="stylesheet" />                               
         <path id="insidePath" d="M400,1000, C400,1800 1600,1800 1600,1000" />     
         <radialGradient id="passive" gradientUnits="userSpaceOnUse" cx="1000" cy="1000" r="1000" fx="1000" fy="1000">
           <stop offset="70%" stop-color="#008" /><stop offset="85%" stop-color="#55f" /><stop offset="100%" stop-color="#008" />
         </radialGradient>
         <radialGradient id="active" gradientUnits="userSpaceOnUse" cx="1000" cy="1000" r="1000" fx="1000" fy="1000">
           <stop offset="70%" stop-color="#111" /><stop offset="85%" stop-color="#555" /><stop offset="100%" stop-color="#111" />
         </radialGradient>
       </defs>
       <g font-size="64" fill="#f80">
        <text id="zAddress"    x="10"   y="60">Teglgaardsvej 529</text>
        <text id="zTimestamp"  x="1990" y="60" text-anchor="end">20170717123456</text>
        <text id="zTask"       x="10"   y="1960">9999</text>
        <text id="zAccumulate" x="1990" y="1990" text-anchor="end">23h5m</text>
       </g>
       <g>
        <text font-size="72" font-family="arial" font-weight="600" text-anchor="middle">
          <textPath id="zId" fill="#aaa" letter-spacing="0.1em" startOffset="50%" xlink:href="#insidePath" opacity="1.0">miketriticum@gmail.com</textPath>
        </text>  
       </g>
    <script type="application/ecmascript" xlink:href="timeElapsed.js" ></script>
  </svg>
  </div>
  <!-- Top part is controls and info - below is google maps with current position marked in a circle -->
  <div style="height: 600px ; width: 100%" id="wwMap">wwMap</div>
</body>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDVV112FdOVJA4U5BSwImhPzEI73mgYUjQ" async defer></script>
<script type="text/javascript" src="staticdata/wwMonitor.js"></script>
<script type="text/javascript" src="staticdata/wwTaskAppend.js"></script>
</html>
