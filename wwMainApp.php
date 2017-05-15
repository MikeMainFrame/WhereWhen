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
      #taskContainer {
       width:100%,
       padding: 4px        
      }  
      .taskItems {
      color: #000;
      padding: 0 4px; 
      font-size: small;
      font-weight: 900  
      }
    </style>  
</head>
<body>
  <h1 id="geolatlng">h1</h1>
  <form id="wwForm" name="zForm">
    <button type="button" value="Start">Start</button>    
  </form>
  <div id="wwMap">wwMap</div>
  <?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
    $dom = new DOMDocument(); 
    $zFileContents = file_get_contents("gs://wherewhen/XML/wwtask.xml");
    $dom->loadXML($zFileContents); 
    
    echo "<div id='taskContainer'>";      
    $tasks = $dom->getElementsByTagName('task');     
    echo "<span class='taskItems'>" . $tasks->item(0)->parentNode->getAttribute('id') . "</span>";
    foreach ($tasks as $task) {
      echo "<span class='taskItems'>" . $task->getAttribute('duration') . "</span>";
      echo "<span class='taskItems'>" . $task->getAttribute('timestamp') . "</span>";
      echo "<span class='taskItems'>" . $task->getAttribute('lat') . "</span>";
      echo "<span class='taskItems'>" . $task->getAttribute('lng') . "</span>";
      echo PHP_EOL;
    }  
    echo "</div>";
    // echo $dom->saveXML();
  ?>
</body>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDVV112FdOVJA4U5BSwImhPzEI73mgYUjQ" async defer></script>
<script type="text/javascript" src="staticdata/wwMonitor.js"></script>
<script type="text/javascript" src="staticdata/wwTaskAppend.js"></script>
</html>
