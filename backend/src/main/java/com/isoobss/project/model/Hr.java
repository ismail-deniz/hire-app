package com.isoobss.project.model;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "hr")
@Data
public class Hr {
    @Id
    private ObjectId id;

    private String username;
    private List<Opening> openings;
    
}
