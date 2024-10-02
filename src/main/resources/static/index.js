// Initialize and add the map
let map;
let markers = [];
let AdvancedMarkerElement;

async function initMap() {
  // The location of georgia_tech 
  const georgia_tech = { lat: 33.7756, lng: -84.3963 };
  const culc = { lat: 33.7749, lng: -84.3958};

  // Load necessary libraries from the Google Maps API
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // Create a new map centered at georgia_tech
  map = new Map(document.getElementById("map"), {
    zoom: 16,
    center: georgia_tech,
    mapId: "DEMO_MAP_ID", // This can be customized if you have a custom map style
  });


  /*
  // Create a marker positioned at georgia_tech
  const marker = new AdvancedMarkerElement({
    map: map,
    position: georgia_tech,
    title: "georgia_tech", // Optional: Tooltip text for the marker
  });
*/


  addMarker(georgia_tech.lat, georgia_tech.lng, "Georgia Tech");
  addMarker(culc.lat, culc.lng, "culc");  
  deleteMarkers();  
  addMarker(culc.lat, culc.lng, "culc");  

  //const culc = { lat: 33.7749, lng: -84.3958};
  //addMarker(culc.lat, culc.lng, "culc");
}

function addMarker(latitude, longitude, title) {

  // Create a marker positioned at georgia_tech
  //const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  if (map) {
    const marker = new google.maps.Marker({
      map: map,
      position: {lat: latitude, lng: longitude},
      title: title, // Optional: Tooltip text for the marker
    });

    markers.push(marker);
  }

}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function hideMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  hideMarkers();
  markers = [];
}
// Call the initMap function to load the map when the page is loaded

initMap();

//while(!map) {}

