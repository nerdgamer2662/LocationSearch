let map;
let markers = [];
export const MI_TO_METERS = 1609.344;

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

  // The current URL loading the Maps JavaScript API has not been added to the list of allowed referrers. Please check the referrer settings of your API key in the Cloud Console.

export async function initMap(mapElement) {
    if (!mapElement) {
      throw new Error("Map container element is not available");
    }
    
    await loadGoogleMapsScript();
    const georgia_tech = { lat: 33.7756, lng: -84.3963 };
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(mapElement, {
      zoom: 16,
      center: georgia_tech,
      mapId: "DEMO_MAP_ID",
    });
  }
  
  

export function centerMap(latitude, longitude) {
  if (map) {
    map.setCenter({ lat: latitude, lng: longitude });
  }
}

export async function nearbySearch(latitude, longitude, radius) {
  const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");
  let center = new google.maps.LatLng(latitude, longitude);
  const request = {
    fields: ["displayName", "location", 'rating', 'websiteURI', 'editorialSummary'],
    locationRestriction: {
      center: center,
      radius: radius,
    },
    includedPrimaryTypes: ["restaurant"],
    maxResultCount: 5,
    rankPreference: SearchNearbyRankPreference.POPULARITY,
  };

  const { places } = await Place.searchNearby(request);
  deleteMarkers();

  if (places.length) {
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      addMarker(place);
      bounds.extend(place.location);
    });
    map.fitBounds(bounds);
  } else {
    console.log("No results");
  }
}

function addMarker(place) {
  if (map) {
    const marker = new google.maps.Marker({
      map,
      position: place.location,
      title: place.displayName,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <h3>${place.displayName}</h3>
        <p>Rating: ${place.rating || 'N/A'}</p>
        <p>${place.editorialSummary || ''}</p>
        <p><a href="${place.websiteURI || '#'}" target="_blank">Website</a></p>
      `,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });

    markers.push(marker);
  }
}

function deleteMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}