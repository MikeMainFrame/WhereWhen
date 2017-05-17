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
    </style>  
</head>
<body>
  <div id="wwMap">wwMap</div>
  <svg viewBox="0 0 600 300" style="width: 100%; font-family: 'Racing Sans One'"  id="zTasks" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <link xmlns="http://www.w3.org/1999/xhtml" href="http://fonts.googleapis.com/css?family=Racing+Sans+One|Six+Caps" type="text/css" rel="stylesheet" />
    </defs>
  <?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    $dom = new DOMDocument(); 
    $zFileContents = file_get_contents("gs://wherewhen/XML/wwtask.xml");
    $dom->loadXML($zFileContents); 
    $tasks = $dom->getElementsByTagName('task');
    
    $y = 0; $x = 0;
    
    echo "<g text-anchor='right' fill='#fff'>";
    
    foreach ($tasks as $task) {      
      echo "<rect x='0' y='" . $y . "' width='600' height='50' rx='5' fill='#000060' />";
      echo "<rect x='20' y='" . ($y + 10) . "' width='40' height='30' rx='5' fill='#0000f0' />";
      echo "<text x='30' y='" .  ($y + 10) . "'>" $task->getAttribute('duration') . "</text>";
      $y = $y + 50;
      //echo "<span class='taskItems'>" . $task->getAttribute('timestamp') . "</span>";
      //echo "<span class='taskItems'>" . $task->getAttribute('lat') . "</span>";
      //echo "<span class='taskItems'>" . $task->getAttribute('lng') . "</span>";
      //echo PHP_EOL;*/
    }  
    echo "</g>";   
    // echo $dom->saveXML();
  ?>
  </svg>
<div id="wwTask" />
</body>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDVV112FdOVJA4U5BSwImhPzEI73mgYUjQ" async defer></script>
<script type="text/javascript" src="staticdata/wwMonitor.js"></script>
<script type="text/javascript" src="staticdata/wwTaskAppend.js"></script>
</html>
