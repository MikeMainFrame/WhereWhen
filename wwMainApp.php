
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
    background: #080;   
}
    </style>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD4FEx-OIBeLwAjGVY-Ln9bh8cPACDImYs&libraries=places,visualization&v=3.exp"></script>
  
</head>
<body>
  <form id="wwForm" name="zForm">
    <button type="button" value="Submit" value="Start"></button>    
  </form>
  <div id="wwMap" />
  <div id="wwTask"/>
</body>
<script type="text/javascript" src="staticdata/wwMonitor.js"></script>
<script type="text/javascript" src="staticdata/wwTaskAppend.js"></script>
</html>
