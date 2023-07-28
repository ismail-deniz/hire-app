package com.isoobss.project.request;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class CreateOpeningRequest {
    private String title;
    private String explanation;
    private boolean isActive;
    private Date activeDate;
    private Date deactiveDate;
    private List<String> qualifications; 
}
