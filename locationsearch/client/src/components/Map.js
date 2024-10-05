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
      setPlaces(foundPlaces);
    //   const places = await nearbySearch(lat, lng, rad);
    //   console.log("Nearby places:", places);
      // TODO: Display the places on the map or in a list
      
    } catch (err) {
      console.error("Error during search:", err);
      setError("An error occurred during search. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Location Search</h1>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }} className="mb-4"></div>
      <form onSubmit={handleSubmit} className="mb-4">
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Latitude"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Longitude"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="w-full md:w-1/3 px-2">
            <input
              type="text"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              placeholder="Radius (mi)"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Search
        </button>
      </form>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Nearby Places</h2>
        {places.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Rating</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Website</th>
                </tr>
              </thead>
              <tbody>
                {places.map((place, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                    <td className="border px-4 py-2">{place.displayName}</td>
                    <td className="border px-4 py-2">{place.rating || 'N/A'}</td>
                    <td className="border px-4 py-2">{place.editorialSummary?.text || 'No description available'}</td>
                    <td className="border px-4 py-2">
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
          <p>No places found. Try searching with different parameters.</p>
        )}
      </div>
    </div>
  );
}


export default Map;