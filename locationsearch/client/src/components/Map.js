import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";


let map;
let markers = [];
const MI_TO_METERS = 1609.344;

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

  let infoWindow = new google.maps.InfoWindow({
    content: "Click anywhere on the map to get the center!",
    position: georgia_tech,
  });

  infoWindow.open(map);

  document.getElementById("searchButton").addEventListener("click", function() {
    const latitude  = parseFloat(document.getElementById("latitude").value);
    const longitude = parseFloat(document.getElementById("longitude").value);
    const radius    = parseFloat(document.getElementById("radius").value) * MI_TO_METERS;

    console.log("Latitude: ", latitude);
    console.log("Longitude: ", longitude);
    console.log("Radius: ", radius);

    centerMap(latitude, longitude);
    nearbySearch(latitude, longitude, radius);
  })

  map.addListener("click", (click) => {
    document.getElementById("latitude").value = click.latLng.lat();
    document.getElementById("longitude").value = click.latLng.lng();
    centerMap(click.latLng.lat(), click.latLng.lng());

    infoWindow.close();
  });
}

// Adds Mark Graphic on Map
async function addMarker(place) {

  if (map) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const markerView = new AdvancedMarkerElement({
      map,
      position: place.location,
      title: place.displayName + "\nDistance: " + place.distance + " mi.\nRating: " + place.rating,
    });

    markerView.addListener("click", (click) => {

      let infoWindow = new google.maps.InfoWindow({
        content:
          "<h1>" +
          place.displayName +
          "</h1>" +
          "<p>" +
          "Distance: " +
          place.distance + 
          " mi.<br />Rating: " +
          place.rating + 
          "<br />" + 
          (place.editorialSummary ? place.editorialSummary : "") +
          "<br />Website: " +
          place.websiteURI +
          "<br /><a href=https://maps.google.com?saddr=Current+Location&daddr=" +
          place.location.lat() +
          "," +
          place.location.lng() +
          ">Directions</a></p>",
        position: place.location,
      });
      infoWindow.open(markerView.map, markerView);
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
    fields: ["displayName", "location", 'rating', 'websiteURI', 'editorialSummary'],
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

      place.distance = haversine_distance(center, place.location);

      addMarker(place);

      bounds.extend(place.location);
      console.log(place);
    });
    map.fitBounds(bounds);
  } else {
    console.log("No results");
  }
}

function haversine_distance(pos1, pos2) {
  var R = 3958.8; // Radius of the Earth in miles
  var rlat1 = pos1.lat() * (Math.PI/180); // Convert degrees to radians
  var rlat2 = pos2.lat() * (Math.PI/180); // Convert degrees to radians
  var difflat = rlat2-rlat1; // Radian difference (latitudes)
  var difflon = (pos2.lng()-pos1.lng()) * (Math.PI/180); // Radian difference (longitudes)

  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
  return +(d.toFixed(1));
}



function Map() {
//   return (
//     <div>
//       <h1>Map</h1>
//       <div id="map"></div>
//       <label>Latitude:</label>
//       <input id="latitude" type="text" />
//       <label>Longitude:</label>
//       <input id="longitude" type="text" />
//       <label>Radius (mi):</label>
//       <input id="radius" type="text" />
//       <button id="searchButton">Search</button>
//     </div>
//   );
    initMap();

}

/*
{
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [radius, setRadius] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
            latitude,
            longitude,
            radius,
        });
    
        alert("Search successful!");
        navigate("/map");
        } catch (err) {
        setError(err.response?.data || "An error occurred during search");
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Latitude"
            required
        />
        <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Longitude"
            required
        />
        <input
            type="text"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            placeholder="Radius"
            required
        />
        <button type="submit">Search</button>
        </form>
    );
    }
*/




export default Map;


