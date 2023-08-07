package com.isoobss.project.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.Document;
import org.bson.json.JsonObject;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.isoobss.project.dto.OpeningDTO;
import com.isoobss.project.enums.ApplicationStatus;
import com.isoobss.project.model.Applicant;
import com.isoobss.project.model.Application;
import com.isoobss.project.model.Opening;
import com.isoobss.project.repository.ApplicantRepository;
import com.isoobss.project.repository.ApplicationRepository;
import com.isoobss.project.repository.OpeningRepository;
import com.isoobss.project.request.CreateOpeningRequest;
import com.isoobss.project.request.EditOpeningRequest;

@Service
public class OpeningService {
    private final OpeningRepository openingRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicantRepository applicantRepository;

    @Autowired
    public OpeningService(OpeningRepository openingRepository, ApplicationRepository applicationRepository, ApplicantRepository applicantRepository) {
        this.openingRepository = openingRepository;
        this.applicationRepository = applicationRepository;
        this.applicantRepository = applicantRepository;
    }

    public OpeningDTO createOpening(CreateOpeningRequest req) {
        Opening newOpening = new Opening();
        newOpening.setTitle(req.getTitle());
        newOpening.setExplanation(req.getExplanation());
        newOpening.setQualifications(req.getQualifications());
        newOpening.setApplicants(new ArrayList<ObjectId>());
        newOpening.setActive(req.isActive());
        newOpening.setActivationDate(req.isActive() ? new Date() : req.getActiveDate());
        newOpening.setDeactivationDate(req.isActive() ? req.getDeactiveDate() : new Date());
        newOpening.setHrId(new ObjectId(req.getHrId()));
        
        
        return convertToDto(openingRepository.save(newOpening));
    }

    public List<OpeningDTO> getAllOpenings() {
        List<Opening> openings = openingRepository.findAll();
        List<OpeningDTO> openingObjects = new ArrayList<OpeningDTO>();
        for (Opening opening : openings) {
            if (opening.isActive() && opening.getDeactivationDate() != null && opening.getDeactivationDate().before(new Date())) {
                opening.setActive(false);
                openingRepository.save(opening);
            } else if (!opening.isActive() && opening.getActivationDate() != null&& opening.getActivationDate().before(new Date())) {
                opening.setActive(true);
                openingRepository.save(opening);
            }
            openingObjects.add(convertToDto(opening));
        }
        return openingObjects;
    }

    public List<OpeningDTO> getOpeningsByHrId(String hrId) {
        List<Opening> openings = openingRepository.findByHrId(new ObjectId(hrId));
        List<OpeningDTO> openingObjects = new ArrayList<OpeningDTO>();
        for (Opening opening : openings) {
            if (opening.isActive() && opening.getDeactivationDate() != null && opening.getDeactivationDate().before(new Date())) {
                opening.setActive(false);
                openingRepository.save(opening);
            } else if (!opening.isActive() && opening.getActivationDate() != null && opening.getActivationDate().before(new Date())) {
                opening.setActive(true);
                openingRepository.save(opening);
            }
            openingObjects.add(convertToDto(opening));
        }
        return openingObjects;
    }

    public void deleteOpening(String openingId) {
        openingRepository.deleteById(new ObjectId(openingId));
        applicationRepository.deleteByOpeningId(new ObjectId(openingId));
        List<Applicant> applicants = applicantRepository.findAllByAppliedOpeningIdsContains(new ObjectId(openingId));
        for (Applicant applicant : applicants) {
            applicant.getAppliedOpeningIds().remove(new ObjectId(openingId));
            applicantRepository.save(applicant);
        }
    }

    public OpeningDTO editOpening(EditOpeningRequest req) {
        Opening opening = openingRepository.findById(new ObjectId(req.getId())).get();
        opening.setTitle(req.getTitle());
        opening.setExplanation(req.getExplanation());
        opening.setQualifications(req.getQualifications());
        opening.setActive(req.isActive());
        opening.setActivationDate(req.isActive() ? new Date() : req.getActiveDate());
        opening.setDeactivationDate(req.isActive() ? req.getDeactiveDate() : new Date());
        return convertToDto(openingRepository.save(opening));
    }

    public OpeningDTO convertToDto(Opening opening) {
        OpeningDTO dto = new OpeningDTO();
        dto.setId(opening.getId().toString());
        dto.setHrId(opening.getHrId().toString());
        dto.setTitle(opening.getTitle());
        dto.setExplanation(opening.getExplanation());
        dto.setQualifications(opening.getQualifications());
        
        // Convert applicants ObjectId list to String list
        List<ObjectId> applicants = opening.getApplicants();
        List<String> applicantIds = applicants.stream()
                                             .map(ObjectId::toString)
                                             .collect(Collectors.toList());
        dto.setApplicants(applicantIds);

        dto.setActive(opening.isActive());
        dto.setActivationDate(opening.getActivationDate());
        dto.setDeactivationDate(opening.getDeactivationDate());

        return dto;
    }
}
