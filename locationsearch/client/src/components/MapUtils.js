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
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCkK-j0HC0sgyE9rLVeSDHaDqG1PDv1FAg&libraries=places`;
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
  return map;
}

export function centerMap(latitude, longitude) {
  if (map) {
    map.setCenter({ lat: latitude, lng: longitude });
  }

}

export async function nearbySearch(latitude, longitude, radius, placeTypes, numResults) {
  try {
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");
    const center = new google.maps.LatLng(latitude, longitude);
    const request = {
      fields: ["displayName", "location", 'rating', 'websiteURI', 'editorialSummary', 'types', 'priceLevel'],
      locationRestriction: {
        center: center,
        radius: radius,
      },
      includedPrimaryTypes: placeTypes.length > 0 ? placeTypes : ["restaurant", "bar", "cafe", "tourist_attraction"],
      maxResultCount: numResults, // for demo only; for dev keept at 5
      rankPreference: SearchNearbyRankPreference.POPULARITY,
    };

    const { places } = await Place.searchNearby(request);
    deleteMarkers();

    //Add Custom Marker for Entered Lat/Lng
    const ref_marker = new google.maps.Marker({
      map,
      position: {lat: latitude, lng: longitude},
      title: "Center",
      icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    });
    markers.push(ref_marker);
  

    if (places.length) {
      const bounds = new google.maps.LatLngBounds();

      console.log("Summaries Found");
      places.forEach((place) => {
        console.log(place.editorialSummary);
      });

      console.log("Places Distances");
      places.forEach((place) => {
        const center_location = {lat: latitude, lng: longitude};
        const place_location  = {lat: place.location.lat(), lng: place.location.lng()};
        console.log(center_location);
        console.log(place_location);
        place.distance = (haversine_distance(center_location, place_location)).toFixed(2);
        console.log(place.distance);
      });

      let [price_results, direction_results] = await processPlaces(places);
      
      console.log("Places Prices");
      let index = 0;
      price_results.forEach((price) => {
        if (!price)
        {
          price = 0;
        }
        places[index].price_level = price;
        console.log(places[index].price_level);
        index = index + 1;
      });

      console.log("Place Maps URLs");
      index = 0;
      direction_results.forEach((url) => {
        if (!url) {
          url = "";
        }
        places[index].directions = url;
        console.log(places[index].directions);
        index = index + 1;
      });

      places.forEach(addMarker);
      places.forEach(place => bounds.extend(place.location));
      map.fitBounds(bounds);
    } else {
      console.log("No results found.");
    }

    //places.forEach(place => {
      //console.log('Place ID:', place.id);  // Correctly access place_id here
    //});

    return places;
  } catch (error) {
    console.error("Error during nearby search:", error);
    throw new Error("Failed to perform nearby search. Please try again.");
  }
}

export async function detailSearch(place_id) {

  //console.log("place_id");
  //console.log(place_id);
  const service = new google.maps.places.PlacesService(map);
  const request = {
    placeId: place_id,
    fields: ['price_level', 'url']
  };

  // Wrapping the getDetails call in a Promise
  return new Promise((resolve, reject) => {
    service.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        resolve([place.price_level, place.url]);  // Resolve the promise with price_level
      } else {
        reject(new Error('Failed to fetch place details'));  // Reject in case of an error
      }
    });
  });
}

export async function processPlaces(results) {
  let price_list = [];
  let directions_list = [];
  for (const specific_place of results) {
    try {
      [specific_place.price_level, specific_place.directions_url] = await detailSearch(specific_place.id);
      price_list.push(specific_place.price_level);
      directions_list.push(specific_place.directions_url);
    } catch (error) {
      console.error('Error fetching price level for place:', specific_place.name, error);
    }
  }
  return [price_list, directions_list];
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

  const miniPopup = new google.maps.InfoWindow({
    content: createMiniInfoWindowContent(place),
  });

  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });

  marker.addListener("mouseover", () => {
    miniPopup.open(map, marker);
  });

  marker.addListener("mouseout", () => {
    miniPopup.close();
  });

  markers.push(marker);
}

function createInfoWindowContent(place) {
  return `
    <div>
      <h3>${place.displayName}</h3>
      <p>Rating: ${place.rating ? `${place.rating.toFixed(1)} / 5` : '<p>Rating N/A</p>'}</p>
      <p>Distance: ${place.distance}</p>
      ${place.priceLevel ? `<p>Price Level: ${place.priceLevel}</p>` : '<p>Price Level: N/A</p>'}
      ${place.editorialSummary ? `<p>${place.editorialSummary}</p>` : '<p>Summary N/A</p>'}
      ${place.websiteURI ? `<p><a href="${place.websiteURI}" target="_blank">Website</a></p>` : '<p>Website N/A</p>'}
      ${place.directions ? `<p><a href="${place.directions}" target="_blank">Directions</a></p>` : '<p>Could not get directions</p>'}
    </div>
  `;
}

function createMiniInfoWindowContent(place) {
  return `
    <div>
      <h3>${place.displayName}</h3>
      <p>Rating: ${place.rating ? `${place.rating.toFixed(1)} / 5` : 'N/A'}</p>
      <p>Distance: ${place.distance}</p>
    </div>
  `;
}

function deleteMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

export function haversine_distance(pos1, pos2) {
  var R = 3958.8; // Radius of the Earth in miles
  var rlat1 = pos1.lat * (Math.PI/180); // Convert degrees to radians
  var rlat2 = pos2.lat * (Math.PI/180); // Convert degrees to radians
  var difflat = rlat2-rlat1; // Radian difference (latitudes)
  var difflon = (pos2.lng-pos1.lng) * (Math.PI/180); // Radian difference (longitudes)
  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
  return d;
}