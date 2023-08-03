package com.isoobss.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.isoobss.project.dto.ApplicantDTO;
import com.isoobss.project.model.Applicant;
import com.isoobss.project.repository.ApplicantRepository;

@Service
public class ProfileService {
    private final ApplicantRepository applicantRepository;
    private final ApplicantService applicantService;
    
    @Autowired
    public ProfileService(ApplicantRepository applicantRepository, ApplicantService applicantService) {
        this.applicantRepository = applicantRepository;
        this.applicantService = applicantService;
    }

    public ApplicantDTO getProfile(String mail) {
        return applicantService.convertToDto(applicantRepository.findByEmail(mail));
    }

    public ApplicantDTO getProfileByUrlId(String urlId) {
        return applicantService.convertToDto(applicantRepository.findByUrlId(urlId));
    }
}
