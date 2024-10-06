package com.cs3300.group8.locationsearch.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;



// Custom filter to verify JWT on each request
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String SECRET_KEY = "your-secret-key"; // Replace with a secure key

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    

    @Autowired
    private UserDetailsService userDetailsService; // Autowire UserDetailsService to load user data

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException, ServletException {

        // Extract the Authorization header
        String authorizationHeader = request.getHeader("Authorization");

        // If no Authorization header is found or it doesn't start with "Bearer", continue the filter chain
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract the token from the header (remove the "Bearer " prefix)
        String token = authorizationHeader.substring(7);

        try {
            // Parse and validate the JWT
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)  // Use the secret key to validate the signature
                    .build()  // Build the parser
                    .parseClaimsJws(token)  // Parse the token
                    .getBody();  // Extract the claims

            // You can retrieve user details from the claims and set it in the security context (optional)
            String username = claims.getSubject();
            // Optionally set the authentication in SecurityContextHolder for further use

        } catch (Exception e) {
            // If JWT is invalid or expired, respond with an unauthorized status
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // Continue the filter chain if the JWT is valid
        filterChain.doFilter(request, response);
    }
}
