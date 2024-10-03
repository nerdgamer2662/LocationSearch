let map;
let markers = [];

//Based on: https://developers.google.com/maps/documentation/javascript/adding-a-google-map
//Loads the Map for the Page and sets up Handlers
async function initMap() {
  // The location of georgia_tech 
  const georgia_tech = { lat: 33.7756, lng: -84.3963 };

  // Load necessary libraries from the Google Maps API
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");

  // Create a new map centered at georgia_tech
  map = new Map(document.getElementById("map"), {
    zoom: 16,
    center: georgia_tech,
    mapId: "DEMO_MAP_ID", // This can be customized if you have a custom map style
  });

  document.getElementById("searchButton").addEventListener("click", function() {
    const latitude  = parseFloat(document.getElementById("latitude").value);
    const longitude = parseFloat(document.getElementById("longitude").value);
    const radius    = parseFloat(document.getElementById("radius").value);

    console.log("Latitude: ", latitude);
    console.log("Longitude: ", longitude);
    console.log("Radius: ", radius);

    centerMap(latitude, longitude);
    nearbySearch(latitude, longitude, radius);
  })
}

// Adds Mark Graphic on Map
async function addMarker(place) {

  if (map) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const markerView = new AdvancedMarkerElement({
      map,
      position: place.location,
      title: place.displayName,
    });

    markers.push(markerView);
  }

}

// Centers map based on supplied coords.
function centerMap(latitude, longitude) {
  map.setCenter({ lat: latitude, lng: longitude })
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

//Based on: https://developers.google.com/maps/documentation/javascript/nearby-search
//Marks nearby places of interests
async function nearbySearch(latitude, longitude, radius) {
  //@ts-ignore
  const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary(
    "places",
  );

  // Restrict within the map viewport.
  let center = new google.maps.LatLng(latitude, longitude);
  const request = {
    // required parameters
    fields: ["displayName", "location"],
    locationRestriction: {
      center: center,
      radius: radius,
    },
    // optional parameters
    includedPrimaryTypes: ["restaurant"],
    maxResultCount: 5,
    rankPreference: SearchNearbyRankPreference.POPULARITY,
    language: "en-US",
    region: "us",
  };
  //@ts-ignore
  const { places } = await Place.searchNearby(request);

  deleteMarkers();

  if (places.length) {

    console.log(places);

    const { LatLngBounds } = await google.maps.importLibrary("core");
    const bounds = new LatLngBounds();

    // Loop through and get all the results.
    places.forEach((place) => {

      addMarker(place);

      bounds.extend(place.location);
      console.log(place);
    });
    map.fitBounds(bounds);
  } else {
    console.log("No results");
  }
}

//Called during page startup
initMap();


