package com.isoobss.project.request;

import lombok.Data;

@Data
public class ApplicationRequest {
    private String applicantId;
    private String openingId;
    private String status;
    private String coverLetter;
}
