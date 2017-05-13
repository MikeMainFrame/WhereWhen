<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Radar Search Documentation :: TRITICUM</title>
    <style>
      html, body, #wwMap, #wwTask {
        height: 100%;
        margin: 0px;
        padding: 0px
      }
    button {
    -moz-border-radius: 4px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    width: 40%;  
    height: 2em;
    background: #080;   
}
    </style>  
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDVV112FdOVJA4U5BSwImhPzEI73mgYUjQ"></script>
</head>
<body>
  <h1 id="geolatlng">h1</h1>
  <form id="wwForm" name="zForm">
    <button type="button" value="Start">Start</button>    
  </form>
  <div id="wwMap">wwMap</div>
  <div id="wwTask">wwTask</div>
</body>
<script type="text/javascript" src="staticdata/wwMonitor.js"></script>
<script type="text/javascript" src="staticdata/wwTaskAppend.js"></script>
</html>
