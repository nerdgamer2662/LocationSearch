import React, { useState, useEffect, useRef } from "react";
import {
  initMap,
  centerMap,
  processPlaces,
  nearbySearch,
  detailSearch,
  MI_TO_METERS,
  haversine_distance,
} from "../components/MapUtils";
import { getSynonyms } from "../components/GPTRequest";

function Map() {
  const [latitude, setLatitude] = useState(33.7756);
  const [longitude, setLongitude] = useState(-84.3963);
  const [radius, setRadius] = useState(20);
  const [error, setError] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [places, setPlaces] = useState([]);
  const mapRef = useRef(null);

  const [placeType, setPlaceType] = useState("");
  const [placeTypes, setPlaceTypes] = useState([]);
  const [numPlaces, setNumPlaces] = useState(10);
  const [sortOption, setSortOption] = useState("");

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

  const handlePlaceTypeChange = (e) => {
    setPlaceType(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setPlaceTypes((prev) =>
      checked ? [...prev, value] : prev.filter((type) => type !== value)
    );
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
      let rad = parseFloat(radius) * MI_TO_METERS;
      rad = Math.min(Math.max(rad, 0), 50000);

      centerMap(lat, lng);

      const searchTypes = [...placeTypes];

      console.log(placeType);

      let adjustedType = await getSynonyms(placeType);

      console.log(adjustedType);

      if (adjustedType.trim() !== "") {
        searchTypes.push(
          adjustedType.trim().toLowerCase().replace(/\s+/g, "_")
        );
      }


      let foundPlaces = await nearbySearch(lat, lng, rad, searchTypes);

      /*
      foundPlaces.forEach((place) => {
        const center_location = {lat, lng};
        const place_location  = {lat: place.location.lat(), lng: place.location.lng()};
        place.distance = haversine_distance(center_location, place_location);

      });

      foundPlaces.forEach((place) => {
        const center_location = {lat, lng};
        const place_location  = {lat: place.location.lat(), lng: place.location.lng()};
        place.distance = haversine_distance(center_location, place_location);

      });

      let price_results = await processPlaces(foundPlaces);
      
      let index = 0;
      price_results.forEach((price) => {
        if (!price)
        {
          price = 0;
        }
        foundPlaces[index].price_level = price;
        index = index + 1;
      });
      
      foundPlaces.forEach((place) => {
        const center_location = {lat, lng};
        const place_location  = {lat: place.location.lat(), lng: place.location.lng()};
        place.distance = haversine_distance(center_location, place_location);
      });
      */

      switch (sortOption) {
        case "rating":
          foundPlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "distance":
          foundPlaces.sort((a, b) => (a.distance || 0) - (b.distance || 0));
          break;
        case "price":
          foundPlaces.sort(
            (min, max) => (max.price_level || 0) - (min.price_level || 0)
          );

          break;
        default:
        // No sorting
      }

      let numResults = Math.min(Math.max(parseInt(numPlaces) || 10, 1), 20);
      setPlaces(foundPlaces.slice(0, numResults));
    } catch (err) {
      console.error("Error during search:", err);
      setError("An error occurred during search. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800">
        Location Search
      </h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div
          ref={mapRef}
          style={{ width: "100%", height: "400px" }}
          className="mb-6"
        ></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              Search Parameters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="set_lat"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Latitude
                  </label>
                  <input
                    id="set_lat"
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="Latitude"
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="set_lng"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Longitude
                  </label>
                  <input
                    id="set_lng"
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="Longitude"
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="set_radius"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Search Radius (mi)
                </label>
                <input
                  id="set_radius"
                  type="range"
                  min="1"
                  max="50"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="w-full"
                />
                <div className="text-center mt-1">{radius} miles</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              Search Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="numResults"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Number of Results
                </label>
                <select
                  id="numResults"
                  value={numPlaces}
                  onChange={(e) => setNumPlaces(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[5, 10, 15, 20].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="sort_dropdown"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sort Results By
                </label>
                <select
                  id="sort_dropdown"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">No sorting</option>
                  <option value="rating">Rating</option>
                  <option value="distance">Distance</option>
                  <option value="price">Price</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              Place Types
            </h2>
            <div className="mb-4">
              <label
                htmlFor="placeType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Custom Place Type
              </label>
              <input
                id="placeType"
                type="text"
                value={placeType}
                onChange={handlePlaceTypeChange}
                placeholder="E.g., museum, park, cafe"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="restaurant"
                  checked={placeTypes.includes("restaurant")}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Restaurants</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="tourist_attraction"
                  checked={placeTypes.includes("tourist_attraction")}
                  onChange={handleCheckboxChange}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 text-gray-700">Tourist Attractions</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Search Locations
          </button>
        </form>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-2xl font-semibold p-6 bg-indigo-100 text-indigo-800">
          Nearby Places
        </h2>
        {places.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rating
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Website
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Distance
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {places.map((place, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {place.displayName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {place.types
                        .map((type) => type.replace(/_/g, " "))
                        .join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {place.rating ? (
                        <span className="text-yellow-500">
                          {"★".repeat(Math.round(place.rating))} (
                          {place.rating.toFixed(1)})
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {place.editorialSummary?.text ||
                        "No description available"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {place.websiteURI ? (
                        <a
                          href={place.websiteURI}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Visit Website
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {place.distance} mi
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {place.price_level
                        ? "💰".repeat(place.price_level)
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-lg text-gray-500 p-6">
            No places found. Try searching with different parameters.
          </p>
        )}
      </div>
    </div>
  );
}

export default Map;
