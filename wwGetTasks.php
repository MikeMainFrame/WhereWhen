<?php
  error_reporting(E_ALL);
  ini_set("display_errors", 1); 
  $zFileContents = file_get_contents("gs://wherewhen/XML/wwtasks.xml");
  $dom = new DOMDocument;
  $dom->loadXML($zFileContents);
  $dom->saveXML();
  ?>
