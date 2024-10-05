import React, { useState, useEffect, useRef} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { initMap, centerMap, nearbySearch, MI_TO_METERS } from "../components/MapUtils";


// const MI_TO_METERS = 1609.344

function Map() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("");
  const [error, setError] = useState("");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const loadMap = async () => {
      if (mapRef.current) {
        try {
          await initMap(mapRef.current);
          setIsMapLoaded(true);
        } catch (error) {
          console.error("Error initializing map:", error);
          setError("Failed to load the map. Please try again later.");
        }
      }
    };
    loadMap();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isMapLoaded) {
      setError("Map is not loaded yet. Please wait and try again.");
      return;
    }
    try {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const rad = parseFloat(radius) * 1609.344; // Convert miles to meters
      centerMap(lat, lng);
      await nearbySearch(lat, lng, rad);
    } catch (err) {
      console.error("Error during search:", err);
      setError("An error occurred during search. Please try again.");
    }
  };

  return (
    <div>
      <h1>Map</h1>
      <div ref={mapRef} style={{ height: "400px", width: "100%" }}></div>
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
          placeholder="Radius (mi)"
          required
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default Map;