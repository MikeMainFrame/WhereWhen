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
                           { center: {lat: parseFloat(lat), lng: parseFloat(lng)}, zoom: 12, styles: zStyle });

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

var zStyle =
[
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
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
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
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
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
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
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
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
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
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
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];
}
})("miketriticum@gmail.com", 55.905442, 12.315357);
