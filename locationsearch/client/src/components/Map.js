import React, { useState, useEffect, useRef } from "react";
import { initMap, centerMap, processPlaces, nearbySearch, detailSearch, MI_TO_METERS, haversine_distance } from "../components/MapUtils";
//import { getSynonyms } from "../components/GPTRequest";

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
    setPlaceTypes(prev => 
      checked ? [...prev, value] : prev.filter(type => type !== value)
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

      /*
      let adjustedType = await getSynonyms(placeType);

      if (adjustedType.trim() !== "") {
        searchTypes.push(adjustedType.trim().toLowerCase().replace(/\s+/g, '_'));
      }
      */
     
      let foundPlaces = await nearbySearch(lat, lng, rad, searchTypes);

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


      switch (sortOption) {
        case "rating":
          foundPlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'distance':
          foundPlaces.sort((a, b) => (a.distance || 0) - (b.distance || 0));
          break;
        case 'price':

          foundPlaces.sort((min, max) => (max.price_level || 0) - (min.price_level || 0));
    
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
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-6">Location Search</h1>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }} className="mb-6"></div>
      <form onSubmit={handleSubmit} className="mb-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex flex-wrap -mx-2 mb-6">
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <label htmlFor="set_lat" className="ml-2">Latitude: </label>
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
            <label htmlFor="set_lng" className="ml-2">Longitude: </label>
            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Longitude"
              required
              className="w-full px-6 py-4 border rounded-lg text-lg"
            />
          </div>
          <div className="w-full md:w-1/3 px-2">
            <label htmlFor="set_radius" className="ml-2">Search Radius: </label>
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
            <label htmlFor="numResults" className="ml-2">Number of Results: </label>
            <input
              type="number"
              min="1"
              max="20"
              value={numPlaces}
              onChange={(e) => setNumPlaces(e.target.value)}
              placeholder="Results per Search"
              className="w-full px-6 py-4 border rounded-lg text-lg"
            />
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <label htmlFor="sort_dropdown" className="ml-2">Choose Sorting: </label>
            <select
              id="sort_dropdown"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-6 py-4 border rounded-lg text-lg"
            >
              <option value="" disabled>Select an option</option>
              <option value="nothing">None</option>
              <option value="rating">Rating</option>
              <option value="distance">Distance (mi)</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
        
        <div className="search-controls mb-4">
          <input
            type="text"
            value={placeType}
            onChange={handlePlaceTypeChange}
            placeholder="Type of place"
            className="w-full px-6 py-4 border rounded-lg text-lg mb-2"
          />
          <label className="checkbox-label inline-flex items-center mr-4">
            <input
              type="checkbox"
              value="restaurant"
              checked={placeTypes.includes("restaurant")}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Include Restaurants</span>
          </label>
          <label className="checkbox-label inline-flex items-center">
            <input
              type="checkbox"
              value="tourist_attraction"
              checked={placeTypes.includes("tourist_attraction")}
              onChange={handleCheckboxChange}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Include Tourist Attractions</span>
          </label>
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
                  <th className="px-8 py-4 text-left text-lg">Distance (mi)</th>
                  <th className="px-8 py-4 text-left text-lg">Price Level (1 Low, 4 High)</th>
                </tr>
              </thead>
              <tbody>
                {places.map((place, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200 transition-all`}>
                    <td className="border px-6 py-4 text-lg">{place.displayName}</td>
                    <td className="border px-6 py-4 text-lg">{place.types.map(type => type.replace(/_/g, ' ')).join(', ')}</td>
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
                    <td className="border px-6 py-4 text-lg">{place.distance.toFixed(2)}</td>
                    <td className="border px-6 py-4 text-lg">{place.price_level}</td>
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