(function main(who, lat, lng) {
  
  var xmlhttp = new XMLHttpRequest();
  
  xmlhttp.overrideMimeType("application/xml");
  xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      groupTasks_ShowUI(xmlhttp.responseXML.documentElement);
    }
  };
  xmlhttp.open("GET","wwGetTasks.php" + "?id=" + who);
  xmlhttp.send();
  return;

function groupTasks_ShowUI(root) {
  var zTasks = root.getElementsByTagName("task");
  var match = false, grouped = [], kx = 0;
  for (var ix = 0; ix < zTasks.length; ix++) {
    var task = zTasks[ix];
    match = false;
    for (var jx = 0; jx < grouped.length; jx++) {
      if (task.getAttribute("address") === grouped[jx].address) {        
        match = true;
        if (task.id === "9999") {
          grouped[jx].duration = parseInt(grouped[jx].duration, 10) + parseInt(task.getAttribute("duration"), 10);
        } else {
          grouped[jx].id = task.id;
        }  
      }      
    }
    if (match === false) grouped.push(copyTask(task));
  }
  // cascade the markers not equal to 9999
  
  var zMap = new google.maps.Map(document.getElementById("wwMap"),
                           { center: {lat: parseFloat(lat), lng: parseFloat(lng)}, zoom: 12, styles: 
                            [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]
                           
                           });

  for (jx = 0; jx < grouped.length; jx++) {
    if (grouped[jx].id === "9999") continue; // skip 9999 elements
    var marker = new google.maps.Marker({
    position: {lat: parseFloat(grouped[jx].lat), lng: parseFloat(grouped[jx].lng)},
    map: zMap,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      strokeColor: '#FF6000',
      strokeOpacity: 0.8,
      strokeWeight: 0,
      scale: 16
      },
    animation: google.maps.Animation.DROP
    });
    kx++;
  }  
  
  function copyTask (task) {
    var groupedItem = {};
    groupedItem.id = task.getAttribute("id");
    groupedItem.duration = task.getAttribute("duration");
    groupedItem.timestamp = task.getAttribute("timestamp");
    groupedItem.lat = task.getAttribute("lat");
    groupedItem.lng = task.getAttribute("lng");
    groupedItem.address = task.getAttribute("address");
    return groupedItem;
  }  
}
})("miketriticum@gmail.com", 55.905442, 12.315357);
