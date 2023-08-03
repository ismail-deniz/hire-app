package com.isoobss.project.service;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.isoobss.project.dto.ApplicationDTO;
import com.isoobss.project.enums.ApplicationStatus;
import com.isoobss.project.model.Applicant;
import com.isoobss.project.model.Application;
import com.isoobss.project.model.Opening;
import com.isoobss.project.repository.ApplicantRepository;
import com.isoobss.project.repository.ApplicationRepository;
import com.isoobss.project.repository.OpeningRepository;
import com.isoobss.project.request.ApplicationRequest;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final OpeningRepository openingRepository;
    private final ApplicantRepository applicantRepository;

    @Autowired
    public ApplicationService(ApplicationRepository applicationRepository, 
                                OpeningRepository openingRepository,
                                ApplicantRepository applicantRepository) {
        this.applicationRepository = applicationRepository;
        this.openingRepository = openingRepository;
        this.applicantRepository = applicantRepository;
    }

    public List<ApplicationDTO> getAllApplicationsByApplicantId(String applicantId) {
        return applicationRepository.findByApplicantId(new ObjectId(applicantId)).stream().map(application -> convertToDto(application)).toList();
    }

    public Application applyToOpening(ApplicationRequest req) {
        Application application = new Application();
        application.setApplicantId(new ObjectId(req.getApplicantId()));
        application.setOpeningId(new ObjectId(req.getOpeningId()));
        application.setStatus(ApplicationStatus.valueOf(req.getStatus()));
        application.setCoverLetter(req.getCoverLetter());

        Applicant applicant = applicantRepository.findById(application.getApplicantId()).get();
        if (applicant == null) {
            return null;
        }
        if (applicant.getAppliedOpeningIds() == null) {
            applicant.setAppliedOpeningIds(new ArrayList<ObjectId>());
        }
        applicant.getAppliedOpeningIds().add(application.getOpeningId());
        applicantRepository.save(applicant);

        return applicationRepository.save(application);
    }

    private ApplicationDTO convertToDto(Application application) {
        Opening opening = openingRepository.findById(application.getOpeningId()).get();
        if (opening == null) {
            return null;
        }
        ApplicationDTO applicationDTO = new ApplicationDTO();
        applicationDTO.setId(application.getId().toString());
        applicationDTO.setApplicantId(application.getApplicantId().toString());
        applicationDTO.setOpeningId(application.getOpeningId().toString());
        applicationDTO.setStatus(application.getStatus());
        applicationDTO.setCoverLetter(application.getCoverLetter());
        applicationDTO.setOpeningTitle(opening.getTitle());
        applicationDTO.setOpeningIsActive(opening.isActive());

        return applicationDTO;
    }
}
