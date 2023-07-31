package com.isoobss.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.isoobss.project.config.JwtUtil;

@Service
public class AuthService {
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    
    @Autowired
    public AuthService(AuthenticationManager authManager, JwtUtil jwtUtil) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
    }

    public String authenticate(String userName, String password) {
        try {
            // Authenticate the user
            Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(userName, password));

            // If authentication is successful, set the authentication in the security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate and return the JWT token
            return jwtUtil.generateToken(userName);
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid username or password");
        }
    }
}
