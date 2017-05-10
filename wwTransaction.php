<?php
  error_reporting(E_ALL);
  ini_set("display_errors", 1); 
  $postdata = file_get_contents("php://input"); 
  $zFileContents = file_get_contents("gs://XML/wwTask.xml");
  $dom = new DOMDocument; 
  $dom->loadXML($zFileContents); 
  $root = $dom->documentElement;                    
  $row = $dom->createDocumentFragment();   
  $row->appendXML($postdata);
  $root->appendChild($row);
  file_put_contents("gs://XML/wwTask.xml", $dom->saveXML());
  echo "good";
?>
