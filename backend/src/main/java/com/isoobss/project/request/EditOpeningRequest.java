package com.isoobss.project.request;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class EditOpeningRequest {
    private String id;
    private String title;
    private String explanation;
    private boolean active;
    private Date activeDate;
    private Date deactiveDate;
    private List<String> qualifications;
    private String hrId; 
}
