package com.isoobss.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.isoobss.project.model.Applicant;
import com.isoobss.project.repository.ApplicantRepository;

@Service
public class ProfileService {
    private final ApplicantRepository applicantRepository;
    
    @Autowired
    public ProfileService(ApplicantRepository applicantRepository) {
        this.applicantRepository = applicantRepository;
    }

    public Applicant getProfile(String mail) {
        return applicantRepository.findByEmail(mail);
    }

    public Applicant getProfileByUrlId(String urlId) {
        return applicantRepository.findByUrlId(urlId);
    }
}
