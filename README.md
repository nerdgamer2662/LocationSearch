# LocationSearch Project

## Table of Contents

- [Overview](#overview)
- [Release Notes](#release-notes)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview

LocationSearch is a web application that allows users to find interesting locations near them. It consists of a client-side application built with React and a server-side application built with Spring Boot. The application features user authentication, location data management, and a responsive design.

## Release Notes

### Version 1.0.0

- **New Features**:
  - User authentication with sign-up and login functionalities.
  - Interactive map for searching nearby locations.
- **Bug Fixes**:
  - Resolved issues with user session management.
  - Fixed CORS issues preventing access from the client application.
- **Known Bugs**:

## Features

- **User Authentication**: Users can sign up and log in to access the application.
- **CORS Support**: Configured to allow cross-origin requests from the client application.
- **Responsive Design**: The application is designed to be user-friendly and responsive.
- **Map Functionality**: Users can search for nearby places using an interactive map.

## Technologies Used

- **Client Side**:

  - **React**: For building the user interface.
  - **React Router**: For routing between different components.
  - **Axios**: For making HTTP requests to the backend API.

- **Server Side**:
  - **Spring Boot**: Framework for building the application.
  - **Spring Security**: For securing the application and managing user authentication.
  - **JPA/Hibernate**: For database interactions.
  - **JWT**: For token-based authentication.
  - **Maven**: For project management and dependency management.

## Getting Started

### Prerequisites

- **Client Side**:
  - Node.js (version 12 or higher)
- **Server Side**:
  - Java 11 or higher
  - Maven 3.6 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nerdgamer2662/LocationSearch.git
   ```
2. Navigate to the server directory and build the project:
   ```bash
   cd locationsearch/server
   mvn clean install
   ```
3. Navigate to the client directory and install dependencies:
   ```bash
   cd ../client
   npm install
   ```
4. Start the client application:
   ```bash
   npm start
   ```
5. Run the server-side application:
   ```bash
   cd ../server
   mvn spring-boot:run
   or
   .\mvnw.cmd spring-boot:run
   (To enable login/security functionality)
   ```

### Configuration

- **Server Configuration**: The application properties can be found in `src/main/resources/application.properties`. You can configure the following:
  - **Server Port**: Change the port if needed (default is 8080).
  - **Database Configuration**: Modify the H2 database settings as required.

### API Endpoints

- **User Registration**: `POST /api/users/signup`
- **User Login**: `POST /api/users/login`
- **CORS Configuration**: Configured to allow requests from `http://localhost:3000`.

## Troubleshooting

- **Common Installation Issues**:

  - If you encounter issues with Maven, ensure you have the correct version installed and that your JAVA_HOME environment variable is set correctly.
  - For client-side issues, check that Node.js and npm are properly installed and updated.

- **Common Errors**:
  - **Error: "Failed to connect to the database"**: Ensure that the H2 database is configured correctly in `application.properties`.
  - **Error: "CORS policy: No 'Access-Control-Allow-Origin' header is present"**: Verify that the server is running and that CORS is configured to allow requests from the client application.
