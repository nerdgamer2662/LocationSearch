import React, { useState, useEffect, useRef } from "react";
import { initMap, centerMap, nearbySearch, MI_TO_METERS } from "../components/MapUtils";

function Map() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("");
  const [error, setError] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [places, setPlaces] = useState([]);
  const mapRef = useRef(null);

  const [placeType_restaurant, settype_restaurant] = useState(false);
  const [placeType_tourist, settype_tourist] = useState(false);

  useEffect(() => {
    const loadMap = async () => {
      if (mapRef.current) {
        try {
          await initMap(mapRef.current, handleMapClick);
          setIsMapLoaded(true);
        } catch (error) {
          console.error("Error initializing map:", error);
          setError("Failed to load the map. Please try again later.");
        }
      }
    };
    loadMap();
  }, []);

  const handleMapClick = (lat, lng) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
    centerMap(lat, lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isMapLoaded) {
      setError("Map is not loaded yet. Please wait and try again.");
      return;
    }
    try {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      let rad = parseFloat(radius) * MI_TO_METERS; // Convert miles to meters

      // Ensure radius is within the valid range
      rad = Math.min(Math.max(rad, 0), 50000);

      centerMap(lat, lng);
      const foundPlaces = await nearbySearch(lat, lng, rad);

      let filtered_results = foundPlaces;

      if (placeType_restaurant || placeType_tourist) {

        console.log("Filtering for Type");
        console.log(filtered_results);

        let types = []

        if (placeType_restaurant) {
          let restaurant_results = foundPlaces.filter((place) => {return place.types.includes("restaurant");});
          filtered_results.concat(restaurant_results);
        }

        if (placeType_tourist) {
          let tourist_results = foundPlaces.filter((place) => {return place.types.includes("tourist_attraction");});
          filtered_results.concat(tourist_results);
        }

        filtered_results = filtered_results.filter(types.some(type => filtered_results.includes(type)));

        console.log("Result of Filtering");
        console.log(filtered_results);
      }

      setPlaces(filtered_results);
    } catch (err) {
      console.error("Error during search:", err);
      setError("An error occurred during search. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-6">Location Search</h1>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }} className="mb-6"></div>
      <form onSubmit={handleSubmit} className="mb-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex flex-wrap -mx-2 mb-6">
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Latitude"
              required
              className="w-full px-6 py-4 border rounded-lg text-lg"
            />
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Longitude"
              required
              className="w-full px-6 py-4 border rounded-lg text-lg"
            />
          </div>
          {/* Radius Input */}
          <div className="w-full md:w-1/3 px-2">
            <input
              type="text"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              placeholder="Radius (mi)"
              required
              className="w-full px-6 py-4 border rounded-lg text-lg"
            />
          </div>
          <div className="w-full md:w-1/3 px-2">
            <input
              type="checkbox"
              id="filter_restaurant"
              checked={placeType_restaurant}
              onChange={(e) => settype_restaurant(e.target.checked)}
              className="w-full px-6 py-4 border rounded-lg text-lg"
            />
            <label htmlFor="filter_restaurant" className="ml-2">Filter Restaurant</label>
          </div>
          <div className="w-full md:w-1/3 px-2">
            <input
              type="checkbox"
              id="filter_tourist"
              checked={placeType_tourist}
              onChange={(e) => settype_tourist(e.target.checked)}
              className="w-full px-6 py-4 border rounded-lg text-lg"
            />
            <label htmlFor="placeType_tourist" className="ml-2">Filter Tourist Attraction</label>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-4 text-xl rounded-lg hover:bg-blue-700 transition-all"
        >
          Search
        </button>
      </form>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Nearby Places</h2>
        {places.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-8 py-4 text-left text-lg">Name</th>
                  <th className="px-8 py-4 text-left text-lg">Type</th>
                  <th className="px-8 py-4 text-left text-lg">Rating</th>
                  <th className="px-8 py-4 text-left text-lg">Description</th>
                  <th className="px-8 py-4 text-left text-lg">Website</th>
                </tr>
              </thead>
              <tbody>
                {places.map((place, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200 transition-all`}>
                    <td className="border px-6 py-4 text-lg">{place.displayName}</td>
                    <td className="border px-6 py-4 text-lg">{place.types}</td>
                    <td className="border px-6 py-4 text-lg">
                      {place.rating ? (
                        <span className="text-yellow-500">
                          {'★'.repeat(Math.round(place.rating))}{' '}
                          ({place.rating.toFixed(1)})
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="border px-6 py-4 text-lg break-words">{place.editorialSummary?.text || 'No description available'}</td>
                    <td className="border px-6 py-4 text-lg">
                      {place.websiteURI ? (
                        <a href={place.websiteURI} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          Visit Website
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-lg">No places found. Try searching with different parameters.</p>
        )}
      </div>
    </div>
  );
}

export default Map;
