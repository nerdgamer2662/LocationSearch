# LocationSearch Server

## Overview

The LocationSearch Server is a Spring Boot application that provides a RESTful API for the LocationSearch web application. It handles user authentication, authorization, and location data management. The server is built using Maven and follows practices for security and data handling.

## Features

- **User Authentication**: Supports user registration and login with JWT token generation.
- **CORS Support**: Configured to allow cross-origin requests from the client application.
- **OAuth2 Integration**: Allows users to log in using their Google accounts.
- **H2 Database**: Uses an in-memory H2 database for development and testing.

## Technologies Used

- **Spring Boot**: Framework for building the application.
- **Spring Security**: For securing the application and managing user authentication.
- **JPA/Hibernate**: For database interactions.
- **JWT**: For token-based authentication.
- **Maven**: For project management and dependency management.

## Getting Started

### Prerequisites

- Java 11 or higher
- Maven 3.6 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nerdgamer2662/LocationSearch.git
   ```
2. Navigate to the server directory:
   ```bash
   cd locationsearch/server
   ```
3. Build the project using Maven:
   ```bash
   mvn clean install
   ```
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```
5. To enable login/security functionality:
   ```bash
   .\mvnw.cmd spring-boot:run
   ```

### Configuration

- The application properties can be found in `src/main/resources/application.properties`. You can configure the following:
  - **Server Port**: Change the port if needed (default is 8080).
  - **Database Configuration**: Modify the H2 database settings as required.

### API Endpoints

- **User Registration**: `POST /api/users/signup`
- **User Login**: `POST /api/users/login`
- **CORS Configuration**: Configured to allow requests from `http://localhost:3000`.

## Security

The application uses Spring Security to secure endpoints and manage user authentication. JWT tokens are generated upon successful login and must be included in the `Authorization` header for protected routes.
