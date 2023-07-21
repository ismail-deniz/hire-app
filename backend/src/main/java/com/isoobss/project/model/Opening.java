package com.isoobss.project.model;

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

    private String title;
    private String explanation;
    private List<ObjectId> applicants;
    private boolean isActive;
}
