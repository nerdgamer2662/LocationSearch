package com.cs3300.group8.locationsearch.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.cs3300.group8.locationsearch.model.User;
import com.cs3300.group8.locationsearch.repository.UserRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Date;

import javax.crypto.SecretKey;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    private static final String SECRET_KEY = "d)H!LWh{7%txM[24#]Pwaj3A~pZ;c@+U"; // Keep this secret

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        if (userRepository.findByUsername(signupRequest.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }
        User newUser = new User(signupRequest.getUsername(), signupRequest.getPassword());
        User savedUser = userRepository.save(newUser);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        User existingUser = userRepository.findByUsername(loginRequest.getUsername());
        if (existingUser == null || !existingUser.checkPassword(loginRequest.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }

        // User is authenticated, now generate a JWT token
        String token = generateJwtToken(existingUser); // Call the helper function to generate the token
    
        // Return the JWT token in the response
        return ResponseEntity.ok().body("Bearer " + token);
    }

    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }

    //private static final String SECRET_KEY = "your-secure-secret-key-of-proper-length"; // At least 32 characters for HS512

    // Create a SecretKey from the secret string
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // Helper method to generate a JWT
    public String generateJwtToken(User user) {
        // Set the token expiration time (e.g., 1 hour)
        long expirationTime = 1000 * 60 * 60; // 1 hour

        // Generate the JWT token with the user's information
        return Jwts.builder()
                .setSubject(user.getUsername())  // Store the username in the token
                .setIssuedAt(new Date())         // Set the current time as the issued time
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) // Set expiration time
                .signWith(key, SignatureAlgorithm.HS256) // Sign the token with the SecretKey and algorithm
                .compact();  // Generate the token
    }

}

class SignupRequest {
    private String username;
    private String password;

    // Getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class LoginRequest {
    private String username;
    private String password;

    // Getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}