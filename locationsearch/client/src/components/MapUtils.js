let map;
let markers = [];
export const MI_TO_METERS = 1609.344;
const DEFAULT_ZOOM_LEVEL = 16;
const DEFAULT_CENTER = { lat: 33.7756, lng: -84.3963 };
const MAP_ID = "DEMO_MAP_ID";

/* global google */

function loadGoogleMapsScript() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('Google Maps script failed to load'));
  });
}

export async function initMap(mapElement, onMapClick) {
  if (!mapElement) {
    throw new Error("Map container element is not available");
  }

  await loadGoogleMapsScript();
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(mapElement, {
    zoom: DEFAULT_ZOOM_LEVEL,
    center: DEFAULT_CENTER,
    mapId: MAP_ID,
  });

  // Add click event listener to the map
  map.addListener("click", (event) => {
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    centerMap(latitude, longitude);
    if (onMapClick) {
      onMapClick(latitude, longitude);
    }
  });
}

export function centerMap(latitude, longitude) {
  if (map) {
    map.setCenter({ lat: latitude, lng: longitude });
  }
}

export async function nearbySearch(latitude, longitude, radius) {
  try {
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");
    const center = new google.maps.LatLng(latitude, longitude);
    const request = {
      fields: ["displayName", "location", 'rating', 'websiteURI', 'editorialSummary'],
      locationRestriction: {
        center: center,
        radius: radius,
      },
      includedPrimaryTypes: ["restaurant"],
      maxResultCount: 10,
      rankPreference: SearchNearbyRankPreference.POPULARITY,
    };

    const { places } = await Place.searchNearby(request);
    deleteMarkers();

    if (places.length) {
      const bounds = new google.maps.LatLngBounds();
      places.forEach(addMarker);
      places.forEach(place => bounds.extend(place.location));
      map.fitBounds(bounds);
    } else {
      console.log("No results found.");
    }

    return places;
  } catch (error) {
    console.error("Error during nearby search:", error);
    throw new Error("Failed to perform nearby search. Please try again.");
  }
}

function addMarker(place) {
  if (!map) return; // Ensure map is initialized

  const marker = new google.maps.Marker({
    map,
    position: place.location,
    title: place.displayName,
  });

  const infoWindow = new google.maps.InfoWindow({
    content: createInfoWindowContent(place),
  });

  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });

  markers.push(marker);
}

function createInfoWindowContent(place) {
  return `
    <h3>${place.displayName}</h3>
    <p>Rating: ${place.rating || 'N/A'}</p>
    <p>${place.editorialSummary || ''}</p>
    <p><a href="${place.websiteURI || '#'}" target="_blank">Website</a></p>
  `;
}

function deleteMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

//Created by Vijay Shastri
export function haversine_distance(pos1, pos2) {
  var R = 3958.8; // Radius of the Earth in miles
  var rlat1 = pos1.lat * (Math.PI/180); // Convert degrees to radians
  var rlat2 = pos2.lat * (Math.PI/180); // Convert degrees to radians
  var difflat = rlat2-rlat1; // Radian difference (latitudes)
  var difflon = (pos2.lng-pos1.lng) * (Math.PI/180); // Radian difference (longitudes)
  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
  return +(d.toFixed(1));
}