<?php
  error_reporting(E_ALL);
  ini_set("display_errors", 1); 
  $zFileContents = file_get_contents("gs://wherewhen/XML/wwtask.xml");
  $dom = new DOMDocument;
  $dom->loadXML($zFileContents);
  $domXPath = new DOMXPath($dom); 
  $id = $_GET["id"];
  $targetNodes = $domXPath->query("//who[@id = " . $id . "]"); 
  echo $targetNodes->saveXML();
?>
