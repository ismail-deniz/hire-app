package com.isoobss.project.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class LinkedinProfile {

    @JsonProperty("localizedFirstName")
    private String firstName;
    
    @JsonProperty("localizedLastName")
    private String lastName;

    @JsonProperty("id")
    private String id;
    //private String profilePictureUrl;
}