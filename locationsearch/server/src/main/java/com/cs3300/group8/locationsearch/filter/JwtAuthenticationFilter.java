package com.cs3300.group8.locationsearch.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.ArrayList;

// JwtAuthenticationFilter that checks for JWT in the Authorization header
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    //private final UserDetailsService userDetailsService;
    private final SecretKey secretKey;

    // Constructor with dependencies
    public JwtAuthenticationFilter() {
        //this.userDetailsService = userDetailsService;
        this.secretKey = Keys.hmacShaKeyFor("d)H!LWh{7%txM[24#]Pwaj3A~pZ;c@+U".getBytes());  // Convert secret key to SecretKey
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String username = claims.getSubject();

            // If needed, you can extract additional claims, like roles:
            String roles = (String) claims.get("roles");  // Example of extracting a custom claim for roles

            // Create an authentication object directly using the JWT claims
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    username, null, new ArrayList<>());  // You can set authorities here if needed

            // Set the authentication object in the security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
