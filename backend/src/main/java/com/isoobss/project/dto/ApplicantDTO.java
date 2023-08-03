package com.isoobss.project.dto;

import java.util.List;

import org.bson.types.ObjectId;

import com.isoobss.project.model.Certificaiton;
import com.isoobss.project.model.Education;
import com.isoobss.project.model.Experience;

import lombok.Data;

@Data
public class ApplicantDTO {
    private String id;

    private String email;
    private String fullName;

    private String linkedinUrl;
    private String urlId;
    private String about;

    private List<String> appliedOpeningIds;
    private boolean blacklisted;

    private List<Experience> experienceList;
    private List<Education> educationList;
    private List<Certificaiton> certificateList;
}
