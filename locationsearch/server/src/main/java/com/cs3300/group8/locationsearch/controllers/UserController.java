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

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

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
        if (existingUser == null || !existingUser.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
        return ResponseEntity.ok(existingUser);
    }

    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
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