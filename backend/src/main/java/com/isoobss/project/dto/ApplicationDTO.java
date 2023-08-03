package com.isoobss.project.dto;

import org.bson.types.ObjectId;

import com.isoobss.project.enums.ApplicationStatus;

import lombok.Data;

@Data
public class ApplicationDTO {
    private String id;

    private String applicantId;
    private String openingId;
    private ApplicationStatus status;
    private String coverLetter;
    private String openingTitle;
    private boolean openingIsActive;
}
