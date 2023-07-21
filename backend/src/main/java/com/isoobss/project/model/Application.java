package com.isoobss.project.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.isoobss.project.enums.ApplicationStatus;

import lombok.Data;

@Document(collection = "application")
@Data
public class Application {
    @Id
    private ObjectId id;

    private ObjectId applicantId;
    private ObjectId openingId;
    private ApplicationStatus status;
    private String coverLetter;
}
