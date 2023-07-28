package com.isoobss.project.model;

import lombok.Data;

@Data
public class LinkedinAccessTokenResponse {

    private String access_token;
    private int expires_in; 
    private String scope;
    
}
