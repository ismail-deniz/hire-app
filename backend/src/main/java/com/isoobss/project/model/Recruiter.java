package com.isoobss.project.model;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "recruiter")
@Data
public class Recruiter {
    @Id
    private ObjectId id;

    private String email;
    private String fullName;
    private String password;

    private List<ObjectId> openingIds;  
}
