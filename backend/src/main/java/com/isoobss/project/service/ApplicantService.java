package com.isoobss.project.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.stereotype.Service;

import com.isoobss.project.model.Applicant;
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

    public List<Applicant> getAllApplicantsBy(String text) {
        List<Applicant> applicants;
        String searchQuery = "{ $search: { index: 'applicant_index', text: { query: '" + text + "', path: { wildcard: '*' } } } }";
        AggregationOperation ao = Aggregation.stage(searchQuery);

        applicants = mongoTemplate.aggregate(Aggregation.newAggregation(ao), "applicant", Applicant.class).getMappedResults();
        return applicants;
    }
}
