package com.isoobss.project.service;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.stereotype.Service;

import com.isoobss.project.dto.ApplicantDTO;
import com.isoobss.project.model.Applicant;
import com.isoobss.project.model.Application;
import com.isoobss.project.repository.ApplicantRepository;

@Service
public class ApplicantService {
    private final ApplicantRepository applicantRepository;
    private final MongoTemplate mongoTemplate;

    @Autowired
    public ApplicantService(ApplicantRepository applicantRepository, MongoTemplate mongoTemplate) {
        this.applicantRepository = applicantRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public List<ApplicantDTO> getAllApplicants() {
        List<Applicant> applicants = applicantRepository.findAll();
        if (applicants == null) return null;
        return applicants.stream().map(applicant -> convertToDto(applicant)).toList();
    }

    public List<ApplicantDTO> getAllApplicantsOfOpening(ObjectId openingId) {
        List<Applicant> applicants = applicantRepository.findAllByAppliedOpeningIdsContains(openingId);
        if (applicants == null) return null;
        return applicants.stream().map(applicant -> convertToDto(applicant)).toList();
    }

    public List<ApplicantDTO> searchAllApplicantsBy(String text) {
        List<Applicant> applicants;
        String searchQuery = "{ $search: { index: 'applicant_index', text: { query: '" + text + "', path: { wildcard: '*' } } } }";
        AggregationOperation ao = Aggregation.stage(searchQuery);

        applicants = mongoTemplate.aggregate(Aggregation.newAggregation(ao), "applicant", Applicant.class).getMappedResults();
        return applicants.stream().map(applicant -> convertToDto(applicant)).toList();
    }

    public List<ApplicantDTO> searchAllApplicantsOfOpeningBy(ObjectId openingId, String text) {
        List<Applicant> applicantsFromAll, applicantsFromOpening;
        List<ObjectId> applicantIdsFromCoverLetterSearch;
        String searchQuery = "{ $search: { index: 'applicant_index', text: { query: '" + text + "', path: { wildcard: '*' } } } }";
        AggregationOperation ao = Aggregation.stage(searchQuery);

        applicantsFromAll = mongoTemplate.aggregate(Aggregation.newAggregation(ao), "applicant", Applicant.class).getMappedResults();
        applicantsFromOpening = applicantRepository.findAllByAppliedOpeningIdsContains(openingId);

        searchQuery = "{ $search: { index: 'application_index', text: { query: '" + text + "', path: { wildcard: '*' } } } }";
        ao = Aggregation.stage(searchQuery);
        applicantIdsFromCoverLetterSearch = 
                mongoTemplate.aggregate(Aggregation.newAggregation(ao), "application", Application.class)
                        .getMappedResults().stream().map(application -> application.getApplicantId()).toList();

        List<Applicant> applicants = new ArrayList<Applicant>();
        // first add profile and cover letter matches
        for (Applicant applicant: applicantsFromAll) {
            if (applicantsFromOpening.contains(applicant) && applicantIdsFromCoverLetterSearch.contains(applicant.getId()))
                applicants.add(applicant);
        }

        // then add only profile matches
        for (Applicant applicant: applicantsFromAll) {
            if (applicantsFromOpening.contains(applicant) && !applicantIdsFromCoverLetterSearch.contains(applicant.getId()))
                applicants.add(applicant);
        }

        // then add only cover letter matches
        for (ObjectId id: applicantIdsFromCoverLetterSearch) {
            Applicant applicant = applicantRepository.findById(id).get();
            if (applicant != null && !applicants.contains(applicant)) {
                if (applicantsFromOpening.contains(applicant))
                    applicants.add(applicant);
            }
        }

        return applicants.stream().map(applicant -> convertToDto(applicant)).toList();
    }

    public ApplicantDTO blacklistApplicant(String applicantId) {
        Applicant applicant = applicantRepository.findById(new ObjectId(applicantId)).get();
        if (applicant == null) return null;
        applicant.setBlacklisted(true);
        return convertToDto(applicantRepository.save(applicant));
    }

    public ApplicantDTO convertToDto(Applicant applicant) {
        if (applicant == null) return null;
        ApplicantDTO applicantDTO = new ApplicantDTO();
        applicantDTO.setId(applicant.getId().toString());
        applicantDTO.setEmail(applicant.getEmail());
        applicantDTO.setFullName(applicant.getFullName());
        applicantDTO.setLinkedinUrl(applicant.getLinkedinUrl());
        applicantDTO.setUrlId(applicant.getUrlId());
        applicantDTO.setAbout(applicant.getAbout());
        if (applicant.getAppliedOpeningIds() != null)
            applicantDTO.setAppliedOpeningIds(applicant.getAppliedOpeningIds().stream().map(id -> id.toString()).toList());
        applicantDTO.setBlacklisted(applicant.isBlacklisted());
        applicantDTO.setExperienceList(applicant.getExperienceList());
        applicantDTO.setEducationList(applicant.getEducationList());
        applicantDTO.setCertificateList(applicant.getCertificateList());
        return applicantDTO;
    }
}
