package com.isoobss.project.dto;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class OpeningDTO {
    private String id;
    private String hrId;
    private String title;
    private String explanation;
    private List<String> qualifications;
    private List<String> applicants;
    private boolean isActive;
    private Date activationDate;
    private Date deactivationDate;
}