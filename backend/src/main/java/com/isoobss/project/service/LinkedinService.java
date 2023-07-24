package com.isoobss.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.isoobss.project.model.LinkedinProfile;
import com.isoobss.project.exception.LinkedinException;
import com.isoobss.project.model.LinkedinAccessTokenResponse;


@Service
public class LinkedinService {
    
    @Value("${linkedin.client.id}")
    private String clientId;
    
    @Value("${linkedin.client.secret}")
    private String clientSecret;
    
    @Value("${linkedin.redirect.uri}")
    private String redirectUri;

    private final RestTemplateBuilder restTemplateBuilder;

    @Autowired
    public LinkedinService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplateBuilder = restTemplateBuilder;
    }

    public LinkedinProfile getLinkedinProfile(String authorizationCode) throws LinkedinException {
        // Exchange authorization code for access token
        String accessToken = exchangeAuthorizationCodeForAccessToken(authorizationCode);

        // Fetch LinkedIn profile using the access token
        return fetchLinkedinProfileData(accessToken);
    }

    private String exchangeAuthorizationCodeForAccessToken(String authorizationCode) throws LinkedinException {
        String tokenUrl = "https://www.linkedin.com/oauth/v2/accessToken";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> requestEntity = new HttpEntity<>(
            "grant_type=authorization_code&code=" + authorizationCode +
            "&client_id=" + clientId +
            "&client_secret=" + clientSecret +
            "&redirect_uri=" + redirectUri,
            headers
        );

        ResponseEntity<LinkedinAccessTokenResponse> responseEntity = restTemplateBuilder.build().exchange(
            tokenUrl, HttpMethod.POST, requestEntity, LinkedinAccessTokenResponse.class);

        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            Object responseBody = responseEntity.getBody();
            if (responseBody instanceof LinkedinAccessTokenResponse) {
                return ((LinkedinAccessTokenResponse) responseBody).getAccess_token();
            } else {
                throw new LinkedinException("Unexpected response type for access token.");
            }
        } else {
            throw new LinkedinException("Failed to exchange authorization code for access token");
        }
    }

    private LinkedinProfile fetchLinkedinProfileData(String accessToken) throws LinkedinException {
        String profileUrl = "https://api.linkedin.com/v2/me";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<?> requestEntity = new HttpEntity<>(headers);
        
        ResponseEntity<LinkedinProfile> responseEntity = restTemplateBuilder.build().exchange(
            profileUrl, HttpMethod.GET, requestEntity, LinkedinProfile.class);

        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            return responseEntity.getBody();
        } else {
            throw new LinkedinException("Failed to fetch LinkedIn profile data");
        }
    }
}
