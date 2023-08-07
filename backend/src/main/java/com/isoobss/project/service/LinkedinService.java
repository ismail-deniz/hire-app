package com.isoobss.project.service;

import java.util.HashMap;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.data.mongodb.core.aggregation.VariableOperators.Map;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.isoobss.project.model.LinkedinProfile;
import com.isoobss.project.repository.ApplicantRepository;
import com.isoobss.project.exception.LinkedinException;
import com.isoobss.project.model.Applicant;
import com.isoobss.project.model.LinkedinAccessTokenResponse;
import com.isoobss.project.model.LinkedinEmailResponse;


@Service
public class LinkedinService {
    
    @Value("${linkedin.client.id}")
    private String clientId;
    
    @Value("${linkedin.client.secret}")
    private String clientSecret;
    
    @Value("${linkedin.redirect.uri}")
    private String redirectUri;

    private final RestTemplateBuilder restTemplateBuilder;

    private final ApplicantRepository applicantRepository;

    private static HashMap<String, String> accessTokenMap = new HashMap<>();

    @Autowired
    public LinkedinService(RestTemplateBuilder restTemplateBuilder, ApplicantRepository applicantRepository) {
        this.restTemplateBuilder = restTemplateBuilder;
        this.applicantRepository = applicantRepository;
    }

    public Applicant getLinkedinProfile(String authorizationCode) throws LinkedinException {
        // Exchange authorization code for access token
        String accessToken = exchangeAuthorizationCodeForAccessToken(authorizationCode);

        // Fetch LinkedIn profile using the access token
        return fetchLinkedinProfileData(accessToken);
    }

    public void logout(String email) {
        String destroyTokenUrl = "https://api.linkedin.com/uas/oauth/invalidateToken";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessTokenMap.get("email"));
        HttpEntity<?> requestEntity = new HttpEntity<>(headers);
        
        ResponseEntity<Object> responseEntity = restTemplateBuilder.build().exchange(
            destroyTokenUrl, HttpMethod.GET, requestEntity, Object.class);
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

    private Applicant fetchLinkedinProfileData(String accessToken) throws LinkedinException {
        String profileUrl = "https://api.linkedin.com/v2/me";
        String emailUrl = "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<?> requestEntity = new HttpEntity<>(headers);
        
        ResponseEntity<LinkedinProfile> responseEntity = restTemplateBuilder.build().exchange(
            profileUrl, HttpMethod.GET, requestEntity, LinkedinProfile.class);
        LinkedinProfile lp = responseEntity.getBody();
            
        ResponseEntity<LinkedinEmailResponse> emailResponseEntity = new RestTemplate().exchange(
            emailUrl, HttpMethod.GET, requestEntity, LinkedinEmailResponse.class);
        LinkedinEmailResponse emailResponse = emailResponseEntity.getBody();

        Applicant applicant = new Applicant();
        applicant.setFullName(lp.getFirstName() + " " + lp.getLastName());
        applicant.setEmail(emailResponse.getElements()[0].getHandle().getEmailAddress());

        accessTokenMap.put(applicant.getEmail(), accessToken);
        
        Applicant exists = applicantRepository.findByEmail(applicant.getEmail());
        if (exists != null) {
            exists.setFullName(applicant.getFullName());
            applicantRepository.save(exists);
            applicant = exists;
        } else {
            applicantRepository.save(applicant);
        }
    
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            return applicant;
        } else {
            throw new LinkedinException("Failed to fetch LinkedIn profile data");
        }
    }
}
