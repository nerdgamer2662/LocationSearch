# LocationSearch

## Overview

LocationSearch is a web application that allows users to find interesting locations near them. The app features user authentication with sign-up and login functionalities.

## Features

- **User Authentication**: Users can sign up and log in to access the application.
- **Responsive Design**: The application is designed to be user-friendly and responsive.

## Technologies Used

- **React**: For building the user interface.
- **React Router**: For routing between different components.
- **Axios**: For making HTTP requests to the backend API.

## Components

- **LandingPage**: The homepage that welcomes users and provides navigation to sign up or log in.
- **SignUpForm**: A form for new users to create an account.
- **LoginForm**: A form for existing users to log in.
- **Map**: A component that displays a map and allows users to search for nearby places.
- **ProtectedRoute**: A component that protects certain routes from unauthorized access.
- **MapUtils**: A utility module for handling map-related functionalities.
- **GPTRequest**: A module for interacting with the OpenAI API to get synonyms for place types.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nerdgamer2662/LocationSearch.git
   ```
2. Navigate to the project directory:
   ```bash
   cd locationsearch/client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm start
   ```
5. **Run the server-side application** to enable login/security functionality:
   ```bash
   .\mvnw.cmd spring-boot:run
   ```

## Usage

- Navigate to the landing page to either sign up or log in.
- After logging in, users can access the map and all its functionalities
