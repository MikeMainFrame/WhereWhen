<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>WhereWhen :: by Michael Kenneth Rasch :: TRITICUM</title>
    <style>
      html, body, #wwMap, #wwTask {
        height: 100%;
        margin: 0px;
        padding: 0px
      }
      
    button {
    padding: 4px;  
    width: 40%;  
    height: 2em;
    font-size: large;
    color: white;  
    border:none;
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
  <div id="wwTask">
  <?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    $dom = new DOMDocument(); 
    $zFileContents = file_get_contents("gs://wherewhen/XML/wwtask.xml");
    $dom->loadXML($zFileContents); 
    echo $dom->saveXML();
  ?>
  </div>
</body>
<script type="text/javascript" src="staticdata/wwMonitor1.js"></script>
<script type="text/javascript" src="staticdata/wwTaskAppend.js"></script>
</html>
