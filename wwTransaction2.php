<?php
  error_reporting(E_ALL);
  ini_set("display_errors", 1); 
  //$postdata = file_get_contents("php://input"); 
  $zFileContents = file_get_contents("gs://wherewhen/XML/wwtask.xml");
  $mother->loadXML($zFileContents);
  $mother = new DOMDocument; 
  $root = $mother->documentElement;                    
  
  $transaction = new DOMDocument;                                                // transaction
  $transaction->loadXML($HTTP_RAW_POST_DATA); 
  $id = $transaction->documentElement->getAttribute("id");                       // id of transaction
  $transactionNode = $mother->importNode($transaction->documentElement->firstChild, true);
  
  $domXPath = new DOMXPath($mother); 
  $targetNodes = $domXPath->query("//who[@id = " . $id . "]"); 
  
  $targetNodes->item(0)->appendChild($transactionNode);
  file_put_contents("gs://wherewhen/XML/wwtask.xml", $mother->saveXML());
  echo 'good';
  ?>
