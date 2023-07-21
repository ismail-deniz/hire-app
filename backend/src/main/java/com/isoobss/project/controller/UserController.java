package com.isoobss.project.controller;

import java.net.http.HttpHeaders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.isoobss.project.model.User;
import com.isoobss.project.repository.UserRepository;
import com.isoobss.project.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;
    
    @GetMapping("fetchUserProfile")
    public ResponseEntity<?> getUser(@PathVariable String code){
        String url = "https://www.linkedin.com/oauth/v2/accessToken";
        
        HttpHeaders headers = new HttpHeaders(null);
        headers.set("Content-Type", "application/x-www-form-urlencoded");

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("grant_type", "authorization_code");
        requestBody.add("code", code);
        requestBody.add("client_id", "77255ae457gw43");
        requestBody.add("client_secret", "ehBdny0qzW1NMYmc");
        requestBody.add("redirect_uri", "http://localhost:3000");

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<?> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, Object.class);

        return response;
    }
}
