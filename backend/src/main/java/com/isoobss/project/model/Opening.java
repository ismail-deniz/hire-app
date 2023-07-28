package com.isoobss.project.model;

import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "opening")
@Data
public class Opening {
    @Id
    private ObjectId id;

    private ObjectId recruiterId;

    private String title;
    private String explanation;
    private List<String> qualifications;

    private List<ObjectId> applicants;
    private boolean isActive;
    private Date activationDate;
    private Date deactivationDate;
}
