<?php
  error_reporting(E_ALL);
  ini_set("display_errors", 1); 
  $mother->loadXML(file_get_contents("gs://wherewhen/XML/wwtask.xml"));
  $mother = new DOMDocument; 
  $root = $mother->documentElement;                    
  
  $transaction = new DOMDocument;                                                // transaction
  $transaction->loadXML(file_get_contents("php://input")); 
  $id = $transaction->documentElement->getAttribute("id");                       // id of transaction
  $transactionNode = $mother->importNode($transaction->documentElement->firstChild, true);
  
  $domXPath = new DOMXPath($mother); 
  $targetNodes = $domXPath->query("//who[@id = " . $id . "]"); 
  
  if ($targetNodes->length) {
    $targetNodes->item(0)->appendChild($transactionNode);
    file_put_contents("gs://wherewhen/XML/wwtask.xml", $mother->saveXML());
    echo 'good';
  } else {
    echo 'mother id not found';
  }  
?>
