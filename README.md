## How To run:
```bash
./mvnw spring-boot:run
```

Then access webpage: 

http://localhost:8080/map

Note that it may be necessary to run on chrome incognito browser because of caching of webpage graphics.


## Map Implementation:

- **`src/main/resources/static/index.js`**  
Logic for map. Loads map (via Google Maps API), controls map centering and marker placement, and handles lat/long/radius event input values entered via webpage. Calls Google Places API to find nearby places based on supplied lat/long/radius and marks those places on the map.  

- **`src/main/resources/static/style.css`**
Style for Map and Input Fields/Button on Webpage

- **`src/main/resources/templates/index.html`**
Defines Webpage setup for Map and Input Features. Loads the Google Maps JavaScript API.

- **`src/main/java/com/map/demomap/MapController.java`**
Simple Endpoint to prompt the index.html file to load.


## To Do:
- Integrate with rest of Project

- Checks for Webpage Inputs. Lat/Long/Radius may be incorrect format
- Hover event: mini-popup for markers, showing details about the makred place
- Click Event: Clicking on markers should show extensive info like images, links, descriptions, etc 
